const fold=(text:string)=>text.normalize('NFD').replace(/\p{M}/gu,'').replace(/đ/gi,'d').toLowerCase().replace(/\s+/g,' ');
// Unicode boundaries avoid treating "mê", "bỏ", "sơ", "nghĩ" as people after accent folding.
const subject='(?:anh ấy|anh ta|cô ấy|cô ta|họ|người ấy|đối phương|người kia|người yêu(?: cũ)?|crush|bạn trai|bạn gái|chồng|vợ|sếp|đồng nghiệp(?: của bạn)?|mẹ|bố)';
const predicate='(?:đã|nhắn|gọi|yêu|thích|nghĩ|muốn|định|sẽ|cảm thấy|còn tình cảm|quay lại|nhớ|có ý|ngoại tình|lừa dối|giả vờ|thao túng|ghét|nói dối)';
const relation=new RegExp(`(?<![\\p{L}])${subject}(?![\\p{L}])(?:\\s+(?:của bạn|có vẻ|có thể|có lẽ|có|đang|vẫn|còn|không|chắc chắn|nhất định|sẽ|rất))*\\s+${predicate}(?![\\p{L}])`,'iu');
export function isThirdPartyQuestion(question:string,context=''):boolean {
 return relation.test(`${question} ${context}`.normalize('NFC'));
}
export function thirdPartyBoundaryCount(text:string):number {
 return [...fold(text).matchAll(/\b(?:khong phai doc long|khong doc duoc long|khong the doc long|khong cho biet (?:nguoi kia|anh ay|co ay|ho) (?:nghi|cam thay)|khong the biet (?:nguoi kia|anh ay|co ay|ho) (?:nghi|cam thay))\b/gu)].length;
}
export type ThirdPartyFlag = {rule:string; severity:'hard'|'soft';fragment:string};
export function classifyThirdParty(text:string): ThirdPartyFlag[] {
 return text.normalize('NFC').split(/[.!?;\n]/u).flatMap((fragment):ThirdPartyFlag[]=>{
  if(/\bkhong (?:cho biet|the biet|doc duoc|the doc|the noi)|khong phai doc long/u.test(fold(fragment))&&!/\b(?:nhung|tuy nhien)\b/u.test(fold(fragment)))return [];
  const plain=fold(fragment);
  const person='(?:anh ấy|anh ta|cô ấy|cô ta|họ|người ấy|đối phương|người kia|người yêu|chồng|vợ|sếp|đồng nghiệp)';
  const concrete=new RegExp(`${person}\\s+(?:(?:chắc chắn|nhất định|có thể|có vẻ|đã|sắp|sẽ|đang|vẫn)\\s+)*(?:nhắn|gọi|nghĩ|nói|quyết định|đến gặp|rời bỏ|theo dõi|gửi|hẹn|gặp|lừa dối|giả vờ|thao túng|ngoại tình)|${person}\\s+(?:đã|sắp|sẽ)\\s+`,'iu').test(fragment);
  if(concrete)return [{rule:'tp_action_fact',severity:'hard' as const,fragment:fragment.trim()}];
  if(!relation.test(fragment))return [];
  if(/\b(?:chac chan|nhat dinh|dam bao)\b/u.test(plain))return [{rule:'tp_certainty',severity:'hard' as const,fragment:fragment.trim()}];
  const framed=/bài cho thấy|các lá cho thấy|theo bài|nghiêng về|có vẻ|dường như|có lẽ|có thể|nếu|gợi/iu.test(fragment);
  const advice=/^(?:chưa nên|nên|đừng)/iu.test(fragment.trim());
  return framed||advice?[]:[{rule:'tp_feeling_unframed',severity:'soft' as const,fragment:fragment.trim()}];
 });
}
export function unsafeThirdParty(text:string):boolean { return classifyThirdParty(text).some(f=>f.severity==='hard'); }

/** Mask only source-matched spans. Keep boundaries so unrelated model claims stay separate. */
export function maskUserEchoes(text:string, inputs:readonly string[]):string {
 const value=text.normalize('NFC');
 const sources=inputs.map(s=>s.normalize('NFC'));
 const spans:{start:number;end:number}[]=[];
 const tokens=(s:string)=>[...s.matchAll(/[\p{L}\p{N}]+/gu)].map(m=>({word:m[0].toLocaleLowerCase('vi'),start:m.index!,end:m.index!+m[0].length}));
 const out=tokens(value), original=sources.map(tokens);
 for(const match of value.matchAll(/“([^”]*)”|"([^"]*)"/gu)){
  const quote=(match[1]??match[2]).trim();
  if(quote && sources.some(s=>s.includes(quote)))spans.push({start:match.index!,end:match.index!+match[0].length});
 }
 const index=new Map<string,{source:ReturnType<typeof tokens>;at:number}[]>();
 for(const source of original)for(let at=0;at+2<source.length;at++){
  const key=source.slice(at,at+3).map(t=>t.word).join('\0');
  index.set(key,[...(index.get(key)??[]),{source,at}]);
 }
 for(let i=0;i+2<out.length;i++){
  const key=out.slice(i,i+3).map(t=>t.word).join('\0');
  for(const {source,at} of index.get(key)??[]){
   let length=3;while(i+length<out.length&&at+length<source.length&&out[i+length].word===source[at+length].word)length++;
   spans.push({start:out[i].start,end:out[i+length-1].end});
  }
 }
 const chars=value.split('');
 for(const span of spans)for(let i=span.start;i<span.end;i++)if(!/[.!?;\n]/u.test(chars[i]))chars[i]=' ';
 return chars.join('');
}
/** Only model-written fragments leave this function. Never put them in server audit. */
export function thirdPartyFlags(text:string,inputs:readonly string[]=[]):ThirdPartyFlag[] {
 const source=text.normalize('NFC'),masked=maskUserEchoes(source,inputs);
 return [...source.matchAll(/[^.!?;\n]+/gu)].flatMap(match=>{
  const rest=masked.slice(match.index!,match.index!+match[0].length).trim();
  if(!rest)return [];
  const direct=classifyThirdParty(rest);
  if(direct.length)return direct;
  if(!relation.test(match[0]))return [];
  return classifyThirdParty(`người kia ${rest}`).map(f=>({...f,fragment:rest.replace(/\s+/gu,' ').trim()}));
 });
}
export function thirdPartyFragments(text:string,inputs:readonly string[]=[]):string[] {
 return thirdPartyFlags(text,inputs).filter(f=>f.severity==='hard').map(f=>f.fragment);
}

/** Coercive advice is separate from third_party: self-directed sentences are never third-party claims. */
export function isCoerciveAdvice(text:string):boolean {
 const plain=fold(text);
 return /\b(?:hay|nen|can|thu|co the)\b.{0,60}\b(?:thu long|ep.{0,30}doi chat|theo doi (?:anh ay|co ay|ho|nguoi ay|doi phuong))\b/u.test(plain) && !/\bkhong (?:nen|can|duoc|khuyen)\b/u.test(plain);
}
