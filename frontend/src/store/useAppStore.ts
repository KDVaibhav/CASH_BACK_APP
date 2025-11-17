import { create } from "zustand";
import { Store } from "../types";

interface AppState {
  store: Store;
  setStore: (store: Store) => void;
}

const sampleStore: Store = {
  name: "testStore",
  currency: "INR",
  timeZone: "GMT-5:00",
};

export const useAppStore = create<AppState>((set) => ({
  store: sampleStore,
  setStore: (store) => set({ store }),
}));
