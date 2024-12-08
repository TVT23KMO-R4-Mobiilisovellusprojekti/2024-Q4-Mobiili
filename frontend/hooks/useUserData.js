import { useEffect } from "react";
import useUserDataStore from "../store/useUserDataStore";
import { useAuth } from "../context/AuthenticationContext";
import {
  collection,
  where,
  query,
  doc,
  collectionGroup,
  getDoc,
} from "firebase/firestore";
import { firestore } from "../services/firebaseConfig";
import { useCollection } from "react-firebase-hooks/firestore";
import { getUserPositionInQueue } from "../services/firestoreQueues";
import { fetchQueueCount } from "../services/firestoreItems";
import useItemStore from "../store/useItemStore";

const useUserData = () => {
  const { user } = useAuth();
  const itemsRef = collection(firestore, "items");
  const userRef = doc(firestore, "users", user?.uid);
  const takersCollectionGroup = collectionGroup(firestore, "takers");
  const userItemsQuery = query(itemsRef, where("giverid", "==", userRef));

  const takersQuery = query(
    takersCollectionGroup,
    where("takerId", "==", userRef)
  );

  // items/listings created by user
  const [itemsSnapshot, userItemsLoading, userItemsError] =
    useCollection(userItemsQuery);
  // taker documents with user
  const [takersSnapshot, takersLoading, takersError] =
    useCollection(takersQuery);

  const removeItem = async (itemId) => {
    await useItemStore.getState().removeItem(user.id, itemId);
  };

  const setQueues = async () => {
    const inQueueForItems = takersSnapshot.docs.map(async (doc) => {
      const itemRef = doc.ref.parent.parent;
      const item = await getDoc(itemRef);
      return {
        ...item.data(),
        id: item.id,
        inQueue: {
          position: await getUserPositionInQueue(user.id, item.id),
          count: await fetchQueueCount(item.id),
        },
      };
    });
    useUserDataStore.setState({
      queues: [...(await Promise.all(inQueueForItems))],
    });
  };

  useEffect(() => {
    if (itemsSnapshot) {
      const items = itemsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      useUserDataStore.setState({ items });
    }
  }, [itemsSnapshot]);

  useEffect(() => {
    if (takersSnapshot) {
      setQueues();
    }
  }, [takersSnapshot]);

  return {
    items: useUserDataStore((state) => state.items),
    queues: useUserDataStore((state) => state.queues),
    useUserDataStore,
    userItemsLoading,
    userItemsError,
    takersLoading,
    takersError,
    removeItem,
  };
};

export default useUserData;
