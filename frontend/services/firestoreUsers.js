import { 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    deleteDoc, 
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collectionGroup
} from 'firebase/firestore';
import { firestore } from './firebaseConfig'; 
import { get, last, take } from 'lodash';

    export const  getAuthenticatedUserData = async (uid) => {
        try {
            const userRef = doc(firestore, "users", uid);
            const userSnapshot = await getDoc(userRef);
            return userSnapshot.exists() ? userSnapshot.data() : null;
        } catch (error) {
            console.error("Virhe haettaessa käyttäjätietoja Firestoresta:", error);
            throw error;
        }
    };
    
    export const getUserData = async (uid) => {
        try {
        const userRef = doc(firestore, "users", uid);
        const userSnapshot = await getDoc(userRef);
        return userSnapshot.exists() ? userSnapshot.data() : null;
        } catch (error) {
        console.error("Virhe haettaessa käyttäjätietoja Firestoresta:", error);
        throw error;
        }
    };

    // ELINA !!!!  HOX !!!!
    // copilot tarjos tällasta, mutta voipi olla, että pitää jotenkin muutttaa!! 
    export const updateUserData = async (uid, username) => {
        try {
            const userRef = doc(firestore, "users", uid);
            await updateDoc(userRef, { username });
            console.log(`Käyttäjän ${uid} tiedot päivitetty`);
        } catch (error) {
            console.error("Virhe päivitettäessä käyttäjän tietoja:", error);
            throw error;
        }
    };

    export const saveUserToFirestore = async (uid, username, email) => {

        try {
            await setDoc(doc(firestore, "users", uid), {
            username,
            email: email.toLowerCase(),
            uid,
            });
            console.log(`Käyttäjä ${username} , ${uid} lisätty`);
        } catch (error) {
            console.error('Virhe lisättäessä käyttäjää:', error);
            throw error;
        }
    };

    export const deleteUserDataFromFirestore = async (uid) => {
      try {
          const userRef = doc(firestore, "users", uid);
          const itemsRef = collection(firestore, 'items');
  
          // Poistetaan käyttäjän julkaisut + julkaisun varaajat 
          const userItemsQuery = query(itemsRef, where('giverid', '==', userRef));
          const userItemsSnapshot = await getDocs(userItemsQuery);
  
          for (const itemDoc of userItemsSnapshot.docs) {
              const itemTakersRef = collection(itemDoc.ref, 'takers');
              const itemTakersSnapshot = await getDocs(itemTakersRef);
  
              for (const takerDoc of itemTakersSnapshot.docs) {
                  await deleteDoc(takerDoc.ref);
                  console.log(`Poistettu tuotteen ${itemDoc.id} varaaja: ${takerDoc.id}`);
              }
  
              await deleteDoc(itemDoc.ref);
              console.log(`Poistettu käyttäjän ${uid} tuote: ${itemDoc.id}`);
          }
  
          // Poistaa käyttäjän omat varaukset
          const takersRef = collectionGroup(firestore, 'takers');
          const q = query(takersRef, where("takerId", "==", userRef));
          const snapshot = await getDocs(q);

          for (const queueDoc of snapshot.docs) {
              await deleteDoc(queueDoc.ref);
              console.log(`Poistettu käyttäjän ${uid} varaus: ${queueDoc.id}`);
          }
          
          // Poistaa käyttäjän dokumentin
          await deleteDoc(userRef);
          console.log(`Käyttäjä ${uid} poistettu Firestoresta`); 

      } catch (error) {
          console.error('Poistovirhe:', error);
          throw error;
      }
  };
  