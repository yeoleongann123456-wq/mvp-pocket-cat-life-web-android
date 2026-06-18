import { create } from "zustand";

type GameStore = {
  catName: string;
  setCatName: (catName: string) => void;
};

export const useGameStore = create<GameStore>((set) => ({
  catName: "Mochi",
  setCatName: (catName) => set({ catName: catName.trim() || "Mochi" })
}));
