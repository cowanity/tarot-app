import {wordCount} from '../src/lib/readingV2';
import {VAGUE} from './answerRules';
import {splitSentences} from '../src/lib/readingStage';
import {textEntries} from './readingText';
import {isHardRule,type Diagnostic} from './guardrailPolicy';
import {CLICHES} from './languageStyle';
const patterns:Record<string,RegExp>={answer_vague:VAGUE,answer_absolute:/chắc chắn|nhất định|100\s*%|mãi mãi/iu,answer_abstract:/chuyển hóa|nền tảng|kết nối sâu|hành trình|năng lượng|chiêm nghiệm|thức tỉnh|khoảng lặng sâu/iu,cliche:new RegExp(CLICHES.join('|'),'iu'),unsaid_opening:/^(?:Dưới câu hỏi|Phải chăng bạn|Có thể bạn|Có lẽ bạn|Liệu)/iu,question_opening:/^(?:Điều gì|Khi nào|Bạn có thể|Bạn sẵn sàng|Mấy giờ)/iu};
/** Fragments are for fixed-case eval only, never production Audit. */
export function diagnose(value:unknown,rules:readonly string[],paths:readonly string[]=[]):Diagnostic[]{
 const entries=textEntries(value);
 return rules.flatMap(rule=>{
  if(['title_long','answer_long','verdict_long'].includes(rule)){const matches=entries.filter(e=>rule==='title_long'?e.path.endsWith('.title')&&e.path.startsWith('per_card.')&&wordCount(e.text)>5:e.path===(rule==='answer_long'?'answer':'verdict')&&wordCount(e.text)>(rule==='answer_long'?60:8));return matches.map(e=>({path:e.path,rule,fragment:e.text.slice(0,180),severity:'soft' as const}));}

  const prefix=rule.startsWith('personal_')?'personal':rule.startsWith('answer_')?(rule==='answer_verdict'?'verdict':''):rule.startsWith('unsaid_')?'unsaid':rule.startsWith('question_')?'question':rule.startsWith('closing_')?'closing':rule.startsWith('tension_')?'tension':rule.startsWith('notice_')?'per_card':'';
  const candidates=entries.filter(e=>prefix?e.path.startsWith(prefix):rule.startsWith('answer_')?['verdict','answer'].includes(e.path):paths.length?paths.some(p=>e.path===p||e.path.startsWith(p+'.')):true);
  const scoped=rule.startsWith('notice_')?candidates.filter(e=>e.path.endsWith('.notice')):candidates;
  const effective=rule==='answer_vague'?scoped.map(e=>({...e,text:e.path==='answer'?(splitSentences(e.text)[0]??''):e.text})):scoped;
  const matches=patterns[rule]?effective.filter(e=>patterns[rule].test(e.text)):scoped;
  return (matches.length?matches.slice(0,3):scoped.length?scoped.slice(0,3):[{path:prefix||paths[0]||'$',text:'[Trường thiếu hoặc sai cấu trúc]'}]).map(e=>({path:e.path,rule,fragment:(patterns[rule]?e.text.match(patterns[rule])?.[0]:undefined)??e.text.slice(0,180),severity:isHardRule(rule)?'hard' as const:'soft' as const}));
 });
}
