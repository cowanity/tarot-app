import { expect, it } from 'vitest';
import { pickSymbolChips } from './pickSymbolChips';
import type { CardSymbol } from '../types';

it('lọc tên dài, có dấu phẩy hoặc rỗng; giữ thứ tự và tối đa 6 biểu tượng', () => {
  const symbol = (name: string): CardSymbol => ({ name, meaning: '', source_refs: [], line_start: 1, line_end: 1 });
  const symbols = [
    symbol('Mặt trời'), symbol('Núi, sông'), symbol('Một con vật đang chạy dọc con đường'), symbol(''),
    symbol('A'.repeat(28)), symbol('B'.repeat(29)), symbol('Hoa hồng'), symbol('Gậy'), symbol('Cốc'), symbol('Kiếm'), symbol('Tiền'),
  ];
  const original = [...symbols];
  expect(pickSymbolChips(symbols).map(({ name }) => name)).toEqual(['Mặt trời', 'A'.repeat(28), 'Hoa hồng', 'Gậy', 'Cốc', 'Kiếm']);
  expect(symbols).toEqual(original);
  expect(pickSymbolChips([])).toEqual([]);
});
