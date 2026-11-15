import { expect, it } from 'vitest';
import { detectSensitive } from './detectSensitive';
import { titleCase } from './titleCase';

it.each([
  'Tôi không muốn tiếp tục sống nữa', 'tôi muốn biến mất', 'toi khong muon song nua', 'chán sống quá',
  'tự tử', 'tự sát', 'tự vẫn', 'tự hại', 'làm hại bản thân', 'làm đau bản thân', 'muốn chết',
  'không đáng sống', 'kết thúc cuộc đời', 'kết thúc cuộc sống', 'kết thúc mạng sống',
  'chấm dứt tất cả', 'chấm dứt cuộc sống', 'chấm dứt cuộc đời', 'không muốn tỉnh dậy',
  'không còn muốn sống', 'chẳng còn thiết tồn tại', 'hết muốn tiếp tục tồn tại',
  'TÔI KHÔNG\nCÒN MUỐN   SỐNG', '“toi muon bien mat”', 'Tôi khong muốn tiếp tục sống',
])('nhận diện crisis: %s', (question) => {
  expect(detectSensitive(question)).toBe('crisis');
  const unaccented = question.normalize('NFD').replace(/\p{M}/gu, '').replace(/[đĐ]/g, 'd');
  expect(detectSensitive(unaccented)).toBe('crisis');
});

it.each([
  'Điều kiện nào để mình chuyển việc?', 'Tôi đau lòng vì chia tay, nên làm gì?',
  'Tôi nợ bạn một lời xin lỗi', 'từ từ suy nghĩ', 'Kỷ luật bản thân',
])('không cảnh báo nhầm: %s', (question) => expect(detectSensitive(question)).toBe('none'));

it.each([
  'Mình thấy đau đầu kéo dài', 'Mình có nên khởi kiện hàng xóm không?', 'Mình có nên vay tiền mua nhà?',
  'thuốc điều trị bệnh', 'chẩn đoán và phẫu thuật', 'mang thai', 'có thai',
  'đau bụng', 'đau ngực', 'đau lưng', 'đau răng', 'cơn đau', 'vay nợ', 'khoản vay', 'mắc nợ',
  'trả nợ', 'nợ nần', 'đầu tư chứng khoán', 'tài chính', 'bị kiện', 'vụ kiện', 'kiện tụng',
  'luật sư', 'pháp luật', 'pháp lý', 'hợp đồng', 'ly hôn',
])('nhận diện professional: %s', (question) => expect(detectSensitive(question)).toBe('professional'));

it.each([
  ['Five of Cups', 'Five of Cups'], ['Wheel of Fortune', 'Wheel of Fortune'],
  ['The High Priestess', 'The High Priestess'], ['FIVE OF CUPS', 'Five of Cups'],
  ['OF THE AND IN ON A AN TO FOR', 'Of the and in on a an to for'], ['', ''],
])('định dạng tên: %s', (input, expected) => expect(titleCase(input)).toBe(expected));
