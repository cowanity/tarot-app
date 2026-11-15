import {expect,test} from 'vitest';
import {unsafeThirdParty,thirdPartyBoundaryCount,isThirdPartyQuestion} from './thirdParty';
import {answerErrors} from './answerRules';
const answer='Có, bài cho thấy cô ấy còn tình cảm.';
test.each(['Cô ấy có yêu tôi không?','Anh ấy có quay lại không?'])('qualified relationship answer passes: %s',question=>{
 expect(isThirdPartyQuestion(question)).toBe(true);expect(answerErrors(answer,question,'full')).toEqual([]);expect(unsafeThirdParty(answer)).toBe(false);
 expect(thirdPartyBoundaryCount(answer)).toBe(0);
 expect(answerErrors(answer+' Không phải đọc lòng cô ấy.',question,'full')).not.toContain('answer_vague');
 expect(answerErrors('Có, cô ấy đã nhắn cho bạn.',question,'full')).toContain('answer_third_party_boundary');
});
test.each(['Cô ấy chắc chắn yêu bạn.','Anh ấy sẽ quay lại.','Cô ấy đang giả vờ.','Có vẻ anh ấy thao túng bạn.'])('rejects factual claims, motives and coercion: %s',text=>expect(unsafeThirdParty(text)).toBe(true));
test('a later factual claim is not excused by a relationship hedge',()=>expect(unsafeThirdParty(answer+' Anh ấy chắc chắn sẽ quay lại.')).toBe(true));
test('an explicit limit or question is not a claim',()=>expect(unsafeThirdParty('Các lá không cho biết cô ấy nghĩ gì.')).toBe(false));

test('discouraging coercion is safe',()=>expect(unsafeThirdParty('Không nên theo dõi cô ấy.')).toBe(false));
test('eval reset closes open model circuits without changing production timers',async()=>{
 const {ModelCircuit}=await import('./modelCircuit');const circuit=new ModelCircuit(['primary']);
 circuit.failure('primary');circuit.failure('primary');expect(circuit.available('primary')).toBe(false);
 circuit.reset();expect(circuit.snapshot()).toEqual([{model:'primary',state:'closed',remainingSeconds:0}]);
 expect(circuit.acquire('primary')).toBe(true);
});
test('user quotes and unquoted shared runs are removed, not new claims',async()=>{
 const {maskUserEchoes,thirdPartyFragments}=await import('./thirdParty');
 const question='Cô ấy có yêu tôi không?';
 expect(thirdPartyFragments(`Bạn hỏi “${question}”`,[question])).toEqual([]);
 expect(thirdPartyFragments(`Bạn hỏi "${question}"`,[question])).toEqual([]);
 expect(thirdPartyFragments(`Bạn hỏi ${question}`,[question])).toEqual([]);
 expect(thirdPartyFragments('Cô ấy chắc chắn còn yêu bạn',[question])).toEqual(['Cô ấy chắc chắn còn yêu bạn']);
 expect(thirdPartyFragments('Bài nghiêng về có, và đây là cách bài soi chuyện giữa hai người, không phải đọc lòng cô ấy',[question])).toEqual([]);
 expect(thirdPartyFragments('Anh ấy đang lừa dối bạn',[question])).toEqual(['Anh ấy đang lừa dối bạn']);
 expect(thirdPartyFragments('Anh ấy sẽ quay lại trong tháng sau',[question])).toEqual(['Anh ấy sẽ quay lại trong tháng sau']);
 expect(maskUserEchoes('Cô ấy có lừa dối bạn',['Cô ấy có yêu tôi không?']).trim()).toBe('lừa dối bạn');
 expect(thirdPartyFragments('Cô ấy có lừa dối bạn',['Cô ấy có yêu tôi không?'])).toEqual(['lừa dối bạn']);
 expect(thirdPartyFragments('Anh ấy đang lừa dối bạn',['Anh ấy đang lừa dối bạn'])).toEqual([]);
 expect(thirdPartyFragments('Cô ấy chắc chắn yêu bạn.',['Tôi đang nghĩ về cô ấy'])).not.toEqual([]);
});
test('new future actions remain checked after a quoted question',async()=>{
 const {thirdPartyFragments}=await import('./thirdParty');
 expect(thirdPartyFragments('Bạn hỏi “Cô ấy có yêu tôi không?”. Anh ấy sẽ gọi bạn trong tháng sau.',['Cô ấy có yêu tôi không?'])).toEqual(['Anh ấy sẽ gọi bạn trong tháng sau']);
});
test.each([
 'Ý chí vững vàng sẽ dẫn lối bạn qua mọi bỡ ngỡ ban đầu',
 'Việc từ bỏ phản ứng cứng nhắc sẽ giúp bạn bước tiếp',
 'Có lẽ bạn muốn hiểu rõ hơn những nguồn lực và sức ép nào đang âm thầm kéo mình lại',
 'Một ý tưởng thô sơ xuất hiện mang theo sinh lực và đam mê, giống như lúc bạn mới nghĩ đến việc này',
 'Nếu bạn cho phép mình bước chậm lại để thích nghi, khả năng cao sự bỡ ngỡ sẽ dần nhường chỗ cho nền tảng vững vàng',
])('never mistakes self-directed Vietnamese prose for a third party: %s',async text=>{
 const {thirdPartyFlags}=await import('./thirdParty');expect(thirdPartyFlags(text)).toEqual([]);
});
test.each(['Cô ấy chắc chắn còn yêu bạn','Anh ấy đang lừa dối bạn','Anh ấy sẽ quay lại vào tháng sau'])('hard claim has a traceable rule: %s',async text=>{
 const {thirdPartyFlags}=await import('./thirdParty');expect(thirdPartyFlags(text)).toEqual(expect.arrayContaining([expect.objectContaining({severity:'hard',rule:expect.stringMatching(/^tp_/),fragment:text})]));
});
test('uncertain third-party phrase is soft, not hard',async()=>{
 const {thirdPartyFlags}=await import('./thirdParty');expect(thirdPartyFlags('Có lẽ cô ấy đang nhớ bạn')).toEqual([]);
});

test.each(['Bạn nên thử lòng cô ấy.','Hãy theo dõi anh ấy.','Bạn nên ép đối chất.','Có thể theo dõi cô ấy.','Hãy ép cô ấy đối chất.'])('coercion is checked separately, never as a self-directed third-party claim: %s',async text=>{ const {isCoerciveAdvice}=await import('./thirdParty');expect(isCoerciveAdvice(text)).toBe(true);expect(unsafeThirdParty(text)).toBe(false); });
