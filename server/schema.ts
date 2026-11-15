import { cards } from '../src/data';
import { z } from 'zod';
import { READING_LIMITS as L, wordCount } from '../src/lib/readingV2';
import {FEELINGS, sanitizeFeelings} from '../src/lib/feelings';
const cardId = z.string().min(1).max(80).refine((id) => cards.some((card) => card.id === id));
const majorNumber = z.number().int().min(1).max(22);
const facetNumber = z.number().int().min(1).max(11);
export const profileSchema = z.object({
  birthCard: majorNumber, yearCard: majorNumber, nameCard: majorNumber.nullable(),
  facets: z.object({soul: facetNumber, lesson: facetNumber, gift: z.number().int().min(0).max(11), purpose: facetNumber}).strict(),
  resonance: z.array(z.object({cardId, via: z.enum(['birth', 'year', 'name']), role: z.enum(['main', 'companion'])}).strict()).max(9),
}).strict();
export const feelingsSchema = z.object({
  ids: z.array(z.string().max(32).refine(id => FEELINGS.some(f => f.id === id))).max(3).refine(ids => new Set(ids).size === ids.length),
  other: z.string().max(40).optional(),
  intensity: z.number().int().min(1).max(5).optional(),
  want: z.enum(['clarity','comfort','decision','listen','curious']).optional(),
  duration: z.enum(['new','weeks','months','long']).optional(),
}).strict().transform(sanitizeFeelings);
export const inputSchema = z.object({
  profile: profileSchema.optional(),
  question: z.string().max(500), context: z.string().max(300),
  feelings: feelingsSchema,
  topic: z.enum(['Tình yêu', 'Sự nghiệp', 'Tài chính', 'Bản thân', 'Tổng quan']),
  spreadId: z.string().min(1).max(80),
  picks: z.array(z.object({position: z.number().int(), cardId: z.string().min(1).max(80), reversed: z.boolean()}).strict()).min(1).max(78),
}).strict();
const text = (max: number) => z.string().trim().min(1).max(max);
const short = (max: number, words: number) => text(max).refine((v) => wordCount(v) <= words, {message: `Tối đa ${words} phần cách nhau bằng khoảng trắng`});
const pathSchema = z.object({label: short(L.label, 8), body: text(L.body)}).strict();
export const fullModelSchema = z.object({
  personal: z.object({title: text(60), text: text(700).min(200)}).strict().optional(),
  verdict: short(L.verdict, 12), answer: short(L.answer, 90), headline: text(L.headline), opening: text(L.opening), tension: text(L.tension),
  per_card: z.array(z.object({position: z.number().int().positive(), title: short(L.title, 8), scene: text(L.scene), notice: text(L.notice)}).strict()).min(1).max(78),
  weave: text(L.weave), unsaid: z.string().trim().max(L.unsaid), outlook: text(L.outlook),
  paths: z.tuple([pathSchema, pathSchema]), closing: short(L.closing, 36), question: text(L.question),
  experiment: z.string().trim().max(L.experiment).refine((v) => wordCount(v) <= 30, {message: 'Tối đa 30 phần cách nhau bằng khoảng trắng'}),
}).strict();
export const wireModelSchema = fullModelSchema.extend({per_card: z.array(fullModelSchema.shape.per_card.element.omit({scene:true})).min(1).max(78)});
export const reflectiveModelSchema = wireModelSchema.omit({outlook: true, paths: true});
export const modelOutputSchema = z.discriminatedUnion('mode', [
  z.object({mode: z.literal('full'), reading: wireModelSchema}),
  z.object({mode: z.literal('reflective_only'), reading: reflectiveModelSchema}),
  z.object({mode: z.literal('care'), reading: z.object({verdict: text(L.verdict), answer: short(L.answer, 45)}).strict()}),
]);
// Final server response includes application-owned outlook and zero paths in reflective mode.
export const outputSchema = fullModelSchema.extend({paths: z.array(pathSchema).refine(p => p.length === 0 || p.length === 2)});
export type Input = z.infer<typeof inputSchema>;
export type ReadingOutput = z.infer<typeof outputSchema>;
export type Mode = 'full' | 'reflective_only';
