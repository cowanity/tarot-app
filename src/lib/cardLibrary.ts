import type {Card} from '../types';
export const FAVORITES_KEY='tarot.library.favorites.v1';
export const foldCardSearch=(text:string)=>text.normalize('NFD').replace(/\p{M}/gu,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().trim();
export function filterLibrary(cards:Card[],query:string,group:string,favorites:readonly string[],onlyFavorites=false){
 const words=foldCardSearch(query).split(/\s+/).filter(Boolean);
 return cards.filter(card=>(group==='all'||(group==='major'?card.arcana==='major':card.suit===group))&&(!onlyFavorites||favorites.includes(card.id))&&words.every(word=>foldCardSearch([card.name_vi,card.name_en,...card.keywords].join(' ')).includes(word)));
}
export function readFavorites(storage:Storage|null,validIds:readonly string[]):string[]{try{const value:unknown=JSON.parse(storage?.getItem(FAVORITES_KEY)??'[]');return Array.isArray(value)?[...new Set(value.filter((id):id is string=>typeof id==='string'&&validIds.includes(id)))]:[];}catch{return [];}}
