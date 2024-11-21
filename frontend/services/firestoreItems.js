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

import { firestore } from './firebaseConfig'; 
import { getAuthenticatedUserData } from './firestoreUsers';
import { get, last, take } from 'lodash';

// ITEMS

    export const addItemToFirestore = async (itemname, itemdescription, postalcode, city ) => {
        
        getAuthenticatedUserData();  

        if (!itemname || !itemdescription || !postalcode || !city) {
            console.error('Virhe: Yksi tai useampi kenttä on tyhjä!');
            throw new Error('Täytä puuttuvat kentät.');
        }

        try {
            
            const giverRef = doc(firestore, 'users', getAuthenticatedUserData().uid);
        
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
        const uid = getAuthenticatedUserData().uid;
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
            const itemRef = doc(firestore, 'items', itemId);

            if (!checkIfMyItem(itemId)) {
                console.error('Virhe: Et voi poistaa toisen tuotteita.');
                throw new Error('Et voi poistaa toisten tuotteita.');
            }

            await deleteDoc(itemRef);
            console.log(`Item ${itemId} poistettu Firestoresta.`);

        } catch (error) {
            console.error('Virhe poistettaessa itemiä Firestoresta:', error);
            throw error;
        }
      };

    export const checkIfMyItem = async (itemId) => {
        try {
            const uid = getAuthenticatedUserData().uid; 
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
