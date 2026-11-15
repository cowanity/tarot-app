import { cards } from '../data';

export type Profile = {
  birthCard: number;
  yearCard: number;
  nameCard: number | null;
  facets: { soul: number; lesson: number; gift: number; purpose: number };
};
export type Resonance = { cardId: string; via: 'birth' | 'year' | 'name'; role: 'main' | 'companion' };
const fail = (code: string): never => { throw Object.assign(new Error(code), {code}); };
const integer = (n: number) => Number.isSafeInteger(n) && n >= 0;
const digits = (n: number) => String(n).split('').reduce((sum, digit) => sum + Number(digit), 0);

export function reduceMax(n: number, max: number): number {
  if (!integer(n) || !integer(max)) return fail('INVALID_NUMBER');
  while (n > max) {
    const next = digits(n);
    if (next === n) return fail('UNREACHABLE_MAX');
    n = next;
  }
  return n;
}
function majorNumber(n: number): void {
  if (!Number.isInteger(n) || n < 1 || n > 22) fail('INVALID_MAJOR_NUMBER');
}
export function majorIdByNumber(n: number): string {
  majorNumber(n);
  if (n === 22) return 'major-00-fool';
  const card = cards.find((card) => card.arcana === 'major' && card.number === n);
  return card?.id ?? fail('MAJOR_NOT_FOUND');
}
const sets: readonly (readonly number[])[] = [
  [], [1], [2], [3], [4], [5], [6], [7], [8], [9],
  [10, 1], [11, 2], [12, 3], [13, 4], [14, 5], [15, 6], [16, 7], [17, 8], [18, 9],
  [19, 10, 1], [20, 2], [21, 3], [22],
];
export function cardSet(n: number): string[] {
  majorNumber(n);
  // Chỉnh có chủ ý lỗi in trùng dòng 11: 20 = Phán Xét, đi kèm 2 = Nữ Tu.
  return sets[n].map(majorIdByNumber);
}
const leap = (year: number) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
function validDate(day: number, month: number, year: number): boolean {
  if (![day, month, year].every(Number.isSafeInteger) || year < 1 || month < 1 || month > 12) return false;
  return day >= 1 && day <= [31, leap(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}
function todayYear(today: Date): number {
  if (!(today instanceof Date) || !Number.isFinite(today.getTime()) || today.getFullYear() < 1900) return fail('INVALID_DATE');
  return today.getFullYear();
}
export function birthCardNumber(day: number, month: number, year: number): number {
  if (!validDate(day, month, year) || !Number.isSafeInteger(day + month + year)) return fail('INVALID_DATE');
  return reduceMax(day + month + year, 22);
}
export function yearCardNumber(day: number, month: number, birthdayYear: number): number {
  // 29/2 remains the birth date in the sum, even when its anniversary is observed on 28/2.
  if (!validDate(day, month, 2000) || !Number.isSafeInteger(birthdayYear) || birthdayYear < 1
    || !Number.isSafeInteger(day + month + birthdayYear)) return fail('INVALID_DATE');
  return reduceMax(day + month + birthdayYear, 22);
}
export function lastBirthdayYear(day: number, month: number, today: Date): number {
  const year = todayYear(today);
  if (!validDate(day, month, 2000)) return fail('INVALID_DATE');
  const anniversaryDay = month === 2 && day === 29 && !leap(year) ? 28 : day;
  const monthNow = today.getMonth() + 1;
  return monthNow > month || (monthNow === month && today.getDate() >= anniversaryDay) ? year : year - 1;
}
export function nameCardNumber(name: string): number | null {
  const letters = name.normalize('NFD').replace(/\p{M}/gu, '').replace(/[đĐ]/g, 'd').toUpperCase().replace(/[^A-Z]/g, '');
  if (!letters) return null;
  const sum = [...letters].reduce((total, letter) => total + ((letter.charCodeAt(0) - 65) % 9) + 1, 0);
  return reduceMax(sum, 22);
}
export function facets(day: number, month: number, year: number): Profile['facets'] {
  if (!validDate(day, month, year) || !Number.isSafeInteger(day + month + year)) return fail('INVALID_DATE');
  return {
    soul: reduceMax(day, 11), lesson: reduceMax(month, 11),
    // The requested formula gives 0 for years ending in 00; do not invent a replacement number.
    gift: reduceMax(digits(year % 100), 11),
    // Use the digits of the SUM, matching 9 + 4 + 1975 = 1988 -> 26 -> 8.
    purpose: reduceMax(day + month + year, 11),
  };
}
export function buildProfile({day, month, year, name = ''}: {day: number; month: number; year: number; name?: string}, today: Date): Profile {
  const currentYear = todayYear(today);
  if (year < 1900 || year > currentYear || !validDate(day, month, year)) return fail('INVALID_DATE');
  return {birthCard: birthCardNumber(day, month, year), yearCard: yearCardNumber(day, month, lastBirthdayYear(day, month, today)),
    nameCard: nameCardNumber(name), facets: facets(day, month, year)};
}
export function profileResonance(profile: Profile, drawnCardIds: string[]): Resonance[] {
  const hits: Resonance[] = [];
  const sources = [['birth', profile.birthCard], ['year', profile.yearCard], ['name', profile.nameCard]] as const;
  for (const cardId of new Set(drawnCardIds)) {
    for (const [via, n] of sources) {
      if (n === null) continue;
      const set = cardSet(n), index = set.indexOf(cardId);
      if (index >= 0) hits.push({cardId, via, role: index === 0 ? 'main' : 'companion'});
    }
  }
  return hits.sort((a, b) => Number(a.role === 'companion') - Number(b.role === 'companion'));
}
