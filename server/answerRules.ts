import {isThirdPartyQuestion, thirdPartyBoundaryCount, unsafeThirdParty} from './thirdParty';
import {splitSentences} from '../src/lib/readingStage';
import {wordCount} from '../src/lib/readingV2';
export const foldAnswer = (text: string) => text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g,'d').replace(/\s+/g,' ').trim();
export const VERDICTS = ['Có','Không','Nên','Đừng','Chưa nên'] as const;
export function isDirectionalQuestion(question: string): boolean {
 const text=foldAnswer(question);
 return !/\b(?:khi nao|bao gio|vi sao|tai sao|the nao)\b/u.test(text) && (/\b(?:lieu|co nen)\b/u.test(text)||/\bco\b[^.!?]*\bkhong\b/u.test(text)||/\b(?:duoc|on|thanh cong|quay lai)\s+khong\b/u.test(text));
}
export const VAGUE = /(?<![\p{L}])(?:chưa rõ|không rõ|khó nói|khó đoán|tùy|chưa thể kết luận)(?![\p{L}])/iu;
export function hasAnswerDirection(answer:string):boolean {return /^(?:có|không|nên|đừng|chưa nên)(?![\p{L}])/iu.test(answer.normalize('NFC').trim());}
export const hasAdvice=(text:string)=>/(?<![\p{L}])(?:có|không|nên|đừng|chưa|hãy)(?![\p{L}])/iu.test(text.normalize('NFC').replace(/(?<![\p{L}])có\s+(?:nỗi|sự|điều|một|những|cảm xúc)(?![\p{L}])/giu,''));
export function answerErrors(answer:string,question:string,mode:'full'|'reflective_only'|'care',verdict?:string):string[] {
 const text=foldAnswer(`${verdict??''} ${answer}`), errors:string[]=[];
 if(!answer.trim()||verdict==='')errors.push('answer_missing');
 if(VAGUE.test((verdict??'').normalize('NFC'))||VAGUE.test((splitSentences(answer)[0]??'').normalize('NFC')))errors.push('answer_vague');
 if(/\b(?:chac chan|nhat dinh|se xay ra|mai mai)\b|100\s*%/u.test(text))errors.push('answer_absolute');
 if(/\b\d{1,4}[-/.]\d{1,2}(?:[-/.]\d{1,4})?\b|\b(?:ngay|thang|nam)\s+\d+\b/u.test(text))errors.push('answer_date');
 if(splitSentences(answer).length>3)errors.push('answer_sentences');
 if(mode==='full'&&isDirectionalQuestion(question)&&/^(?:co the|co le|nghieng ve|luc nay co the)\b/u.test(foldAnswer(answer)))errors.push('answer_hedged');
 if(wordCount(answer)>(mode==='care'?60:90)||(mode!=='care'&&answer.length>520))errors.push('answer_length');
 if(mode!=='care'&&wordCount(answer)>60)errors.push('answer_long');
 if(mode!=='care'&&verdict!==undefined&&wordCount(verdict)>8)errors.push('verdict_long');
 if(verdict!==undefined){
  if(mode==='full'&&isDirectionalQuestion(question)){
   if(!verdict.trim()||!hasAdvice(verdict)||wordCount(verdict)>8)errors.push('answer_verdict');
  }else if(wordCount(verdict)<3||wordCount(verdict)>8||VERDICTS.some(v=>v===verdict))errors.push('answer_verdict');
  if(mode==='full'&&/\b(?:khi nao|bao gio)\b/u.test(foldAnswer(question))&&!/\b(?:ngay|tuan|thang|mua|nam|som|muon|sau|truoc|toi)\b/u.test(foldAnswer(verdict)))errors.push('answer_time');
 }
 if(mode==='full'&&isDirectionalQuestion(question)&&!hasAdvice(verdict??answer))errors.push('answer_direction');
 if(/^nghiêng về/iu.test(verdict??'')||/^nghiêng về/iu.test(answer))errors.push('answer_hedged');
 if(verdict?.trim()&&foldAnswer(answer).startsWith(foldAnswer(verdict)))errors.push('answer_repeats_verdict');
 if(/chuyển hóa|nền tảng|kết nối sâu|hành trình|năng lượng|chiêm nghiệm|thức tỉnh|khoảng lặng sâu/iu.test(`${verdict??''} ${answer}`))errors.push('answer_abstract');
 if(!isThirdPartyQuestion(question)&&thirdPartyBoundaryCount(answer)>0)errors.push('answer_boundary_unexpected');
 if(isThirdPartyQuestion(question)&&unsafeThirdParty(answer))errors.push('answer_third_party_boundary');
 return [...new Set(errors)];
}
