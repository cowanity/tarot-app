# A/B — vận hành, không chấm văn

Mỗi ca/biến thể tối đa một lần gọi provider thực tế. Không sửa văn, không fallback model, không retry nội dung hay transport. Cả hai dùng gemini-3.5-flash-lite, temperature 0.7, cùng schema/guard 7d và cùng giới hạn token. Thứ tự old trước v1; thứ tự này có thể chịu nhiễu thời điểm/provider.

Baseline old giữ system 7c và nội dung ví dụ cũ; cố định ví dụ cũ số 1 và style đầu tiên để loại ngẫu nhiên. Không phải phát lại bit-for-bit mọi request 7c. v1 chọn ví dụ theo want. Đây là so sánh hai gói prompt, không cô lập riêng tác động system hoặc ví dụ.

| Bản | Ca | Có bài | Gọi | Token ghi nhận | Giây | Lỗi provider | Lỗi guard |
|---|---|---|---|---|---|---|---|
| old | 12 | Không | 1 | 7567 | 14.74 | — | personal_style, personal_forbidden |
| old | 19 | Có | 1 | 3628 | 11.92 | — | — |
| old | 20 | Không | 1 | 3773 | 12.72 | — | answer_vague |
| old | 21 | Có | 1 | 3713 | 9.96 | — | — |
| old | 22 | Có | 1 | 3715 | 11.52 | — | — |
| old | 23 | Có | 1 | 3699 | 11.61 | — | — |
| v1 | 12 | Không | 1 | 8108 | 10.98 | — | personal_schema |
| v1 | 19 | Có | 1 | 4361 | 11.57 | — | — |
| v1 | 20 | Có | 1 | 4423 | 9.36 | — | — |
| v1 | 21 | Có | 1 | 4466 | 11.75 | — | — |
| v1 | 22 | Có | 1 | 4341 | 11.27 | — | — |
| v1 | 23 | Có | 1 | 4373 | 13.03 | — | — |

old: 4/6 có bài first-pass; 6 lần gọi; 26095 token ghi nhận; 72.48 giây xử lý (không gồm nghỉ).

v1: 5/6 có bài first-pass; 6 lần gọi; 30072 token ghi nhận; 67.95 giây xử lý (không gồm nghỉ).

Token 0 ở lỗi provider chỉ là không có usage trả về, không chứng minh không tính phí. Không chấm văn khi không có bài. Không suy chất lượng từ tỷ lệ trả HTTP 200. raw-old.json/raw-v1.json có variant và diagnostics, chỉ đọc sau bài mù. Không chạy lại để chọn bài đẹp.
