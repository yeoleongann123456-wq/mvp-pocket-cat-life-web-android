export const LEGACY_SAVE_KEY = "pocketCatLifeSave";
export const MOCHI_SAVE_KEY = "mochiCareSave";

export function readJsonFromStorage<T>(key: string): T | null {
  const value = localStorage.getItem(key);
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
