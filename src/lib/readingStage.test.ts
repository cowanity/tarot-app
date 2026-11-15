import {expect, test} from 'vitest';
import {headlineSize, ritualMessage, scrollProgress, splitSentences} from './readingStage';
import {aiReadingText, splitThirdPartyLimit} from './aiPresentation';
import {THIRD_PARTY_LIMIT_SENTENCE} from './safetyText';
import type {AiReading} from './readingV2';

test('sentence stagger preserves Vietnamese punctuation and quoted endings', () => {
  expect(splitSentences('  Bạn có thấy thế không? “Một khoảng lặng.” Chờ thêm… Đã rõ!  '))
    .toEqual(['Bạn có thấy thế không?', '“Một khoảng lặng.”', 'Chờ thêm…', 'Đã rõ!']);
  expect(splitSentences('Mức 1.5 vẫn giữ. Một câu cuối')).toEqual(['Mức 1.5 vẫn giữ.', 'Một câu cuối']);
  expect(splitSentences('')).toEqual([]);
});
test('scroll progress clamps outside the scene and handles invalid sizes', () => {
  expect(scrollProgress(800, 1000, 800)).toBe(0);
  expect(scrollProgress(-1000, 1000, 800)).toBe(1);
  expect(scrollProgress(-100, 1000, 800)).toBe(.5);
  expect(scrollProgress(2000, 1000, 800)).toBe(0);
  expect(scrollProgress(-2000, 1000, 800)).toBe(1);
  expect(scrollProgress(0, 0, 800)).toBe(0);
  expect(scrollProgress(NaN, 1000, 800)).toBe(0);
});
const reading: AiReading = {answer: 'Chưa rõ, và điều đáng nhìn lại là lựa chọn của bạn.', headline: 'Headline', opening: 'Opening', tension: 'Tension',
  per_card: [{position: 1, title: 'Title', scene: 'Scene', notice: 'Notice'}],
  personal: {title: 'Personal title', text: 'Personal text'}, weave: 'Weave', unsaid: 'Unsaid', outlook: 'Outlook',
  paths: [{label: 'A', body: 'Branch A'}, {label: 'B', body: 'Branch B'}], closing: 'Closing', question: 'Question', experiment: 'Experiment'};
test('copy follows stage order including personal and only present sections', () => {
  expect(aiReadingText(reading).split('\n\n')).toEqual([reading.answer,'Opening','Vị trí 1: Title','Scene','Notice',
    'Personal title','Personal text','Tension','Weave','Unsaid','Outlook','A','Branch A','B','Branch B','Closing','Question','Experiment']);
  expect(aiReadingText({...reading, personal: undefined, paths: [], experiment: ''}).split('\n\n'))
    .toEqual([reading.answer,'Opening','Vị trí 1: Title','Scene','Notice','Tension','Weave','Outlook','Unsaid','Closing','Question']);
});
test('exact safety sentence remains once in copy and separates only by constant', () => {
  const opening = THIRD_PARTY_LIMIT_SENTENCE + ' Opening';
  expect(splitThirdPartyLimit(opening, ['third_party_limit'])).toEqual({limit: THIRD_PARTY_LIMIT_SENTENCE, opening: 'Opening'});
  expect(splitThirdPartyLimit('Một lời giới hạn khác. Opening', ['third_party_limit']).limit).toBeNull();
  const copied = aiReadingText({...reading, opening}, ['third_party_limit']);
  expect(copied.split(THIRD_PARTY_LIMIT_SENTENCE)).toHaveLength(2);
  expect(copied.startsWith(reading.answer + '\n\n' + THIRD_PARTY_LIMIT_SENTENCE + '\n\nOpening')).toBe(true);
});
test('headline sizes and ritual timings obey specified boundaries', () => {
  expect([40,41,60,61].map(n => headlineSize('a'.repeat(n)))).toEqual(['short','medium','medium','long']);
  expect(ritualMessage(0)).toBe(ritualMessage(7));
  expect(new Set([0,8,20,40].map(ritualMessage)).size).toBe(4);
});
