import {ModelCircuit} from './modelCircuit';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import responseSchema from './geminiResponseSchema.json';
import type { Settings } from './config';
export type AttemptKind = 'primary' | 'retry' | 'fallback';
export interface CompletionInput {
  repairFields?: readonly ('verdict'|'answer'|'unsaid'|'question'|'closing'|'experiment'|'personal')[];
  preferredModel?: string;
  excludedModels?: readonly string[];
  hasProfile?: boolean;
  transport?: { retries: number; fallback: boolean; avoided?: string[]; lastRetried?: boolean };
  deadline?: number;
  omitExperiment?: boolean;
  mode?: 'full' | 'reflective_only';
  system: string; user: string; maxTokens: number; signal: AbortSignal;
  /** Must run immediately before EACH actual provider call, including retries. */
  beforeCall?: (attempt?: { model: string; usedFallback: boolean; kind?: AttemptKind }) => void;
  onProviderError?: (code: string) => void;
}

export interface Completion { model?: string; usedFallback?: boolean; text: string; usage: { input: number; output: number } }
export interface LlmProvider { complete(input: CompletionInput): Promise<Completion>; resetCircuits?(): void; circuits?(): ReturnType<ModelCircuit['snapshot']> }
export class AnthropicProvider implements LlmProvider {
  private client: Anthropic;
  constructor(apiKey: string, private model: string) {
    this.client = new Anthropic({ apiKey, maxRetries: 0, timeout: 30_000, logLevel: 'off' });
  }
  async complete(input: CompletionInput): Promise<Completion> {
    const state = input.transport ?? {retries: 0, fallback: false};
    for (;;) {
      input.signal.throwIfAborted();
      input.beforeCall?.({model: this.model, usedFallback: false, kind: state.retries ? 'retry' : 'primary'});
      try {
        const response = await this.client.messages.create({model: this.model, system: input.system,
          messages: [{role: 'user', content: input.user}], max_tokens: input.maxTokens, temperature: 0.7,
        }, {signal: input.signal});
        return {text: response.content.flatMap(part => part.type === 'text' ? [part.text] : []).join(''),
          usage: {input: response.usage.input_tokens, output: response.usage.output_tokens}};
      } catch (error) {
        if (input.signal.aborted) throw new Error('ANTHROPIC_ABORTED');
        const status = error instanceof Anthropic.APIError ? error.status : undefined;
        const network = error instanceof Anthropic.APIConnectionError;
        const code = status ? `ANTHROPIC_HTTP_${status}` : network ? 'ANTHROPIC_NETWORK' : 'PROVIDER_ERROR';
        input.onProviderError?.(code);
        if (!(network || status === 429 || (status !== undefined && status >= 500))) throw new Error(code);
        if (state.retries >= 2) throw new Error('AI_BUSY');
        await abortableSleep([1500, 3000][state.retries++] + Math.floor(Math.random() * 601), input.signal);
      }
    }
  }
}
const geminiResponse = z.object({
  promptFeedback: z.object({ blockReason: z.string().optional() }).optional(),
  candidates: z.array(z.object({
    finishReason: z.string().optional(),
    content: z.object({ parts: z.array(z.object({ text: z.string().optional() })).optional() }).optional(),
  })).optional(),
  usageMetadata: z.object({
    promptTokenCount: z.number().int().nonnegative().optional(),
    candidatesTokenCount: z.number().int().nonnegative().optional(),
    thoughtsTokenCount: z.number().int().nonnegative().optional(),
  }).optional(),
});
class GeminiError extends Error { retryAfterMs = 0; }
/** Whitelist only; never return arbitrary fetch/SDK error messages to audit or eval. */
export function providerErrorCode(error: unknown): string {
  if (error instanceof Error && /^(?:GEMINI_(?:HTTP_[1-5]\d{2}|BLOCKED|MAX_TOKENS|NO_TEXT|NETWORK|TIMEOUT|ABORTED|INVALID_RESPONSE)|ANTHROPIC_(?:HTTP_[1-5]\d{2}|NETWORK|ABORTED)|AI_BUSY|AI_DAILY_CAP|CALL_BUDGET_EXHAUSTED)$/.test(error.message)) return error.message;
  return 'PROVIDER_ERROR';
}
export function abortableSleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) { reject(new GeminiError('GEMINI_ABORTED')); return; }
    const abort = () => { clearTimeout(timer); signal.removeEventListener('abort', abort); reject(new GeminiError('GEMINI_ABORTED')); };
    const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, ms);
    signal.addEventListener('abort', abort, { once: true });
  });
}

/** Omit forbidden properties, not merely their required entries. */
export function geminiSchemaFor(input: Pick<CompletionInput, 'mode' | 'hasProfile' | 'omitExperiment' | 'repairFields'>) {
  if(input.repairFields?.length)return {type:'OBJECT',properties:Object.fromEntries(input.repairFields.map(field=>[field,field==='personal'?responseSchema.properties.personal:{type:'STRING'}])),required:[...input.repairFields]};
  const excluded = new Set<string>([
    ...(!input.hasProfile ? ['personal'] : []),
    ...(input.mode === 'reflective_only' ? ['paths', 'outlook', 'experiment'] : []),
    ...(input.omitExperiment ? ['experiment'] : []),
  ]);
  const required = responseSchema.required.filter(key => !excluded.has(key));
  if (input.hasProfile && input.mode !== 'reflective_only') required.push('personal');
  return {...responseSchema, properties: Object.fromEntries(Object.entries(responseSchema.properties).filter(([key]) => !excluded.has(key))), required};
}

/** Shared routing for real Gemini and scripted providers in tests. */
export class ModelChainProvider implements LlmProvider {
  private circuit: ModelCircuit;
  private models: string[];
  constructor(models: string[], private send: (model: string, input: CompletionInput) => Promise<Completion>) {
    this.models = [...new Set(models)]; this.circuit = new ModelCircuit(this.models);
  }
  resetCircuits = () => this.circuit.reset();
  circuits = () => this.circuit.snapshot();
  async complete(input: CompletionInput): Promise<Completion> {
    const state = input.transport ?? {retries: 0, fallback: false};
    state.avoided ??= [];
    const deadline = input.deadline ?? Date.now() + 60_000;
    let retryModel: string | undefined;
    for (;;) {
      if (input.signal.aborted) throw new Error('GEMINI_ABORTED');
      if (deadline - Date.now() < 15_000) throw new Error('AI_BUSY');
      const preferred:string|undefined=input.preferredModel && this.models.includes(input.preferredModel) && !input.excludedModels?.includes(input.preferredModel) && !state.avoided!.includes(input.preferredModel) && this.circuit.available(input.preferredModel)?input.preferredModel:undefined;
      const model:string|undefined = retryModel ?? preferred ?? this.models.find(m => !input.excludedModels?.includes(m) && !state.avoided!.includes(m) && this.circuit.available(m));
      if (!model || !this.circuit.acquire(model)) throw new Error('AI_BUSY');
      const kind: AttemptKind = retryModel ? 'retry' : model === this.models[0] ? 'primary' : 'fallback';
      retryModel = undefined;
      try { input.beforeCall?.({model, usedFallback: model !== this.models[0], kind}); }
      catch (error) { this.circuit.release(model); throw error; }
      const controller = new AbortController();
      let timedOut = false;
      let abort!: () => void;
      const cancelled = new Promise<never>((_, reject) => {
        abort = () => { controller.abort(); reject(new Error(timedOut ? 'GEMINI_TIMEOUT' : 'GEMINI_ABORTED')); };
      });
      input.signal.addEventListener('abort', abort, {once: true});
      const timer = setTimeout(() => { timedOut = true; abort(); }, Math.min(30_000, deadline - Date.now()));
      try {
        const result = await Promise.race([this.send(model, {...input, signal: controller.signal, beforeCall: undefined}), cancelled]);
        this.circuit.success(model);
        state.avoided = state.avoided.filter(m => m !== model);
        return {...result, model, usedFallback: model !== this.models[0]};
      } catch (error) {
        const code = timedOut ? 'GEMINI_TIMEOUT' : providerErrorCode(error);
        if (input.signal.aborted) { this.circuit.release(model); throw new Error('GEMINI_ABORTED'); }
        input.onProviderError?.(code);
        const transport = /^(?:GEMINI_HTTP_(?:5\d{2}|429)|GEMINI_NETWORK|GEMINI_TIMEOUT)$/.test(code);
        if (transport) this.circuit.failure(model); else this.circuit.success(model);
        if (!transport && code !== 'GEMINI_HTTP_404') throw error;
        state.avoided.push(model);
        // Never wait on an overloaded model when another eligible model remains.
        if (this.models.some(m => !input.excludedModels?.includes(m) && !state.avoided!.includes(m) && this.circuit.available(m))) continue;
        if (transport && !state.lastRetried && this.circuit.available(model)) {
          state.lastRetried = true;
          clearTimeout(timer); input.signal.removeEventListener('abort', abort);
          await abortableSleep(1000, input.signal);
          retryModel = model; continue;
        }
        throw new Error('AI_BUSY');
      } finally { clearTimeout(timer); input.signal.removeEventListener('abort', abort); }
    }
  }
}
export class GeminiProvider implements LlmProvider {
  private chain: ModelChainProvider;
  constructor(private apiKey: string, model: string, fallbackModels: string | string[] = []) {
    this.chain = new ModelChainProvider([model, ...(typeof fallbackModels === 'string' ? [fallbackModels].filter(Boolean) : fallbackModels)], (name, input) => this.send(input, name));
  }
  resetCircuits = () => this.chain.resetCircuits();
  circuits = () => this.chain.circuits();
  complete(input: CompletionInput) { return this.chain.complete(input); }
  private async send(input: CompletionInput, model: string): Promise<Completion> {
    if (input.signal.aborted) throw new GeminiError('GEMINI_ABORTED');
    let response: Response;
    try {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: 'POST', redirect: 'error', signal: input.signal,
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': this.apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: input.system }] },
          contents: [{ role: 'user', parts: [{ text: input.user }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: Math.max(input.maxTokens, input.repairFields?.length ? 1600 : 6000), responseMimeType: 'application/json',
            // Verified with check_gemini.py on the user's gemini-3.5-flash (HTTP 200 for both probes).
            // Model-specific: a different fallback must not inherit unverified parameters.
            ...(model === 'gemini-3.5-flash' ? {thinkingConfig: {thinkingLevel: 'low'}} : {}),
            responseSchema: geminiSchemaFor(input),
          },
        }),
      });
    } catch { throw new GeminiError(input.signal.aborted ? 'GEMINI_ABORTED' : 'GEMINI_NETWORK'); }
    if (!response.ok) {
      const error = new GeminiError(`GEMINI_HTTP_${response.status}`);
      throw error;
    }
    let body: unknown;
    try { body = await response.json(); }
    catch (error) { throw new GeminiError(input.signal.aborted ? 'GEMINI_ABORTED' : error instanceof SyntaxError ? 'GEMINI_INVALID_RESPONSE' : 'GEMINI_NETWORK'); }
    if (input.signal.aborted) throw new GeminiError('GEMINI_ABORTED');
    const parsed = geminiResponse.safeParse(body);
    if (!parsed.success) throw new GeminiError('GEMINI_INVALID_RESPONSE');
    const data = parsed.data;
    if (data.promptFeedback?.blockReason) throw new GeminiError('GEMINI_BLOCKED');
    const candidate = data.candidates?.[0];
    if (candidate?.finishReason === 'MAX_TOKENS') throw new GeminiError('GEMINI_MAX_TOKENS');
    if (['SAFETY', 'PROHIBITED_CONTENT', 'RECITATION'].includes(candidate?.finishReason ?? '')) throw new GeminiError('GEMINI_BLOCKED');
    const text = candidate?.content?.parts?.map((part) => part.text ?? '').join('') ?? '';
    if (!text.trim()) throw new GeminiError('GEMINI_NO_TEXT');
    return { model, text, usage: { input: data.usageMetadata?.promptTokenCount ?? 0,
      output: (data.usageMetadata?.candidatesTokenCount ?? 0) + (data.usageMetadata?.thoughtsTokenCount ?? 0) } };
  }
}
export function createProvider(settings: Pick<Settings, 'provider' | 'apiKey' | 'model'> & Partial<Pick<Settings, 'fallbackModel' | 'fallbackModels'>>): LlmProvider {
  if (!settings.apiKey.trim()) throw new Error(settings.provider === 'gemini' ? 'MISSING_GEMINI_API_KEY' : 'MISSING_ANTHROPIC_API_KEY');
  return settings.provider === 'gemini'
    ? new GeminiProvider(settings.apiKey, settings.model, settings.fallbackModels ?? settings.fallbackModel)
    : new AnthropicProvider(settings.apiKey, settings.model);
}
/** Only tests instantiate this provider; no fake-mode environment switch in production. */
export class FakeProvider implements LlmProvider {
  calls: CompletionInput[] = [];
  constructor(private responses: (string | Error)[]) {}
  async complete(input: CompletionInput): Promise<Completion> {
    input.beforeCall?.();
    this.calls.push(input);
    const response = this.responses[Math.min(this.calls.length - 1, this.responses.length - 1)];
    if (response instanceof Error) throw response;
    let text = response ?? '';
    if (input.mode === 'reflective_only') {
      try { const value = JSON.parse(text); if (value && typeof value === 'object' && !Array.isArray(value)) { delete value.outlook; delete value.paths; text = JSON.stringify(value); } } catch { /* Preserve invalid fixtures. */ }
    }
    return { text, usage: { input: 10, output: 20 } };
  }
}
