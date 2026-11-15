import {expect,test} from 'vitest';
import {cards} from '../data';
import {filterLibrary,readFavorites,foldCardSearch} from './cardLibrary';
test('search handles Vietnamese accents and English names',()=>{
 const card=cards.find(c=>c.id==='major-18-moon')!;
 expect(filterLibrary(cards,foldCardSearch(card.name_vi),'all',[])).toContain(card);
 expect(filterLibrary(cards,card.name_en,'all',[])).toContain(card);
 expect(foldCardSearch('ĐƯỜNG')).toBe('duong');
});
test('filters compose with favorites and queries',()=>{
 const card=cards.find(c=>c.suit==='cups')!;
 expect(filterLibrary(cards,'','cups',[card.id],true)).toEqual([card]);
 expect(filterLibrary(cards,'','major',[card.id],true)).toEqual([]);
 expect(filterLibrary(cards,'','all',[])).toHaveLength(78);
 expect(filterLibrary(cards,'zzzznotfound','all',[])).toEqual([]);
});
test('stored favorites tolerate unavailable, corrupt and stale storage',()=>{
 const ids=cards.map(c=>c.id);
 const storage=(raw:string)=>({getItem:()=>raw}) as unknown as Storage;
 expect(readFavorites(null,ids)).toEqual([]);
 expect(readFavorites(storage('{bad'),ids)).toEqual([]);
 expect(readFavorites(storage(JSON.stringify([ids[0],ids[0],'missing',42])),ids)).toEqual([ids[0]]);
 expect(readFavorites({getItem:()=>{throw new Error();}} as unknown as Storage,ids)).toEqual([]);
});
