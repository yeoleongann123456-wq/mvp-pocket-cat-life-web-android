import { useMemo } from "react";
import type { LegacySave } from "../types/game";
import { LEGACY_SAVE_KEY, readJsonFromStorage } from "../utils/storage";

export function useLegacySave() {
  return useMemo(() => readJsonFromStorage<LegacySave>(LEGACY_SAVE_KEY), []);
}
