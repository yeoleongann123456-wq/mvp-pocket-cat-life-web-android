import { useMemo } from "react";
import type { MochiState } from "../types/game";
import { MOCHI_SAVE_KEY, readJsonFromStorage } from "../utils/storage";

export function useStoredMochiSave() {
  return useMemo(() => readJsonFromStorage<MochiState>(MOCHI_SAVE_KEY), []);
}
