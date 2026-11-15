import { expect, test } from 'vitest';
import { badTokens } from './vnSpacing';
test.each(['giá trị củachính bạn', 'tiếp tụcchấp nhận', 'từngười khác', 'tiêuhao', 'bạnlựa', 'liêntục'])('flags glued Vietnamese: %s', (text) => {
  expect(badTokens(text).length).toBeGreaterThan(0);
});
test('normal Vietnamese, ASCII and English are accepted', () => {
  expect(badTokens('nghiêng, khuyến khích, thuyết phục, nguyệt, quyền, chuyện, người, ngưỡng, nghỉ ngơi, thuở, khuya, yêu, giường, trường, tuyệt, hoàn toàn')).toEqual([]);
  expect(badTokens('Hello world Tarot understanding ABC123')).toEqual([]);
});
test('lowercase allowlist exempts accented tokens, including normalized input', () => {
  expect(badTokens('TIÊUHAO tiêuhao'.normalize('NFD'), new Set(['tiêuhao']))).toEqual([]);
});
