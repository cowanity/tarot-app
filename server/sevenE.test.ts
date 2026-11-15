import {expect,test} from 'vitest';
import {createApp} from './app';
import {FakeProvider} from './provider';
import {GOLDEN_EXAMPLES} from './prompts/goldenExamples';
import {cases,resolveEvalCase} from './eval/run';
import {parseAndGuard} from './guardrails';
async function run(patch:unknown,question='Cô ấy có yêu tôi không?',verdict='Hiện tại có nỗi buồn đan xen cần đối diện.'){
 const {spread,picks}=resolveEvalCase(20);
 const provider=new FakeProvider([JSON.stringify({...GOLDEN_EXAMPLES[0].output,verdict}),JSON.stringify(patch)]);
 const app=createApp({provider,model:'fake',origin:'http://localhost:5173'});
 const response=await app.request('/api/interpret',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,context:'Mình đang chờ.',topic:'Tình yêu',feelings:{ids:[]},spreadId:spread.id,picks})});
 return {provider,response,payload:await response.json()};
}
const good={verdict:'Chưa nên chờ cô ấy',answer:'Bài cho thấy chuyện cũ còn làm hai người đau. Lúc này bạn nên dành thời gian cho mình.'};
test('one compact verdict repair accepts direction and leaves article intact',async()=>{
 const r=await run(good);expect(r.response.status).toBe(200);expect(r.provider.calls).toHaveLength(2);
 expect(r.payload.reading.verdict).toBe(good.verdict);expect(r.payload.notes).toContain('verdict_repaired');
 expect(r.provider.calls[1].user).toContain('<context>');expect(r.provider.calls[1].user).not.toContain('<profile>');
});
test('still evasive or unsafe repair retains original',async()=>{
 for(const patch of [{...good,verdict:'Cảm xúc còn đan xen'},{...good,answer:'Chắc chắn anh ấy sẽ quay lại.'}]){
  const r=await run(patch);expect(r.provider.calls).toHaveLength(2);expect(r.payload.notes).toContain('verdict_repair_rejected');expect(r.payload.reading.verdict).toContain('nỗi buồn');
 }
});
test('open question has no direction repair',async()=>{const r=await run(good,'Chuyện tình yêu của mình thế nào?','Cảm xúc còn đan xen');expect(r.provider.calls).toHaveLength(1);});
test('abstract triggers repair but unrelated soft notes do not',async()=>{const r=await run(good,'Chuyện tình yêu thế nào?','Bạn đang giữa giông bão');expect(r.provider.calls).toHaveLength(2);});
test('total provider calls remain capped at three including repair',async()=>{
 const {spread,picks}=resolveEvalCase(20);const original={...GOLDEN_EXAMPLES[0].output,verdict:'Cảm xúc còn đan xen'};
 const provider=new FakeProvider(['not json',JSON.stringify(original),JSON.stringify(good)]);
 const app=createApp({provider,model:'fake',origin:'http://localhost:5173'});
 const response=await app.request('/api/interpret',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:'Cô ấy có yêu tôi không?',context:'',topic:'Tình yêu',feelings:{ids:[]},spreadId:spread.id,picks})});
 expect(response.status).toBe(200);expect(provider.calls).toHaveLength(3);
});
test('heldouts avoid all golden cards and questions',()=>{
 const excluded=new Set(['major-13-death','cups-five','wands-seven','wands-ten','pentacles-two','pentacles-eight','swords-four','major-08-strength']);
 for(let id=24;id<=29;id++){expect(resolveEvalCase(id).picks.every(p=>!excluded.has(p.cardId))).toBe(true);expect(GOLDEN_EXAMPLES.some(e=>e.input.question===cases[id-1].question)).toBe(false);}
});
test('personal schema diagnostics identify field and rule',()=>{
 const result=parseAndGuard(JSON.stringify({...GOLDEN_EXAMPLES[0].output,personal:{title:3,text:false}}),resolveEvalCase(20).drawn,'full','Anh ấy có quay lại không?');
 expect(result.diagnostics).toEqual(expect.arrayContaining([expect.objectContaining({rule:'personal_schema',path:'personal.title',fragment:'personal.title: invalid_type'})]));
});
