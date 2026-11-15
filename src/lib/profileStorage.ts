import { buildProfile, type Profile } from './numerology';
export const PROFILE_KEY = 'tarot.profile.v1';
export interface ProfileDraft {day: string; month: string; year: string; name: string}
export const EMPTY_PROFILE: ProfileDraft = {day: '', month: '', year: '', name: ''};
export function calculateProfile(draft: ProfileDraft, today: Date): Profile | null {
  if (![draft.day, draft.month, draft.year].every((n) => /^\d+$/.test(n))) return null;
  try { return buildProfile({day: Number(draft.day), month: Number(draft.month), year: Number(draft.year), name: draft.name}, today); }
  catch { return null; }
}
export function readProfile(storage: Storage | null, today: Date): {draft: ProfileDraft; remember: boolean} {
  const empty = {draft: {...EMPTY_PROFILE}, remember: false};
  try {
    const value = JSON.parse(storage?.getItem(PROFILE_KEY) ?? 'null');
    if (!value || value.v !== 1 || value.remember !== true || !value.draft ||
      !Object.keys(EMPTY_PROFILE).every((key) => typeof value.draft[key] === 'string') || value.draft.name.length > 100) return empty;
    const draft = {day: value.draft.day, month: value.draft.month, year: value.draft.year, name: value.draft.name};
    return calculateProfile(draft, today) ? {draft, remember: true} : empty;
  } catch { return empty; }
}
export function writeProfile(storage: Storage | null, draft: ProfileDraft, remember: boolean, today: Date): boolean {
  try {
    if (!storage) return !remember;
    if (remember && calculateProfile(draft, today)) storage.setItem(PROFILE_KEY, JSON.stringify({v: 1, remember: true, draft: {day: draft.day, month: draft.month, year: draft.year, name: draft.name.slice(0,100)}}));
    else storage.removeItem(PROFILE_KEY);
    return true;
  } catch { return false; }
}
