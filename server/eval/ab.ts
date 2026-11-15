import {fullValidation} from './fullDiagnostics';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {randomInt} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {createApp,type Audit} from '../app';
import {createProvider,type LlmProvider} from '../provider';
import {config} from '../config';
import {promptVariant,type PromptVariant} from '../prompts/variant';
import {cases,resolveEvalCase} from './run';
import type {Diagnostic} from '../guardrailPolicy';
export const AB_CASES=[24,25,26,27,28,29];
export type Trial={id:number;variant:PromptVariant;status:number;payload:Record<string,unknown>;calls:number;tokens:number;seconds:number;attempts:Audit['attempts'];diagnostics:Diagnostic[];withRepair?:boolean;schemaIssues?:unknown[];validations?:unknown[];completions?:unknown[]};
export async function runABVariant(provider:LlmProvider,variant:PromptVariant,ids=AB_CASES,pause=async()=>{await new Promise(r=>setTimeout(r,8000));},withRepair=false):Promise<Trial[]>{
 const rows:Trial[]=[];
 for(const [index,id] of ids.entries()){
  if(index)await pause();provider.resetCircuits?.();
  const item=cases[id-1],{spread,picks,profile}=resolveEvalCase(id);
  const input={question:item.question,context:item.context??'',feelings:item.feelings??{ids:[]},topic:item.topic,spreadId:spread.id,picks,...(profile?{profile}:{})};
  let audit:Audit|undefined;const diagnostics:Diagnostic[]=[];const validations:ReturnType<typeof fullValidation>[]=[],completions:unknown[]=[];let raw='';
  const observed:LlmProvider={complete:async request=>{const response=await provider.complete(request);raw=response.text;completions.push({text:raw,repairFields:request.repairFields??null,model:response.model});return response;}};
  const app=createApp({provider:observed,model:'gemini-3.5-flash-lite',origin:'http://localhost:5173',firstPass:true,withVerdictRepair:withRepair,promptVariant:variant,cap:100,log:r=>{audit=r;},onValidation:r=>{const full=fullValidation(r,raw);validations.push(full);diagnostics.push(...full.diagnostics);}});
  const started=Date.now();const response=await app.request('/api/interpret',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});
  const payload=await response.json() as Record<string,unknown>;
  rows.push({id,variant,withRepair,schemaIssues:validations.flatMap(v=>v.schemaIssues),validations,completions,status:response.status,payload,calls:audit?.attempts.length??0,tokens:audit?.tokens??0,seconds:(Date.now()-started)/1000,attempts:audit?.attempts??[],diagnostics});
  console.log(JSON.stringify({variant,case:id,status:response.status,calls:rows.at(-1)!.calls,tokens:rows.at(-1)!.tokens,seconds:rows.at(-1)!.seconds,error:payload.error??null}));
 }
 return rows;
}
export async function writeBlindReports(old:Trial[],v1:Trial[],directory='reports/AB',flip=()=>randomInt(2)===1,repair:Trial[]=[]){
 await mkdir(directory,{recursive:true});const key=['# KEY — mở sau khi đọc bài','', '| Ca | X | Y |','|---|---|---|'];
 for(const id of AB_CASES){
  const a=old.find(r=>r.id===id),b=v1.find(r=>r.id===id);if(!a||!b)throw new Error('INCOMPLETE_AB');
  const pair=flip()?[a,b]:[b,a];key.push(`| ${id} | ${pair[0].variant} | ${pair[1].variant} |`);
  const item=cases[id-1];
  const content=[`# Ca ${id}`, '',`Câu hỏi: ${item.question}`,`Bối cảnh: ${item.context||'Không khai báo'}`,`Nhu cầu: ${item.feelings?.want??'Không khai báo'}`,`Các lá: ${resolveEvalCase(id).drawn.map(d=>`${d.position.name_vi}: ${d.card.name_vi} (${d.reversed?'ngược':'xuôi'})`).join('; ')}`,'',...pair.flatMap((r,i)=>[
   `## ${i?'Y':'X'}`,'',r.status===200&&r.payload.reading?'```json\n'+JSON.stringify(r.payload.reading,null,2)+'\n```':`Không có bài để chấm. Trạng thái ${r.status}; lỗi ${String(r.payload.error??'unavailable')}.`,''])].join('\n');
  await writeFile(`${directory}/case-${id}.md`,content);
 }
 await writeFile(`${directory}/KEY.md`,key.join('\n')+'\n');
 const rows=[...old,...v1,...repair];const ops=['# A/B — vận hành, không chấm văn','', 'Hai biến thể old/v1 first-pass: mỗi ca/biến thể tối đa một lần gọi provider thực tế. Không sửa văn, không fallback model, không retry nội dung hay transport. Cả hai dùng gemini-3.5-flash-lite, temperature 0.7, cùng schema và chặn tầng 1, cùng note 7e và cùng giới hạn token. Thứ tự old trước v1; thứ tự này có thể chịu nhiễu thời điểm/provider.', '', 'Baseline old giữ system 7c và nội dung ví dụ cũ; cố định ví dụ cũ số 1 và style đầu tiên để loại ngẫu nhiên. Không phải phát lại bit-for-bit mọi request 7c. v1 chọn ví dụ theo want. Đây là so sánh hai gói prompt, không cô lập riêng tác động system hoặc ví dụ.', '', '| Bản | Ca | Có bài | Gọi | Token ghi nhận | Giây | Lỗi provider | Lỗi guard |','|---|---|---|---|---|---|---|---|',...rows.map(r=>`| ${r.variant}${r.withRepair?'+sửa':''} | ${r.id} | ${r.status===200&&r.payload.reading?'Có':'Không'} | ${r.calls} | ${r.tokens} | ${r.seconds.toFixed(2)} | ${r.attempts.filter(a=>!a.outcome.startsWith('guardrail:')&&a.outcome!=='ok').map(a=>a.outcome).join(', ')||'—'} | ${[...new Set(r.diagnostics.filter(d=>d.severity==='hard').map(d=>d.rule))].join(', ')||'—'} |`)];
 for(const variant of ['old','v1'] as const){const subset=rows.filter(r=>r.variant===variant&&!r.withRepair);ops.push('',`${variant}: ${subset.filter(r=>r.status===200&&r.payload.reading).length}/${subset.length} có bài first-pass; ${subset.reduce((n,r)=>n+r.calls,0)} lần gọi; ${subset.reduce((n,r)=>n+r.tokens,0)} token ghi nhận; ${subset.reduce((n,r)=>n+r.seconds,0).toFixed(2)} giây xử lý (không gồm nghỉ).`);}
 ops.push('','Token 0 ở lỗi provider chỉ là không có usage trả về, không chứng minh không tính phí. Không chấm văn khi không có bài. Không suy chất lượng từ tỷ lệ trả HTTP 200. raw-old.json/raw-v1.json có variant và diagnostics, chỉ đọc sau bài mù. Không chạy lại để chọn bài đẹp.');
 for(const group of [old,v1,repair])if(group.length){
  const label=group[0].withRepair?'v1+sửa':group[0].variant;
  const count=(rule:string)=>group.filter(r=>r.diagnostics.some(d=>d.rule===rule)||(r.payload.notes as string[]|undefined)?.includes(rule)).length;
  ops.push('',`${label}: ${group.filter(r=>r.status===200&&r.payload.reading).length}/${group.length} có bài; ${group.reduce((n,r)=>n+r.calls,0)} lần gọi; ${group.reduce((n,r)=>n+r.tokens,0)} token ghi nhận.`,`${label}: answer_verdict ${count('answer_verdict')}/${group.length}; answer_abstract ${count('answer_abstract')}/${group.length}; kích hoạt sửa ${count('verdict_repair_triggered')}/${group.length}.`);
 }
 ops.push('', 'Ca 20, 21, 22 trùng câu hỏi + lá của ví dụ: chỉ kiểm hợp đồng, không đo chất lượng. Ca 24–29 là bộ giữ lại, khác câu hỏi và lá ví dụ. Lượt v1+sửa là mẫu sinh độc lập, một lần primary và tối đa một lần sửa có điều kiện; không tắt chặn tầng 1. Chênh lệch không thể quy hết cho sửa vì có nhiễu sinh mẫu.');
 if(repair.length){
  const repairKey=['# KEY so sánh sửa',''];
  for(const original of v1){const fixed=repair.find(r=>r.id===original.id);if(!fixed)continue;const pair=flip()?[original,fixed]:[fixed,original];repairKey.push(`Ca ${original.id}: X=${pair[0].withRepair?'v1+sửa':'v1'}, Y=${pair[1].withRepair?'v1+sửa':'v1'}`);
   await writeFile(`${directory}/repair-case-${original.id}.md`,pair.map((r,i)=>`## ${i?'Y':'X'}\n\n${r.status===200&&r.payload.reading?JSON.stringify(r.payload.reading,null,2):'Không có bài để chấm.'}`).join('\n\n'));
  }
  await writeFile(`${directory}/REPAIR-KEY.md`,repairKey.join('\n'));
 }
 await writeFile(`${directory}/OPS.md`,ops.join('\n')+'\n');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 try{
  const variant=promptVariant();const withRepair=process.env.WITH_VERDICT_REPAIR==='1';const settings=config({...process.env,AI_PROVIDER:'gemini',AI_MODEL:'gemini-3.5-flash-lite',AI_FALLBACK_MODEL:'',AI_FALLBACK_MODELS:withRepair?(process.env.AI_FALLBACK_MODELS??'gemini-3.5-flash'):'',AI_DAILY_CAP:'100'});
  await mkdir('reports/AB',{recursive:true});
  const rows=await runABVariant(createProvider(settings),variant,AB_CASES,undefined,withRepair);
  await writeFile(`reports/AB/raw-${withRepair?'v1-repair':variant}.json`,JSON.stringify(rows,null,2));
  let old:Trial[]|undefined,v1:Trial[]|undefined;
  try{old=JSON.parse(await readFile('reports/AB/raw-old.json','utf8'));v1=JSON.parse(await readFile('reports/AB/raw-v1.json','utf8'));}catch{console.log('AB_WAITING_OTHER_VARIANT');process.exitCode=0;}
  if(old&&v1){let repair:Trial[]=[];try{repair=JSON.parse(await readFile('reports/AB/raw-v1-repair.json','utf8'));}catch{}await writeBlindReports(old,v1,'reports/AB',undefined,repair);}
 }catch(error){console.error(error instanceof Error&&/^(MISSING_|INVALID_|INCOMPLETE_)/.test(error.message)?error.message:'AB_ERROR');process.exitCode=1;}
}
