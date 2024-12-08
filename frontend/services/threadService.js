import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "./firebaseConfig";

const fetchThreadData = async (threadId) => {
  const threadSnapshot = await getDoc(doc(firestore, "threads", threadId));

  if (!threadSnapshot.exists()) {
    throw new Error("Thread does not exist");
  }

  const thread = threadSnapshot.data();

  const itemSnapshot = await getDoc(thread.item);

  if (!itemSnapshot.exists()) throw new Error("Item does not exist");

  const itemData = {
    ...itemSnapshot.data(),
    id: itemSnapshot.id,
  };

  const participants = await Promise.all(
    thread.participants.map(async (participantRef) => {
      const participantSnapshot = await getDoc(participantRef);
      if (!participantSnapshot.exists())
        throw new Error("Participant does not exist");
      return {
        ...participantSnapshot.data(),
        id: participantSnapshot.id,
      };
    })
  );

  const messagesRef = collection(firestore, "threads", threadId, "messages");
  const messageQuery = query(
    messagesRef,
    orderBy("createdAt", "desc"),
    limit(1)
  );

  const messageSnapshot = await getDocs(messageQuery);

  const latestMessage = messageSnapshot.empty
    ? null
    : messageSnapshot.docs[0].data();
  return {
    ...thread,
    item: itemData,
    participants,
    latestMessage,
    id: threadId,
  };
};

const fetchMessages = async (threadId) => {
  const messagesRef = collection(firestore, "threads", threadId, "messages");
  const messageQuery = query(messagesRef, orderBy("createdAt", "asc"));
  const messageSnapshot = await getDocs(messageQuery);
  return messageSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
};

const addThread = async (threadData) => {
  const threadsRef = collection(firestore, "threads");
  const newThreadRef = doc(threadsRef);
  const thread = {
    ...threadData,
    createdAt: serverTimestamp(),
    id: newThreadRef.id,
  };
  await setDoc(newThreadRef, thread);
  return newThreadRef.id;
};

const removeThread = async (threadId) => {
  const threadRef = doc(firestore, "threads", threadId);
  await deleteDoc(threadRef);
};

const updateThread = async (threadId, threadData) => {
  const threadRef = doc(firestore, "threads", threadId);
  await updateDoc(threadRef, threadData);
};

const setThread = async (threadId, threadData) => {
  const threadRef = doc(firestore, "threads", threadId);
  await setDoc(threadRef, threadData, { merge: true });
};

export {
  fetchThreadData,
  fetchMessages,
  addThread,
  removeThread,
  updateThread,
  setThread,
};
