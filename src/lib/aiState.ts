import type { AiResult } from './aiClient';
export interface AiState {
  status: 'idle' | 'loading' | 'ok' | 'care' | 'rate_limit' | 'unavailable' | 'network' | 'busy' | 'blocked';
  result: Extract<AiResult, {kind: 'ok'}> | null;
  retryUntil: number;
  errorReason?: 'rate_limited'|'daily_budget';
  careAnswer?: string;
}
export const initialAiState: AiState = {status: 'idle', result: null, retryUntil: 0};
export type AiAction = {type: 'reset' | 'start'} | {type: 'finish'; result: AiResult; now: number};
export function aiReducer(state: AiState, action: AiAction): AiState {
  if (action.type === 'reset') return initialAiState;
  if (action.type === 'start') return state.status === 'loading' ? state : {...initialAiState, status: 'loading'};
  if (action.type !== 'finish') return state;
  const result = action.result;
  if (result.kind === 'aborted') return initialAiState;
  if (result.kind === 'ok') return {status: 'ok', result, retryUntil: 0};
  return {...(result.kind==='rate_limit'?{errorReason:result.reason}:{}),status: result.kind, result: null, ...(result.kind === 'care' ? {careAnswer: result.answer} : {}), retryUntil: result.kind === 'rate_limit' ? action.now + Math.min(86400, result.retryAfter) * 1000 : 0};
}
