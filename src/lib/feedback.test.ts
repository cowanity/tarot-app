import {expect,test,vi} from 'vitest';
import {feedbackText,sanitizeFeedback} from './feedback';
import {saveFeedback,saveReading,listReadings,clearAll,type SavedReading} from './history';
import {buildAiPayload} from './aiClient';
import {cards,spreads} from '../data';
const spread=spreads.find(s=>s.card_count===1)!;
const reading:SavedReading={v:2,id:'feedback',createdAt:'2026-10-12T00:00:00.000Z',question:'PRIVATE_QUESTION',topic:'Tổng quan',spreadId:spread.id,
  cards:[{position:spread.positions[0].number,cardId:cards[0].id,reversed:false}],feelings:{ids:['buon'],want:'comfort',duration:'weeks'}};
function memory() {
  const data=new Map<string,string>();
  return {getItem:(key:string)=>data.get(key)??null,setItem:(key:string,value:string)=>{data.set(key,value);},removeItem:(key:string)=>{data.delete(key);}} as Storage;
}
test('local feedback saves once, replaces a vote and retains separate modes',()=>{
  const store=memory(),position=reading.cards[0].position;
  expect(saveFeedback(store,reading,{position,mode:'offline',rating:'yes'}).ok).toBe(true);
  expect(saveFeedback(store,reading,{position,mode:'offline',rating:'no'}).ok).toBe(true);
  expect(saveFeedback(store,reading,{position:null,mode:'full',rating:'yes'}).ok).toBe(true);
  saveReading(store,reading); // Delayed/manual save must not wipe votes.
  expect(listReadings(store)).toHaveLength(1);
  expect(listReadings(store)[0].feedback).toEqual([{position,mode:'offline',rating:'no'},{position:null,mode:'full',rating:'yes'}]);
  expect(clearAll(store).ok).toBe(true);expect(listReadings(store)).toEqual([]);
});
test('feedback rejects unknown positions/modes and handles quota',()=>{
  expect(sanitizeFeedback([{position:99,mode:'offline',rating:'yes'},{position:null,mode:'bogus',rating:'yes'}],[1])).toEqual([]);
  expect(sanitizeFeedback([{position:1,mode:'full',rating:'yes',other:'PRIVATE'}],[1])).toEqual([{position:1,mode:'full',rating:'yes'}]);
  const store=memory();vi.spyOn(store,'setItem').mockImplementation(()=>{throw new Error('quota');});
  expect(saveFeedback(store,reading,{position:null,mode:'offline',rating:'yes'})).toEqual({ok:false});
});
test('export uses explicit fields and question opt-in, never custom emotion or book text',()=>{
  const extended={...reading,feedback:[{position:null,mode:'full' as const,rating:'yes' as const}],context:'PRIVATE_CONTEXT',
    feelings:{...reading.feelings!,other:'PRIVATE_OTHER'},opening:'PRIVATE_GENERATED'};
  const text=feedbackText([extended]);
  expect(text).not.toContain('PRIVATE');
  expect(JSON.parse(text)).toMatchObject({feelings:['buon'],want:'comfort',duration:'weeks',cards:reading.cards.map(({position,cardId})=>({position,cardId}))});
  const opted=feedbackText([extended],true);
  expect(opted).toContain('PRIVATE_QUESTION');
  for(const forbidden of ['PRIVATE_CONTEXT','PRIVATE_OTHER','PRIVATE_GENERATED'])expect(opted).not.toContain(forbidden);
});
test('feedback never enters interpretation payload',()=>{
  const payload=buildAiPayload({question:'',context:'',feelings:{ids:[]},topic:'Tổng quan',spreadId:spread.id,reading:[],
    ...{feedback:[{position:null,mode:'offline',rating:'yes'}]}});
  expect(payload).not.toHaveProperty('feedback');
});
test('grouped picker renders accessible selected chips, count and closed optional section',async()=>{
  const {renderToStaticMarkup}=await import('react-dom/server');
  const {createElement}=await import('react');
  const {FeelingsPicker}=await import('../components/FeelingsPicker');
  const html=renderToStaticMarkup(createElement(FeelingsPicker,{value:{ids:['lo_lang','buon','kho_goi_ten']},onChange:()=>{}}));
  expect(html).toContain('3/3');expect(html).toContain('Cảm xúc khác');
  for(const group of ['Nặng nề','Giằng co','Sáng','Đặc biệt'])expect(html).toContain(group);
  expect(html.match(/aria-pressed="true"/g)).toHaveLength(3);
  expect(html).toContain('<details class="feeling-more">');
  expect(html).toContain('disabled=""');
});
