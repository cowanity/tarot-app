import {expect,test} from 'vitest';
import {readFileSync} from 'node:fs';
import {answerErrors,hasAnswerDirection} from './answerRules';
import {GOLDEN_EXAMPLES} from './prompts/goldenExamples';
import {parseAndGuard} from './guardrails';
import {cards,spreads} from '../src/data';
import {resolveReading} from '../src/lib/readingContext';
import {FakeProvider} from './provider';
import {createApp} from './app';
import {cases,resolveEvalCase} from './eval/run';
import {runABVariant} from './eval/ab';
import {promptVariant} from './prompts/variant';
test('accent-aware vague check is limited to verdict and first answer sentence',()=>{
 expect(answerErrors('Tuy nhiên, bạn nên chờ.','Có nên chờ không?','full','Nên chờ')).not.toContain('answer_vague');
 for(const verdict of ['Tùy bạn','Chưa rõ hướng của mối quan hệ'])expect(answerErrors('Bài nhắc đến việc chờ.','Có nên chờ không?','full',verdict)).toContain('answer_vague');
 expect(answerErrors('Bài khuyên chờ. Mình chưa rõ lý do.','Có nên chờ không?','full','Nên chờ')).not.toContain('answer_vague');
 expect(hasAnswerDirection('Cô ấy còn tình cảm')).toBe(false);expect(hasAnswerDirection('Có, bạn nên thử')).toBe(true);
 expect(answerErrors('Bài khuyên chờ.','Có nên chờ không?','full','Bạn chưa cần quyết định')).not.toContain('answer_verdict');
});
const ids=[['major-13-death','cups-five','wands-seven'],['wands-ten','pentacles-two','pentacles-eight'],['cups-five','swords-four','major-08-strength']];
for(const [i,e] of GOLDEN_EXAMPLES.entries())test(`golden ${e.id} passes tier one directly and through fake provider`,async()=>{
 const spread=spreads.find(s=>s.card_count===3)!;const picks=spread.positions.map((p,j)=>({position:p.number,cardId:ids[i][j],reversed:false}));
 const input={question:e.input.question,context:e.input.context,topic:e.input.topic,feelings:{ids:[],want:e.want as 'clarity'},spreadId:spread.id,picks};
 const drawn=resolveReading(spread.id,picks).map((d,j)=>({...d,position:{...d.position,name_vi:e.input.cards[j].match(/\(([^)]+)\)/)![1]}}));
 const result=parseAndGuard(JSON.stringify(e.output),drawn,'full',input.question,undefined,input.topic,input.context,input.feelings);
 expect(result.errors,result.diagnostics?.map(d=>d.fragment).join('\n')).toEqual([]);
 const provider=new FakeProvider([JSON.stringify(e.output)]);const app=createApp({provider,model:'fake',origin:'http://localhost:5173'});
 expect((await app.request('/api/interpret',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)})).status).toBe(200);expect(provider.calls).toHaveLength(1);
});
test('health has no circuit disclosure; empty unsaid hides both renderers',async()=>{
 const app=createApp({provider:new FakeProvider([]),model:'private',origin:'http://localhost:5173'});
 expect(await(await app.request('https://public.example/api/health')).json()).toEqual({ok:true});
 for(const file of ['src/components/ReadingScenes.tsx','src/components/AiReadingPanel.tsx'])expect(readFileSync(file,'utf8')).toContain('{reading.unsaid &&');
});
test('new fixtures are valid and do not route listen to crisis',()=>{
 for(const id of [21,22,23])expect(resolveEvalCase(id).drawn).toHaveLength(3);
 expect(cases[21].feelings?.want).toBe('listen');expect(cases[20].context).toContain('làm thêm giờ');
 expect(promptVariant(undefined)).toBe('v1');expect(()=>promptVariant('bad')).toThrow();
 expect(cards.some(c=>c.id==='major-08-strength')).toBe(true);
});
test('first pass hard failure cannot repair or retry',async()=>{
 const provider=new FakeProvider([JSON.stringify({...GOLDEN_EXAMPLES[0].output,answer:'Chắc chắn anh ấy sẽ quay lại.'})]);
 const [row]=await runABVariant(provider,'v1',[20],async()=>{});
 expect(row.status).toBe(502);expect(row.calls).toBe(1);expect(provider.calls).toHaveLength(1);
});
test('90 words and 520 characters are accepted; exceeding either fails',async()=>{
 const {outputSchema}=await import('./schema');const {isAiReading}=await import('../src/lib/aiClient');
 const {drawn}=resolveEvalCase(20);const g=parseAndGuard(JSON.stringify(GOLDEN_EXAMPLES[0].output),drawn,'full',cases[19].question).reading!;
 const answer=Array.from({length:90},(_,i)=>i%2?'riêng':'Từ').join(' ');
 expect(outputSchema.safeParse({...g,answer}).success).toBe(true);expect(isAiReading({...g,answer})).toBe(true);
 expect(outputSchema.safeParse({...g,answer:answer+' nữa'}).success).toBe(false);
 expect(outputSchema.safeParse({...g,answer:'a'.repeat(520)}).success).toBe(true);
 expect(outputSchema.safeParse({...g,answer:'a'.repeat(521)}).success).toBe(false);
 expect(answerErrors('Một câu. Hai câu. Ba câu.','','full')).not.toContain('answer_sentences');
 expect(answerErrors('Một câu. Hai câu. Ba câu. Bốn câu.','','full')).toContain('answer_sentences');
});
test('v1 soft editorial defects ship without repair',async()=>{
 const provider=new FakeProvider([JSON.stringify({...GOLDEN_EXAMPLES[0].output,answer:'Nền tảng của câu hỏi là chờ. Bài gợi việc nhìn lại.',question:'Điều gì khiến bạn chờ?',unsaid:'Có thể bạn muốn chờ.'})]);
 const [row]=await runABVariant(provider,'v1',[20],async()=>{});
 expect(row.status).toBe(200);expect(provider.calls).toHaveLength(1);
 expect(row.payload.notes).toEqual(expect.arrayContaining(['answer_abstract','question_opening','unsaid_opening']));
});
test('first-pass budget also prevents provider transport retries',async()=>{
 const {ModelChainProvider}=await import('./provider');let calls=0;
 const provider=new ModelChainProvider(['gemini-3.5-flash-lite'],async()=>{calls++;throw new Error('GEMINI_HTTP_503');});
 const [row]=await runABVariant(provider,'v1',[20],async()=>{});
 expect(row.status).toBe(503);expect(row.calls).toBe(1);expect(calls).toBe(1);
});
test('blind reports have both versions without revealing mapping',async()=>{
 const {writeBlindReports,AB_CASES}=await import('./eval/ab');const {mkdtemp,readFile,rm}=await import('node:fs/promises');const {join}=await import('node:path');const {tmpdir}=await import('node:os');
 const dir=await mkdtemp(join(tmpdir(),'tarot-ab-'));
 const make=(variant:'old'|'v1')=>AB_CASES.map(id=>({id,variant,status:503,payload:{error:'AI_BUSY'},calls:1,tokens:0,seconds:1,attempts:[{kind:'primary' as const,outcome:'http_503'}],diagnostics:[]}));
 try{await writeBlindReports(make('old'),make('v1'),dir,()=>true);const text=await readFile(join(dir,'case-24.md'),'utf8');expect(text).toContain('## X');expect(text).toContain('## Y');expect(text).not.toMatch(/old|v1/);expect(await readFile(join(dir,'KEY.md'),'utf8')).toContain('| 24 | old | v1 |');}finally{await rm(dir,{recursive:true,force:true});}
});
