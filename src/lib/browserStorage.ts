/** Accessing the localStorage property itself can throw in private contexts. */
export function browserStorage(): Storage | null {
  try { return window.localStorage; } catch { return null; }
}
