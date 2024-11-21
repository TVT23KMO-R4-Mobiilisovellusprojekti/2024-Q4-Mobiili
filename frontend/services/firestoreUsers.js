import { 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    deleteDoc, 
    doc,
    setDoc,
    getDoc
} from 'firebase/firestore';

import { getAuth } from 'firebase/auth';
import { firestore } from './firebaseConfig'; 
import { get, last, take } from 'lodash';

/*
    export const getAuthenticatedUserData = () => {
        const auth = getAuth(); 
        const user = auth.currentUser; 

        return user;
    };
*/

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

    export const  saveUserToFirestore = async (uid, username, email) => {
            
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
            const collectionsToClean = ["items", "users"];

            for (const collectionName of collectionsToClean) {
                const uid = getAuthenticatedUserData().uid;
                const userRef = collection(firestore, collectionName);
                const giverRef = doc(firestore, 'users', uid);

                const giveridQuery = query(userRef, where("giverid", "==", giverRef)); 
                const uidQuery = query(userRef, where("uid", "==", uid));

                const giveridSnapshot = await getDocs(giveridQuery);
                const uidSnapshot = await getDocs(uidQuery);

                giveridSnapshot.forEach(async (doc) => {
                const itemRef = doc.ref; 
                const takersRef = collection(itemRef, "takers"); 

                const takersSnapshot = await getDocs(takersRef);
                takersSnapshot.forEach(async (takerDoc) => {
                    await deleteDoc(takerDoc.ref); 
                    console.log(`Taker ${takerDoc.id} poistettu tuotteesta ${doc.id}`);
                });

                // ei ainakaan vielä poistanut käyttäjää listauksista joihin oli varannut, 
                // palataan tähän myöhemmin
                const takeridQuery = query(takersRef, where("takerid", "==", uid));
                const takeridSnapshot = await getDocs(takeridQuery);
                takeridSnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                    console.log(`Rivi ${doc.id} poistettu kokoelmasta takers (takerid-ehto)`);
                });

                await deleteDoc(doc.ref);
                console.log(`Rivi ${doc.id} poistettu kokoelmasta ${collectionName} (giverid-ehto)`);
                });

                uidSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
                console.log(`Rivi ${doc.id} poistettu kokoelmasta ${collectionName} (uid-ehto)`);
                });

            }
        } catch (error) {
            console.error("Virhe käyttäjän tietojen poistossa Firestoresta:", error);
            throw error;
        }
    };