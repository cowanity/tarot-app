/** Shared contract only: no provider or book content enters this module. */
export const READING_LIMITS = {
  verdict: 160, answer: 520, headline: 70, opening: 1600, tension: 900, title: 120, scene: 1600, notice: 400,
  weave: 1600, unsaid: 900, outlook: 900, label: 120, body: 1400, closing: 300, question: 400, experiment: 240,
} as const;
export const wordCount = (text: string) => text.trim() ? text.trim().split(/\s+/u).length : 0;
export interface ReadingV2 {
  personal?: {title: string; text: string};
  verdict: string;
  answer: string; headline: string; opening: string; tension: string;
  per_card: {position: number; title: string; scene: string; notice: string}[];
  weave: string; unsaid: string; outlook: string;
  paths: {label: string; body: string}[];
  closing: string; question: string; experiment: string;
}

/** Compatibility view for readings saved before verdict was introduced. */
export type AiReading = Omit<ReadingV2, 'verdict'> & {verdict?: string};
