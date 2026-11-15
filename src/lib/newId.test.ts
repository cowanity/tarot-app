import {afterEach, expect, test, vi} from 'vitest';
import {newId} from './newId';
afterEach(() => vi.unstubAllGlobals());
test('uses native UUID when available with the crypto receiver', () => {
  const crypto = {randomUUID: vi.fn(function(this: unknown) {
    expect(this).toBe(crypto);
    return '00112233-4455-4677-8899-aabbccddeeff';
  })};
  vi.stubGlobal('crypto', crypto);
  expect(newId()).toBe('00112233-4455-4677-8899-aabbccddeeff');
});
test('HTTP fallback uses random bytes and sets UUID v4 version and variant', () => {
  const getRandomValues = vi.fn((bytes: Uint8Array) => {bytes.fill(255); return bytes;});
  vi.stubGlobal('crypto', {getRandomValues});
  expect(newId()).toBe('ffffffff-ffff-4fff-bfff-ffffffffffff');
  expect(getRandomValues).toHaveBeenCalledOnce();
});
test('fallback preserves leading zeroes and the complete 128-bit layout', () => {
  vi.stubGlobal('crypto', {getRandomValues: (bytes: Uint8Array) => bytes});
  expect(newId()).toBe('00000000-0000-4000-8000-000000000000');
});
