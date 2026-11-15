import { describe, expect, it } from 'vitest';
import { cards, spreads } from '../data';
import { drawSpread } from './drawSpread';
import { getCardText, MISSING_REVERSED } from './getCardText';
import { randomInt, type Uint32Rng } from './rng';
import { shuffle } from './shuffle';

const seeded = (seed: number): Uint32Rng => () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed;
};

describe('Logic Tarot', () => {
  it('rút đúng card_count của mọi thế bài', () => {
    for (const spread of spreads) {
      const result = drawSpread(spread.id, { rng: seeded(123) });
      expect(result).toHaveLength(spread.card_count);
      expect(result.map((item) => item.position)).toEqual(spread.positions);
    }
  });

  it('không trùng lá qua nhiều lần rút và không sửa bộ bài gốc', () => {
    const originalIds = cards.map((card) => card.id);
    for (let seed = 1; seed <= 50; seed++) {
      const result = drawSpread('celtic-cross', { allowReversed: true, rng: seeded(seed) });
      expect(new Set(result.map((item) => item.card.id)).size).toBe(10);
    }
    expect(cards.map((card) => card.id)).toEqual(originalIds);
  });

  it('mặc định và allowReversed=false luôn trả bài xuôi', () => {
    for (const spread of spreads) {
      expect(drawSpread(spread.id, { rng: seeded(7) }).every((item) => !item.reversed)).toBe(true);
      expect(drawSpread(spread.id, {
        allowReversed: false, reversedProbability: 1, rng: seeded(7),
      }).every((item) => !item.reversed)).toBe(true);
    }
  });

  it('RNG giả cho kết quả xác định, loại phần dư và giữ lá chéo luôn xuôi', () => {
    const values = [0xffffffff, 8];
    expect(randomInt(3, () => values.shift()!)).toBe(2);
    expect(values).toHaveLength(0);
    expect(shuffle(['a', 'b', 'c', 'd'], () => 0)).toEqual(['b', 'c', 'd', 'a']);
    const options = { allowReversed: true, reversedProbability: 1 };
    const first = drawSpread('celtic-cross', { ...options, rng: seeded(42) });
    expect(first).toEqual(drawSpread('celtic-cross', { ...options, rng: seeded(42) }));
    expect(first.map((item) => item.reversed)).toEqual([
      true, false, true, true, true, true, true, true, true, true,
    ]);
    expect(drawSpread('one-card', {
      allowReversed: true, reversedProbability: 0, rng: seeded(42),
    })[0].reversed).toBe(false);
  });

  it('chọn đúng chiều, độ sâu, nguồn và xử lý rev_missing bằng nghĩa xuôi', () => {
    const card = cards[0];
    expect(getCardText(card, false).text).toBe(card.summary_up);
    expect(getCardText(card, true, 'depth')).toMatchObject({
      text: card.depth_rev, quote: card.quote_rev, quote_ref: card.quote_rev_ref, refs: card.refs.rev,
    });
    const missing = { ...card, rev_missing: true, summary_rev: null, depth_rev: null, quote_rev: null };
    for (const depth of ['summary', 'depth'] as const) {
      expect(getCardText(missing, true, depth)).toEqual({
        text: `${MISSING_REVERSED}. ${card.summary_up}`,
        quote: card.quote_up, quote_ref: card.quote_up_ref, refs: card.refs.up, rev_missing: true,
      });
    }
  });
});
