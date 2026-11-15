import {cards} from '../src/data';
import type {DrawnCard} from '../src/types';
import type {ReadingOutput} from './schema';
import {imageryFor} from './cardImagery';
import {exampleWords} from './prompts/goldenExamples';
import {wordCount} from '../src/lib/readingV2';
import {splitSentences} from '../src/lib/readingStage';
export function containsRun(text:string,source:string,n:number):boolean {
 const a=exampleWords(text),b=exampleWords(source); const runs=new Set(b.flatMap((_,i)=>i+n<=b.length?[b.slice(i,i+n).join(' ')]:[]));
 return a.some((_,i)=>i+n<=a.length&&runs.has(a.slice(i,i+n).join(' ')));
}
export function sceneFor(cardId:string,reversed:boolean):string {return imageryFor(cardId)+(reversed?' (lá ngược)':'');}
export function voiceSoftErrors(reading:ReadingOutput,drawn:readonly DrawnCard[]):string[]{
 const errors:string[]=[];
 if(reading.per_card.some(c=>wordCount(c.title)>5))errors.push('title_long');
 if(reading.per_card.some(c=>{const d=drawn.find(d=>d.position.number===c.position);return d&&containsRun(c.notice,imageryFor(d.card.id),4);}))errors.push('notice_copy');
 if(wordCount(reading.tension)<9)errors.push('tension_vague');
 if(reading.per_card.some(c=>{const s=splitSentences(c.notice);return s.length<1||s.length>2;}))errors.push('notice_rhythm');
 const names=new Set(cards.map(c=>c.name_vi.toLocaleLowerCase('vi')));
 const text=JSON.stringify({...reading,per_card:reading.per_card.map(({scene:_scene,...c})=>c)});
 const variants=text.match(/(?:Át|Ace|Hai|Ba|Bốn|Năm|Sáu|Bảy|Tám|Chín|Mười|Tiểu đồng|Chàng trai|Hiệp sĩ|Kỵ sĩ|Hoàng hậu|Nữ hoàng|Vua)\s+(?:Cốc|Chén|Ly|Kiếm|Gậy|Tiền|Đồng tiền)/giu)??[];
 if(variants.some(n=>!names.has(n.toLocaleLowerCase('vi'))))errors.push('card_name_variant');
 return errors;
}
export function voiceHardErrors(reading:ReadingOutput):string[]{
 const errors:string[]=[];
 if(/^(?:Dưới câu hỏi|Phải chăng bạn|Có thể bạn|Có lẽ bạn|Liệu)(?![\p{L}])/iu.test(reading.unsaid))errors.push('unsaid_opening');
 if(/^(?:Điều gì|Khi nào|Bạn có thể|Bạn sẵn sàng|Mấy giờ)(?![\p{L}])/iu.test(reading.question))errors.push('question_opening');
 if(wordCount(reading.question)>15)errors.push('question_length');
 if(/^Hôm nay chỉ/iu.test(reading.closing))errors.push('closing_opening');
 if(splitSentences(reading.opening).length>2)errors.push('opening_sentences');
 return errors;
}
