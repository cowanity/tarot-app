import type {SavedReading} from './history';
import {storedFeelings} from './feelings';
export type FeedbackMode = 'offline'|'full'|'reflective_only'|'care';
export interface ReadingFeedback {position:number|null; mode:FeedbackMode; rating:'yes'|'no'}
/** Only catalog positions and fixed metadata enter local feedback. */
export function sanitizeFeedback(raw:unknown, positions:readonly number[]):ReadingFeedback[] {
  if(!Array.isArray(raw)) return [];
  const selected=new Map<string,ReadingFeedback>();
  for(const value of raw.slice(0,400)) {
    if(!value||typeof value!=='object')continue;
    const {position,mode,rating}=value;
    if(position!==null&&(!Number.isInteger(position)||!positions.includes(position)))continue;
    if(!['offline','full','reflective_only','care'].includes(mode)||!['yes','no'].includes(rating))continue;
    selected.set(`${mode}:${position}`,{position,mode,rating});
  }
  return [...selected.values()];
}
export function feedbackText(readings:readonly SavedReading[], includeQuestion=false):string {
  return readings.filter(r=>r.feedback?.length).map(r=>{
    const f=storedFeelings(r.feelings);
    // Explicit projection: never export context, other, generated text or profile.
    return JSON.stringify({
      cards:r.cards.map(c=>({position:c.position,cardId:c.cardId})),
      feelings:f.ids, ...(f.want?{want:f.want}:{}), ...(f.duration?{duration:f.duration}:{}),
      feedback:sanitizeFeedback(r.feedback,r.cards.map(c=>c.position)),
      ...(includeQuestion?{question:r.question}:{})
    });
  }).join('\n');
}
