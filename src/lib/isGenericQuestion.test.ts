import { expect, test } from 'vitest';
import { isGenericQuestion } from './isGenericQuestion';
import { questionTemplates } from './questionTemplates';

test('nhận diện câu trống và gợi ý nguyên văn, giữ câu riêng là cụ thể', () => {
  const templates = Object.values(questionTemplates);
  expect(isGenericQuestion('', templates)).toBe(true);
  expect(isGenericQuestion('  \n ', templates)).toBe(true);
  for (const template of templates) expect(isGenericQuestion(template, templates)).toBe(true);
  expect(isGenericQuestion('Mình có nên chuyển sang nhóm thiết kế vào tháng tới?', templates)).toBe(false);
  expect(isGenericQuestion(`${templates[0]} Mình muốn hiểu cách lắng nghe nhau.`, templates)).toBe(false);
  expect(isGenericQuestion(templates[0].toUpperCase(), templates)).toBe(false);
});
