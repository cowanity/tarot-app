import {afterEach, expect, test, vi} from 'vitest';
import {ModelCircuit} from './modelCircuit';
import {ModelChainProvider, FakeProvider, type CompletionInput} from './provider';
import {config} from './config';
const input = (): CompletionInput => ({system:'s',user:'PRIVATE',maxTokens:100,signal:new AbortController().signal});
afterEach(() => vi.useRealTimers());
test('two failures open for 120s; one half-open lease; successful probe closes', () => {
  vi.useFakeTimers(); const c = new ModelCircuit(['a']);
  c.failure('a'); expect(c.available('a')).toBe(true); c.failure('a');
  expect(c.snapshot()).toEqual([{model:'a',state:'open',remainingSeconds:120}]);
  vi.advanceTimersByTime(120000); expect(c.acquire('a')).toBe(true); expect(c.acquire('a')).toBe(false);
  c.success('a'); expect(c.snapshot()[0].state).toBe('closed');
  c.failure('a'); vi.advanceTimersByTime(120001); c.failure('a'); expect(c.available('a')).toBe(true);
});
test('success interrupts consecutive errors; failed half-open reopens', () => {
  vi.useFakeTimers(); const c = new ModelCircuit(['a']);
  c.failure('a'); c.success('a'); c.failure('a'); expect(c.available('a')).toBe(true);
  c.failure('a'); vi.advanceTimersByTime(120000); c.acquire('a'); c.failure('a');
  expect(c.snapshot()[0].remainingSeconds).toBe(120);
});
test('FakeProvider repeated primary 503 opens circuit; probe recovers', async () => {
  vi.useFakeTimers(); const primary = new FakeProvider([new Error('GEMINI_HTTP_503'),new Error('GEMINI_HTTP_503'),'{}']);
  const backup = new FakeProvider(['{}']); const models:string[]=[];
  const chain = new ModelChainProvider(['main','backup'], (model,i) => {models.push(model);return (model==='main'?primary:backup).complete(i);});
  await chain.complete(input()); await chain.complete(input()); await chain.complete(input());
  expect(models).toEqual(['main','backup','main','backup','backup']);
  expect(chain.circuits()[0].state).toBe('open');
  vi.advanceTimersByTime(120000); await chain.complete(input());
  expect(models.at(-1)).toBe('main'); expect(chain.circuits()[0].state).toBe('closed');
});
test('primary 503 then first backup timeout moves to second backup after 30s', async () => {
  vi.useFakeTimers(); const bad = new FakeProvider([new Error('GEMINI_HTTP_503')]); const good = new FakeProvider(['{}']);
  const seen:string[]=[]; let timedSignal:AbortSignal|undefined;
  const chain = new ModelChainProvider(['main','b1','b2'], (m,i) => {seen.push(m); if(m==='main')return bad.complete(i); if(m==='b2')return good.complete(i); timedSignal=i.signal;return new Promise(()=>{});});
  const pending=chain.complete(input()); await vi.advanceTimersByTimeAsync(30000);
  expect((await pending).model).toBe('b2'); expect(seen).toEqual(['main','b1','b2']); expect(timedSignal?.aborted).toBe(true);
});
test('60s maximum and minimum 15s remaining prevent another call', async () => {
  vi.useFakeTimers(); const seen:string[]=[];
  const chain=new ModelChainProvider(['a','b','c'],(m)=>{seen.push(m);return new Promise(()=>{});});
  const pending=chain.complete(input()); const checked=expect(pending).rejects.toThrow('AI_BUSY');
  await vi.advanceTimersByTimeAsync(60000); await checked; expect(seen).toEqual(['a','b']);
  await expect(chain.complete({...input(),deadline:Date.now()+14999})).rejects.toThrow('AI_BUSY'); expect(seen).toHaveLength(2);
});
test('safe config supports default chain, legacy, explicit empty and rejects unsafe names', () => {
  const env={AI_PROVIDER:'gemini',GEMINI_API_KEY:'secret'};
  expect(config(env).fallbackModels).toEqual(['gemini-3.5-flash']);
  expect(config({...env,AI_FALLBACK_MODEL:'old'}).fallbackModels).toEqual(['old']);
  expect(config({...env,AI_FALLBACK_MODELS:''}).fallbackModels).toEqual([]);
  expect(config({...env,AI_FALLBACK_MODELS:' a, a,b '}).fallbackModels).toEqual(['a','b']);
  expect(()=>config({...env,AI_FALLBACK_MODELS:'a,../secret'})).toThrow('INVALID_AI_FALLBACK_MODELS');
});
