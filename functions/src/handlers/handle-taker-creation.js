import {
  COLLECTION_THREADS,
  COLLECTION_TAKERS,
  TAKER_EXPIRATION_HOURS,
  COLLECTION_ITEMS,
  COLLECTION_USERS,
} from "../shared/constants.js";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "../shared/firebase.js";

export default async ({ req, res, log, error }) => {
  log("uusi takerin luonti");
  const { itemId, takerId } = req.bodyJson;

  log("req.body", req.body);
  log(`uusi taker luodaan itemille ${itemId}`);
  log(`takerId: ${takerId}`);

  if (!itemId || !takerId) {
    return res.json(
      {
        success: false,
        message: "ItemId tai takerId puuttuu",
      },
      400
    );
  }

  log("takerId", takerId);
  log("itemId", itemId);
  const userRef = db.doc(takerId);
  const itemRef = db.collection(COLLECTION_ITEMS).doc(itemId);

  try {
    await db.runTransaction(async (transaction) => {
      const [itemDoc, userDoc] = await Promise.all([
        transaction.get(itemRef),
        transaction.get(userRef),
      ]);

      if (!itemDoc.exists) throw new Error("Itemiä ei olemassa");
      if (!userDoc.exists) throw new Error("Käyttäjää ei ole olemassa");

      const itemData = itemDoc.data();
      if (!itemData.giverid) throw new Error("Itemillä ei ole antajaa");

      const takersSnapshot = await transaction.get(
        itemRef.collection(COLLECTION_TAKERS).orderBy("createdAt")
      );

      const takers = takersSnapshot.docs.filter(
        (doc) => !doc.data().placeholder
      );

      const existingTaker = takers.find(
        (doc) => doc.data().takerId === userRef
      );
      if (existingTaker) throw new Error("Käyttäjä on jo jonossa");

      const now = Timestamp.now();

      const takerData = {
        takerId: userRef,
        createdAt: now,
      };

      transaction.set(
        itemRef.collection(COLLECTION_TAKERS).doc(userRef.id),
        takerData
      );

      const earliestTaker = takers[0];

      if (!earliestTaker) {
        const threadRef = db.collection(COLLECTION_THREADS).doc();
        const expirationTime = Timestamp.fromMillis(
          now.toMillis() + TAKER_EXPIRATION_HOURS * 60 * 60 * 1000
        );

        transaction.set(threadRef, {
          participants: [itemData.giverid, userRef],
          item: itemRef,
          createdAt: now,
        });

        transaction.set(itemRef.collection(COLLECTION_TAKERS).doc(userRef.id), {
          ...takerData,
          thread: threadRef,
          expiration: expirationTime,
        });
      } else if (!earliestTaker.data().thread) {
        const threadRef = db.collection(COLLECTION_THREADS).doc();
        const expirationTime = Timestamp.fromMillis(
          now.toMillis() + TAKER_EXPIRATION_HOURS * 60 * 60 * 1000
        );

        transaction.set(threadRef, {
          participants: [itemData.giverid, earliestTaker.data().takerId],
          item: itemRef,
          createdAt: now,
        });

        transaction.set(earliestTaker.ref, {
          ...earliestTaker.data(),
          thread: threadRef,
          expiration: expirationTime,
        });
      }
    });

    log(`uusi taker luotu itemille ${itemId}`);
    return res.json(
      {
        success: true,
        message: "Lisätty jonoon",
      },
      200
    );
  } catch (e) {
    error("Takerin luonnissa tapahtui virhe: ", e);
    return res.json(
      {
        success: false,
        message: "Takerin luonti epäonnistui",
        error: e.message,
      },
      500
    );
  }
};
