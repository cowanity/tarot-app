import type { Limits } from './limits';
export class CallBudgetError extends Error {
  constructor(public readonly retryAfter = 0, public readonly reason:'rate_limited'|'daily_budget'='daily_budget') { super(retryAfter ? 'AI_DAILY_CAP' : 'CALL_BUDGET_EXHAUSTED'); }
}
/** One instance per API request, shared by provider retries and guardrail repair. */
export function createCallBudget(limits: Limits, maximum = 3, ip?:string) {
  let calls = 0;
  return () => {
    if (calls >= maximum) throw new CallBudgetError();
    if(calls===0&&ip!==undefined){const denied=limits.acquire(ip);if(denied)throw new CallBudgetError(denied.retryAfter,denied.reason);}
    const retryAfter = calls === 0 && ip===undefined ? limits.aiCall() : 0;
    if (retryAfter) throw new CallBudgetError(retryAfter);
    calls++;
  };
}
