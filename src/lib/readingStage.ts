import type {Card} from '../types';
/** Keep punctuation/quotes intact, including ellipses; don't split decimal numbers. */
export function splitSentences(text: string): string[] {
  return text.trim().split(/(?<=[.!?…][”"»]?)[\s\n]+/u).filter(Boolean);
}
export function scrollProgress(top: number, height: number, viewport: number): number {
  if (![top, height, viewport].every(Number.isFinite) || height <= 0 || viewport <= 0) return 0;
  return Math.max(0, Math.min(1, (viewport - top) / (height + viewport)));
}
export const headlineSize = (text: string) => Array.from(text).length <= 40 ? 'short' : Array.from(text).length <= 60 ? 'medium' : 'long';
/** Only attach a basis image when the branch explicitly names a drawn card. */
export function namedCards(text: string, cards: readonly Card[]): Card[] {
  const normalized = text.normalize('NFC').toLocaleLowerCase('vi');
  return cards.filter(card => [card.name_vi, card.name_en].some(name => {
    const needle = name.normalize('NFC').toLocaleLowerCase('vi');
    const start = normalized.indexOf(needle);
    if (start < 0) return false;
    return !/[\p{L}\p{N}]/u.test(normalized[start - 1] ?? '') && !/[\p{L}\p{N}]/u.test(normalized[start + needle.length] ?? '');
  }));
}
export function ritualMessage(seconds: number) {
  return seconds < 8 ? 'Đang trải các lá bài của bạn…' : seconds < 20 ? 'Đang nối các lá với câu chuyện của bạn…'
    : seconds < 40 ? 'Lời đọc đang dần thành hình, chờ thêm chút nhé…' : 'Vẫn đang soạn lời đọc. Bạn có thể chờ thêm hoặc đọc theo sách trước.';
}
