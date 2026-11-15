/** Chỉ nhận diện câu trống hoặc câu gợi ý được dùng nguyên văn. */
export function isGenericQuestion(question: string, templates: readonly string[]): boolean {
  return question.trim().length === 0 || templates.includes(question);
}
