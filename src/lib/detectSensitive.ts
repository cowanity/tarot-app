export type Sensitivity = 'none' | 'professional' | 'crisis';
const crisisPatterns = [
  'tự (tử|sát|vẫn|hại)',
  'làm (hại|đau) bản thân',
  'muốn chết', 'chán sống', 'muốn biến mất', 'không đáng sống',
  'kết thúc (cuộc đời|cuộc sống|mạng sống)',
  'chấm dứt (tất cả|cuộc sống|cuộc đời)',
  'không muốn tỉnh dậy', 'kết liễu',
  '(không|chẳng|hết) (còn )?(muốn|thiết) (tiếp tục )?(sống|tồn tại)',
];
const professional = [
  'sức khỏe', 'bệnh', 'thuốc', 'điều trị', 'chẩn đoán', 'phẫu thuật', 'mang thai', 'có thai',
  'đau đầu', 'đau bụng', 'đau ngực', 'đau lưng', 'đau răng', 'cơn đau',
  'vay tiền', 'vay nợ', 'khoản vay', 'mắc nợ', 'trả nợ', 'nợ nần', 'đầu tư', 'chứng khoán', 'tài chính',
  'khởi kiện', 'bị kiện', 'vụ kiện', 'kiện tụng', 'luật sư', 'pháp luật', 'pháp lý', 'hợp đồng', 'ly hôn',
];
const fold = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd');

function compile(pattern: string): RegExp {
  // Match accented or unaccented words without folding the user's text:
  // "tu tu" matches, but the distinct accented phrase "từ từ" does not.
  const variants = pattern.replace(/\p{L}+/gu, (word) => {
    const plain = fold(word);
    return plain === word ? word : `(?:${word}|${plain})`;
  }).replace(/ +/g, '\\s+');
  return new RegExp(`(^|[^\\p{L}\\p{N}])(?:${variants})($|[^\\p{L}\\p{N}])`, 'u');
}
const crisisMatchers = crisisPatterns.map(compile);
const professionalMatchers = professional.map(compile);

/** Lưới an toàn khớp từ khóa, không phải bộ phân loại hoàn chỉnh; chỉ chạy tại máy. */
export function detectSensitive(question: string): Sensitivity {
  const text = question.normalize('NFC').toLocaleLowerCase('vi').replace(/\s+/g, ' ').trim();
  if (crisisMatchers.some((pattern) => pattern.test(text))) return 'crisis';
  return professionalMatchers.some((pattern) => pattern.test(text)) ? 'professional' : 'none';
}
