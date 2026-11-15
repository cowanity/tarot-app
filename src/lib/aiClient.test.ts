import {CARE_ANSWER} from './safetyText';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { buildAiPayload, getAiInfo, interpret, isAiReading, type AiPayload, type AiReading } from './aiClient';
import { parseSettings } from './settings';
import { aiReadingText, splitThirdPartyLimit } from './aiPresentation';
import { THIRD_PARTY_LIMIT_SENTENCE } from './safetyText';
import { aiReducer, initialAiState } from './aiState';
import type { DrawnCard } from '../types';
const payload: AiPayload = {question: 'Câu hỏi', context: '', feelings: {ids: []}, topic: 'Tổng quan', spreadId: 'one-card', picks: [{position: 1, cardId: 'major-00-fool', reversed: false}]};
const reading: AiReading = {answer: 'Chưa rõ, và điều đáng nhìn lại là lựa chọn của bạn.', headline: 'Một góc nhìn', opening: 'Bạn có thể nhìn lại.', tension: 'Hai điều cần cân nhắc.', weave: 'Các ý kết nối.', unsaid: 'Có thể còn điều chưa kể.', outlook: 'Một khả năng để cân nhắc.',
  per_card: [{position: 1, title: 'Nhìn lại', scene: 'Bạn có thể tự hỏi.', notice: 'Điều này đáng để ý.'}],
  paths: [{label: 'Một phía', body: 'Một góc nhìn.'}, {label: 'Phía còn lại', body: 'Một góc nhìn khác.'}], closing: 'Câu hỏi còn mở.', question: 'Bạn cần gì?', experiment: 'Có thể thử ghi lại.'};
const response = (body: unknown, status = 200, headers: Record<string, string> = {}) => vi.fn<typeof fetch>().mockImplementation(async () => new Response(JSON.stringify(body), {status, headers}));
afterEach(() => vi.useRealTimers());

describe('AI client, no live network', () => {
  test.each(['full', 'reflective_only'] as const)('accepts %s and only returns documented properties', async (mode) => {
    const fetchImpl = response({mode, reading: mode === 'reflective_only' ? {...reading, paths: []} : reading, model: 'ignored', question: 'NEVER_RETAIN'});
    expect(await interpret(payload, {fetchImpl})).toEqual({kind: 'ok', mode, reading: mode === 'reflective_only' ? {...reading, paths: []} : reading, notes: []});
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0]; expect(url).toBe('/api/interpret');
    expect(JSON.parse(String(init?.body))).toEqual(payload); expect(init?.signal).toBeInstanceOf(AbortSignal);
  });
  test('care contains no reading', async () => expect(await interpret(payload, {fetchImpl: response({mode: 'care'})})).toEqual({kind: 'care', answer: CARE_ANSWER}));
  test.each([[undefined, 60], ['120', 120], ['99999', 86400], ['invalid', 60]] as const)('429 Retry-After %s', async (header, seconds) => {
    expect(await interpret(payload, {fetchImpl: response({}, 429, header ? {'Retry-After': header} : {})})).toEqual({kind: 'rate_limit', retryAfter: seconds});
  });
  test('502 and network failure are distinct', async () => {
    expect(await interpret(payload, {fetchImpl: response({}, 502)})).toEqual({kind: 'unavailable'});
    expect(await interpret(payload, {fetchImpl: vi.fn().mockRejectedValue(new Error('PRIVATE'))})).toEqual({kind: 'network'});
  });
  test.each([
    null, {}, {mode: 'bad', reading}, {mode: 'full', reading: {...reading, opening: null}},
    {mode: 'full', reading: {...reading, per_card: [{position: '1', scene: 'x', title: 'x'}]}},
    {mode: 'full', reading: {...reading, per_card: [{position: 2, scene: 'x', title: 'x'}]}},
    {mode: 'full', reading, notes: 'third_party_limit'}, {mode: 'full', reading, notes: [123]},
    {mode: 'full', reading: {...reading, paths: 'not-array'}},
  ])('rejects invalid shape without throwing', async (body) => expect(await interpret(payload, {fetchImpl: response(body)})).toEqual({kind: 'unavailable'}));
  test('invalid JSON is unavailable', async () => expect(await interpret(payload, {fetchImpl: vi.fn().mockResolvedValue(new Response('{'))})).toEqual({kind: 'unavailable'}));
  test('pre-abort and in-flight abort never escape as thrown errors', async () => {
    const controller = new AbortController(); controller.abort(); const fetchImpl = vi.fn<typeof fetch>();
    expect(await interpret(payload, {signal: controller.signal, fetchImpl})).toEqual({kind: 'aborted'}); expect(fetchImpl).not.toHaveBeenCalled();
    const active = new AbortController(); const waiting = interpret(payload, {signal: active.signal, fetchImpl: vi.fn<typeof fetch>(() => new Promise<Response>(() => {}))});
    active.abort(); expect(await waiting).toEqual({kind: 'aborted'});
  });
  test('client allows a retry but stops at 90 seconds including body reading', async () => {
    vi.useFakeTimers(); let signal: AbortSignal | null | undefined;
    const fetchImpl = vi.fn<typeof fetch>().mockImplementation(async (_url, init) => {
      signal = init?.signal; return {ok: true, status: 200, json: () => new Promise(() => {})} as Response;
    });
    const done = vi.fn(); const pending = interpret(payload, {fetchImpl}).then((result) => { done(); return result; });
    await vi.advanceTimersByTimeAsync(40_000); expect(done).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(50_000); expect(await pending).toEqual({kind: 'unavailable'}); expect(signal?.aborted).toBe(true);
  });
  test('payload whitelist strips history, book text, and extra state', () => {
    const state = {question: 'x'.repeat(600), context: 'y'.repeat(400), feelings: ['Lo lắng'], topic: 'Bản thân', spreadId: 'one-card',
      reading: [{position: {number: 1}, card: {id: 'a', summary_up: 'PRIVATE_BOOK'}, reversed: true}] as DrawnCard[],
      history: ['PRIVATE_HISTORY'], aiReading: reading};
    const result = buildAiPayload(state);
    expect(Object.keys(result).sort()).toEqual(['question', 'context', 'feelings', 'topic', 'spreadId', 'picks'].sort());
    expect(result.question).toHaveLength(500); expect(result.context).toHaveLength(300);
    expect(result.picks).toEqual([{position: 1, cardId: 'a', reversed: true}]); expect(JSON.stringify(result)).not.toContain('PRIVATE');
  });
  test('info validates provider/freeTier and fails closed', async () => {
    expect(await getAiInfo({fetchImpl: response({provider: 'gemini', freeTier: true, key: 'NEVER_RETAIN'})})).toEqual({provider: 'gemini', freeTier: true});
    expect(await getAiInfo({fetchImpl: response({provider: 'other', freeTier: true})})).toBeNull();
    expect(await getAiInfo({fetchImpl: response({}, 503)})).toBeNull();
    expect(await getAiInfo({fetchImpl: vi.fn().mockRejectedValue(new Error('PRIVATE'))})).toBeNull();
  });
});

describe('consent, presentation and state', () => {
  test('consent defaults and old settings remain compatible', () => {
    expect(parseSettings('{"motion":"reduced","autoSave":true}')).toMatchObject({motion: 'reduced', autoSave: true});
    for (const consent of [true, {}, [], {provider: '', at: 'bad'}, {provider: 'gemini', at: 'bad'}, {provider: 1, at: '2026-10-08T00:00:00.000Z'}])
      expect(parseSettings(JSON.stringify({aiConsent: consent}))).not.toHaveProperty('aiConsent');
    const consent = {provider: 'gemini', at: '2026-10-08T00:00:00.000Z'};
    expect(parseSettings(JSON.stringify({aiConsent: consent}))).not.toHaveProperty('aiConsent');
  });
  test('third-party limit splits only at start with matching note, never duplicates', () => {
    const opening = THIRD_PARTY_LIMIT_SENTENCE + ' Nội dung còn lại.';
    const split = splitThirdPartyLimit(opening, ['third_party_limit']);
    expect(split).toEqual({limit: THIRD_PARTY_LIMIT_SENTENCE, opening: 'Nội dung còn lại.'});
    expect(split.opening).not.toContain(THIRD_PARTY_LIMIT_SENTENCE);
    expect(splitThirdPartyLimit(opening, []).opening).toBe(opening);
    expect(splitThirdPartyLimit('Trước. ' + opening, ['third_party_limit']).limit).toBeNull();
  });
  test('reducer handles loading, result, cancellation, rate limit and reset', () => {
    const loading = aiReducer(initialAiState, {type: 'start'}); expect(loading.status).toBe('loading');
    expect(aiReducer(loading, {type: 'start'})).toBe(loading);
    expect(aiReducer(loading, {type: 'finish', result: {kind: 'aborted'}, now: 0})).toEqual(initialAiState);
    const ok = aiReducer(loading, {type: 'finish', result: {kind: 'ok', mode: 'full', reading, notes: []}, now: 0});
    expect(ok.status).toBe('ok'); expect(aiReducer(ok, {type: 'reset'})).toEqual(initialAiState);
    expect(aiReducer(loading, {type: 'finish', result: {kind: 'rate_limit', retryAfter: 60}, now: 1000}).retryUntil).toBe(61_000);
  });
});

describe('silent retry budget', () => {
  test.each(['unavailable', 'network'] as const)('%s retries exactly once after 1500ms', async (kind) => {
    vi.useFakeTimers();
    const fetchImpl = vi.fn<typeof fetch>();
    if (kind === 'network') fetchImpl.mockRejectedValue(new Error('PRIVATE'));
    else fetchImpl.mockImplementation(async () => new Response('', {status: 502}));
    const pending = interpret(payload, {fetchImpl});
    await vi.advanceTimersByTimeAsync(1499); expect(fetchImpl).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1); expect(await pending).toEqual({kind});
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(90_000); expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
  test('silent retry can recover', async () => {
    vi.useFakeTimers();
    const fetchImpl = vi.fn<typeof fetch>().mockRejectedValueOnce(new Error('PRIVATE'))
      .mockResolvedValueOnce(new Response(JSON.stringify({mode: 'full', reading})));
    const pending = interpret(payload, {fetchImpl});
    await vi.advanceTimersByTimeAsync(1500);
    expect(await pending).toMatchObject({kind: 'ok'}); expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
  test.each(['care', 'rate_limit'] as const)('%s never retries', async (kind) => {
    vi.useFakeTimers(); const fetchImpl = response({mode: 'care'}, kind === 'care' ? 200 : 429);
    expect(await interpret(payload, {fetchImpl})).toMatchObject({kind});
    await vi.advanceTimersByTimeAsync(90_000); expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
  test('cancelling backoff prevents retry and clears the timer', async () => {
    vi.useFakeTimers(); const controller = new AbortController(); const fetchImpl = response({}, 502);
    const pending = interpret(payload, {signal: controller.signal, fetchImpl});
    await vi.advanceTimersByTimeAsync(1000); controller.abort();
    expect(await pending).toEqual({kind: 'aborted'});
    await vi.advanceTimersByTimeAsync(90_000); expect(fetchImpl).toHaveBeenCalledTimes(1); expect(vi.getTimerCount()).toBe(0);
  });
});

test('V2 client shape limits and copied reading order', () => {
  expect(isAiReading(reading)).toBe(true);
  for (const patch of [{answer: undefined}, {answer: Array(91).fill('từ').join(' ')}, {opening: undefined}, {tension: 5}, {paths: []}, {paths: [...reading.paths, reading.paths[0]]},
    {per_card: [{...reading.per_card[0], notice: undefined}]}, {headline: 'x'.repeat(71)},
    {closing: Array(37).fill('từ').join(' ')}, {experiment: Array(31).fill('từ').join(' ')}])
    expect(isAiReading({...reading, ...patch})).toBe(false);
  expect(isAiReading({...reading, answer:Array(90).fill('từ').join(' ')})).toBe(true);
  expect(isAiReading({...reading, experiment: ''})).toBe(true);
  const copy = aiReadingText(reading);
  const expected = [reading.answer, reading.opening, reading.per_card[0].title,
    reading.per_card[0].scene, reading.per_card[0].notice, reading.tension, reading.weave, reading.unsaid, reading.outlook,
    reading.paths[0].label, reading.paths[0].body, reading.paths[1].label, reading.paths[1].body,
    reading.closing, reading.question, reading.experiment];
  let previous = -1;
  for (const part of expected) { const next = copy.indexOf(part, previous + 1); expect(next).toBeGreaterThan(previous); previous = next; }
  expect(aiReadingText({...reading, experiment: ''}).endsWith(reading.question)).toBe(true);
});

test('V2 client normalizes per-card copy order to spread positions', async () => {
  const picks = [{position: 1, cardId: 'a', reversed: false}, {position: 2, cardId: 'b', reversed: false}];
  const reversedOrder = {...reading, per_card: [{...reading.per_card[0], position: 2}, reading.per_card[0]]};
  const result = await interpret({...payload, picks}, {fetchImpl: response({mode: 'full', reading: reversedOrder})});
  expect(result.kind).toBe('ok');
  if (result.kind === 'ok') expect(result.reading.per_card.map((p) => p.position)).toEqual([1, 2]);
});

 test('AI_BUSY is shown without a silent retry or trusting server message text', async () => {
   const fetchImpl = response({error: 'AI_BUSY', message: 'UNTRUSTED'}, 503);
   const result = await interpret(payload, {fetchImpl}); expect(result).toEqual({kind: 'busy'});
   expect(fetchImpl).toHaveBeenCalledTimes(1);
   expect(aiReducer(initialAiState, {type: 'finish', result, now: 0}).status).toBe('busy');
 });
 test('reflective empty paths render no direction blocks and copy has no path text', async () => {
   const {createElement} = await import('react'); const {renderToStaticMarkup} = await import('react-dom/server');
   const {AiReadingEnding} = await import('../components/AiReadingPanel');
   const safe = {...reading, paths: []};
   expect(isAiReading(safe, 'reflective_only')).toBe(true); expect(isAiReading(safe, 'full')).toBe(false);
   const html = renderToStaticMarkup(createElement(AiReadingEnding, {reading: safe}));
   expect(html).not.toContain('ai-subsection'); expect(html).not.toContain('Hai hướng đi');
   expect(aiReadingText(safe)).not.toContain(reading.paths[0].label);
 });

 test('optional reflective paths and experiment are normalized without blank sections', async () => {
   const {paths: _paths, experiment: _experiment, ...partial} = reading;
   const result = await interpret(payload, {fetchImpl: response({mode: 'reflective_only', reading: partial})});
   expect(result.kind).toBe('ok');
   if (result.kind === 'ok') {expect(result.reading.paths).toEqual([]); expect(result.reading.experiment).toBe('');}
 });

 test('403 is classified without retry or exposing response text', async () => {
   const fetchImpl=response({error:'PRIVATE'},403);
   const result=await interpret(payload,{fetchImpl}); expect(result).toEqual({kind:'blocked'});
   expect(fetchImpl).toHaveBeenCalledTimes(1);
   expect(aiReducer(initialAiState,{type:'finish',result,now:0}).status).toBe('blocked');
 });
 test('friendly messages and error layout: message before retry, offline below', async () => {
   const {aiErrorMessage}=await import('./aiErrorMessage');
   expect(aiErrorMessage('network')).toBe('Chưa soạn được luận giải lúc này. Bạn vẫn có bản đọc từ sách bên dưới.');
   expect(aiErrorMessage('blocked')).toContain('Địa chỉ truy cập này chưa được cho phép.');
   expect(aiErrorMessage('rate_limit')).toBe('Bạn vừa rút khá nhiều lượt. Thử lại sau ít phút nhé.');
   expect(aiErrorMessage('busy')).toBe('Chưa soạn được luận giải lúc này. Bạn vẫn có bản đọc từ sách bên dưới.');
   const {createElement}=await import('react'); const {renderToStaticMarkup}=await import('react-dom/server');
   const {SettingsProvider}=await import('../hooks/useSettings'); const {AiReadingPanel}=await import('../components/AiReadingPanel');
   const html=renderToStaticMarkup(createElement(SettingsProvider,{children:createElement(AiReadingPanel,{
     info:{provider:'gemini',freeTier:false},payload,
     ai:{state:{...initialAiState,status:'network'},remaining:0,autoRun:()=>{},abortPending:()=>{},run:async()=>{},cancel:()=>{}}
   })}));
   expect(html.indexOf('Chưa kết nối được.')).toBeLessThan(html.indexOf('>Thử lại<'));
   expect(html.indexOf('>Thử lại<')).toBeLessThan(html.indexOf('Đọc theo sách (không cần mạng)'));
   expect(html).not.toContain('ORIGIN_BLOCKED');
 });
test.each(['rate_limited','daily_budget'] as const)('keeps %s through client and reducer',async reason=>{
 const result=await interpret(payload,{fetchImpl:response({error:reason},429,{'Retry-After':'120'})});
 expect(result).toEqual({kind:'rate_limit',reason,retryAfter:120});
 expect(aiReducer(initialAiState,{type:'finish',result,now:0}).errorReason).toBe(reason);
});
