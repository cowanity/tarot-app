import {expect,test} from 'vitest';
import {answerErrors,isDirectionalQuestion} from './answerRules';
test.each(['chưa rõ','không rõ','khó nói','khó đoán','tùy','chưa thể kết luận'])('rejects vague phrase %s in both fields',phrase=>{
 expect(answerErrors(phrase,'','full','Nhìn lại lựa chọn')).toContain('answer_vague');
 expect(answerErrors('Nhìn lại lựa chọn.', '', 'full',phrase)).toContain('answer_vague');
});
test('yes/no takes a side; timing is an open question',()=>{
 expect(isDirectionalQuestion('Có nên nghỉ việc không?')).toBe(true);
 expect(isDirectionalQuestion('Khi nào tìm được việc?')).toBe(false);
 expect(answerErrors('Có — bài cho thấy cô ấy còn tình cảm. Nhưng sự gần gũi cần thời gian.','Cô ấy có yêu tôi không?','full','Có')).toEqual(['answer_repeats_verdict']);
 expect(answerErrors('Chưa rõ hướng đi.','','full','Chưa rõ hướng')).toContain('answer_vague');
});
test('third party feelings through cards allowed; concrete actions rejected',()=>{
 expect(answerErrors('Có, bài cho thấy cô ấy còn tình cảm.','Cô ấy có yêu tôi không?','full','Có')).toEqual(['answer_repeats_verdict']);
 expect(answerErrors('Có, cô ấy đã nhắn cho bạn.','Cô ấy có yêu tôi không?','full','Có')).toContain('answer_third_party_boundary');
});
test('sensitive verdict acknowledges instead of predicting',()=>{
 expect(answerErrors('Bạn đang cần được lắng nghe.','Có nên đổi thuốc không?','reflective_only','Bạn cần được lắng nghe')).toEqual([]);
 expect(answerErrors('Có.','Có nên đổi thuốc không?','reflective_only','Có')).toContain('answer_verdict');
});
test('length, absolutes and sentences bounded',()=>{
 expect(answerErrors('Nhất định sẽ thành công.','','full')).toContain('answer_absolute');
 expect(answerErrors(Array(91).fill('từ').join(' '),'','full')).toContain('answer_length');
 expect(answerErrors('Một. Hai. Ba. Bốn.','','full')).toContain('answer_sentences');
});
