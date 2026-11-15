import {readingStrings} from './readingText';
export const CLICHES = ['hành trình', 'năng lượng', 'vũ trụ', 'khởi đầu mới', 'tiềm năng', 'chữa lành', 'vùng an toàn', 'lắng nghe trái tim', 'hãy nhớ rằng', 'điều quan trọng là'];
export const OMINOUS = ['nguy cơ', 'sẽ gặp', 'tai họa', 'hậu quả nặng', 'bất hạnh'];
const fold = (text: string) => text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd');
function counts(value: unknown, phrases: readonly string[]) {
  const texts = readingStrings(value).map(fold);
  return phrases.map(phrase => ({phrase, count: texts.reduce((n, text) => n + [...text.matchAll(new RegExp(`\\b${fold(phrase).replace(/ /g, '\\s+')}\\b`, 'gu'))].length, 0)}));
}
export const matchedCliches = (value: unknown) => counts(value, CLICHES).filter(p => p.count).map(p => p.phrase);
export const countCliches = (value: unknown) => counts(value, CLICHES).reduce((n, p) => n + p.count, 0);
export const ominousCount = (value: unknown) => counts(value, OMINOUS).reduce((n, p) => n + p.count, 0);

export const RESTRICTED_ABSTRACT = ['năng lượng', 'vũ trụ', 'thông điệp', 'hành trình'];
export const restrictedAbstractCounts = (value: unknown): Record<string, number> => Object.fromEntries(counts(value, RESTRICTED_ABSTRACT).map(p => [p.phrase, p.count]));
export const countStrictCliches = (value: unknown) => counts(value, CLICHES.filter(p => !RESTRICTED_ABSTRACT.includes(p))).reduce((n,p)=>n+p.count,0);

export const abstractRepeatCount = (value: unknown) => Object.values(restrictedAbstractCounts(value)).reduce((n,count)=>n+Math.max(0,count-1),0);
