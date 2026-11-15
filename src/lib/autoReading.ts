import type {AiPayload} from './aiClient';
export const AUTO_READING_KEY='tarot.auto-reading.v1';
export function sessionStore():Storage|null {try{return window.sessionStorage;}catch{return null;}}
export function createAutoReadingGate(storage:Pick<Storage,'getItem'|'setItem'>|null) {
  const seen=new Set<string>();
  try {const saved:unknown=JSON.parse(storage?.getItem(AUTO_READING_KEY)??'[]');if(Array.isArray(saved))for(const id of saved)if(typeof id==='string')seen.add(id);}catch{/* memory fallback */}
  return {claim(input:{id:string;fresh:boolean;enabled:boolean;ready:boolean;readOnly?:boolean;hasReading?:boolean}) {
    if(!input.id||!input.fresh||!input.enabled||!input.ready||input.readOnly||input.hasReading||seen.has(input.id))return false;
    seen.add(input.id);try{storage?.setItem(AUTO_READING_KEY,JSON.stringify([...seen]));}catch{/* never retry a claim just because storage failed */}
    return true;
  }};
}
export function autoPayloadReady(payload:AiPayload,count:number):boolean {
  return typeof payload.question==='string'&&payload.question.length<=500&&typeof payload.context==='string'&&payload.context.length<=300
    && Boolean(payload.spreadId)&&count>0&&payload.picks.length===count
    && payload.picks.every(p=>Number.isInteger(p.position)&&Boolean(p.cardId)&&typeof p.reversed==='boolean')
    && new Set(payload.picks.map(p=>p.position)).size===count&&new Set(payload.picks.map(p=>p.cardId)).size===count;
}
