import {CARE_ANSWER} from './safetyText';
import { describe, expect, test, vi } from 'vitest';
vi.mock('../data/numberLens.json', () => ({default: [
  {number: 1, essence: 'Ý chính.', gift: 'Điểm nâng đỡ.', shadow: 'Điều tự quan sát.', question: 'Bạn muốn hiểu gì?'},
  {number: 2, _placeholder: true, essence: 'TEMP', gift: 'TEMP', shadow: 'TEMP', question: 'TEMP'},
]}));
import { buildProfile, majorIdByNumber } from './numerology';
import { buildProfileContext, lookupNumberLens, toWireProfile } from './profileContext';
import { calculateProfile, EMPTY_PROFILE, PROFILE_KEY, readProfile, writeProfile } from './profileStorage';
import { buildAiPayload, interpret, isAiReading } from './aiClient';
import { buildOfflineReading } from './offlineReading';
import type { DrawnCard } from '../types';
const today = new Date(2026, 6, 17);
const draft = {day: '17', month: '7', year: '1984', name: 'PRIVATE_PERSON_NAME'};
const storage = () => {
  const data = new Map<string, string>();
  return {getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => {data.set(key, value);}, removeItem: (key: string) => {data.delete(key);}} as Storage;
};
const profile = {birthCard: 1, yearCard: 2, nameCard: null, facets: {soul: 1, lesson: 2, gift: 0, purpose: 3}};

describe('private profile data', () => {
  test('session default, opt-in storage, disabling persistence and deletion', () => {
    const store = storage(); expect(readProfile(store, today)).toEqual({draft: EMPTY_PROFILE, remember: false});
    expect(writeProfile(store, draft, false, today)).toBe(true); expect(store.getItem(PROFILE_KEY)).toBeNull();
    expect(writeProfile(store, draft, true, today)).toBe(true); expect(readProfile(store, today)).toEqual({draft, remember: true});
    expect(writeProfile(store, draft, false, today)).toBe(true); expect(store.getItem(PROFILE_KEY)).toBeNull();
    writeProfile(store, draft, true, today); writeProfile(store, EMPTY_PROFILE, false, today); expect(store.getItem(PROFILE_KEY)).toBeNull();
  });
  test('corrupt storage, quota, invalid dates and local calculations', () => {
    const store = storage(); store.setItem(PROFILE_KEY, '{'); expect(readProfile(store, today).remember).toBe(false);
    expect(readProfile(null, today).remember).toBe(false);
    expect(writeProfile({setItem: () => {throw Error('quota');}} as unknown as Storage, draft, true, today)).toBe(false);
    expect(writeProfile({removeItem: () => {throw Error('denied');}} as unknown as Storage, draft, false, today)).toBe(false);
    expect(calculateProfile({...draft, day: '31', month: '2'}, today)).toBeNull();
    expect(calculateProfile(draft, today)).toEqual(buildProfile({day: 17, month: 7, year: 1984, name: draft.name}, today));
  });
  test('wire whitelist drops identity and replaces forged resonance', () => {
    const raw = {...profile, name: draft.name, day: 17, month: 7, year: 1984, birthDate: 'PRIVATE_DATE', resonance: [{cardId: 'fake'}]};
    const sent = toWireProfile(raw, [majorIdByNumber(1)]);
    expect(sent.resonance).toEqual([{cardId: majorIdByNumber(1), via: 'birth', role: 'main'}]);
    expect(Object.keys(sent).sort()).toEqual(['birthCard', 'yearCard', 'nameCard', 'facets', 'resonance'].sort());
    expect(JSON.stringify(sent)).not.toMatch(/PRIVATE|1984|birthDate|"day"|"month"|"year"/);
  });
  test('only verified lens fields reach context; placeholders and gift zero are absent', () => {
    expect(lookupNumberLens(2)).toBeNull(); expect(lookupNumberLens(0)).toBeNull();
    const ctx = buildProfileContext(profile, [majorIdByNumber(1)]);
    expect(ctx.resonance).toHaveLength(1); expect(ctx.facets[0].lens?.essence).toBe('Ý chính.');
    expect(ctx.facets[1].lens).toBeNull(); expect(JSON.stringify(ctx)).not.toContain('TEMP');
    expect(JSON.stringify(ctx)).not.toContain('PRIVATE_PERSON_NAME');
  });
  test('actual fetch receives numbers/ids only from the profile and opt-out omits it', async () => {
    const state = {question: '', context: '', feelings: [], topic: 'Tổng quan', spreadId: 'one-card',
      reading: [{position: {number: 1}, card: {id: majorIdByNumber(1)}, reversed: false}] as DrawnCard[],
      profileEnabled: true, profile: {...profile, name: draft.name, birthDate: 'PRIVATE_DATE', day: 17, month: 7, year: 1984}, rawProfile: draft};
    const payload = buildAiPayload(state); expect(payload.profile?.birthCard).toBe(1);
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response('{"mode":"care"}'));
    expect(await interpret(payload, {fetchImpl})).toEqual({kind: 'care', answer: CARE_ANSWER});
    const json = JSON.parse(String(fetchImpl.mock.calls[0][1]?.body));
    expect(JSON.stringify(json)).not.toMatch(/PRIVATE|1984|birthDate|"day"|"month"|"year"/);
    expect(buildAiPayload({...state, profileEnabled: false})).not.toHaveProperty('profile');
    expect(buildAiPayload({...state, profile: null})).not.toHaveProperty('profile');
  });
  test('offline output never grows a personal block', () => {
    expect(buildOfflineReading([], {question: '', topic: 'Tổng quan', context: '', feelings: []})).not.toHaveProperty('personal');
  });
  test('client validates personal size even when all other fields are present', () => {
    const reading = {answer:'Một góc nhìn.',headline:'a',opening:'a',tension:'a',per_card:[{position:1,title:'a',scene:'a',notice:'a'}],weave:'a',unsaid:'a',outlook:'a',paths:[{label:'a',body:'a'},{label:'b',body:'b'}],closing:'a',question:'a',experiment:''};
    expect(isAiReading({...reading, personal: {title:'a',text:'x'.repeat(200)}})).toBe(true);
    expect(isAiReading({...reading, personal: {title:'a',text:'x'.repeat(199)}})).toBe(false);
    expect(isAiReading({...reading, personal: {title:'a',text:'x'.repeat(701)}})).toBe(false);
  });
});
