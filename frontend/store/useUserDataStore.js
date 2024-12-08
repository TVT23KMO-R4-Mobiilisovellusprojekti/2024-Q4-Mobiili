import { create } from "zustand";

const useUserDataStore = create((set, get) => ({
  items: [],
  queues: [],
  setItems: (items) => set({ items }),
  setInQueue: (inQueue) => set({ inQueue }),
}));

export default useUserDataStore;
