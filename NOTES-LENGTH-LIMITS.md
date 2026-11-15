# Nới giới hạn trình bày

## Hành vi
- title: mục tiêu prompt vẫn 5 phần cách nhau bằng khoảng trắng; 6–8 → title_long; >8 → schema cứng. Giữ trần 120 ký tự.
- answer: mục tiêu prompt vẫn 60 từ/3 câu; 61–90 → answer_long; >90 hoặc >520 ký tự → lỗi cứng, có thể sửa theo trường. Những điều kiện sửa do nội dung/an toàn đã có vẫn giữ.
- verdict: mục tiêu 8; 9–12 → verdict_long (có thể đồng thời answer_verdict theo luật cũ); >12 → schema cứng. Giữ trần ký tự cũ.
- Giữ nguyên các khóa và cấu trúc JSON, care, system/user prompt, bộ ví dụ và geminiResponseSchema mô tả mục tiêu. Kiểm SHA-256 các file prompt/schema provider trước–sau được lưu.
- Client/History chấp nhận cùng giới hạn cứng với server, tránh server ship nhưng UI từ chối bài.

## Log
Chỉ eval cục bộ thêm completions nguyên văn, validations theo lần kiểm, fields nguyên vẹn, schemaIssues path/code/độ dài. Diagnostics của eval lấy cả trường, không cắt 180 ký tự. A/B runner chỉ cập nhật khả năng ghi log, không được chạy lại. Production Audit vẫn không có nội dung bài/câu hỏi; schemaIssues chỉ có metadata. Test về eval đã đổi từ che văn bản sang giữ nguyên văn theo yêu cầu này; test riêng về privacy production vẫn giữ.

Sửa đường trả schemaIssues của finalShape để lỗi answer/verdict sau bước parse nới tạm không bị mất metadata. Không thay điều kiện an toàn.

## UI
AnswerHero và tiêu đề giữ chiều cao tự nhiên, cho phép xuống dòng/overflow-wrap, không line-clamp. Script ui_shots có long-fields: title 8, answer 90, verdict 12; kiểm tại 360px và các kích thước khác.

**Chưa xác nhận bằng browser:** launch Playwright thất bại vì không có Chromium executable. Không có ảnh hay bằng chứng DOM rằng 360px không overflow; không báo đạt giả. Xem reports/length-limits/ui.log. Đây là hạng mục còn chờ nghiệm thu.

## Chạy thật
Đúng một request production cho mỗi ca 24,25,26,29; tối đa 3 provider call/request. Không retry lại request, không chạy A/B, không chọn lại bài. Kết quả và toàn bộ diagnostics ở reports/length-limits/production/.

Toàn bộ test: 587/587 PASS; typecheck và build PASS.
