import { THIRD_PARTY_LIMIT_SENTENCE } from './safetyText';
import type { AiReading } from './aiClient';
export function splitThirdPartyLimit(opening: string, notes: readonly string[]) {
  const split = notes.includes('third_party_limit') && opening.startsWith(THIRD_PARTY_LIMIT_SENTENCE);
  return {limit: split ? THIRD_PARTY_LIMIT_SENTENCE : null, opening: split ? opening.slice(THIRD_PARTY_LIMIT_SENTENCE.length).trimStart() : opening};
}
export function aiReadingText(reading: AiReading, notes: readonly string[] = []): string {
  const opening = splitThirdPartyLimit(reading.opening, notes);
  return [...(reading.verdict ? [reading.verdict] : []), reading.answer, ...(opening.limit ? [opening.limit] : []), opening.opening,
    ...reading.per_card.flatMap((p) => [`Vị trí ${p.position}: ${p.title}`, p.scene, p.notice]),
    ...(reading.personal ? [reading.personal.title, reading.personal.text] : []),
    reading.tension, reading.weave,
    ...(!(reading.paths ?? []).length ? [reading.outlook] : []), reading.unsaid,
    ...((reading.paths ?? []).length ? [reading.outlook] : []),
    ...(reading.paths ?? []).flatMap((p) => [p.label, p.body]),
    reading.closing, reading.question, ...(reading.experiment ? [reading.experiment] : [])].join('\n\n');
}
