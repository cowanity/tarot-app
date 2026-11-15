let memoryId='';
export function localDay(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
export function dailyCardIndex(day:string,deviceId:string,count:number){let hash=2166136261;for(const char of `${day}|${deviceId}`)hash=Math.imul(hash^char.charCodeAt(0),16777619);return count>0?(hash>>>0)%count:0;}
export function deviceId(storage:Storage|null,random:()=>string=()=>crypto.randomUUID()){try{const id=storage?.getItem('tarot.daily-device');if(id)return id;const next=memoryId||random();memoryId=next;storage?.setItem('tarot.daily-device',next);return next;}catch{return memoryId||(memoryId=random());}}
