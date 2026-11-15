# Ca 12 — production đầy đủ, một lần chạy

- HTTP 200: có bài, không offline.
- `personal_dropped`: có; bài ship không có phần personal.
- 2 lần gọi, 9585 token ghi nhận, 11.153 giây.
- Primary: gemini-3.5-flash-lite; sửa personal: gemini-3.5-flash.
- Lần đầu lỗi personal_style; sau sửa lỗi personal_year_context nên bỏ personal theo production.
- Lần chạy thật này **không có personal_schema**. Không tạo chẩn đoán giả. Test fake với personal.title sai kiểu đã xác nhận diagnostics có `path=personal.title`, `rule=personal_schema`, `fragment=personal.title: invalid_type`; các lỗi schema thật sẽ ghi cùng dạng.
- Bài: `reports/readings/case-12.md`; toàn bộ diagnostics trong JSON và run log cùng tên.

Chỉ chạy đúng một lần, không chọn lại bài. Cờ crossCase FAIL trong log cũ đếm tỷ lệ lặp trên mẫu n=1 nên không có giá trị để kết luận lặp văn; không dùng làm điều kiện pass/fail của ca 12. Rhythm cũng chỉ tham khảo.
