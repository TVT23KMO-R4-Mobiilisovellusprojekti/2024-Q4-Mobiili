import {
  COLLECTION_TAKERS,
  COLLECTION_THREADS,
  COLLECTION_MESSAGES,
  TAKER_EXPIRATION_HOURS,
} from "./constants.js";
import db from "./firebase.js";
import { BatchManager, deleteCollection } from "./batch-utils.js";
import { Timestamp } from "firebase-admin/firestore";

/**
 * hakee dokumentit, joiden expiration on mennyt umpeen
 * @param {string} collectionName
 * @returns {Promise<FirebaseFirestore.QuerySnapshot>}
 */
export const getExpiredDocuments = async (collectionName) =>
  await db
    .collection(collectionName)
    .where("expiration", "<=", Timestamp.now())
    .get();

/**
 * poistaa threadin ja siihen liittyvät viestit
 * @param {FirebaseFirestore.QueryDocumentSnapshot} threadDoc
 * @param {BatchManager} batchManager
 * @returns {Promise<void>}
 */
export const deleteThreadAndMessages = async (threadDoc, batchManager) => {
  const messages = await threadDoc.ref.collection(COLLECTION_MESSAGES).get();
  await deleteCollection(messages, batchManager);
  await batchManager.delete(threadDoc.ref);
};

/**
 * poistaa vanhentuneen itemin ja siihen liittyvät takers ja threadit
 * @param {FirebaseFirestore.QueryDocumentSnapshot} itemDoc
 * @returns {Promise<void>}
 */
export const handleExpiredItem = async (itemDoc) => {
  const batchManager = new BatchManager();

  const takers = await itemDoc.ref.collection(COLLECTION_TAKERS).get();
  await deleteCollection(takers, batchManager);

  const threads = await db
    .collection(COLLECTION_THREADS)
    .where("item", "==", itemDoc.ref)
    .get();

  for (const thread of threads.docs) {
    await deleteThreadAndMessages(thread, batchManager);
  }

  await batchManager.delete(itemDoc.ref);
  await batchManager.commit();
};

/**
 * asettaa seuraavalle varaukselle vanhenemisajan ja luo uuden keskustelun itemin antajan ja seuraavan varaajan välille
 * @param {FirebaseFirestore.DocumentReference} itemRef
 * @param {FirebaseFirestore.Timestamp} now
 * @param {FirebaseFirestore.DocumentData} takerData
 */
const setupNextTaker = async (itemRef, now, takerData) => {
  await db.runTransaction(async (transaction) => {
    const nextInLineQuery = await itemRef
      .collection(COLLECTION_TAKERS)
      .orderBy("createdAt")
      .startAfter(takerData.createdAt)
      .limit(1)
      .get();

    const nextInLine = nextInLineQuery.docs[0];
    if (!nextInLine) return;

    const nextTakerData = nextInLine.data();
    const threadRef = db.collection(COLLECTION_THREADS).doc();
    const itemDoc = await itemRef.get();
    const itemData = itemDoc.data();

    if (!itemData?.giverid || !nextTakerData?.takerId) {
      throw new Error("Invalid giver or taker data");
    }

    const expirationTime = Timestamp.fromMillis(
      now.toMillis() + TAKER_EXPIRATION_HOURS * 60 * 60 * 1000
    );

    transaction.set(threadRef, {
      participants: [itemData.giverid, nextTakerData.takerId],
      item: itemRef,
      createdAt: now,
    });

    transaction.set(nextInLine.ref, {
      ...nextTakerData,
      thread: threadRef,
      expiration: expirationTime,
    });
  });
};

/**
 * käsittelee vanhentuneen takerin
 * @param {FirebaseFirestore.QueryDocumentSnapshot} takerDoc
 */
export const handleExpiredTaker = async (takerDoc) => {
  const batchManager = new BatchManager();

  const itemRef = takerDoc.ref.parent.parent;
  if (!itemRef) throw new Error("Virheellinen itemRef");

  const takerData = takerDoc.data();
  if (!takerData) throw new Error("Virheellinen takerData");

  const now = Timestamp.now();

  const threads = await db
    .collection(COLLECTION_THREADS)
    .where("item", "==", itemRef)
    .where("participants", "array-contains", takerData.takerId)
    .get();

  for (const thread of threads.docs) {
    await deleteThreadAndMessages(thread, batchManager);
  }

  await setupNextTaker(itemRef, now, takerData);

  await batchManager.delete(takerDoc.ref);
  await batchManager.commit();
};
