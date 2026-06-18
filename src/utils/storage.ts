export const LEGACY_SAVE_KEY = "pocketCatLifeSave";

export function readJsonFromStorage<T>(key: string): T | null {
  const value = localStorage.getItem(key);
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
