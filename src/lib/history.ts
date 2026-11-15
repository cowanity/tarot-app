import {isAiReading,type AiResult} from './aiClient';
export type SavedInterpretation=Extract<AiResult,{kind:'ok'}>;
import {sanitizeFeedback, type ReadingFeedback} from './feedback';
import {storedFeelings, type Feelings} from './feelings';
import { cards, spreads } from '../data';
import type { DrawnCard } from '../types';

export const LEGACY_HISTORY_KEY = 'tarot.history.v1';
export const HISTORY_KEY = 'tarot.history.v2';
export const HISTORY_EVENT = 'tarot:history-updated';
export interface SavedReading {
  v: 1 | 2;
  interpretation?: SavedInterpretation;
  feedback?: ReadingFeedback[];
  feelings?: Omit<Feelings, 'other'>;
  id: string;
  createdAt: string;
  question: string;
  topic: string;
  spreadId: string;
  cards: { position: number; cardId: string; reversed: boolean }[];
}
const cardMap = new Map(cards.map((card) => [card.id, card]));
const spreadMap = new Map(spreads.map((spread) => [spread.id, spread]));
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Validate against the current catalog; return only the permitted storage fields. */
function validate(value: unknown): SavedReading | null {
  if (!record(value) || (value.v !== 1 && value.v !== 2) || typeof value.id !== 'string' || !value.id.trim()
    || typeof value.createdAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value.createdAt)
    || !Number.isFinite(Date.parse(value.createdAt)) || typeof value.question !== 'string'
    || typeof value.topic !== 'string' || typeof value.spreadId !== 'string' || !Array.isArray(value.cards)) return null;
  const spread = spreadMap.get(value.spreadId);
  if (!spread || value.cards.length !== spread.card_count) return null;
  const selected: SavedReading['cards'] = [];
  const positions = new Set<number>(), cardIds = new Set<string>();
  for (const item of value.cards) {
    if (!record(item) || typeof item.position !== 'number' || !Number.isInteger(item.position)
      || typeof item.cardId !== 'string' || !cardMap.has(item.cardId) || typeof item.reversed !== 'boolean') return null;
    const position = spread.positions.find((p) => p.number === item.position);
    if (!position || positions.has(item.position) || cardIds.has(item.cardId) || (position.force_upright && item.reversed)) return null;
    positions.add(item.position); cardIds.add(item.cardId);
    selected.push({ position: item.position, cardId: item.cardId, reversed: item.reversed });
  }
  const stored=value.interpretation;
  const interpretation:SavedInterpretation|undefined=record(stored)&&stored.kind==='ok'&&(stored.mode==='full'||stored.mode==='reflective_only')
    &&isAiReading(stored.reading,stored.mode)&&stored.reading.per_card.length===positions.size&&stored.reading.per_card.every(p=>positions.has(p.position))
    &&Array.isArray(stored.notes)&&stored.notes.length<=20&&stored.notes.every(n=>typeof n==='string'&&n.length<=100)
    ? {kind:'ok',mode:stored.mode,reading:stored.reading,notes:stored.notes as string[]}:undefined;
  return { ...(interpretation?{interpretation}:{}), ...(Array.isArray(value.feedback) ? {feedback:sanitizeFeedback(value.feedback,selected.map(c=>c.position))} : {}), v: 2, feelings: storedFeelings(value.feelings), id: value.id, createdAt: value.createdAt, question: value.question,
    topic: value.topic, spreadId: value.spreadId, cards: selected };
}

function parseHistory(raw: string | null): SavedReading[] {
  let value: unknown;
  try { value = JSON.parse(raw ?? '[]'); } catch { return []; }
  if (!Array.isArray(value)) return [];
  const unique = new Map<string, SavedReading>();
  for (const candidate of value) {
    const item = validate(candidate);
    if (item && !unique.has(item.id)) unique.set(item.id, item);
  }
  return [...unique.values()].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 100);
}

export function listReadings(storage: Storage | null): SavedReading[] {
  try {
    if (!storage) return [];
    const current = storage.getItem(HISTORY_KEY);
    if (current !== null) return parseHistory(current);
    const legacy = storage.getItem(LEGACY_HISTORY_KEY);
    const items = parseHistory(legacy);
    if (legacy !== null) {
      try {storage.setItem(HISTORY_KEY, JSON.stringify(items)); storage.removeItem(LEGACY_HISTORY_KEY);} catch { /* Keep legacy readable if migration cannot be saved. */ }
    }
    return items;
  } catch { return []; }
}
export function saveReading(storage: Storage | null, reading: SavedReading): { ok: boolean } {
  try {
    const clean = validate(reading);
    if (!storage || !clean) return { ok: false };
    // Read inside this try, so an unreadable store is never overwritten with an empty list.
    const all = parseHistory(storage.getItem(HISTORY_KEY) ?? storage.getItem(LEGACY_HISTORY_KEY));
    const previous = all.find(item=>item.id===clean.id);
    if(!clean.interpretation&&previous?.interpretation)clean.interpretation=previous.interpretation;
    const retained = clean.feedback === undefined && previous?.feedback
      ? {...clean,feedback:sanitizeFeedback(previous.feedback,clean.cards.map(c=>c.position))} : clean;
    const items = all.filter((item) => item.id !== clean.id);
    const next = [retained, ...items].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 100);
    storage.setItem(HISTORY_KEY, JSON.stringify(next));
    return { ok: true };
  } catch { return { ok: false }; }
}
export function deleteReading(storage: Storage | null, id: string): { ok: boolean } {
  try {
    if (!storage) return { ok: false };
    const items = parseHistory(storage.getItem(HISTORY_KEY) ?? storage.getItem(LEGACY_HISTORY_KEY));
    storage.setItem(HISTORY_KEY, JSON.stringify(items.filter((item) => item.id !== id)));
    return { ok: true };
  } catch { return { ok: false }; }
}
export function clearAll(storage: Storage | null): { ok: boolean } {
  try {
    if (!storage) return { ok: false };
    storage.setItem(HISTORY_KEY, '[]');
    storage.removeItem(LEGACY_HISTORY_KEY);
    return { ok: true };
  } catch { return { ok: false }; }
}
export function rebuildReading(saved: SavedReading): DrawnCard[] {
  const clean = validate(saved);
  if (!clean) return [];
  return spreadMap.get(clean.spreadId)!.positions.map((position) => {
    const item = clean.cards.find((card) => card.position === position.number)!;
    return { position, card: cardMap.get(item.cardId)!, reversed: item.reversed };
  });
}

/** A feedback click explicitly saves this reading; retain existing votes across modes. */
export function saveFeedback(storage:Storage|null, reading:SavedReading, vote:ReadingFeedback):{ok:boolean} {
  try {
    if(!storage) return {ok:false};
    const existing=parseHistory(storage.getItem(HISTORY_KEY) ?? storage.getItem(LEGACY_HISTORY_KEY)).find(r=>r.id===reading.id);
    const base=existing??reading;
    const clean=sanitizeFeedback([vote],base.cards.map(c=>c.position));
    if(!clean.length)return {ok:false};
    return saveReading(storage,{...base,feedback:sanitizeFeedback([...(base.feedback??[]),...clean],base.cards.map(c=>c.position))});
  }catch{return {ok:false};}
}
