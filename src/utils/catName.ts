export const DEFAULT_CAT_NAME = "Mochi";

export function getCatDisplayName(catName?: string | null) {
  const displayName = catName?.trim().replace(/\s+/g, " ");
  return displayName || DEFAULT_CAT_NAME;
}

export function getCatDisplayNameUpper(catName?: string | null) {
  return getCatDisplayName(catName).toUpperCase();
}
