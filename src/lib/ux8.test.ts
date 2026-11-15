import {readFileSync} from 'node:fs';
import {expect,test,vi} from 'vitest';
import {dailyCardIndex,localDay,deviceId} from './dailyCard';
import {quickMeaning} from './cardQuick';
import {shareText,wrapText} from './shareImage';
import {readHistoryNames,renameHistory} from './historyNames';
const memory=()=>{const m=new Map<string,string>();return {getItem:(k:string)=>m.get(k)??null,setItem:(k:string,v:string)=>m.set(k,v)} as unknown as Storage;};
test('daily local date and device seed are stable, in range',()=>{const date=new Date(2026,9,18,23,59);expect(localDay(date)).toBe('2026-10-18');const s=memory();const id=deviceId(s,()=> 'device');expect(deviceId(s,()=> 'different')).toBe(id);const n=dailyCardIndex(localDay(date),id,78);expect(n).toBe(dailyCardIndex('2026-10-18',id,78));expect(n).toBeGreaterThanOrEqual(0);expect(n).toBeLessThan(78);expect(new Set(Array.from({length:30},(_,i)=>dailyCardIndex(`2026-10-${i}`,id,78))).size).toBeGreaterThan(10);});
test('quick text optional by id/direction, fallback retains original',()=>{const card={id:'x',summary_up:'Xuôi gốc',summary_rev:'Ngược gốc'};expect(quickMeaning(card,false,{})).toBe('Xuôi gốc');expect(quickMeaning(card,true,{x:{up:'Ngắn'}})).toBe('Ngược gốc');expect(quickMeaning(card,false,{x:{up:'Ngắn'}})).toBe('Ngắn');});
test('share excludes question by default, first sentence only; lines fit',()=>{expect(shareText('Nên đợi','Một câu. Câu hai.','Riêng tư')).toEqual({verdict:'Nên đợi',sentence:'Một câu.'});expect(shareText('','','Riêng tư',true)).toHaveProperty('question','Riêng tư');for(const line of wrapText('abc defghijklmnopqrstuvwxyz',5,s=>s.length))expect(line.length).toBeLessThanOrEqual(5);});
test('history names local, bounded and storage errors handled',()=>{const s=memory();expect(renameHistory(s,'r',' Tên riêng ')).toBe(true);expect(readHistoryNames(s)).toEqual({r:'Tên riêng'});renameHistory(s,'r','');expect(readHistoryNames(s)).toEqual({});expect(renameHistory(null,'r','x')).toBe(false);const fail={getItem:vi.fn(()=>{throw Error();})} as unknown as Storage;expect(readHistoryNames(fail)).toEqual({});});
function luminance(hex:string){const [r,g,b]=hex.match(/\w\w/g)!.map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return r*.2126+g*.7152+b*.0722;}
test('new text token combinations have >=4.5 contrast',()=>{for(const bg of ['#1a1033','#07050f','#171021','#21152e'])for(const fg of ['#ece6f7','#c4b4d8','#e4c582'])expect((luminance(fg)+.05)/(luminance(bg)+.05)).toBeGreaterThanOrEqual(4.5);});

test('actual theme reading tokens meet contrast on panel backgrounds',()=>{const css=readFileSync('src/theme.css','utf8');for(const token of ['--reading-text','--reading-muted']){const fg=css.match(new RegExp(`${token}:\\s*(#[a-f0-9]{6})`,'i'))?.[1];expect(fg).toBeTruthy();for(const bg of ['#1a1033','#171021','#21152e'])expect((luminance(fg!)+.05)/(luminance(bg)+.05)).toBeGreaterThanOrEqual(4.5);}});
