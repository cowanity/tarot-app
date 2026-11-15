import { describe, expect, test, vi } from 'vitest';
import type { Card, DrawnCard, Spread } from '../types';

const fixtures = vi.hoisted(() => {
  const card = (id: string): Card => ({
    id, name_vi: id, name_en: id, arcana: 'major', suit: null, number: 0, element: null,
    keywords: [' Một ', 'hai'], symbols: [], summary_up: 'Xuôi ngắn', depth_up: 'Xuôi sâu',
    summary_rev: 'Ngược ngắn', depth_rev: 'Ngược sâu', rev_missing: false,
    quote_up: 'Không đưa trích dẫn', quote_rev: null, quote_up_ref: [], quote_rev_ref: [], refs: { up: [], rev: [] },
  });
  const spread: Spread = {
    id: 'test-spread', name_vi: 'Thế thử', card_count: 2, source: 'app', source_ref: null,
    positions: [1, 2].map((number) => ({ number, name_vi: `Vị trí ${number}`, meaning_short: 'Ý nghĩa vị trí',
      x: number, y: 0, source_ref: null, needs_review: false, force_upright: number === 2 })),
  };
  return { cards: [card('a'), card('b')], spreads: [spread] };
});
vi.mock('../data', () => fixtures);
import { buildReadingContext, resolveReading } from './readingContext';
import { buildOfflineReading } from './offlineReading';
import { feelings, topicPhrases } from '../data/appPhrases.vi';
const picks = [{ position: 1, cardId: 'a', reversed: true }, { position: 2, cardId: 'b', reversed: false }];
const options = { question: '', topic: 'Tổng quan', context: '', feelings: [] as string[] };
const reading = (): DrawnCard[] => resolveReading('test-spread', picks);

describe('resolveReading', () => {
  test('tra dữ liệu chuẩn và sắp theo vị trí, không nhận văn bản bên ngoài', () => {
    const resolved = resolveReading('test-spread', [...picks].reverse());
    expect(resolved.map((item) => item.card.id)).toEqual(['a', 'b']);
    expect(resolved[0].card).toBe(fixtures.cards[0]);
  });
  test('báo mã cho id thế bài/lá/vị trí sai', () => {
    expect(() => resolveReading('missing', picks)).toThrow('SPREAD_NOT_FOUND');
    expect(() => resolveReading('test-spread', [{ ...picks[0], cardId: 'missing' }, picks[1]])).toThrow('CARD_NOT_FOUND');
    expect(() => resolveReading('test-spread', [{ ...picks[0], position: 99 }, picks[1]])).toThrow('POSITION_NOT_FOUND');
  });
  test('từ chối thiếu lá', () => expect(() => resolveReading('test-spread', picks.slice(0, 1))).toThrow('CARD_COUNT'));
  test('từ chối trùng vị trí và lá', () => {
    expect(() => resolveReading('test-spread', [picks[0], { ...picks[1], position: 1 }])).toThrow('DUPLICATE_POSITION');
    expect(() => resolveReading('test-spread', [picks[0], { ...picks[1], cardId: 'a' }])).toThrow('DUPLICATE_CARD');
  });
  test('không chấp nhận force_upright ngược', () => {
    expect(() => resolveReading('test-spread', [picks[0], { ...picks[1], reversed: true }])).toThrow('FORCE_UPRIGHT');
  });
  test('từ chối schema không hợp lệ', () => {
    expect(() => resolveReading('test-spread', [null, picks[1]] as unknown as typeof picks)).toThrow('INVALID_PICKS');
    expect(() => resolveReading('test-spread', null as unknown as typeof picks)).toThrow('INVALID_PICKS');
  });
});

describe('buildReadingContext', () => {
  test('đúng chiều, giới hạn 8 từ khóa, không quote hay mô tả biểu tượng', () => {
    const drawn = reading();
    drawn[0] = { ...drawn[0], card: { ...drawn[0].card, keywords: Array.from({ length: 10 }, (_, i) => `Từ ${i}`) } };
    const output = buildReadingContext(drawn, fixtures.spreads[0]);
    expect(output.positions[0].text).toBe('Ngược ngắn\n\nNgược sâu');
    expect(output.positions[0].orientation).toBe('reversed');
    expect(output.positions[0].keywords).toHaveLength(8);
    expect(output.positions[1].text).toBe('Xuôi ngắn\n\nXuôi sâu');
    expect(output.positions[0]).not.toHaveProperty('quote');
    expect(output.positions[0].symbols).toEqual([]);
    expect(Object.keys(output.positions[0].card)).toEqual(['id', 'name_vi', 'name_en']);
  });
  test('rev_missing dùng cả tóm tắt và chiều sâu xuôi, giữ hướng và cờ', () => {
    const drawn = reading();
    drawn[0] = { ...drawn[0], card: { ...drawn[0].card, rev_missing: true } };
    expect(buildReadingContext(drawn, fixtures.spreads[0]).positions[0]).toMatchObject({
      text: 'Xuôi ngắn\n\nXuôi sâu', orientation: 'reversed', reversedMissing: true,
    });
  });
});

describe('buildOfflineReading', () => {
  test('xác định, mỗi vị trí một câu hỏi, không sửa đầu vào', () => {
    const drawn = reading(), original = structuredClone(drawn);
    expect(buildOfflineReading(drawn, options)).toEqual(buildOfflineReading(drawn, options));
    const result = buildOfflineReading(drawn, options);
    expect(result.reflections).toHaveLength(2);
    result.reflections.forEach((item) => {
      expect(item.text.endsWith('?')).toBe(true);
      expect(item.text).toContain(`Vị trí ${item.position}`);
      expect(item.text).toContain('Một');
    });
    expect(drawn).toEqual(original);
  });
  test('chỉ nối từ khóa trùng chính xác sau chuẩn hóa, không đếm lặp trên một lá', () => {
    const drawn = reading();
    drawn[0] = { ...drawn[0], card: { ...drawn[0].card, keywords: [' Bình  tĩnh ', 'bình tĩnh', 'Khác'] } };
    drawn[1] = { ...drawn[1], card: { ...drawn[1].card, keywords: ['BÌNH TĨNH', 'Khác biệt'] } };
    expect(buildOfflineReading(drawn, options).connections).toEqual(["Từ khóa 'bình tĩnh' xuất hiện ở các vị trí 1. Vị trí 1 và 2. Vị trí 2."]);
    expect(buildOfflineReading(drawn.slice(0, 1), options).connections).toEqual([]);
    drawn[1] = { ...drawn[1], card: { ...drawn[1].card, keywords: ['Một mình'] } };
    expect(buildOfflineReading(drawn, options).connections).toEqual([]);
  });
  test('đủ 5 chủ đề, 6 cảm xúc, hai câu khép lại và phản hồi bối cảnh', () => {
    for (const [topic, phrase] of Object.entries(topicPhrases)) {
      const result = buildOfflineReading(reading(), { ...options, topic });
      expect(result.reflections[0].text).toContain(phrase);
      expect(result.closing).toHaveLength(2);
    }
    const closings = feelings.map((feeling) => buildOfflineReading(reading(), { ...options, feelings: [feeling] }).closing[1]);
    expect(new Set(closings).size).toBe(6);
    closings.forEach((text) => expect(text.endsWith('?')).toBe(true));
    expect(closings[1]).toContain('giữ lại hay buông');
    expect(buildOfflineReading(reading(), { ...options, context: 'Bối cảnh riêng' }).closing[0]).toContain('bối cảnh');
    expect(buildOfflineReading(reading(), { ...options, question: 'Câu hỏi riêng' }).closing[0]).toContain('câu hỏi');
  });
  test('thiếu từ khóa không bịa từ khóa và giới hạn 3 cảm xúc hợp lệ', () => {
    const drawn = reading().map((item) => ({ ...item, card: { ...item.card, keywords: [] } }));
    const result = buildOfflineReading(drawn, { ...options, feelings: ['khác', ...feelings] });
    expect(result.connections).toEqual([]);
    expect(result.reflections[0].text).not.toContain('từ khóa');
    expect(result.closing[1]).not.toContain('Mệt mỏi');
    expect(result.closing[1]).toContain('Lo lắng, Phân vân, Hy vọng');
  });
});

test('context includes arcana, suit/element and at most six short symbol names', () => {
  const drawn = reading();
  drawn[0].card = {...drawn[0].card, arcana: 'minor', suit: 'cups', element: 'Nước', symbols:
    ['tên, có phẩy', 'x'.repeat(29), ...Array.from({length: 9}, (_, i) => `Tên ${i}`)].map((name) => ({name, meaning: 'PRIVATE_SYMBOL_MEANING', source_refs: [], line_start: 1, line_end: 1}))};
  const ctx = buildReadingContext(drawn, fixtures.spreads[0]);
  expect(ctx.positions[0]).toMatchObject({arcana: 'minor', suit_element: 'Cốc · Nước', symbols: ['Tên 0', 'Tên 1', 'Tên 2', 'Tên 3', 'Tên 4', 'Tên 5']});
  expect(JSON.stringify(ctx)).not.toContain('PRIVATE_SYMBOL_MEANING');
  expect(JSON.stringify(ctx)).not.toContain('Không đưa trích dẫn');
});
