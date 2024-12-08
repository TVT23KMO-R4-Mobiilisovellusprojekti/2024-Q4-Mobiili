import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  orderBy,
  collectionGroup,
  setDoc,
} from "firebase/firestore";
import { firestore } from "./firebaseConfig";
import { Timestamp } from "firebase/firestore";
import client from "../appwrite";

export const createTaker = async (uid, itemId) => {
  const userRef = doc(firestore, "users", uid);
  const data = { itemId, takerId: userRef.path };
  try {
    const response = await client.functions.createExecution(
      "handle-taker-creation",
      JSON.stringify(data)
    );
    return response;
  } catch (error) {
    console.error("Virhe:", error.message);
    throw new Error(error.message);
  }
};

export const addTakerToItem = async (uid, itemId) => {
  try {
    const itemRef = doc(firestore, "items", itemId);

    const itemSnapshot = await getDoc(itemRef);
    if (!itemSnapshot.exists()) {
      console.error("Virhe: Tuotetta ei löytynyt.");
      throw new Error("Tuotetta ei löytynyt.");
    }

    const itemData = itemSnapshot.data();
    const giverId = itemData.giverid.id;

    if (giverId === uid) {
      console.error("Virhe: Et voi varata omaa tuotettasi.");
      throw new Error("Et voi varata omaa tuotettasi.");
    }

    const expiresIn6Hours = await setExpirationTime(itemId);
    const takersRef = collection(itemRef, "takers");
    const now = Timestamp.now();

    const takerData = {
      takerId: doc(firestore, "users", uid),
      createdAt: now,
      expiration: expiresIn6Hours,
    };

    await setDoc(doc(takersRef, uid), takerData);

    console.log(`UID: ${uid} varannut:`, itemId);
  } catch (error) {
    console.error("Virhe lisättäessä varausta:", error);
    throw error;
  }
};

export const setExpirationTime = async (itemId) => {
  try {
    const itemRef = collection(firestore, `items/${itemId}/takers`);
    const q = query(itemRef, orderBy("expiration", "desc"));
    const snapshot = await getDocs(q);

    let expiresIn6Hours;

    const now = Timestamp.now();

    if (!snapshot.empty) {
      const latestTaker = snapshot.docs[0].data();
      console.log("Vimeisin exp.", latestTaker.expiration);

      expiresIn6Hours = new Timestamp(
        latestTaker.expiration.seconds + 6 * 60 * 60,
        latestTaker.expiration.nanoseconds
      );
    } else {
      console.log("Eka varaaja, Exp 6h");
      expiresIn6Hours = new Timestamp(
        now.seconds + 6 * 60 * 60,
        now.nanoseconds
      );
    }

    return expiresIn6Hours;
  } catch (error) {
    console.error("Virhe expiration-ajan asettamisessa:", error);
    throw error;
  }
};

export const deleteExpiredStuff = async () => {
  try {
    const takersRef = collectionGroup(firestore, "takers");
    const q = query(takersRef, orderBy("createdAt"));
    const snapshot = await getDocs(q);

    snapshot.docs.forEach(async (docSnapshot) => {
      const takerData = docSnapshot.data();
      console.log("5");
      console.log("takerData.expiration", takerData.expiration);
      console.log("Timestamp.now()", Timestamp.now());
      console.log(takerData.expiration < Timestamp.now());
      if (takerData.expiration < Timestamp.now()) {
        await deleteDoc(docSnapshot.ref);
        console.log(`Poistettu vanhentunut varaus:`, docSnapshot.id);
      }
    });
  } catch (error) {
    console.error("Poistovirhe:", error);
    throw error;
  }
};

export const itemQueuesForUser = async (uid, itemId) => {
  try {
    const userRef = doc(firestore, "users", uid);
    const itemRef = doc(firestore, "items", itemId);
    const takersRef = collection(itemRef, "takers");

    const q = query(takersRef, where("takerId", "==", userRef));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return false;
    }

    return querySnapshot;
  } catch (error) {
    console.error("Hakuvirhe:", error);
    throw error;
  }
};

export const deleteTakerFromItem = async (uid, itemId) => {
  try {
    const querySnapshot = await itemQueuesForUser(uid, itemId);

    for (const takerDoc of querySnapshot.docs) {
      await deleteDoc(takerDoc.ref);
      console.log(`UID: ${uid} poistanut varauksen:`, takerDoc.id);
    }
    const response = await client.functions.createExecution(
      "handle-invalid-threads"
    );
    return response;
  } catch (error) {
    console.error("Poistovirhe:", error);
    throw error;
  }
};

export const getCurrentUserQueues = async (uid, itemId) => {
  try {
    const querySnapshot = await itemQueuesForUser(uid, itemId);

    if (querySnapshot) {
      console.log(`UID: ${uid} varannut: ${itemId}`);
      return true;
    }
  } catch (error) {
    console.error("Tarkistusvirhe:", error);
    return false;
  }
};

export const getUserPositionInQueue = async (uid, itemId) => {
  try {
    const takersRef = collection(firestore, `items/${itemId}/takers`);

    const q = query(takersRef, orderBy("createdAt"));
    const snapshot = await getDocs(q);

    let position = 0;

    snapshot.docs.forEach((docSnapshot, index) => {
      const takerData = docSnapshot.data();
      if (takerData.takerId.id === uid) {
        position = index + 1;
      }
    });
    if (position === 0) {
      throw new Error("Käyttäjää ei löytynyt jonosta.");
    }

    return position;
  } catch (error) {
    console.error("Virhe käyttäjän jonosijan hakemisessa:", error);
    throw error;
  }
};
