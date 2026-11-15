/** Câu hỏi do ứng dụng viết; không phải nội dung hay diễn giải của sách. */
import {labelsOf} from '../lib/feelings';
// Existing quick picker; the grouped UI will consume FEELINGS directly in the next step.
export const feelings = labelsOf(['lo_lang','phan_van','hy_vong','kiet_suc','to_mo','binh_yen']);
export type Feeling = typeof feelings[number];
export const topicPhrases: Record<string, string> = {
  'Tình yêu': 'chuyện tình cảm', 'Sự nghiệp': 'công việc', 'Tài chính': 'chuyện tiền bạc',
  'Bản thân': 'bản thân bạn', 'Tổng quan': 'hiện tại của bạn',
};
export const reflectionTemplates = [
  (position: string, keyword: string, topic: string) => `Ở vị trí ${position}, từ khóa “${keyword}” gợi bạn muốn tìm hiểu điều gì về ${topic}?`,
  (position: string, keyword: string, topic: string) => `Khi nhìn ${topic} qua vị trí ${position}, bạn muốn tự hỏi điều gì từ từ khóa “${keyword}”?`,
  (position: string, keyword: string, topic: string) => `Với từ khóa “${keyword}” ở vị trí ${position}, trải nghiệm nào về ${topic} bạn muốn nhìn lại?`,
];
export const feelingPrompts: Record<Feeling, string> = {
  'Lo lắng': 'điều gì có thể giúp bạn cảm thấy được hỗ trợ',
  'Phân vân': 'bạn đang cân nhắc giữ lại hay buông điều gì',
  'Hy vọng': 'bạn muốn dành sự chăm sóc cho mong muốn nào',
  'Kiệt sức': 'bạn muốn cho mình khoảng nghỉ như thế nào',
  'Tò mò': 'bạn muốn tìm hiểu thêm điều gì',
  'Bình yên': 'bạn muốn dành thời gian quan sát điều gì',
};
export const topicClosings: Record<string, string> = {
  'Tình yêu': 'Trong chuyện tình cảm, điều gì bạn muốn nói rõ hơn với chính mình hoặc người kia',
  'Sự nghiệp': 'Trong công việc, điều gì bạn muốn làm rõ trước khi chọn bước tiếp theo',
  'Tài chính': 'Trong chuyện tiền bạc, thông tin nào bạn muốn kiểm tra trước khi quyết định',
  'Bản thân': 'Về bản thân bạn, nhu cầu nào bạn muốn lắng nghe kỹ hơn',
  'Tổng quan': 'Trong hiện tại của bạn, điều gì bạn muốn dành sự chú ý trước tiên',
};
