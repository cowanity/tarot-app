# Bản sửa 7c

Giữ nguyên schema 7b. Phân tầng guardrail; lỗi biên tập có notes; tối đa 3 lần gọi provider; sửa gọn 1–2 trường, ưu tiên model flash đã cấu hình; personal lỗi được bỏ sau sửa. Nới third_party cho cảm xúc/kỳ vọng và giữ chặn hành động, lời nói, ý nghĩ cụ thể. Sanitize chữ lặp, khoảng trắng, đầu câu; cắt notice sai hình xác định. UI tách “Trên lá bài” nhỏ/muted khỏi notice chính. Prompt bỏ câu mẫu; cập nhật tiếng thường và các giới hạn mở đầu. Eval bổ sung rule/fragment, số gọi/token/giây/notes; rhythm chỉ tham khảo.

Kiểm tra cuối: 35 file / 548 test pass. Typecheck và build pass. Log đính kèm trong reports/.

Eval Gemini thật bị cơ chế duyệt tự động chặn việc gửi dữ liệu mẫu tới Google Generative Language API. Chưa xác nhận các mục tiêu ca 12/19/20, trung bình ≤2,5 lần gọi và p95 ≤20 giây. EVAL_VOICE.md ghi rõ giới hạn; reports/readings/ không chứa bài giả lập đóng vai bài thật.

Giữ .env của bạn khi thay code. Chạy npm ci, npm run typecheck, npm test, npm run build. Lệnh eval: npm run server:eval -- 1 2 11 12 15 16 17 18 19 20 --save-readings.

Báo cáo cũ nằm trong reports/before-7c/ để tránh nhầm với lần chạy này.
