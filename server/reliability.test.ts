import { afterEach, expect, test, vi } from 'vitest';
import { GeminiProvider, providerErrorCode } from './provider';
import { config } from './config';
const input = (signal = new AbortController().signal) => ({system: 'system', user: 'PRIVATE_QUESTION', maxTokens: 1400, signal});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

test('cancel during retry wait never sends the second request', async () => {
  vi.useFakeTimers();
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('PRIVATE_CONTENT', {status: 503})));
  const controller = new AbortController();
  const pending = new GeminiProvider('SECRET_KEY', 'primary').complete(input(controller.signal));
  const check = expect(pending).rejects.toThrow('GEMINI_ABORTED');
  await vi.advanceTimersByTimeAsync(0); controller.abort(); await check;
  await vi.advanceTimersByTimeAsync(2000); expect(fetch).toHaveBeenCalledTimes(1);
});
test('network errors switch to fallback once and never expose raw messages', async () => {
  vi.useFakeTimers();
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('SECRET_KEY PRIVATE_QUESTION PRIVATE_CONTENT')));
  const pending = new GeminiProvider('SECRET_KEY', 'primary', 'backup').complete(input());
  const check = expect(pending).rejects.toThrow(/^AI_BUSY$/);
  await vi.advanceTimersByTimeAsync(6000); await check; expect(fetch).toHaveBeenCalledTimes(3);
});
test.each([500, 504])('HTTP %i switches immediately then retries only the final model', async (status) => {
  vi.useFakeTimers();
  vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => new Response('SECRET_KEY PRIVATE_QUESTION', {status})));
  const pending = new GeminiProvider('SECRET_KEY', 'primary', 'backup').complete(input());
  const check = expect(pending).rejects.toThrow(/^AI_BUSY$/);
  await vi.advanceTimersByTimeAsync(6000); await check; expect(fetch).toHaveBeenCalledTimes(3);
});
test('same fallback model is skipped; final retry waits one second', async () => {
  vi.useFakeTimers(); vi.spyOn(Math, 'random').mockReturnValue(0.99999);
  vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => new Response('', {status: 503})));
  const pending = new GeminiProvider('key', 'same', 'same').complete(input());
  const check = expect(pending).rejects.toThrow('AI_BUSY');
  await vi.advanceTimersByTimeAsync(999); expect(fetch).toHaveBeenCalledTimes(1);
  await vi.advanceTimersByTimeAsync(1); await check; expect(fetch).toHaveBeenCalledTimes(2);
});
test('both model names share validation and empty fallback disables it', () => {
  const env = {AI_PROVIDER: 'gemini', GEMINI_API_KEY: 'key'};
  expect(config(env).fallbackModel).toBe('');
  expect(config({...env, AI_FALLBACK_MODEL: 'gemini-2.5-flash'}).fallbackModel).toBe('gemini-2.5-flash');
  for (const model of ['bad model', '../model', '<tag>', 'x'.repeat(129)]) {
    expect(() => config({...env, AI_MODEL: model})).toThrow('INVALID_AI_MODEL');
    expect(() => config({...env, AI_FALLBACK_MODEL: model})).toThrow('INVALID_AI_FALLBACK_MODEL');
  }
  expect(providerErrorCode(new Error('PRIVATE'))).toBe('PROVIDER_ERROR');
});

test.each([500, 502, 503, 504, 'network'] as const)('first %s switches immediately to fallback', async (failure) => {
  vi.useFakeTimers(); const beforeCall = vi.fn();
  const fetchMock = vi.fn<typeof fetch>();
  if (failure === 'network') fetchMock.mockRejectedValueOnce(new Error('PRIVATE'));
  else fetchMock.mockResolvedValueOnce(new Response('PRIVATE', {status: failure}));
  fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({candidates: [{content: {parts: [{text: '{}'}]}}]})));
  vi.stubGlobal('fetch', fetchMock);
  const pending = new GeminiProvider('key', 'primary', 'backup').complete({...input(), beforeCall});
  await vi.advanceTimersByTimeAsync(2100); const result = await pending;
  expect(result.usedFallback).toBe(true); expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock.mock.calls[1][0]).toContain('/models/backup:generateContent');
  expect(beforeCall.mock.calls.map(([attempt]) => attempt.kind)).toEqual(['primary', 'fallback']);
  expect(vi.getTimerCount()).toBe(0);
});
