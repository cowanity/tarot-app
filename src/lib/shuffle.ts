import { cryptoUint32, randomInt, type Uint32Rng } from './rng';

/** Fisher–Yates on a copy: the static deck is never changed. */
export function shuffle<T>(items: readonly T[], rng: Uint32Rng = cryptoUint32): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1, rng);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
