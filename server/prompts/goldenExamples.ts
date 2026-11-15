import samples from './golden_v1.json';
import {readingStrings} from '../readingText';
export const GOLDEN_EXAMPLES=samples.map(e=>({...e,text:JSON.stringify({input:e.input,output:e.output})}));
export function selectGoldenExample(want?:string){return GOLDEN_EXAMPLES.find(e=>e.id===(want==='decision'?'decision-work':want==='listen'||want==='comfort'?'listen-breakup':'clarity-third-party'))!;}
export const exampleWords=(text:string)=>text.normalize('NFC').toLocaleLowerCase('vi').match(/[\p{L}\p{N}]+/gu)??[];
/** Match six contiguous words, preserving Vietnamese accents. Never join separate output fields. */
export function exampleParrot(output:unknown,example:{text:string}):boolean {
  const source=exampleWords(example.text),phrases=new Set<string>();
  for(let i=0;i+6<=source.length;i++)phrases.add(source.slice(i,i+6).join(' '));
  const modelOnly=output&&typeof output==='object'&&!Array.isArray(output)&&'per_card' in output ? {...output,per_card:Array.isArray(output.per_card)?output.per_card.map(({scene:_scene,...rest})=>rest):output.per_card}:output;
  return readingStrings(modelOnly).some(text=>{const words=exampleWords(text);for(let i=0;i+6<=words.length;i++)if(phrases.has(words.slice(i,i+6).join(' ')))return true;return false;});
}
