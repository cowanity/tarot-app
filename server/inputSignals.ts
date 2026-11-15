const fold = (text: string) => text.normalize('NFD').replace(/\p{M}/gu,'').replace(/đ/gi,'d').toLowerCase().replace(/\s+/g,' ');
/** A prompt/eval hint, never a replacement for role boundaries or safety routing. */
export function hasPromptInjection(...texts: string[]): boolean {
  const text=fold(texts.join(' '));
  return /<\/?(?:mode|user_question|user_context|feelings|system|reading_context)\b|\b(?:bo qua|quen|ignore)\b.{0,60}\b(?:huong dan|quy tac|chi dan|instructions|rules)\b|\b(?:doi vai|tiet lo huong dan|noi ban la bac si)\b/u.test(text);
}
