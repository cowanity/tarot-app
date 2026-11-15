import {expect,test} from 'vitest';
import {createApp} from './app';
import {FakeProvider,ModelChainProvider} from './provider';
import {resolveEvalCase} from './eval/run';
import {parseAndGuard} from './guardrails';
import {unsafeThirdParty} from './thirdParty';
import {sanitizeText,trimNoticeImages} from './sanitize';
import {sceneFor} from './voiceRules';
import type {ReadingOutput} from './schema';
import {voiceReport} from './eval/quality';
const passes=['Chưa nên kỳ vọng anh ấy quay lại lúc này, vì dòng cảm xúc cũ vẫn cần thời gian lắng xuống.','Có, cô ấy từng có tình cảm chân thành với bạn. Nhưng hiện tại vết thương lòng đang ngăn cách hai người.','Các lá nghiêng về có: cô ấy còn tình cảm nhưng đang bị kẹt giữa nhớ và tổn thương.'];
test.each(passes)('7c permits feelings: %s',s=>expect(unsafeThirdParty(s)).toBe(false));
test.each(['Anh ấy sẽ nhắn cho bạn tuần sau.','Cô ấy đang nghĩ đến người khác.','Chắc chắn anh ấy sẽ quay lại.'])('7c blocks concrete claims: %s',s=>expect(unsafeThirdParty(s)).toBe(true));
test.each([['Bài bài cho thấy…','Bài cho thấy…'],['  bạn   muốn  hỏi.   mình nghe. ','Bạn muốn hỏi. Mình nghe.'],['bài bài bài cho thấy.','Bài cho thấy.']])('sanitize %s',(a,b)=>expect(sanitizeText(a)).toBe(b));
function fixture(id=19){
 const f=resolveEvalCase(id);
 const reading:ReadingOutput={verdict:'Còn thương nhưng chưa gần nhau',answer:passes[1],headline:'Nhìn lại chuyện tình cảm',opening:'Bạn hỏi về chuyện tình cảm.',tension:'Bạn muốn gần nhau nhưng vẫn muốn có thời gian riêng.',per_card:f.drawn.map(d=>({position:d.position.number,title:'Muốn gần hơn',scene:sceneFor(d.card.id,d.reversed),notice:'Bạn muốn hiểu chuyện tình cảm đang diễn ra. Cảm xúc cần được gọi tên.'})),weave:'Bạn có thể nhìn lại điều mình cần.',unsaid:'',outlook:'Nếu dành thời gian lắng nghe, bạn có thể hiểu thêm.',paths:[{label:'Nói ra',body:'Nếu chia sẻ, bạn có thể hiểu thêm.'},{label:'Chờ thêm',body:'Nếu chờ, bạn có thể nhìn lại.'}],closing:'Bạn vẫn cần thời gian để hiểu nhau.',question:'Tình cảm nào khiến bạn muốn hỏi?',experiment:'Ghi tên điều bạn cần.'};
 const input={question:'Cô ấy có yêu tôi không?',context:'',feelings:{ids:[]},topic:'Tình yêu',spreadId:f.spread.id,picks:f.picks,...(f.profile?{profile:f.profile}:{})};
 return {...f,reading,input};
}
function harness(responses:string[]){const provider=new FakeProvider(responses);const app=createApp({provider,model:'main',origin:'http://localhost:5173'});return {provider,post:(input:unknown)=>app.request('/api/interpret',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)})};}
test.each([19,20])('case %i safe feelings ship without full retry',async id=>{
 const f=fixture(id);f.reading.answer=passes[id===20?0:1];
 const h=harness([JSON.stringify(f.reading)]);const res=await h.post(f.input);expect(res.status).toBe(200);expect(h.provider.calls).toHaveLength(1);
});
test('only soft problems ship immediately',async()=>{
 const f=fixture();f.reading.tension='Giữa hai bờ.';f.reading.per_card[0].notice=f.reading.per_card[0].scene;
 const h=harness([JSON.stringify(f.reading)]);const res=await h.post(f.input);expect(res.status).toBe(200);expect((await res.json()).notes).toContain('notice_copy');expect(h.provider.calls).toHaveLength(1);
});
test('bad personal gets one compact repair then is dropped; case 12 survives',async()=>{
 const f=fixture(12);f.reading.personal={title:'Năng lượng',text:'Bạn là người thiên bẩm. '.repeat(12)};
 const h=harness([JSON.stringify(f.reading),JSON.stringify({personal:f.reading.personal})]);
 const res=await h.post(f.input);expect(res.status).toBe(200);const body=await res.json();expect(body.reading.personal).toBeUndefined();expect(body.notes).toContain('personal_dropped');expect(h.provider.calls).toHaveLength(2);expect(h.provider.calls[1].repairFields).toEqual(['personal']);expect(h.provider.calls[1].preferredModel).toBe('gemini-3.5-flash');
});
test('hard failures cannot consume more than three actual calls',async()=>{
 const f=fixture();f.reading.answer='Anh ấy sẽ nhắn cho bạn tuần sau.';
 const h=harness([JSON.stringify(f.reading)]);const res=await h.post(f.input);expect(res.status).not.toBe(200);expect(h.provider.calls.length).toBeLessThanOrEqual(3);
});
test('transport retries share the three call budget',async()=>{
 let calls=0;const chain=new ModelChainProvider(['main','backup'],async()=>{calls++;throw new Error('GEMINI_HTTP_503');});
 const app=createApp({provider:chain,model:'main',origin:'http://localhost:5173'});const res=await app.request('/api/interpret',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(fixture().input)});expect(res.status).not.toBe(200);expect(calls).toBeLessThanOrEqual(3);
});
test('invalid imagery sentence removed deterministically',()=>{
 const f=fixture();const value={per_card:[{position:f.drawn[0].position.number,notice:'Bạn muốn hiểu tình cảm. Đàn chó cần được lắng nghe.'}]};
 const fixed=trimNoticeImages(value,f.drawn);expect(fixed.notes).toEqual(['notice_image_trimmed']);expect(fixed.value).toMatchObject({per_card:[{notice:'Bạn muốn hiểu tình cảm.'}]});
});
test('diagnostics include matching fragment for vague answer and soft opening',()=>{
 const f=fixture();const r=parseAndGuard(JSON.stringify({...f.reading,answer:'Chưa rõ.',question:'Điều gì khiến bạn muốn hỏi?'}),f.drawn,'full',f.input.question);
 expect(r.diagnostics).toEqual(expect.arrayContaining([expect.objectContaining({rule:'answer_vague',fragment:'Chưa rõ'}),expect.objectContaining({rule:'question_opening',fragment:'Điều gì'})]));
});
test('voice report includes cost and informative rhythm',()=>{const report=voiceReport([{id:19,status:'qua',reading:fixture().reading,scores:[1,1,1,0,1,1,1],calls:1,tokens:200,seconds:2,notes:['notice_copy']}]);expect(report).toContain('p95 2.00');expect(report).toContain('Rhythm chỉ tham khảo');expect(report).toContain('notice_copy');});
test('personal cannot prevent shipping when transport consumed the repair budget',async()=>{
 const f=fixture(12);f.reading.personal={title:'Năng lượng',text:'Bạn là người thiên bẩm. '.repeat(12)};
 let calls=0;
 const provider=new ModelChainProvider(['main','backup'],async()=>{calls++;if(calls<3)throw new Error('GEMINI_HTTP_503');return {text:JSON.stringify(f.reading),usage:{input:1,output:1}};});
 const app=createApp({provider,model:'main',origin:'http://localhost:5173'});
 const res=await app.request('/api/interpret',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f.input)});
 expect(res.status).toBe(200);const body=await res.json();expect(body.reading.personal).toBeUndefined();expect(body.notes).toContain('personal_dropped');expect(calls).toBe(3);
});
test('response schema remains a hard gate after sanitation',()=>{
 const f=fixture();const r=parseAndGuard(JSON.stringify({...f.reading,answer:'a'.repeat(521)}),f.drawn,'full',f.input.question);
 expect(r.reading).toBeUndefined();expect(r.errors).toContain('output_schema');expect(r.diagnostics?.some(d=>d.rule==='output_schema'&&d.path==='answer')).toBe(true);
});

test('notice object counts are trimmed even with generic vật',()=>{
 const f=fixture();const value={per_card:[{position:f.drawn[0].position.number,notice:'Bạn đang dè dặt. Bốn vật trên bàn tượng trưng cho điều bạn đang có.'}]};
 expect(trimNoticeImages(value,f.drawn)).toMatchObject({value:{per_card:[{notice:'Bạn đang dè dặt.'}]},notes:['notice_image_trimmed']});
});
