import {sceneFor,containsRun} from '../voiceRules';
import {hasPromptInjection} from '../inputSignals';
import type {Feelings} from '../../src/lib/feelings';
import {splitSentences} from '../../src/lib/readingStage';
import {wordCount, type AiReading} from '../../src/lib/readingV2';
import {answerErrors, foldAnswer, isDirectionalQuestion} from '../answerRules';
import {restrictedAbstractCounts} from '../languageStyle';
import type {buildReadingContext} from '../../src/lib/readingContext';

/** Editorial diagnostics only: lexical anchors cannot prove metaphors or semantic equivalence. */
export function readingQuality(reading: AiReading, question: string, mode: 'full'|'reflective_only', positions: ReturnType<typeof buildReadingContext>['positions'], input: {context?:string;feelings?:Feelings} = {}) {
  const blocks = [reading.answer, reading.opening, reading.tension, ...reading.per_card.flatMap(c => [c.scene,c.notice]),
    ...(reading.personal ? [reading.personal.text] : []), reading.weave, reading.unsaid, reading.outlook,
    ...(reading.paths ?? []).map(p => p.body), reading.closing, reading.question, reading.experiment ?? ''].filter(Boolean);
  const paragraphs = blocks.flatMap(b=>b.split(/\n+/).filter(Boolean));
  const paragraphsWithoutShort = paragraphs.filter(p=>!splitSentences(p).some(s=>wordCount(s)<=8)).length;
  const inputSignal=foldAnswer(`${question} ${input.context ?? ''} ${input.feelings?.other ?? ''}`);
  const emotionalSignal=Boolean(input.feelings?.ids.length || input.feelings?.other?.trim()) || /\b(?:buon|dau|ton thuong|lo au|vet thuong)\b/u.test(inputSignal);
  const distressCount=emotionalSignal ? 0 : blocks.reduce((n,b)=>n+[...foldAnswer(b).matchAll(/\b(?:ton thuong|vet thuong|noi buon|noi dau)\b/gu)].length,0);
  const sentences = blocks.flatMap(splitSentences), lengths = sentences.map(wordCount);
  const short = lengths.filter(n => n <= 10).length, long = lengths.filter(n => n >= 18).length;
  const ratio = lengths.length ? short / lengths.length : 0;
  const normalizedQuestion = question.normalize('NFC');
  const quotes = [...reading.opening.normalize('NFC').matchAll(/[“"‘]([^”"’]+)[”"’]/gu)].map(m => m[1]);
  const quoteExact = quotes.some(q => wordCount(q)>=2 && wordCount(q)<=6 && normalizedQuestion.includes(q));
  const restricted = restrictedAbstractCounts(blocks);
  const metaphorHints = (text: string) => [...foldAnswer(text).matchAll(/\b(?:nhu|tua|giong nhu|het nhu)\b/g)].length;
  const imagery = reading.per_card.map(c => {
    const source = positions.find(p => p.number === c.position);
    const anchors = source?.symbols ?? [];
    const scene = foldAnswer(c.scene);
    return {position:c.position, sourceSymbolCount:anchors.length,
      anchored:anchors.some(a => scene.includes(foldAnswer(a))), comparisonMarkers:metaphorHints(c.scene), requiresHumanReview:true};
  });
  const contentWords = (text: string) => foldAnswer(text).split(/[^a-z0-9]+/).filter(w => w.length>2 && !['ban','cua','mot','nhung','nhieu','nhu','the','voi','nay','khi','cho','trong'].includes(w));
  const answerWords = new Set(contentWords(reading.answer));
  return {
    answer: {errors:answerErrors(reading.answer,question,mode,reading.verdict), words:wordCount(reading.answer), directionalQuestion:isDirectionalQuestion(question)},
    unsupportedDistress:{count:distressCount, hasInputSignal:emotionalSignal, requiresHumanReview:true},
    openingQuote: hasPromptInjection(question,input.context??'',input.feelings?.other??'') ? 'not_applicable_injection' : wordCount(question)<2 ? 'not_applicable' : quoteExact ? 'exact_match' : 'review',
    rhythm:{sentences:lengths.length, short, long, shortRatio:Number(ratio.toFixed(3)), paragraphs:paragraphs.length, paragraphsWithoutShort, informationalOnly:true, targetMet:short>0 && long>0 && ratio>=.30 && ratio<=.60 && paragraphsWithoutShort===0},
    restrictedAbstract:restricted, abstractTargetMet:Object.values(restricted).every(n=>n<=1),
    imagery:{cards:imagery, paragraphsOverOneComparison:blocks.flatMap(b=>b.split(/\n\s*\n/)).filter(b=>metaphorHints(b)>1).length, requiresHumanReview:true},
    closingEcho:{sharedWords:[...new Set(contentWords(reading.closing).filter(w=>answerWords.has(w)))].length, requiresHumanReview:true},
  };
}

import {imageryFor} from '../cardImagery';
import {exampleWords} from '../prompts/goldenExamples';
import {crossCaseRepetition} from './repetition';
export type VoiceCase = {calls?:number;tokens?:number;seconds?:number;notes?:string[];id:number; reading?:AiReading; scores?:number[]; status:string; exampleId?:string; exampleParrot?:boolean};
/** Provisional lexical rubric, never a semantic judge or a production guardrail. */
export function voiceScores(reading:AiReading,question:string,mode:'full'|'reflective_only',positions:ReturnType<typeof buildReadingContext>['positions']) {
 const q=readingQuality(reading,question,mode,positions);
 const overlap=(a:string,b:string,n:number)=>{const x=exampleWords(a),y=exampleWords(b).join(' ');return x.some((_,i)=>i+n<=x.length&&y.includes(x.slice(i,i+n).join(' ')));};
 const scenes=reading.per_card.every(c=>{const p=positions.find(p=>p.number===c.position);return p&&c.scene===sceneFor(p.card.id,p.orientation==='reversed')&&!containsRun(c.notice,imageryFor(p.card.id),4);});
 const answerAnchored=exampleWords(question).some(w=>w.length>2&&new Set<string>(exampleWords(reading.answer)).has(w));
 const blocks=[reading.opening,...reading.per_card.map(c=>c.scene),reading.weave,reading.unsaid,reading.closing];
 const rhythm=blocks.every(b=>splitSentences(b).some(s=>wordCount(s)<=10)&&splitSentences(b).some(s=>wordCount(s)>10));
 return [
  Number(splitSentences(reading.answer).length<=2&&q.answer.errors.length===0&&Boolean(reading.verdict)),
  Number(!question.trim()||hasPromptInjection(question)||overlap(question,reading.opening,2)),
  Number(scenes),Number(rhythm),
  Number(!/^(?:Dưới câu hỏi|Phải chăng bạn|Có thể bạn|Có lẽ bạn|Liệu)/iu.test(reading.unsaid)&&!/bạn (?:đã từng|từng bị)|quá khứ của bạn/u.test(reading.unsaid.toLowerCase())),
  Number((!reading.experiment||wordCount(reading.experiment)<=30&&!/tuần|tháng|năm/u.test(reading.experiment))&&!/chắc chắn|nhất định|sẽ /u.test(reading.closing.toLowerCase())),
  Number(!question.trim()||answerAnchored),
 ];
}
export function voiceReport(rows:VoiceCase[]):string {
 const available=rows.filter((r):r is VoiceCase & {reading:AiReading}=>Boolean(r.reading));
 const repetition=crossCaseRepetition(available.map(r=>r.reading));
 const repeated=repetition.repeated.filter(r=>r.count>1&&r.ratio>1/3);
 const headings=['Verdict hợp lệ và có lập trường','Phản chiếu đầu vào','Scene đúng hoàn toàn, notice không chép','Xen nhịp (tham khảo)','Quan sát dè dặt','Việc nhỏ, không hứa','Lý do answer bám từ trong câu hỏi','Không lặp đầu câu'];
 const lines=['# EVAL VOICE','', 'Điểm 0/1 là sàng lọc từ vựng tạm thời, không chứng minh đúng ý hay chất thơ. Cần người đọc duyệt mục 1–6, đặc biệt chi tiết ngoài mô tả, bịa chuyện và ẩn dụ. Dấu — là chưa có bài hợp lệ; không tính thành 0.','', '| Ca | Gọi | Token | Giây | Notes | Trạng thái | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | Tổng | Mục trượt | Mẫu / chép mẫu |','|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|'];
 for(const row of rows){
  if(!row.reading||!row.scores){lines.push(`| ${row.id} | ${row.calls??0} | ${row.tokens??0} | ${(row.seconds??0).toFixed(2)} | ${(row.notes??[]).join(', ')||'—'} | ${row.status} | — | — | — | — | — | — | — | — | — | Chưa chấm | — |`);continue;}
  const repeatHit=repeated.some(r=>exampleWords(row.reading![r.field as 'answer']??'').slice(0,3).join(' ')===r.prefix);
  const scores=[...row.scores,Number(!repeatHit)];
  lines.push(`| ${row.id} | ${row.calls??0} | ${row.tokens??0} | ${(row.seconds??0).toFixed(2)} | ${(row.notes??[]).join(', ')||'—'} | ${row.status} | ${scores.join(' | ')} | ${scores.filter((_,i)=>i!==3).reduce((a,b)=>a+b,0)}/7 | ${scores.flatMap((n,i)=>n||i===3?[]:[i+1]).join(', ')||'Không'} | ${row.exampleId??'—'} / ${row.exampleParrot?'Có':'Không'} |`);
 }
 const average=rows.reduce((n,r)=>n+(r.calls??0),0)/(rows.length||1);const times=rows.map(r=>r.seconds??0).sort((a,b)=>a-b);const p95=times[Math.max(0,Math.ceil(times.length*.95)-1)]??0;
 lines.push('',`Trung bình ${average.toFixed(2)} lần gọi/bài (mục tiêu ≤2,5: ${average<=2.5?'đạt':'chưa đạt'}); p95 ${p95.toFixed(2)} giây (mục tiêu ≤20: ${p95<=20?'đạt':'chưa đạt'}).`,'Rhythm chỉ tham khảo, không tính vào tổng hoặc mục trượt.');
 for(const phrase of ['Ra ngoài đi bộ','Viết ra một']){const count=available.filter(r=>r.reading.experiment.toLocaleLowerCase('vi').startsWith(phrase.toLocaleLowerCase('vi'))).length;lines.push(`Experiment “${phrase}”: ${count}/${available.length}; ${count/(available.length||1)<=1/3?'đạt':'vượt 1/3'}.`);}
 lines.push('','## Tiêu chí',...headings.map((h,i)=>`${i+1}. ${h}.`),'','## Cụm đầu câu lặp trên 1/3 số bài hợp lệ', ...(repeated.length?repeated.map(r=>`- ${r.field}: “${r.prefix}” — ${r.count}/${available.length} bài.`):['Chưa thấy cụm lặp, hoặc chưa đủ bài để đánh giá.']), '', 'Mục 3 kiểm scene khớp mô tả server 100% và không có chuỗi 4 từ chép trong notice. Mục 4 dùng độ dài câu làm chỉ báo, không nhận diện thơ. Mục 6 cần duyệt tính khả thi trong một ngày.', '');
 return lines.join('\n');
}
