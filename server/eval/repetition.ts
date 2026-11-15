import type {AiReading as ReadingOutput} from '../../src/lib/readingV2';
const fields=['answer','opening','tension','unsaid','question','experiment','closing'] as const;
export function crossCaseRepetition(readings:readonly ReadingOutput[]) {
 const counts:Record<string,Record<string,number>>={};
 for(const field of fields){counts[field]={};for(const r of readings){
  const prefix=(r[field]??'').normalize('NFC').toLocaleLowerCase('vi').match(/[\p{L}\p{N}]+/gu)?.slice(0,3).join(' ');
  if(prefix)counts[field][prefix]=(counts[field][prefix]??0)+1;
 }}
 return {status: fields.some(field=>Object.values(counts[field]).some(n=>n/readings.length>1/3)) ? 'FAIL' : 'PASS', cases:readings.length,counts,repeated:fields.flatMap(field=>Object.entries(counts[field]).filter(([,count])=>count/readings.length>1/3).map(([prefix,count])=>({field,prefix,count,ratio:count/readings.length})))};
}
