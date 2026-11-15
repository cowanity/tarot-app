import { spreads } from '../data';
import type { Card, DrawnCard } from '../types';
import type { DrawOptions } from './drawSpread';
import { cryptoUint32, randomChance } from './rng';

/** positionOffset supports picking progressively without rerolling earlier cards. */
export function dealFromDeck(
  spreadId: string,
  shuffledDeck: readonly Card[],
  pickedIndices: readonly number[],
  options: DrawOptions & { positionOffset?: number } = {},
): DrawnCard[] {
  const spread = spreads.find((item) => item.id === spreadId);
  if (!spread) throw new Error('Không tìm thấy thế bài');
  const { allowReversed = false, reversedProbability = 0.35, rng = cryptoUint32, positionOffset = 0 } = options;
  if (!Number.isFinite(reversedProbability) || reversedProbability < 0 || reversedProbability > 1) {
    throw new RangeError('Xác suất không hợp lệ');
  }
  if (spread.card_count !== spread.positions.length || !Number.isInteger(positionOffset)
    || positionOffset < 0 || positionOffset + pickedIndices.length > spread.card_count) {
    throw new RangeError('Số vị trí không hợp lệ');
  }
  if (new Set(shuffledDeck.map((card) => card.id)).size !== shuffledDeck.length
    || new Set(pickedIndices).size !== pickedIndices.length
    || pickedIndices.some((index) => !Number.isInteger(index) || index < 0 || index >= shuffledDeck.length)) {
    throw new RangeError('Bộ bài hoặc chỉ số chọn không hợp lệ');
  }
  return pickedIndices.map((index, order) => {
    const position = spread.positions[positionOffset + order];
    return {
      position, card: shuffledDeck[index],
      reversed: allowReversed && !position.force_upright && randomChance(reversedProbability, rng),
    };
  });
}
