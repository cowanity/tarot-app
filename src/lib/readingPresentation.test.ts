import { expect, it } from 'vitest';
import { formatRefs } from './formatRefs';
import { summarizeReading } from './summarizeReading';
import { detectSensitive } from './detectSensitive';
import type { Card, DrawnCard } from '../types';

it('gom nguồn theo sách và gộp các trang liền kề', () => {
  expect(formatRefs(['H-tr.88', 'H-tr.90', 'H-tr.89', 'P-tr.36', 'P-tr.38']))
    .toEqual(['Huggens · tr. 88–90*', 'Pollack · tr. 36, 38']);
});
it('loại trang trùng, bỏ nguồn sai và xử lý danh sách rỗng', () => {
  expect(formatRefs(['P-tr.3', 'P-tr.1', 'P-tr.2', 'P-tr.2', ' H-tr.5 ', 'P-tr.0', 'X-tr.1', 'P-tr.NaN']))
    .toEqual(['Huggens · tr. 5*', 'Pollack · tr. 1–3']);
  expect(formatRefs([])).toEqual([]);
});
it('thống kê chính xác, không gán nguyên tố cho lá có element=null', () => {
  const base: Card = { id: 'sample', name_vi: 'Mẫu', name_en: 'SAMPLE', arcana: 'major', suit: null, number: 0, element: null,
    keywords: [], symbols: [], summary_up: '', depth_up: '', quote_up: null, quote_up_ref: [],
    summary_rev: null, depth_rev: null, quote_rev: null, quote_rev_ref: [], rev_missing: true, refs: { up: [], rev: [] } };
  const position: DrawnCard['position'] = { number: 1, name_vi: 'Mẫu', x: 0, y: 0, source_ref: null, needs_review: false, meaning_short: '' };
  const reading: DrawnCard[] = [
    { position, card: base, reversed: true },
    ...(['Lửa', 'Nước', 'Khí', 'Đất'] as const).map((element) => ({ position, card: { ...base, arcana: 'minor' as const, element }, reversed: false })),
  ];
  expect(summarizeReading(reading)).toEqual({ total: 5, major: 1, minor: 4, reversed: 1, elements: { Lửa: 1, Nước: 1, Khí: 1, Đất: 1 } });
  expect(summarizeReading([])).toEqual({ total: 0, major: 0, minor: 0, reversed: 0, elements: { Lửa: 0, Nước: 0, Khí: 0, Đất: 0 } });
});
it('phân loại từ khóa tại máy, ưu tiên khủng hoảng và tránh trùng một phần từ', () => {
  for (const question of ['SỨC KHỎE', 'điều trị bệnh', 'vay nợ', 'đầu tư chứng khoán', 'khởi kiện theo pháp luật', 'ly hôn pháp lý', 'dau tu']) {
    expect(detectSensitive(question)).toBe('professional');
  }
  for (const question of ['Tôi nợ tiền và muốn chết', 'tự hại', 'TỰ TỬ', 'tu tu', 'tự sát'.normalize('NFD')]) {
    expect(detectSensitive(question)).toBe('crisis');
  }
  for (const question of ['', 'từ từ suy nghĩ', 'chăm sóc bản thân', 'kiến thức mới', 'vậy mình nên làm gì']) {
    expect(detectSensitive(question)).toBe('none');
  }
});
