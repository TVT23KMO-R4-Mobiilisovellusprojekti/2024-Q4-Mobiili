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
} from 'firebase/firestore';
import { firestore } from './firebaseConfig'; 
import { checkIfMyItem, paginateItems } from './firestoreItems';
import { get, last, take } from 'lodash';
    
    export const getCurrentUserQueuesForItems = async (lastDoc, pageSize) => {
        await checkIfMyItem();
        return paginateItems(lastDoc, pageSize, () => where('takerId', '==', doc(firestore, 'users', uid)));
    };

    export const addTakerToItem = async (uid, itemId) => {
        try {
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
        console.log(`UID: ${uid} varannut:`, itemId);
    
        } catch (error) {
        console.error('Virhe lisättäessä varausta:', error);
        throw error;
        }
    };

    export const deleteTakerFromItem = async (uid, itemId) => {
        try {
            const userRef = doc(firestore, "users", uid); 
            const itemRef = doc(firestore, "items", itemId); 
            const takersRef = collection(itemRef, "takers"); 

            const q = query(takersRef, where("takerId", "==", userRef));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.empty) {
                console.log("Käyttäjää ei löydy jonosta.");
                return; 
            }

            for (const takerDoc of querySnapshot.docs) {
                await deleteDoc(takerDoc.ref);
                console.log(`UID: ${uid} poistanut varauksen:`, takerDoc.id);
            }
        } catch (error) {
            console.error("Virhe poistettaessa varausta:", error);
            throw error;
        }
    };

    export const getCurrentUserQueues = async (uid, itemId) => {
        try {
            const itemRef = doc(firestore, "items", itemId);
            const takersRef = collection(itemRef, "takers");

            const userRef = doc(firestore, "users", uid);
            const q = query(takersRef, where("takerId", "==", userRef));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                console.log(`UID: ${uid} varannut: ${itemId}`);
                return true;
            }

            return false; 
        } catch (error) {
            console.error("Virhe jonotiedon tarkistuksessa:", error);
            return false; 
        }
    };

