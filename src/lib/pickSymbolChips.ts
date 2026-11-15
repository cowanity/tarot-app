import type { CardSymbol } from '../types';

export function pickSymbolChips(symbols: readonly CardSymbol[]): CardSymbol[] {
  return symbols.filter(({ name }) => name.trim().length > 0 && name.length <= 28 && !name.includes(',')).slice(0, 6);
}
