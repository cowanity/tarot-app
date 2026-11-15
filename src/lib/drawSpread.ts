import { cards, spreads } from '../data';
import type { DrawnCard } from '../types';
import { cryptoUint32, randomChance, type Uint32Rng } from './rng';
import { shuffle } from './shuffle';

export interface DrawOptions {
  allowReversed?: boolean;
  reversedProbability?: number;
  rng?: Uint32Rng;
}

export function drawSpread(spreadId: string, options: DrawOptions = {}): DrawnCard[] {
  const spread = spreads.find((item) => item.id === spreadId);
  if (!spread) throw new Error('Không tìm thấy thế bài');
  const { allowReversed = false, reversedProbability = 0.35, rng = cryptoUint32 } = options;
  if (!Number.isFinite(reversedProbability) || reversedProbability < 0 || reversedProbability > 1) {
    throw new RangeError('Xác suất bài ngược phải nằm trong khoảng 0 đến 1');
  }
  if (spread.card_count !== spread.positions.length || spread.card_count > cards.length) {
    throw new Error('Cấu hình thế bài không hợp lệ');
  }
  const deck = shuffle(cards, rng);
  return spread.positions.map((position, index) => ({
    position,
    card: deck[index],
    reversed: allowReversed && !position.force_upright && randomChance(reversedProbability, rng),
  }));
}
