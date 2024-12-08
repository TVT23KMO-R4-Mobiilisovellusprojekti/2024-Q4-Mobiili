import { create } from "zustand";
import {
  addThread as addThreadToFirestore,
  fetchThreadData,
  removeThread as removeThreadFromFirestore,
  updateThread as updateThreadInFirestore,
} from "../services/threadService";

export const useThreadsStore = create((set, get) => ({
  threads: [],
  loading: true,
  error: "",
  setThreads: (threads) => set({ threads }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addThread: async (threadData) => {
    console.log("threads state: ", get().threads);
    const threadId = await addThreadToFirestore(threadData);
    console.log("threads state after add: ", get().threads);
  },

  removeThread: async (threadId) => {
    await removeThreadFromFirestore(threadId);
  },

  updateThread: async (threadId, threadData) => {
    await updateThreadInFirestore(threadId, threadData);
    const thread = await fetchThreadData(threadId);
    set((state) => ({
      threads: state.threads.map((t) => (t.id === threadId ? thread : t)),
    }));
  },
}));
