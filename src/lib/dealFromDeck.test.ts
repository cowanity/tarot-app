import { expect, it } from 'vitest';
import { cards, spreads } from '../data';
import { dealFromDeck } from './dealFromDeck';
import { shuffle } from './shuffle';

it('chia đủ số lá đã chọn, không trùng và giữ thứ tự chọn trong bộ đã xào', () => {
  const deck = shuffle(cards, () => 0);
  for (const spread of spreads) {
    const indices = Array.from({ length: spread.card_count }, (_, index) => 21 - index);
    const result = dealFromDeck(spread.id, deck, indices);
    expect(result).toHaveLength(spread.card_count);
    expect(new Set(result.map((item) => item.card.id)).size).toBe(spread.card_count);
    expect(result.map((item) => item.card.id)).toEqual(indices.map((index) => deck[index].id));
  }
  expect(() => dealFromDeck('past-present-future', deck, [0, 0])).toThrow();
});

it('force_upright luôn xuôi kể cả khi chọn từng lá và xác suất ngược là 100%', () => {
  const deck = shuffle(cards, () => 0);
  const spread = spreads.find((item) => item.id === 'celtic-cross')!;
  let calls = 0;
  const rng = () => { calls++; return 0; };
  const result = spread.positions.flatMap((_, index) => dealFromDeck(spread.id, deck, [index], {
    allowReversed: true, reversedProbability: 0.5, rng, positionOffset: index,
  }));
  expect(result.map((item) => item.reversed)).toEqual(spread.positions.map((p) => !p.force_upright));
  expect(calls).toBe(spread.positions.filter((p) => !p.force_upright).length);
  expect(dealFromDeck(spread.id, deck, [0], { allowReversed: false, rng })[0].reversed).toBe(false);
});
