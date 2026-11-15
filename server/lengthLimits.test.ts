import {expect,test} from 'vitest';
import {GOLDEN_EXAMPLES} from './prompts/goldenExamples';
import {parseAndGuard} from './guardrails';
import {resolveEvalCase} from './eval/run';
import {createApp} from './app';
import {FakeProvider} from './provider';
import {fullValidation} from './eval/fullDiagnostics';
import {isAiReading} from '../src/lib/aiClient';
const words=(n:number)=>Array.from({length:n},(_,i)=>i%2?'riêng':'Từ').join(' ');
const base=GOLDEN_EXAMPLES[0].output;
const drawn=resolveEvalCase(20).drawn;
for(const title of [6,7,8])for(const answer of [61,75,90])test(`ships title ${title}, answer ${answer} without length repair`,async()=>{
 const draft={...base,verdict:'Nên chờ thêm một chút',answer:words(answer),per_card:base.per_card.map(p=>({...p,title:words(title)}))};
 const provider=new FakeProvider([JSON.stringify(draft)]);const {spread,picks}=resolveEvalCase(20);
 const app=createApp({provider,model:'fake',origin:'http://localhost:5173'});
 const res=await app.request('/api/interpret',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:'Chuyện tình cảm thế nào?',context:'',feelings:{ids:[]},topic:'Tình yêu',spreadId:spread.id,picks})});
 const payload=await res.json();expect(res.status).toBe(200);expect(payload.notes).toEqual(expect.arrayContaining(['title_long','answer_long']));expect(provider.calls).toHaveLength(1);expect(isAiReading(payload.reading)).toBe(true);
});
test('hard bounds title 9, answer 91 / 521 chars, verdict 13',()=>{
 for(const patch of [{per_card:base.per_card.map(p=>({...p,title:words(9)}))},{answer:words(91)},{answer:'a'.repeat(521)},{verdict:words(13)}]){const result=parseAndGuard(JSON.stringify({...base,...patch}),drawn,'full');expect(result.reading).toBeUndefined();expect(result.errors).toContain('output_schema');expect(result.schemaIssues.length).toBeGreaterThan(0);}
 const result=parseAndGuard(JSON.stringify({...base,verdict:words(12)}),drawn,'full');expect(result.errors).toEqual([]);expect(result.notes).toContain('verdict_long');
});
test('eval retains complete fields and schema path/code',()=>{
 const raw=JSON.stringify({...base,answer:words(91)});const result=parseAndGuard(raw,drawn,'full');const full=fullValidation(result,raw);
 expect(full.schemaIssues).toEqual(expect.arrayContaining([expect.objectContaining({path:'answer',code:'custom'})]));expect(full.fields.answer).toBe(words(91));expect(full.diagnostics.find(d=>d.path==='answer')?.fragment).toBe(words(91));
});
