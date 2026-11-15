import {failureReason,errorMetadata,type ErrorMetadata,type FailureReason} from './failureReason';
import {staticCacheHeader} from '../src/lib/pwaConfig';
import {repairVerdict,verdictRepairReason} from './verdictRepair';
import {voiceSoftErrors} from './voiceRules';
import {randomUUID} from 'node:crypto';
import {selectGoldenExample,exampleParrot} from './prompts/goldenExamples';
import {repairFields,modelJson,REPAIR_FIELDS,type RepairField} from './targetedRepair';
import {abstractRepeatCount} from './languageStyle';
import {CARE_ANSWER} from '../src/lib/safetyText';
import {serveStatic} from '@hono/node-server/serve-static';
import {fileURLToPath} from 'node:url';
import {originPolicy, logOrigin} from './originPolicy';
import { reflectiveOutlook } from './reflectiveOutlook';
import { toWireProfile } from '../src/lib/profileContext';
import { Hono, type Context } from 'hono';
import { cors } from 'hono/cors';
import { bodyLimit } from 'hono/body-limit';
import { spreads } from '../src/data';
import { resolveReading, buildReadingContext, ReadingContextError } from '../src/lib/readingContext';
import {readingSensitivity} from '../src/lib/feelings';
import { inputSchema, type Mode } from './schema';
import { buildUserPrompt, cleanText } from './prompts/user';
import { systemForMode } from './prompts/system';
import {oldSystemForMode} from './prompts/oldSystem';
import {buildOldUserPrompt} from './prompts/oldUser';
import type {PromptVariant} from './prompts/variant';
import { providerErrorCode, type AttemptKind, type LlmProvider } from './provider';
import { CallBudgetError, createCallBudget } from './callBudget';
import { softLengthCount, parseAndGuard, guardrailFeedback, withThirdPartyLimit, type SchemaIssue } from './guardrails';
import { Limits } from './limits';
export interface Audit { reason: FailureReason | null; origin?: string; method: string; path: string; errorCode: string | null; time: string; status: number; latencyMs: number; attempts: {kind: AttemptKind; outcome: string; model?: string; latencyMs?: number; guardrailErrors?: string[]}[]; spreadId: string | null; mode: string | null; model: string; tokens: number; providerError: ErrorMetadata | null; usedFallback: boolean; schemaIssues: SchemaIssue[]; responseChars: number; badSpacingCount: number }
export function createApp(options: { provider: LlmProvider; model: string; origin: string; cap?: number; hourlyLimit?:number; providerName?: 'gemini' | 'anthropic'; freeTier?: boolean;
  promptVariant?: PromptVariant; firstPass?: boolean; withVerdictRepair?: boolean;
  onValidation?: (result:ReturnType<typeof parseAndGuard>)=>void;
  ip?: (c: Context) => string; log?: (entry: Audit) => void; now?: () => number; timeoutMs?: number; environment?: string; vitePort?: number; serveStatic?: boolean; staticRoot?: string }) {
  const app = new Hono<{ Variables: { audit: Partial<Audit> } }>();
  const acceptsOrigin = originPolicy(options.origin, options.environment ?? process.env.NODE_ENV, options.vitePort ?? 5173);
  const limits = new Limits(options.cap, options.now, options.hourlyLimit);
  app.onError((error,c)=>{const meta=c.get('audit')??{};meta.providerError=errorMetadata(error);meta.reason='internal_error';c.set('audit',meta);return c.json({error:'internal_error',fallback:'offline'},500);});
  app.use('/api/*', async (c, next) => {
    c.header('Cache-Control','no-store');
    const start = Date.now();
    try { await next(); } finally {
      const meta = c.get('audit');
      const status = c.res.status;
      const errorCode = status < 400 ? null : status === 403 ? 'ORIGIN_BLOCKED' : status === 429 ? 'RATE_LIMIT'
        : status === 500 ? 'INTERNAL_ERROR' : status === 503 ? 'AI_BUSY' : status === 502 ? meta?.attempts?.some(a => a.outcome.startsWith('guardrail:')) ? 'GUARDRAIL' : 'PROVIDER_UNAVAILABLE'
        : status === 400 ? 'BAD_REQUEST' : status === 413 ? 'BODY_TOO_LARGE' : status === 404 ? 'NOT_FOUND' : 'REQUEST_FAILED';
      // Never log query strings or arbitrary user-supplied path segments.
      const path = ['/api/interpret', '/api/health', '/api/info'].includes(c.req.path) ? c.req.path : '/api/*';
      try { options.log?.({ method: c.req.method, path, errorCode, reason:status<400?null:meta?.reason??failureReason(status,meta?.providerError?.message,meta?.attempts?.some(a=>a.outcome.startsWith('guardrail:')),meta?.attempts?.length??0), ...(status === 403 ? {origin: logOrigin(c.req.header('Origin') ?? '')} : {}), time: new Date().toISOString(), status: c.res.status, latencyMs: Date.now() - start, attempts: meta?.attempts ?? [],
        spreadId: meta?.spreadId ?? null, mode: meta?.mode ?? null, model: meta?.model ?? options.model, tokens: meta?.tokens ?? 0, providerError: meta?.providerError ?? (status>=400?errorMetadata(new Error(status===429?meta?.reason==='daily_budget'?'AI_DAILY_CAP':'RATE_LIMITED':status<500?'BAD_REQUEST':errorCode==='GUARDRAIL'?'GUARD_BLOCKED':'INTERNAL_ERROR')):null), usedFallback: meta?.usedFallback ?? false, schemaIssues: meta?.schemaIssues ?? [], responseChars: meta?.responseChars ?? 0, badSpacingCount: meta?.badSpacingCount ?? 0 }); } catch { /* No request or error logging. */ }
    }
  });
  app.use('/api/*', async (c, next) => {
    const origin = c.req.header('Origin');
    if (origin && !acceptsOrigin(origin)) return c.json({ error: 'origin_blocked' }, 403);
    await next();
  });
  app.use('/api/*', cors({ origin: origin => acceptsOrigin(origin) ? origin : undefined, allowMethods: ['POST', 'GET', 'OPTIONS'], allowHeaders: ['Content-Type'] }));
  app.get('/api/info', (c) => c.json({provider: options.providerName ?? 'anthropic', freeTier: options.freeTier ?? false}));
  app.get('/api/health', (c) => c.json({ ok: true }));
  app.use('/api/interpret', bodyLimit({ maxSize: 8192, onError: (c) => c.json({ error: 'body_too_large' }, 413) }));
  app.post('/api/interpret', async (c) => {
    if (!c.req.header('Content-Type')?.toLowerCase().startsWith('application/json')) return c.json({error: 'content_type'}, 400);
    let body: unknown;
    try { body = await c.req.json(); } catch { return c.json({error: 'invalid_json'}, 400); }
    const parsed = inputSchema.safeParse(body);
    if (!parsed.success) return c.json({error: 'invalid_body'}, 400);
    const input = { ...parsed.data, question: cleanText(parsed.data.question), context: cleanText(parsed.data.context) };
    let drawn;
    try { drawn = resolveReading(input.spreadId, input.picks); }
    catch (error) { return c.json({ error: error instanceof ReadingContextError ? error.code : 'invalid_reading' }, 400); }
    if (input.profile) input.profile = toWireProfile(input.profile, drawn.map(({card}) => card.id));
    const attempts: Audit['attempts'] = [];
    const audit: Partial<Audit> = { spreadId: input.spreadId, tokens: 0, attempts };
    let attemptStarted = 0;
    const outcome = (code: string) => { const last = attempts.at(-1); if (last) { last.outcome = code; last.latencyMs = Date.now() - attemptStarted; } };
    const providerFailed = (error: unknown) => {
      const code = providerErrorCode(error);
      if(code!=='AI_BUSY'||!audit.providerError)audit.providerError = errorMetadata(error);
      if(controller.signal.aborted)audit.reason='timeout';
      else if(code!=='AI_BUSY')audit.reason=failureReason(502,code,false,attempts.length);
      outcome(controller.signal.aborted ? 'timeout' : code.replace(/^(?:GEMINI|ANTHROPIC)_/, '').toLowerCase());
    };
    c.set('audit', audit);
    const sensitive = readingSensitivity(input.question, input.context, input.feelings);
    if (sensitive === 'crisis') { audit.mode = 'care'; return c.json({mode: 'care', verdict:'Bạn xứng đáng được lắng nghe', answer: CARE_ANSWER, outlook: reflectiveOutlook(input.topic, '', true), paths: []}); }
    const mode: Mode = sensitive === 'professional' ? 'reflective_only' : 'full'; audit.mode = mode;
    const ctx = buildReadingContext(drawn, spreads.find((s) => s.id === input.spreadId)!, input.profile);
    const requestId=randomUUID(),example=selectGoldenExample(input.feelings.want);
    const prompt = (options.promptVariant==='old'?buildOldUserPrompt:buildUserPrompt)(ctx, input, mode, requestId);
    let repaired=false;let verdictRepaired=false;
    let primaryModel=options.model;
    let best:{reading:import('./schema').ReadingOutput;notes:string[];model:string}|undefined;
    const controller = new AbortController();
    const deadline = Date.now() + Math.min(options.timeoutMs ?? 60_000, 60_000);
    const timer = setTimeout(() => controller.abort(), deadline - Date.now());
    const disconnected = () => controller.abort();
    c.req.raw.signal.addEventListener('abort', disconnected, { once: true });
    if (c.req.raw.signal.aborted) controller.abort();
    const takeCall = createCallBudget(limits,3,options.ip?.(c)??'local');
    let feedback = '';
    const excludedModels = new Set<string>();

    const transport = {retries: 0, fallback: false, avoided: [] as string[]};
    const ship=()=>{const safe=withThirdPartyLimit(best!.reading,input.question,input.context);return c.json({mode,...safe,notes:[...new Set([...safe.notes,...best!.notes])],model:best!.model});};
    const assess=(result:ReturnType<typeof parseAndGuard>,model:string)=>{if(result.reading){const notes=[...new Set([...(result.notes??[]),...voiceSoftErrors(result.reading,drawn),...(exampleParrot(result.reading,example)?['example_parrot']:[]),...(softLengthCount(result.reading)?['soft_length']:[]),...(abstractRepeatCount(result.reading)?['abstract_repeat']:[]),...(result.ominousCount?['ominous']:[])])];if(!best||notes.length<best.notes.length)best={reading:result.reading,notes:[...new Set(notes)],model};}};
    try {
      const complete = async (attempt: number, overrides: Partial<import('./provider').CompletionInput> = {}) => {
        let completionCalls=0;
        const completion = await new Promise<Awaited<ReturnType<LlmProvider['complete']>>>((resolve, reject) => {
          const aborted = () => reject(new Error('timeout'));
          controller.signal.addEventListener('abort', aborted, {once: true});
          options.provider.complete({system: (options.promptVariant==='old'?oldSystemForMode:systemForMode)(mode), mode, transport, deadline, excludedModels: [...excludedModels], hasProfile: Boolean(input.profile), omitExperiment: input.feelings.want === 'listen', user: prompt + feedback, maxTokens: 6500, ...overrides, signal: controller.signal,
            beforeCall: (call) => {
              if (controller.signal.aborted) throw new Error('timeout');
              if(overrides.repairFields&&completionCalls>=1)throw new CallBudgetError();
              if (deadline - Date.now() < 15_000) throw new Error('AI_BUSY');
              if(options.firstPass&&attempts.length>=1&&(!options.withVerdictRepair||!overrides.repairFields||attempts.length>=2))throw new CallBudgetError();
              takeCall();completionCalls++;
              attemptStarted = Date.now();
              attempts.push({kind: call?.usedFallback ? 'fallback' : attempt > 0 ? 'retry' : call?.kind ?? 'primary', outcome: 'pending', model: call?.model ?? options.model, latencyMs: 0});
              if (call) { audit.model = call.model; audit.usedFallback = Boolean(audit.usedFallback || call.usedFallback); }
            },
            onProviderError: (code) => { providerFailed(new Error(code)); },
          })
            .then(resolve, reject).finally(() => controller.signal.removeEventListener('abort', aborted));
        });
        outcome('ok');
        audit.tokens = (audit.tokens ?? 0) + completion.usage.input + completion.usage.output;
        return completion;
      };
      for(let attempt=0;attempt<(options.firstPass?1:3)&&attempts.length<3;attempt++){
        if(controller.signal.aborted)throw new Error('timeout');
        if(attempts.length>=2)excludedModels.add(primaryModel);
        const completion=await complete(attempt);
        let result=parseAndGuard(completion.text,drawn,mode,input.question,input.profile,input.topic,input.context,input.feelings);
        const model=completion.model??options.model;if(attempt===0)primaryModel=attempts[0]?.model??model;
        options.onValidation?.(result);
        assess(result,model);
        const rules=[...result.errors,...(result.notes??[])];
        const paths=(result.diagnostics??[]).filter(d=>result.errors.includes(d.rule)).map(d=>d.path);
        const fields=[...new Set(paths.map(p=>p.split('.')[0]))];
        const localized=fields.length>0&&fields.length<=2&&fields.every(f=>REPAIR_FIELDS.includes(f as RepairField));
        if(!options.firstPass&&!repaired&&localized&&result.candidate&&attempts.length<3){
          repaired=true;const original=result;
          outcome('guardrail:'+rules.join(','));if(attempts.length)attempts.at(-1)!.guardrailErrors=rules;
          result=await repairFields({candidate:result.candidate,fields:fields as RepairField[],input,drawn,mode,errors:(result.diagnostics??[]).map(d=>`${d.rule}: ${d.fragment}`),complete:r=>complete(attempt+1,r)});
          options.onValidation?.(result);
          if(fields.includes('personal')&&(!result.candidate?.personal||result.diagnostics?.some(d=>d.severity==='hard'&&d.path.startsWith('personal')))){
            const {personal:_personal,...remaining}=(result.candidate??original.candidate)!;
            result=parseAndGuard(modelJson(remaining,mode),drawn,mode,input.question,input.profile,input.topic,input.context,input.feelings);
            result.notes=[...(result.notes??[]),'personal_dropped'];
          }
          // Keep a previously safe candidate when the repair is worse or invalid.
          options.onValidation?.(result);
          assess(result,model);
        }
        if(!options.firstPass&&!best&&result.candidate&&fields.includes('personal')&&attempts.length>=3){
          const {personal:_personal,...remaining}=result.candidate;
          result=parseAndGuard(modelJson(remaining,mode),drawn,mode,input.question,input.profile,input.topic,input.context,input.feelings);
          result.notes=[...(result.notes??[]),'personal_dropped'];options.onValidation?.(result);assess(result,model);
        }
        audit.schemaIssues=result.schemaIssues;audit.responseChars=result.responseChars;audit.badSpacingCount=result.badSpacingCount;
        if(best&&!verdictRepaired&&(!options.firstPass||options.withVerdictRepair)&&attempts.length<3){
          const reason=verdictRepairReason(best.reading,input.question,best.notes);
          if(reason){
            verdictRepaired=true;best.notes.push('verdict_repair_triggered');
            try{
              const fixed=await repairVerdict({candidate:best.reading,input,drawn,mode,reason,complete:r=>complete(attempt+1,r)});
              if(fixed)options.onValidation?.(fixed.result);
              if(fixed?.result.reading&&!verdictRepairReason(fixed.result.reading,input.question,fixed.result.notes)){
                const retained=best.notes.filter(n=>!['answer_verdict','answer_direction','answer_abstract'].includes(n));
                best={reading:fixed.result.reading,notes:[...retained,...(fixed.result.notes??[]),'verdict_repaired'],model:fixed.model??best.model};
              }else best.notes.push('verdict_repair_rejected');
            }catch(error){providerFailed(error);best.notes.push('verdict_repair_rejected');}
          }
        }
        if(best)return ship();
        outcome('guardrail:'+result.errors.join(','));if(attempts.length)attempts.at(-1)!.guardrailErrors=result.errors;
        feedback=`\n<validation_feedback>${guardrailFeedback(result.errors,result.schemaIssues,result.matchedCliches,result.thirdPartyFlags?.filter(f=>f.severity==='hard'))}</validation_feedback>`;
      }
    } catch (error) {
      if(best)return ship();
      if(attempts.at(-1)?.outcome.startsWith('guardrail:')) return c.json({error:'guardrail',fallback:'offline'},502);
      if (providerErrorCode(error) === 'AI_BUSY' || controller.signal.aborted || (error instanceof CallBudgetError && !error.retryAfter)) { if (controller.signal.aborted) providerFailed(error); else if(!audit.providerError)audit.providerError = errorMetadata(new Error('AI_BUSY')); return c.json({error: 'AI_BUSY', message: 'Hệ thống đang bận, bạn thử lại sau ít phút nhé'}, 503); }
      if (error instanceof CallBudgetError) {
        if (error.retryAfter) { audit.reason=error.reason;c.header('Retry-After', String(error.retryAfter)); return c.json({error:error.reason}, 429); }
      } else {providerFailed(error);if(audit.reason==='internal_error')return c.json({error:'internal_error',fallback:'offline'},500);}
    }
    finally { clearTimeout(timer); c.req.raw.signal.removeEventListener('abort', disconnected); }
    if(best)return ship();
    if (attempts.at(-1)?.outcome.startsWith('guardrail:')) {audit.reason='guard_blocked';return c.json({error:'guardrail',fallback:'offline'},502);}
    if (attempts.length >= 3) return c.json({error: 'AI_BUSY', message: 'Hệ thống đang bận, bạn thử lại sau ít phút nhé'}, 503);
    return c.json({error: 'unavailable', fallback: 'offline'}, 502);
  });
  if (options.serveStatic ?? ((options.environment ?? process.env.NODE_ENV) === 'production' || process.env.SERVE_STATIC === 'true')) {
    const root = options.staticRoot ?? fileURLToPath(new URL('../dist/', import.meta.url));
    app.use('*',async(c,next)=>{c.header('Cache-Control',staticCacheHeader(c.req.path));await next();if(c.res.status>=400)c.header('Cache-Control','no-store');});
    const assets = serveStatic({root});
    const index = serveStatic({path: `${root}/index.html`});
    // Vite copies public/audio into dist/audio. Preserve native MIME/byte-range streaming; missing audio must never receive SPA HTML.
    app.use('/audio/*', async (c) => {
      if(c.req.method!=='GET'&&c.req.method!=='HEAD')return c.body(null,405);
      c.header('Accept-Ranges','bytes');
      return assets(c,async()=>{c.res=c.newResponse(null,404);});
    });
    app.get('*', (c, next) => c.req.path.startsWith('/api') ? next() : assets(c, next));
    app.get('*', (c, next) => c.req.path.startsWith('/api')||/\.[a-z0-9]{1,8}$/i.test(c.req.path) ? next() : index(c, next));
  }
  return app;
}
