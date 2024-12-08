import { useAuth } from "../context/AuthenticationContext";
import { collection, doc, query, where } from "firebase/firestore";
import { firestore } from "../services/firebaseConfig";
import { useCollection } from "react-firebase-hooks/firestore";
import { useEffect } from "react";
import { fetchThreadData } from "../services/threadService";
import { useThreadsStore } from "../store/useThreadsStore";

const useThreads = () => {
  const { user } = useAuth();
  const userRef = doc(firestore, "users", user?.uid);
  const threadsRef = collection(firestore, "threads");
  const q = query(threadsRef, where("participants", "array-contains", userRef));
  const [snapshot, loading, error] = useCollection(q);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (snapshot) {
          const threads = await Promise.all(
            snapshot.docs.map(async (doc) => await fetchThreadData(doc.id))
          );

          useThreadsStore.setState({ threads });
        }
      } catch (error) {
        console.error("Error fetching threads:", error);
      } finally {
        useThreadsStore.setState({ loading, error: error?.message || null });
      }
    };

    fetchData();
  }, [snapshot, loading, error]);

  return useThreadsStore();
};
export default useThreads;
