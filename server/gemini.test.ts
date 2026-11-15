import { afterEach, describe, expect, test, vi } from 'vitest';
import { AnthropicProvider, GeminiProvider, createProvider, type CompletionInput, geminiSchemaFor } from './provider';
import responseSchema from './geminiResponseSchema.json';
import { outputSchema } from './schema';
import { config } from './config';

const key = 'PRIVATE_TEST_KEY';
const question = 'PRIVATE_USER_QUESTION';
const secretBody = 'PRIVATE_RESPONSE_CONTENT';
const input = (signal = new AbortController().signal): CompletionInput => ({ system: 'system', user: question, maxTokens: 1400, signal });
const provider = () => new GeminiProvider(key, 'gemini-2.5-flash');
const response = (extra = {}) => ({ candidates: [{finishReason: 'STOP', content: {parts: [{text: '{"ok":'}, {text: 'true}'}, {}]}}], ...extra });
function stub(data: unknown, status = 200) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(data), { status, headers: {'Content-Type': 'application/json'} })));
}
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

async function rejectsPrivately(action: Promise<unknown>, expected: string) {
  const error = await action.catch((error: unknown) => error);
  expect(error).toBeInstanceOf(Error);
  expect((error as Error).message).toBe(expected);
  expect(String(error)).not.toContain(key);
  expect(String(error)).not.toContain(question);
  expect(String(error)).not.toContain(secretBody);
}

describe('Gemini fetch provider', () => {
  test('key only in header, encoded model, complete request body, text and thought usage', async () => {
    stub(response({usageMetadata: {promptTokenCount: 12, candidatesTokenCount: 30, thoughtsTokenCount: 17}}));
    const request = input();
    const result = await new GeminiProvider(key, 'gemini/model ?&test').complete(request);
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe('https://generativelanguage.googleapis.com/v1beta/models/gemini%2Fmodel%20%3F%26test:generateContent');
    expect(String(url)).not.toContain(key); expect(new URL(String(url)).search).toBe('');
    expect(init?.headers).toEqual({'Content-Type': 'application/json', 'x-goog-api-key': key});
    expect(init?.signal).toBeInstanceOf(AbortSignal); expect(init?.signal?.aborted).toBe(false); expect(init?.method).toBe('POST'); expect(init?.redirect).toBe('error');
    expect(JSON.parse(String(init?.body))).toEqual({systemInstruction: {parts: [{text: 'system'}]},
      contents: [{role: 'user', parts: [{text: question}]}],
      generationConfig: {temperature: 0.7, maxOutputTokens: 6000, responseMimeType: 'application/json', responseSchema: geminiSchemaFor(request)}});
    expect(result).toMatchObject({text: '{"ok":true}', usage: {input: 12, output: 47}});
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  test('zero usage when missing, preserve caller token budget above 6000', async () => {
    stub(response());
    expect((await provider().complete({...input(), maxTokens: 7500})).usage).toEqual({input: 0, output: 0});
    expect(JSON.parse(String(vi.mocked(fetch).mock.calls[0][1]?.body)).generationConfig.maxOutputTokens).toBe(7500);
  });
  test('uses only first candidate and sums optional thought-only usage', async () => {
    stub({candidates: [{content: {parts: [{text: 'first'}]}}, {content: {parts: [{text: secretBody}]}}], usageMetadata: {thoughtsTokenCount: 9}});
    expect(await provider().complete(input())).toMatchObject({text: 'first', usage: {input: 0, output: 9}});
  });
  test.each(['SAFETY', 'PROHIBITED_CONTENT', 'MAX_TOKENS', 'RECITATION'])('rejects finishReason %s even if text exists', async (finishReason) => {
    stub({candidates: [{finishReason, content: {parts: [{text: secretBody + question + key}]}}]});
    await rejectsPrivately(provider().complete(input()), finishReason === 'MAX_TOKENS' ? 'GEMINI_MAX_TOKENS' : 'GEMINI_BLOCKED');
  });
  test('promptFeedback blockReason rejects even with otherwise usable candidate', async () => {
    stub(response({promptFeedback: {blockReason: 'SAFETY', blockReasonMessage: secretBody + question + key}}));
    await rejectsPrivately(provider().complete(input()), 'GEMINI_BLOCKED');
  });
  test.each([{}, {candidates: []}, {candidates: [{}]}, {candidates: [{content: {parts: [{}]}}]}, {candidates: [{content: {parts: [{text: '  '}]}}]}])('rejects no text %j', async (data) => {
    stub(data); await rejectsPrivately(provider().complete(input()), 'GEMINI_NO_TEXT');
  });
  test.each([400])('HTTP %i never echoes or reads error body and never retries', async (status) => {
    const res = new Response(secretBody + question + key, {status});
    const json = vi.spyOn(res, 'json'); const text = vi.spyOn(res, 'text');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(res));
    await rejectsPrivately(provider().complete(input()), `GEMINI_HTTP_${status}`);
    expect(json).not.toHaveBeenCalled(); expect(text).not.toHaveBeenCalled(); expect(fetch).toHaveBeenCalledTimes(1);
  });
  test('invalid JSON, malformed response and fetch errors have only short codes', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(secretBody + question + key)));
    await rejectsPrivately(provider().complete(input()), 'GEMINI_INVALID_RESPONSE');
    stub({candidates: secretBody + question + key});
    await rejectsPrivately(provider().complete(input()), 'GEMINI_INVALID_RESPONSE');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error(secretBody + question + key)));
    vi.useFakeTimers(); const pending = rejectsPrivately(provider().complete(input()), 'AI_BUSY');
    await vi.advanceTimersByTimeAsync(6000); await pending;
  });
  test('pre-aborted signal never starts fetch; cancellation stops an in-flight request', async () => {
    const controller = new AbortController(); controller.abort(); vi.stubGlobal('fetch', vi.fn());
    await rejectsPrivately(provider().complete(input(controller.signal)), 'GEMINI_ABORTED'); expect(fetch).not.toHaveBeenCalled();
    const active = new AbortController(); let aborted = false;
    vi.stubGlobal('fetch', vi.fn((_url: unknown, init?: RequestInit) => new Promise((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => { aborted = true; reject(new Error(secretBody + question + key)); }, {once: true});
    })));
    const pending = provider().complete(input(active.signal)); active.abort();
    await rejectsPrivately(pending, 'GEMINI_ABORTED'); expect(aborted).toBe(true); expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe('configuration and factory', () => {
  test('default Anthropic, selected Gemini and provider-specific defaults/keys', () => {
    const anthropic = config({ANTHROPIC_API_KEY: key});
    expect(anthropic).toMatchObject({provider: 'anthropic', model: 'claude-sonnet-5-5', cap: 150, apiKey: key});
    expect(createProvider(anthropic)).toBeInstanceOf(AnthropicProvider);
    const gemini = config({AI_PROVIDER: 'gemini', GEMINI_API_KEY: key, ANTHROPIC_API_KEY: 'unused'});
    expect(gemini).toMatchObject({provider: 'gemini', model: 'gemini-3.5-flash-lite', apiKey: key});
    expect(createProvider(gemini)).toBeInstanceOf(GeminiProvider);
    expect(config({AI_PROVIDER: 'gemini', GEMINI_API_KEY: key, AI_MODEL: 'custom', AI_DAILY_CAP: '100'})).toMatchObject({model: 'custom', cap: 100});
  });
  test.each([
    [{}, 'MISSING_ANTHROPIC_API_KEY'],
    [{AI_PROVIDER: 'gemini', ANTHROPIC_API_KEY: key}, 'MISSING_GEMINI_API_KEY'],
    [{AI_PROVIDER: 'anthropic', GEMINI_API_KEY: key}, 'MISSING_ANTHROPIC_API_KEY'],
    [{AI_PROVIDER: 'gemini', GEMINI_API_KEY: '   '}, 'MISSING_GEMINI_API_KEY'],
    [{AI_PROVIDER: 'other'}, 'INVALID_AI_PROVIDER'],
    [{AI_DAILY_CAP: '0'}, 'INVALID_DAILY_CAP'],
    [{AI_DAILY_CAP: '1.5'}, 'INVALID_DAILY_CAP'],
    [{ALLOWED_ORIGIN: 'invalid'}, 'INVALID_ALLOWED_ORIGIN'],
    [{ALLOWED_ORIGIN: 'https://example.com/path'}, 'INVALID_ALLOWED_ORIGIN'],
  ])('rejects invalid configuration with a safe code', (env, code) => expect(() => config(env)).toThrow(code));
  test('factory refuses empty keys for both providers', () => {
    expect(() => createProvider({provider: 'gemini', apiKey: '', model: 'test'})).toThrow('MISSING_GEMINI_API_KEY');
    expect(() => createProvider({provider: 'anthropic', apiKey: '', model: 'test'})).toThrow('MISSING_ANTHROPIC_API_KEY');
  });
});

describe('verified Gemini 3.5 generation settings', () => {
  test('uses low thinking and exactly the probed V2 schema, preserving token budget', async () => {
    stub(response());
    await new GeminiProvider(key, 'gemini-3.5-flash').complete({...input(), maxTokens: 6500});
    const config = JSON.parse(String(vi.mocked(fetch).mock.calls[0][1]?.body)).generationConfig;
    expect(config).toEqual({temperature: 0.7, maxOutputTokens: 6500, responseMimeType: 'application/json',
      thinkingConfig: {thinkingLevel: 'low'}, responseSchema: geminiSchemaFor(input())});
    expect(responseSchema.required).toEqual(Object.keys(outputSchema.shape).filter((key) => key !== 'personal'));
    expect(responseSchema.properties.paths).toMatchObject({type: 'array', minItems: 2, maxItems: 2});
    expect(responseSchema.properties.per_card.items.required).toEqual(['position', 'title', 'notice']);
  });
  test('fallback gets structural schema but no model-specific thinking configuration', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response('', {status: 404}))
      .mockResolvedValueOnce(new Response(JSON.stringify(response())));
    vi.stubGlobal('fetch', fetchMock);
    await new GeminiProvider(key, 'gemini-3.5-flash', 'gemini-2.5-flash').complete(input());
    const configs = fetchMock.mock.calls.map(([, init]) => JSON.parse(String(init?.body)).generationConfig);
    expect(configs[0].thinkingConfig).toEqual({thinkingLevel: 'low'});
    expect(configs[1]).not.toHaveProperty('thinkingConfig'); expect(configs[1]).toHaveProperty('responseSchema');
  });
});

 test('429 immediately switches models without waiting for Retry-After', async () => {
   vi.useFakeTimers();
   const fetchMock = vi.fn().mockResolvedValueOnce(new Response('', {status:429, headers:{'Retry-After':'10'}}))
     .mockResolvedValueOnce(new Response(JSON.stringify(response())));
   vi.stubGlobal('fetch', fetchMock);
   const result = await new GeminiProvider(key,'primary','backup').complete(input());
   expect(result.usedFallback).toBe(true); expect(fetchMock).toHaveBeenCalledTimes(2);
   expect(vi.getTimerCount()).toBe(0);
 });

 test('reflective Gemini structural schema excludes outlook while full keeps it', async () => {
   for (const mode of ['full', 'reflective_only'] as const) {
     const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(response())));
     vi.stubGlobal('fetch', fetchMock);
     await new GeminiProvider(key, 'gemini-3.5-flash').complete({...input(), mode});
     const schema = JSON.parse(fetchMock.mock.calls[0][1].body).generationConfig.responseSchema;
     expect('outlook' in schema.properties).toBe(mode === 'full');
     expect(schema.required.includes('outlook')).toBe(mode === 'full');
     expect('paths' in schema.properties).toBe(mode === 'full'); expect(schema.required.includes('paths')).toBe(mode === 'full');
   }
 });

 test.each([
   {mode: 'full' as const, hasProfile: false, omitExperiment: false},
   {mode: 'full' as const, hasProfile: true, omitExperiment: true},
   {mode: 'reflective_only' as const, hasProfile: false, omitExperiment: false},
 ])('request schema removes forbidden properties: %j', (request) => {
   const schema = geminiSchemaFor(request);
   expect('personal' in schema.properties).toBe(request.hasProfile);
   expect('experiment' in schema.properties).toBe(request.mode === 'full' && !request.omitExperiment);
   expect('paths' in schema.properties).toBe(request.mode === 'full');
   expect(schema.required.every(k => k in schema.properties)).toBe(true);
   expect(geminiSchemaFor({mode:'full',hasProfile:true}).required).toContain('personal');
 });
