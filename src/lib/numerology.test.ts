import { describe, expect, test, vi } from 'vitest';
import type { Card } from '../types';
// Reverse the data and put a Minor Arcana with a duplicate number first: never rely on array order.
vi.mock('../data', async (original) => {
  const data = await original<{cards: Card[]}>();
  return {...data, cards: [{...data.cards[0], arcana: 'minor', number: 1, id: 'not-a-major'}, ...data.cards.slice().reverse()]};
});
import { cards } from '../data';
import { reduceMax, majorIdByNumber, cardSet, birthCardNumber, yearCardNumber, lastBirthdayYear, nameCardNumber, facets, buildProfile, profileResonance, type Profile } from './numerology';
const today = new Date(2026, 6, 17, 12);

describe('numerology arithmetic', () => {
  test('mandatory birth, name and facets examples', () => {
    expect(birthCardNumber(17, 7, 1984)).toBe(10);
    expect(reduceMax(2008, 22)).toBe(10);
    expect(nameCardNumber('Kim')).toBe(15);
    expect(facets(9, 4, 1975)).toEqual({soul: 9, lesson: 4, gift: 3, purpose: 8});
    expect(facets(10, 12, 1992)).toEqual({soul: 10, lesson: 3, gift: 11, purpose: 7});
    expect(facets(11, 11, 1990).soul).toBe(11);
    expect(facets(11, 11, 1990).lesson).toBe(11);
  });
  test('preserves 10 and 11; repeated digit sums, zero and invalid inputs', () => {
    for (const max of [11, 22]) for (const n of [10, 11]) expect(reduceMax(n, max)).toBe(n);
    expect(reduceMax(1999, 22)).toBe(10); expect(reduceMax(22, 22)).toBe(22);
    expect(reduceMax(0, 11)).toBe(0); expect(reduceMax(0, 0)).toBe(0);
    for (const n of [-1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) expect(() => reduceMax(n, 22)).toThrow('INVALID_NUMBER');
    expect(() => reduceMax(7, 1)).toThrow('UNREACHABLE_MAX');
  });
  test('Vietnamese diacritics, decomposed Unicode, letters only and empty names', () => {
    // NGUYEN = 32, VAN = 10, DUC = 10 -> 52 -> 7.
    expect(nameCardNumber('Nguyễn Văn Đức')).toBe(7);
    expect(nameCardNumber('Nguyễn Văn Đức'.normalize('NFD'))).toBe(7);
    expect(nameCardNumber('NGUYEN VAN DUC')).toBe(7);
    expect(nameCardNumber('Đđ')).toBe(8);
    for (const name of ['', '   ', '123 !@#$ 😀', '中文']) expect(nameCardNumber(name)).toBeNull();
  });
});

describe('major mapping and card sets', () => {
  test('lookup by number/arcana, irrespective of data order', () => {
    for (let n = 1; n <= 21; n++) {
      const card = cards.find((c) => c.arcana === 'major' && c.number === n)!;
      expect(card).toBeDefined(); expect(majorIdByNumber(n)).toBe(card.id);
    }
    expect(majorIdByNumber(22)).toBe('major-00-fool');
    for (const n of [0, 23, 1.5, NaN]) expect(() => majorIdByNumber(n)).toThrow('INVALID_MAJOR_NUMBER');
  });
  test('all sets including explicit correction 20 and the triple 19', () => {
    for (let n = 1; n <= 9; n++) expect(cardSet(n)).toEqual([majorIdByNumber(n)]);
    for (let n = 10; n <= 18; n++) expect(cardSet(n)).toEqual([majorIdByNumber(n), majorIdByNumber(n - 9)]);
    expect(cardSet(19)).toEqual([majorIdByNumber(19), majorIdByNumber(10), majorIdByNumber(1)]);
    expect(cardSet(20)).toEqual([majorIdByNumber(20), majorIdByNumber(2)]);
    expect(cardSet(21)).toEqual([majorIdByNumber(21), majorIdByNumber(3)]);
    expect(cardSet(22)).toEqual(['major-00-fool']);
    const copy = cardSet(19); copy.pop(); expect(cardSet(19)).toHaveLength(3);
  });
});

describe('birthday and profile validation', () => {
  test('birthday today, tomorrow and yesterday in local calendar', () => {
    expect(lastBirthdayYear(17, 7, today)).toBe(2026);
    expect(lastBirthdayYear(18, 7, today)).toBe(2025);
    expect(lastBirthdayYear(16, 7, today)).toBe(2026);
    expect(lastBirthdayYear(31, 12, new Date(2026, 0, 1))).toBe(2025);
    expect(yearCardNumber(17, 7, 2026)).toBe(reduceMax(2050, 22));
  });
  test('February 29 uses February 28 only in non-leap years', () => {
    expect(lastBirthdayYear(29, 2, new Date(2025, 1, 27))).toBe(2024);
    expect(lastBirthdayYear(29, 2, new Date(2025, 1, 28))).toBe(2025);
    expect(lastBirthdayYear(29, 2, new Date(2024, 1, 28))).toBe(2023);
    expect(lastBirthdayYear(29, 2, new Date(2024, 1, 29))).toBe(2024);
    expect(yearCardNumber(29, 2, 2025)).toBe(reduceMax(2056, 22));
    expect(buildProfile({day: 29, month: 2, year: 2000}, today).birthCard).toBe(birthCardNumber(29, 2, 2000));
    expect(() => buildProfile({day: 29, month: 2, year: 1900}, today)).toThrow('INVALID_DATE');
  });
  test('complete profile is deterministic and does not mutate today', () => {
    const before = today.getTime();
    expect(buildProfile({day: 17, month: 7, year: 1984, name: 'Kim'}, today)).toEqual({
      birthCard: 10, yearCard: 7, nameCard: 15, facets: facets(17, 7, 1984),
    });
    expect(buildProfile({day: 17, month: 7, year: 1984}, today).nameCard).toBeNull();
    expect(today.getTime()).toBe(before);
  });
  test.each([[31,4,2000],[29,2,2001],[0,1,2000],[1,13,2000],[1,1,1899],[1,1,2027],[1.5,1,2000],[1,1,NaN]])('invalid date %i/%i/%i has a code', (day, month, year) => {
    expect(() => buildProfile({day, month, year}, today)).toThrowError(expect.objectContaining({code: 'INVALID_DATE'}));
  });
  test('invalid clock is rejected', () => expect(() => buildProfile({day: 1, month: 1, year: 2000}, new Date(NaN))).toThrow('INVALID_DATE'));
  test('100 seeded valid birth dates: range invariants, including the literal gift=0 century exception', () => {
    let seed = 20261009;
    const random = (max: number) => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % max; };
    for (let i = 0; i < 100; i++) {
      const year = 1900 + random(127), month = 1 + random(12);
      const day = 1 + random(new Date(year, month, 0).getDate());
      const p = buildProfile({day, month, year, name: 'Kim'}, today);
      for (const n of [p.birthCard, p.yearCard, p.nameCard!]) { expect(n).toBeGreaterThanOrEqual(1); expect(n).toBeLessThanOrEqual(22); }
      for (const [key, n] of Object.entries(p.facets)) {
        expect(n).toBeGreaterThanOrEqual(key === 'gift' && year % 100 === 0 ? 0 : 1); expect(n).toBeLessThanOrEqual(11);
      }
    }
    expect(facets(1, 1, 1900).gift).toBe(0); expect(facets(1, 1, 2000).gift).toBe(0);
  });
});

test('resonance deduplicates each card/via, prefers mains and handles no hits', () => {
  const profile: Profile = {birthCard: 19, yearCard: 10, nameCard: 1, facets: {soul: 1, lesson: 1, gift: 1, purpose: 1}};
  const one = majorIdByNumber(1), ten = majorIdByNumber(10);
  const result = profileResonance(profile, [one, ten, one, 'missing', 'cups-ace']);
  expect(result).toEqual([
    {cardId: one, via: 'name', role: 'main'}, {cardId: ten, via: 'year', role: 'main'},
    {cardId: one, via: 'birth', role: 'companion'}, {cardId: one, via: 'year', role: 'companion'},
    {cardId: ten, via: 'birth', role: 'companion'},
  ]);
  expect(profileResonance(profile, [majorIdByNumber(8)])).toEqual([]);
  expect(profileResonance(profile, [])).toEqual([]);
  expect(profileResonance({...profile, nameCard: null}, [one]).every((hit) => hit.via !== 'name')).toBe(true);
});
