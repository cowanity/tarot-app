/** A source of unsigned 32-bit integers; injectable for reproducible tests. */
export type Uint32Rng = () => number;
const UINT32_RANGE = 2 ** 32;

export const cryptoUint32: Uint32Rng = () => {
  const bytes = new Uint32Array(1);
  globalThis.crypto.getRandomValues(bytes);
  return bytes[0];
};

/** Uniform integer in [0, exclusiveMax), rejecting the incomplete remainder. */
export function randomInt(exclusiveMax: number, rng: Uint32Rng = cryptoUint32): number {
  if (!Number.isInteger(exclusiveMax) || exclusiveMax < 1 || exclusiveMax > UINT32_RANGE) {
    throw new RangeError('Giới hạn RNG không hợp lệ');
  }
  const limit = UINT32_RANGE - (UINT32_RANGE % exclusiveMax);
  while (true) {
    const value = rng();
    if (!Number.isInteger(value) || value < 0 || value >= UINT32_RANGE) {
      throw new RangeError('RNG phải trả về số nguyên uint32');
    }
    if (value < limit) return value % exclusiveMax;
  }
}

export function randomChance(probability: number, rng: Uint32Rng = cryptoUint32): boolean {
  if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
    throw new RangeError('Xác suất phải nằm trong khoảng 0 đến 1');
  }
  if (probability === 0) return false;
  if (probability === 1) return true;
  return randomInt(UINT32_RANGE, rng) / UINT32_RANGE < probability;
}
