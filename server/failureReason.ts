export type FailureReason='rate_limited'|'daily_budget'|'provider_429'|'provider_5xx'|'provider_network'|'timeout'|'guard_blocked'|'bad_request'|'internal_error';
export interface ErrorMetadata {name:string;message:string;cause:{code:string|null}}
/** Arbitrary exception text may contain prompts or credentials. Keep known diagnostics only. */
export function errorMetadata(error:unknown):ErrorMetadata{
 const e=error instanceof Error?error:new Error();
 const name=['Error','TypeError','ReferenceError','RangeError','SyntaxError','AbortError','TimeoutError'].includes(e.name)?e.name:'Error';
 const safe=/^(?:GEMINI_|ANTHROPIC_)(?:HTTP_\d{3}|NETWORK|TIMEOUT|ABORTED|BLOCKED|MAX_TOKENS|NO_TEXT|INVALID_RESPONSE)$|^(?:AI_BUSY|AI_DAILY_CAP|CALL_BUDGET_EXHAUSTED|timeout|RATE_LIMITED|BAD_REQUEST|GUARD_BLOCKED|INTERNAL_ERROR)$/;
 const native=/^Cannot read properties of (?:undefined|null) \(reading '[A-Za-z_$][\w$]*'\)$|^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)* is (?:not defined|not a function)$/;
 const message=(safe.test(e.message)||(['TypeError','ReferenceError'].includes(name)&&native.test(e.message))?e.message:'[redacted error message]').slice(0,200);
 const cause=e.cause&&typeof e.cause==='object'&&'code' in e.cause?String(e.cause.code):'';
 return {name,message,cause:{code:/^(?:ECONNRESET|ECONNREFUSED|ENOTFOUND|EAI_AGAIN|ETIMEDOUT|EPIPE|ENETUNREACH|UND_ERR_CONNECT_TIMEOUT|UND_ERR_SOCKET)$/.test(cause)?cause:null}};
}
export function failureReason(status:number,code?:string|null,guard=false,attempts=0):FailureReason{
 if(status>=400&&status<500&&status!==429)return 'bad_request';
 if(guard)return 'guard_blocked';
 if(/TIMEOUT|ABORTED/.test(code??''))return 'timeout';
 if(/HTTP_429/.test(code??''))return 'provider_429';
 if(/HTTP_5\d\d/.test(code??'')||code==='AI_BUSY')return 'provider_5xx';
 if(attempts>0&&/^(?:GEMINI|ANTHROPIC)_NETWORK$/.test(code??''))return 'provider_network';
 return 'internal_error';
}
