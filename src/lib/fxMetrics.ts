import type {EffectLevel} from './settings';
export type Metrics={fps:number;level:EffectLevel;particles:number;downgrades:number;jsMs:number};
let value:Metrics={fps:0,level:'full',particles:0,downgrades:0,jsMs:0};const listeners=new Set<()=>void>();
export const getFxMetrics=()=>value;
export function publishFxMetrics(patch:Partial<Metrics>){value={...value,...patch};listeners.forEach(fn=>fn());}
export function subscribeFxMetrics(fn:()=>void){listeners.add(fn);return()=>{listeners.delete(fn);};}
