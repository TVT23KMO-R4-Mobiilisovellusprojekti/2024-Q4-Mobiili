import { 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    deleteDoc, 
    doc,
    getDoc,
    serverTimestamp,
    orderBy,
    limit,
    startAfter,
} from 'firebase/firestore';

import { getAuth } from 'firebase/auth';
import { firestore } from './firebaseConfig'; 
import { get, last, take } from 'lodash';

// USERS

    export const getAuthenticatedUserData = () => {
        const auth = getAuth(); 
        const user = auth.currentUser; 
    
        if (user) {
        console.log('UID:', user.uid);
        } else {
        console.error('Ei ole kirjautunut');
        }

        return user;
    };

    export const  saveUserToFirestore = async (uid, username, email) => {
            
        try {
            await addDoc(collection(firestore, 'users'), {
            username,
            email: email.toLowerCase(),
            uid,
            });
            console.log('Käyttäjä lisätty Firestoreen');
        } catch (error) {
            console.error('Virhe lisättäessä käyttäjää Firestoreen:', error);
            throw error;
        }
    };

    export const deleteUserDataFromFirestore = async (uid) => {

        try {
            const collectionsToClean = ["items", "users"];

            for (const collectionName of collectionsToClean) {
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

// ITEMS

    export const addItemToFirestore = async (itemname, itemdescription, postalcode, city ) => {
        
        getUserData(uid);  

        if (!itemname || !itemdescription || !postalcode || !city) {
            console.error('Virhe: Yksi tai useampi kenttä on tyhjä!');
            throw new Error('Täytä puuttuvat kentät.');
        }

        try {
            
            const giverRef = doc(firestore, 'users', getUserData(uid));
        
            const itemData = {
            itemname,
            itemdescription,
            postalcode,
            city,
            giverid: giverRef,
            createdAt: serverTimestamp(),
            expirationAt: serverTimestamp(),
            };
        
            const docRef = await addDoc(collection(firestore, 'items'), itemData);
            console.log('Tavara lisätty Firestoreen, ID:', docRef.id);
        
            const takersRef = collection(firestore, `items/${docRef.id}/takers`);
            await addDoc(takersRef, { placeholder: true });
            console.log('Alikokoelma "takers" luotu tuotteelle:', docRef.id);
        
            return docRef.id;
        } catch (error) {
            console.error('Virhe lisättäessä tavaraa Firestoreen:', error);
            throw error;
        }
    };

    export const getItemsFromFirestore = async () => {
        try {
            const itemsRef = collection(firestore, 'items');
            const itemsSnapshot = await getDocs(itemsRef);
            const items = [];

            itemsSnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
            });
        
            return items;
        } catch (error) {
            console.error('Virhe haettaessa tavaroita Firestoresta:', error);
            throw error;
        }
    };

    export const paginateItems = async (lastDoc, pageSize, filter = undefined) => {
        try {
            const itemsRef = collection(firestore, 'items');
            let q;
    
            if (lastDoc) {
                q = query(itemsRef, orderBy('createdAt'), startAfter(lastDoc), limit(pageSize));
            } else {
                q = query(itemsRef, orderBy('createdAt'), limit(pageSize));
            }

            if (filter) {
                q = query(q, filter());
            }
    
            const itemsSnapshot = await getDocs(q);
            const items = [];
    
            itemsSnapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() });
            });
    
            const lastVisibleDoc = itemsSnapshot.docs[itemsSnapshot.docs.length - 1];
            return { items, lastDoc: lastVisibleDoc };
        } catch (error) {
            console.error('Virhe paginoidessa tavaroita:', error);
            throw error;
        }
    };

    export const getCurrentUserItems = async (lastDoc, pageSize) => {
        const uid = getUserData(uid);
        return paginateItems(lastDoc, pageSize, () => where('giverid', '==', doc(firestore, 'users', uid)));
    };
    
    export const getItemFromFirestore = async (itemId) => {
        try {
            const itemRef = doc(firestore, 'items', itemId);
            const itemSnapshot = await getDoc(itemRef);
        
            if (itemSnapshot.exists()) {
            const itemData = itemSnapshot.data();
            const itemId = itemSnapshot.id;
            const giverRef = itemData.giverid;
            const takersRef = collection(firestore, `items/${itemId}/takers`);

            return { itemId, ...itemData, giverRef, takersRef };
            } else {
            return null;
            }

        } catch (error) {
            console.error('Virhe haettaessa tavaraa Firestoresta:', error);
            throw error;
        }
    };

    export const deleteItemFromFirestore = async (itemId) => {
        try {
            getUserData(uid);
            getItemFromFirestore(itemId);

            if (giverRef !== uid) {
                console.error('Virhe: Et voi poistaa toisen tuotteita.');
                throw new Error('Et voi poistaa toisten tuotteita.');
            }

            await deleteDoc(itemRef);
            console.log('Tavara poistettu Firestoresta:', itemId);
        } catch (error) {
            console.error('Virhe poistettaessa tavaraa Firestoresta:', error);
            throw error;
        }
    };

    export const checkIfMyItem = async (itemId) => {
        try {
            const uid = getUserData(uid); 
            const itemData = await getItemFromFirestore(itemId); 
            const { giverRef } = itemData; 

            console.log("GiverRef:", giverRef.id);

            if (giverRef.id === uid) {
                return true; 
            } else {
                return false;
            }
        } catch (error) {
            console.error("Error checking item ownership:", error);
            return false;
        }
    };

// TAKERS & QUEUES
    
    export const getCurrentUserQueuesForItems = async (lastDoc, pageSize) => {
        const uid = getUserData(uid);
        return paginateItems(lastDoc, pageSize, () => where('takerId', '==', doc(firestore, 'users', uid)));
    };

    export const addTakerToItem = async (itemId) => {
        try {
        const uid = getUserData(uid);
        const itemRef = doc(firestore, 'items', itemId);
    
        const itemSnapshot = await getDoc(itemRef);
        if (!itemSnapshot.exists()) {
            console.error('Virhe: Tuotetta ei löytynyt.');
            throw new Error('Tuotetta ei löytynyt.');
        }
    
        const itemData = itemSnapshot.data();
        const giverId = itemData.giverid.id;

        if (giverId === uid) {
            console.error('Virhe: Et voi varata omaa tuotettasi.');
            throw new Error('Et voi varata omaa tuotettasi.');
        }
    
        const takersRef = collection(itemRef, 'takers');

        const takerData = {
            takerId: doc(firestore, "users", uid), 
            createdAt: serverTimestamp(), 
        };
    
        await addDoc(takersRef, takerData);
        console.log('Taker lisätty tuotteelle:', itemId);
    
        } catch (error) {
        console.error('Virhe lisättäessä varaajaa Firestoreen:', error);
        throw error;
        }
    };

    export const deleteTakerFromItem = async (itemId) => {
        try {
            const uid = getUserData(uid);
            const userRef = doc(firestore, "users", uid); 
            const itemRef = doc(firestore, "items", itemId); 
            const takersRef = collection(itemRef, "takers"); 

            const q = query(takersRef, where("takerId", "==", userRef));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.empty) {
                console.log("Käyttäjää ei löytynyt jonosta.");
                return; 
            }

            for (const takerDoc of querySnapshot.docs) {
                await deleteDoc(takerDoc.ref);
                console.log("Poistettu varaaja dokumentista:", takerDoc.id);
            }
        } catch (error) {
            console.error("Virhe poistettaessa varaajaa Firestoresta:", error);
            throw error;
        }
    };

    export const getCurrentUserQueues = async (itemId) => {
        try {
            const uid = getUserData(uid); 
            const itemRef = doc(firestore, "items", itemId);
            const takersRef = collection(itemRef, "takers");

            const userRef = doc(firestore, "users", uid);
            const q = query(takersRef, where("takerId", "==", userRef));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                console.log("Käyttäjä on jo jonossa:", uid);
                return true;
            }

            console.log("Käyttäjä ei ole jonossa:", uid);
            return false; 
        } catch (error) {
            console.error("Virhe jonotiedon tarkistuksessa:", error);
            return false; 
        }
    };

