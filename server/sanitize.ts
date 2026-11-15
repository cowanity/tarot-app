import {splitSentences} from '../src/lib/readingStage';
import {imageryFor} from './cardImagery';
import type {DrawnCard} from '../src/types';
export function sanitizeText(text:string):string {
 let out=text.normalize('NFC').replace(/\s+/gu,' ').trim();
 const repeat=/(\p{L}+)(\s+)\1(?=$|[^\p{L}])/giu;
 for(let previous='';previous!==out;){previous=out;out=out.replace(repeat,'$1');}
 return out.replace(/(^|[.!?]\s+)([“"‘']?)(\p{L})/gu,(_,start,quote,letter:string)=>start+quote+letter.toLocaleUpperCase('vi'));
}
export function sanitizeValue(value:unknown):unknown {
 if(typeof value==='string')return sanitizeText(value);
 if(Array.isArray(value))return value.map(sanitizeValue);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,sanitizeValue(v)]));
 return value;
}
const objects=['chó','sư tử','ngựa','chim','rắn','cá','cừu','bò','đại bàng','tàu','thuyền','lâu đài','hoa hồng','hoa huệ','gậy','kiếm','chén','cốc','đồng xu','xích','bàn tay','con đường'];
const includesWord=(text:string,word:string)=>new RegExp(`(?<![\\p{L}])${word}(?![\\p{L}])`,'iu').test(text);
export function trimNoticeImages(value:unknown,drawn:readonly DrawnCard[]):{value:unknown;notes:string[]} {
 const notes:string[]=[];
 if(!value||typeof value!=='object'||!('per_card' in value)||!Array.isArray(value.per_card))return {value,notes};
 const per_card=value.per_card.map((item:unknown)=>{
  if(!item||typeof item!=='object'||!('notice' in item)||typeof item.notice!=='string'||!('position' in item))return item;
  const card=drawn.find(d=>d.position.number===item.position);if(!card)return item;
  const sentences=splitSentences(item.notice);if(sentences.length<2)return item;
  const source=imageryFor(card.card.id), image=sentences[1];
  const absent=objects.some(word=>includesWord(image,word)&&!includesWord(source,word));
  const counted=/(?<![\p{L}])(?:\d+|một|hai|ba|bốn|năm|sáu|bảy|tám|chín|mười)\s+(?:(?:con|cây|chiếc|bông|đàn|đầu)\s+)?(?:chó|sư tử|ngựa|chim|rắn|cá|cừu|bò|đại bàng|tàu|thuyền|lâu đài|hoa|gậy|kiếm|chén|cốc|đồng xu|vật|cột|tay|chân|xích|đường)(?![\p{L}])/iu.test(image);
  if(!absent&&!counted)return item;
  notes.push('notice_image_trimmed');return {...item,notice:[sentences[0],...sentences.slice(2)].join(' ')};
 });
 return {value:{...value,per_card},notes:[...new Set(notes)]};
}
