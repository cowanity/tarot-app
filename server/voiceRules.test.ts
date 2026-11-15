import {expect,test} from 'vitest';
import {cards,spreads} from '../src/data';
import {resolveReading} from '../src/lib/readingContext';
import {imageryFor} from './cardImagery';
import {sceneFor,containsRun,voiceSoftErrors,voiceHardErrors} from './voiceRules';
import {parseAndGuard} from './guardrails';
import {geminiSchemaFor} from './provider';
import type {ReadingOutput} from './schema';
const spread=spreads.find(s=>s.card_count===1)!;
const drawn=resolveReading(spread.id,[{position:spread.positions[0].number,cardId:cards[0].id,reversed:false}]);
const reading:ReadingOutput={verdict:'Nhìn lại lựa chọn hiện tại',answer:'Lựa chọn hiện tại cần thêm thời gian.',headline:'Lựa chọn',opening:'Bạn nhắc đến lựa chọn.',tension:'Bạn muốn tiến lên nhưng vẫn muốn giữ nhịp sống quen thuộc.',per_card:[{position:drawn[0].position.number,title:'Muốn bước tới',scene:'Chi tiết model tự bịa.',notice:'Lựa chọn cần thêm thời gian. Một tia sáng rơi xuống.'}],weave:'Các lá nối lại.',unsaid:'',outlook:'Bạn có thể nhìn lại.',paths:[{label:'Một hướng',body:'Nếu dừng, bạn có thể nhìn lại.'},{label:'Hướng khác',body:'Nếu tiếp tục, bạn có thể cân nhắc.'}],closing:'Lựa chọn cần thêm thời gian.',question:'Bạn muốn cân nhắc lựa chọn nào?',experiment:'Ghi một dòng.'};
test('all 78 imagery entries are bounded',()=>{expect(cards).toHaveLength(78);for(const c of cards){expect(imageryFor(c.id).length).toBeGreaterThan(0);expect(imageryFor(c.id).length).toBeLessThanOrEqual(260);}});
test('wire schema excludes scene, server always reconstructs it',()=>{
 const schema=geminiSchemaFor({mode:'full'});
 expect(schema.properties.per_card).toHaveProperty('items');
 expect(JSON.stringify(schema.properties.per_card)).not.toContain('scene');
 const result=parseAndGuard(JSON.stringify(reading),drawn,'full','Lựa chọn nào phù hợp?');
 expect(result.errors).toEqual([]);expect(result.reading?.per_card[0].scene).toBe(imageryFor(cards[0].id));
 expect(sceneFor(cards[0].id,true)).toBe(imageryFor(cards[0].id)+' (lá ngược)');
});
test('copy detection respects word boundaries, casing and punctuation',()=>{
 expect(containsRun('Một, hai ba bốn năm!','MỘT hai ba bốn năm sáu',5)).toBe(true);
 expect(containsRun('Một hai ba bốn','Một hai ba bốn năm',5)).toBe(false);
 expect(voiceSoftErrors({...reading,per_card:[{...reading.per_card[0],notice:imageryFor(cards[0].id)}]},drawn)).toContain('notice_copy');
 expect(voiceSoftErrors({...reading,tension:'Giữa hai bờ.'},drawn)).toContain('tension_vague');
 expect(voiceHardErrors({...reading,unsaid:'Có thể bạn muốn dừng.'})).toContain('unsaid_opening');
});
