import {describe,test,expect} from 'vitest';
import {cards,spreads} from '../../src/data';
import {cardImagery} from '../cardImagery';
import {GOLDEN_EXAMPLES,selectGoldenExample,exampleParrot} from './goldenExamples';
import {buildUserPrompt} from './user';
import {buildReadingContext,resolveReading} from '../../src/lib/readingContext';
import {voiceReport} from '../eval/quality';
describe('7a imagery and rotating cadence examples',()=>{
 test('exactly 78 catalog ids have nonempty descriptions at most 260 characters',()=>{
  expect(cards).toHaveLength(78);
  expect(Object.keys(cardImagery).sort()).toEqual(cards.map(c=>c.id).sort());
  for(const c of cards){expect(cardImagery[c.id].trim().length).toBeGreaterThan(0);expect([...cardImagery[c.id]].length).toBeLessThanOrEqual(260);}
 });
 test('each drawn card gets imagery and only one selected example',()=>{
  const spread=spreads.find(s=>s.card_count===3)!;
  const picks=spread.positions.map((p,i)=>({position:p.number,cardId:cards[i].id,reversed:false}));
  const ctx=buildReadingContext(resolveReading(spread.id,picks),spread);
  const prompt=buildUserPrompt(ctx,{question:'',context:'',feelings:{ids:[]},topic:'Tổng quan',spreadId:spread.id,picks},'full','request-7a');
  expect(prompt.match(/<golden_example /g)).toHaveLength(1);
  for(const p of picks)expect(prompt).toContain(cardImagery[p.cardId]);
  expect(prompt.match(/Hình ảnh trên lá/g)).toHaveLength(3);
 });
 test('selection follows need only',()=>{
  expect(selectGoldenExample('decision').id).toBe('decision-work');
  for(const want of ['listen','comfort'])expect(selectGoldenExample(want).id).toBe('listen-breakup');
  for(const want of ['clarity','curious',undefined])expect(selectGoldenExample(want).id).toBe('clarity-third-party');
 });
 test('six words match despite punctuation/case; five words or separate fields do not',()=>{
  const sample={text:'Một hai ba bốn năm sáu bảy.'};
  expect(exampleParrot({opening:'MỘT, hai: ba — bốn năm sáu!'},sample)).toBe(true);
  expect(exampleParrot({opening:'Một hai ba bốn năm'},sample)).toBe(false);
  expect(exampleParrot({opening:'Một hai ba',closing:'bốn năm sáu'},sample)).toBe(false);
  expect(exampleParrot({closing:'Tối nay, chưa quyết định chuyện nhắn lại cũng được.'},GOLDEN_EXAMPLES[0])).toBe(false);
  expect(exampleParrot({closing:'Tối nay, chưa quyết định chuyện nhắn lại cũng được.'},GOLDEN_EXAMPLES[2])).toBe(true);
 });
 test('missing provider output is unscored, not a fabricated failure or success',()=>{
  const report=voiceReport([{id:1,status:'MISSING_GEMINI_API_KEY'}]);
  expect(report).toContain('Chưa chấm');expect(report).not.toContain('0/7');
  expect(report).toContain('sàng lọc từ vựng tạm thời');
 });
});
