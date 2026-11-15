import {sanitizeFeelings, type Feelings} from './feelings';
import { toWireProfile, type WireProfile } from './profileContext';
import type { Profile } from './numerology';
import { READING_LIMITS as L, wordCount, type AiReading } from './readingV2';
import { THIRD_PARTY_LIMIT_SENTENCE, CARE_ANSWER } from './safetyText';
export type { AiReading } from './readingV2';
import type { DrawnCard } from '../types';
export interface AiInfo { provider: 'gemini' | 'anthropic'; freeTier: boolean }
export interface AiPayload {
  profile?: WireProfile;
  question: string; context: string; feelings: Feelings; topic: string; spreadId: string;
  picks: {position: number; cardId: string; reversed: boolean}[];
}
export type AiResult = {kind: 'ok'; mode: 'full' | 'reflective_only'; reading: AiReading; notes: string[]}
  | {kind: 'blocked'} | {kind: 'busy'} | {kind: 'care'; answer: string} | {kind: 'rate_limit'; retryAfter: number; reason?:'rate_limited'|'daily_budget'}
  | {kind: 'unavailable' | 'network' | 'aborted'};
export function buildAiPayload(state: {
  profile?: Profile | null; profileEnabled?: boolean;
  question: string; context: string; feelings: Feelings | readonly string[]; topic: string; spreadId: string; reading: readonly DrawnCard[];
}): AiPayload {
  return {question: state.question.slice(0, 500), context: state.context.slice(0, 300), feelings: sanitizeFeelings(state.feelings),
    topic: state.topic, spreadId: state.spreadId,
    ...(state.profileEnabled && state.profile ? {profile: toWireProfile(state.profile, state.reading.map(({card}) => card.id))} : {}),
    picks: state.reading.map(({position, card, reversed}) => ({position: position.number, cardId: card.id, reversed})),
  };
}
const object = (v: unknown): v is Record<string, unknown> => Boolean(v) && typeof v === 'object' && !Array.isArray(v);
const text = (v: unknown, max: number, words = Infinity, empty = false): v is string => typeof v === 'string'
  && (empty || v.trim().length > 0) && v.length <= max && wordCount(v) <= words;
export function isAiReading(v: unknown, mode: 'full' | 'reflective_only' = 'full'): v is AiReading {
  return object(v) && (v.personal === undefined || (object(v.personal) && text(v.personal.title, 60) && text(v.personal.text, 700) && v.personal.text.length >= 200)) && text(v.headline, L.headline) && text(v.opening, L.opening + THIRD_PARTY_LIMIT_SENTENCE.length + 1)
    && (v.verdict === undefined || text(v.verdict, L.verdict, 12)) && text(v.answer, L.answer, 90) && text(v.tension, L.tension) && text(v.weave, L.weave) && text(v.unsaid, L.unsaid, Infinity, true) && text(v.outlook, L.outlook)
    && text(v.closing, L.closing, 36) && text(v.question, L.question) && text(v.experiment, L.experiment, 30, true)
    && Array.isArray(v.per_card) && v.per_card.length > 0 && v.per_card.length <= 78
    && v.per_card.every((p) => object(p) && Number.isInteger(p.position) && Number(p.position) > 0
      && text(p.title, L.title, 8) && text(p.scene, L.scene) && text(p.notice, L.notice))
    && new Set(v.per_card.map((p) => p.position)).size === v.per_card.length
    && Array.isArray(v.paths) && v.paths.length === (mode === 'reflective_only' ? 0 : 2)
    && v.paths.every((p) => object(p) && text(p.label, L.label, 8) && text(p.body, L.body));
}
interface ClientOptions { signal?: AbortSignal; fetchImpl?: typeof fetch }
async function withTimeout<T>(signal: AbortSignal | undefined, ms: number, work: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  const timer = setTimeout(abort, ms);
  signal?.addEventListener('abort', abort, {once: true});
  let onAbort: (() => void) | undefined;
  try {
    if (signal?.aborted) controller.abort();
    if (controller.signal.aborted) throw new Error('aborted');
    return await Promise.race([work(controller.signal), new Promise<never>((_resolve, reject) => {
      onAbort = () => reject(new Error('aborted'));
      controller.signal.addEventListener('abort', onAbort, {once: true});
    })]);
  } finally {
    clearTimeout(timer); signal?.removeEventListener('abort', abort);
    if (onAbort) controller.signal.removeEventListener('abort', onAbort);
  }
}
async function interpretOnce(payload: AiPayload, {signal, fetchImpl = fetch}: ClientOptions = {}): Promise<AiResult> {
  if(typeof navigator!=='undefined'&&navigator.onLine===false)return {kind:'network'};
  let timedOut = false;
  try {
    return await withTimeout(signal, 50_000, async (internal) => {
      const markTimeout = () => { timedOut = !signal?.aborted; };
      internal.addEventListener('abort', markTimeout, {once: true});
      try {
        const res = await fetchImpl('/api/interpret', {method: 'POST', headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload), signal: internal, cache: 'no-store'});
        if (res.status === 403) return {kind: 'blocked'};
        if (res.status === 429) {
          const header = res.headers.get('Retry-After');
          const seconds = header && /^\d+$/.test(header) ? Number(header) : header ? Math.ceil((Date.parse(header) - Date.now()) / 1000) : 60;
          let reason:'rate_limited'|'daily_budget'|undefined;try{const body=await res.json();if(body?.error==='daily_budget'||body?.error==='rate_limited')reason=body.error;}catch{/* No content logged. */}
          return {kind: 'rate_limit', ...(reason?{reason}:{}), retryAfter: Number.isFinite(seconds) ? Math.max(1, Math.min(86400, seconds)) : 60};
        }
        if (!res.ok) {
          try { const error = await res.json(); if (object(error) && error.error === 'AI_BUSY') return {kind: 'busy'}; } catch { /* No response content is logged. */ }
          return {kind: 'unavailable'};
        }
        let data: unknown;
        try { data = await res.json(); } catch { return {kind: 'unavailable'}; }
        if (!object(data)) return {kind: 'unavailable'};
        if (data.mode === 'care') return {kind: 'care', answer: text(data.answer, L.answer, 55) ? data.answer : CARE_ANSWER};
        if (object(data.reading)) {
          if (data.reading.experiment === undefined) data.reading.experiment = '';
          if (data.mode === 'reflective_only' && data.reading.paths === undefined) data.reading.paths = [];
        }
        if ((data.mode !== 'full' && data.mode !== 'reflective_only') || !isAiReading(data.reading, data.mode)
          || (data.notes !== undefined && (!Array.isArray(data.notes) || !data.notes.every((note) => typeof note === 'string')))) return {kind: 'unavailable'};
        if (data.reading.personal && !payload.profile) return {kind: 'unavailable'};
        if (data.reading.per_card.length !== payload.picks.length || data.reading.per_card.some((p) => !payload.picks.some((pick) => pick.position === p.position))) return {kind: 'unavailable'};
        // Copy just the documented fields. Never retain echoed input or unrecognized response properties.
        const r = data.reading;
        return {kind: 'ok', mode: data.mode, notes: data.notes === undefined ? [] : [...data.notes as string[]], reading: {
          ...(r.personal ? {personal: {title: r.personal.title, text: r.personal.text}} : {}),
          ...(r.verdict ? {verdict:r.verdict} : {}), answer: r.answer, headline: r.headline, opening: r.opening, tension: r.tension, weave: r.weave, unsaid: r.unsaid, outlook: r.outlook,
          per_card: payload.picks.map((pick) => {
            const {position, title, scene, notice} = r.per_card.find((item) => item.position === pick.position)!;
            return {position, title, scene, notice};
          }),
          paths: r.paths.map(p => ({label: p.label, body: p.body})),
          closing: r.closing, question: r.question, experiment: r.experiment,
        }};
      } finally { internal.removeEventListener('abort', markTimeout); }
    });
  } catch { return {kind: signal?.aborted ? 'aborted' : timedOut ? 'unavailable' : 'network'}; }
}
/** One silent retry, with a single deadline covering fetch, body parsing and backoff. */
export async function interpret(payload: AiPayload, {signal, fetchImpl = fetch}: ClientOptions = {}): Promise<AiResult> {
  try {
    return await withTimeout(signal, 90_000, async (overall) => {
      const first = await interpretOnce(payload, {signal: overall, fetchImpl});
      if (overall.aborted) return {kind: 'aborted'};
      if (first.kind !== 'unavailable' && first.kind !== 'network') return first;
      await new Promise<void>((resolve, reject) => {
        const abort = () => { clearTimeout(timer); overall.removeEventListener('abort', abort); reject(new Error('aborted')); };
        const timer = setTimeout(() => { overall.removeEventListener('abort', abort); resolve(); }, 1500);
        overall.addEventListener('abort', abort, {once: true});
        if (overall.aborted) abort();
      });
      if (overall.aborted) return {kind: 'aborted'};
      return interpretOnce(payload, {signal: overall, fetchImpl});
    });
  } catch { return {kind: signal?.aborted ? 'aborted' : 'unavailable'}; }
}
export async function getAiInfo({signal, fetchImpl = fetch}: ClientOptions = {}): Promise<AiInfo | null> {
  try {
    return await withTimeout(signal, 8000, async (internal) => {
      const res = await fetchImpl('/api/info', {signal: internal, cache: 'no-store'});
      if (!res.ok) return null;
      const value: unknown = await res.json();
      return object(value) && (value.provider === 'gemini' || value.provider === 'anthropic') && typeof value.freeTier === 'boolean'
        ? {provider: value.provider, freeTier: value.freeTier} : null;
    });
  } catch { return null; }
}
