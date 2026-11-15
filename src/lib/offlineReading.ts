import {sanitizeFeelings, labelsOf, type Feelings} from './feelings';
import type { DrawnCard } from '../types';
import { feelingPrompts, reflectionTemplates, topicClosings, topicPhrases, type Feeling } from '../data/appPhrases.vi';
export interface OfflineOptions { question: string; topic: string; context: string; feelings: Feelings | readonly string[] }
const normalize = (value: string) => value.normalize('NFC').trim().replace(/\s+/gu, ' ').toLocaleLowerCase('vi');
function hash(value: string): number {
  let result = 2166136261;
  for (const char of value) result = Math.imul(result ^ char.charCodeAt(0), 16777619);
  return result >>> 0;
}
// Offline reflections have no paths/outlook predictions, personal block or numerology inference.
export function buildOfflineReading(reading: readonly DrawnCard[], options: OfflineOptions) {
  const topic = topicPhrases[options.topic] ?? topicPhrases['Tổng quan'];
  const reflections = reading.map(({ card, position }) => {
    const keyword = card.keywords.find((word) => word.trim())?.trim();
    const text = keyword
      ? reflectionTemplates[hash(`${card.id}:${position.number}`) % reflectionTemplates.length](position.name_vi, keyword, topic)
      : `Ở vị trí ${position.name_vi}, bạn muốn tự hỏi điều gì về ${topic}?`;
    return { position: position.number, text };
  });
  const shared = new Map<string, Map<string, string>>();
  for (const { card, position } of reading) {
    for (const key of new Set(card.keywords.map(normalize).filter(Boolean))) {
      if (!shared.has(key)) shared.set(key, new Map());
      shared.get(key)!.set(card.id, `${position.number}. ${position.name_vi}`);
    }
  }
  const connections = [...shared].filter(([, positions]) => positions.size >= 2)
    .map(([keyword, positions]) => `Từ khóa '${keyword}' xuất hiện ở các vị trí ${[...positions.values()].join(' và ')}.`);
  const feelings = labelsOf(sanitizeFeelings(options.feelings).ids);
  const anchor = options.context.trim() ? ', khi nhìn lại bối cảnh bạn vừa chia sẻ'
    : options.question.trim() ? ', khi trở lại câu hỏi của bạn' : '';
  const closing = [
    `${topicClosings[options.topic] ?? topicClosings['Tổng quan']}${anchor}?`,
    feelings.length
      ? `Với những cảm xúc bạn chọn (${feelings.join(', ')}), ${feelings.map((feeling) => feelingPrompts[feeling as Feeling] ?? 'bạn muốn được hỗ trợ như thế nào').join('; ')}?`
      : `Khi nghĩ về ${topic}, bạn muốn cho mình thêm thời gian hoặc sự hỗ trợ như thế nào?`,
  ];
  return { reflections, connections, closing };
}
