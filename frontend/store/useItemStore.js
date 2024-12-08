import { create } from "zustand";
import {
  addItemToFirestore,
  deleteItemFromFirestore,
  fetchQueueCount,
  paginateItems,
} from "../services/firestoreItems";
import {
  addTakerToItem,
  createTaker,
  deleteTakerFromItem,
  getUserPositionInQueue,
} from "../services/firestoreQueues";
import { collection, doc, getDoc, where } from "firebase/firestore";
import { firestore } from "../services/firebaseConfig";

const PAGE_SIZE = 5;

const useItemStore = create((set, get) => {
  const setLoading = (loading) => set({ loading });
  const setError = (error) => set({ error });
  return {
    items: [],
    loading: false,
    error: null,
    lastDoc: null,
    hasMore: true,
    pages: [],
    isLastPage: false,
    currentPage: 0,

    fetchItems: async (pageIndex, selectedCity = "") => {
      setLoading(true);
      setError(null);
      try {
        const lastDoc = get().pages[pageIndex - 1];

        const { items: newItems, lastDoc: newLastDoc } = await paginateItems(
          lastDoc,
          PAGE_SIZE,
          () => (selectedCity ? where("city", "==", selectedCity) : undefined)
        );

        if (!get().pages[pageIndex]) {
          set((state) => {
            const updatedPages = [...state.pages];
            updatedPages[pageIndex] = newLastDoc;
            return { pages: updatedPages };
          });
        }
        const filteredItems = newItems.filter(
          (item) => !get().items.some((i) => i.id === item.id)
        );
        set((state) => ({
          items: [...newItems],
          lastDoc: newLastDoc,
          isLastPage: newItems.length < PAGE_SIZE,
          hasMore: newItems.length === PAGE_SIZE,
        }));
      } catch (error) {
        setError(error);
        console.error("Virhe ladattaessa kohteita:", error);
      } finally {
        setLoading(false);
      }
    },
    addUserToQueue: async (userId, itemId) => {
      try {
        // await addTakerToItem(userId, itemId);
        const response = await createTaker(userId, itemId);
        console.log("Response:", response);
        const queueCount = await fetchQueueCount(itemId);
        const queuePosition = await getUserPositionInQueue(userId, itemId);
        return { queueCount, queuePosition };
      } catch (error) {
        console.error("Error adding user to queue:", error);
        throw error;
      }
    },

    removeUserFromQueue: async (userId, itemId) => {
      try {
        await deleteTakerFromItem(userId, itemId);
        return await fetchQueueCount(itemId);
      } catch (error) {
        throw error;
      }
    },

    addItem: async ({ userId, itemname, itemdescription, city, imageUrl }) => {
      try {
        const id = await addItemToFirestore(
          userId,
          itemname,
          itemdescription,
          city,
          imageUrl
        );
        const itemCollectionRef = collection(firestore, "items");
        const itemSnap = await getDoc(doc(itemCollectionRef, id));
        const item = {
          ...itemSnap.data(),
          id: itemSnap.id,
        };

        const items = get().items.filter((i) => i.id !== item.id);
        set(() => ({
          items: [...items, item],
        }));
        return item;
      } catch (error) {
        console.error("Virhe lisättäessä tuotetta:", error);
        throw error;
      }
    },

    removeItem: async (userId, itemId) => {
      const items = get().items.filter((i) => i.id !== itemId);
      set(() => ({
        items,
      }));
      await deleteItemFromFirestore(userId, itemId);
    },
  };
});

export default useItemStore;
