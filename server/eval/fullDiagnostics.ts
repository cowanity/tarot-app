import type {parseAndGuard} from '../guardrails';
import {textEntries} from '../readingText';
/** Local eval only: never attach generated field content to production Audit. */
export function fullValidation(result:ReturnType<typeof parseAndGuard>,raw:string){
 let value:unknown=result.candidate;try{const patch=JSON.parse(raw.trim().replace(/^```(?:json)?\s*([\s\S]*?)```$/iu,'$1'));value=result.candidate?{...result.candidate,...patch}:patch;}catch{}
 const fields=Object.fromEntries(textEntries(value).map(e=>[e.path,e.text]));
 return {errors:result.errors,notes:result.notes??[],schemaIssues:result.schemaIssues,fields,diagnostics:(result.diagnostics??[]).map(d=>({...d,fragment:fields[d.path]??d.fragment}))};
}
