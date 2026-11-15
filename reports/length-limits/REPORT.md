# Kết quả nới giới hạn trình bày

Một request production đầy đủ cho mỗi ca, không chạy lại A/B hay chọn lại kết quả. Primary gemini-3.5-flash-lite, sửa trường dùng gemini-3.5-flash.

| Ca | Có bài | Calls | Lỗi cứng từng lượt | Notes trả về | Token | Giây |
|---|---|---|---|---|---|---|
| 24 | Có | 2 | PASS → PASS | question_anchor, answer_long, verdict_long, question_opening, soft_length, verdict_repair_triggered, answer_verdict, verdict_repaired | 5088 | 16.139 |
| 25 | Có | 1 | PASS | soft_length | 4413 | 10.904 |
| 26 | Có | 2 | bad_spacing → PASS | answer_long, cliche, soft_length | 9230 | 14.505 |
| 29 | Có | 2 | answer_vague → PASS | third_party_limit, soft_length | 5142 | 11.118 |

4/4 ra bài; 7 calls, trung bình 1,75 calls/bài; 23.873 token. Không có personal_dropped. Ca 24 sửa riêng verdict+answer vì hướng trả lời; ca 29 sửa riêng verdict vì answer_vague. Ca 26 retry cả bài vì bad_spacing. Không có lỗi schema ở các lượt này.

Audit của ca 29 ghi gộp `answer_vague,verdict_long,answer_verdict`; validation phân biệt rõ lỗi cứng chỉ là answer_vague, hai mã còn lại là note mềm. Notes trả về có thể giữ dấu vết ứng viên trước sửa (ca 24), nên không đồng nghĩa mọi note còn xuất hiện trong bài cuối.

## Phạm vi
Title cứng 8 từ, mềm >5; answer cứng 90 từ/520 ký tự, mềm >60; verdict cứng 12 từ, mềm >8. Không thay prompt, ví dụ, care, chặn an toàn hay cấu trúc trường. SHA-256 các prompt và provider schema khớp trước/sau.

Eval cục bộ lưu completions và đầy đủ fields, schemaIssues/path/code; production audit không thêm văn bản. Xem JSON từng ca để đối chiếu từng lượt.

## Kiểm chứng
Typecheck và build thành công. Test biên riêng: 22 PASS. Kết quả toàn bộ test ở test-results.json.

UI đã thêm wrap và fixture title8/answer90 ở 360px. **Chưa xác nhận bằng trình duyệt**: Chromium không có trong môi trường; ui.log ghi lỗi thật. Không có ảnh kiểm chứng/no-overflow được tuyên bố đạt.

Toàn bộ test: 587/587 PASS; typecheck và build PASS.
