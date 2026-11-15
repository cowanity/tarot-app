# A/B — vận hành, không chấm văn

Hai biến thể old/v1 first-pass: mỗi ca/biến thể tối đa một lần gọi provider thực tế. Không sửa văn, không fallback model, không retry nội dung hay transport. Cả hai dùng gemini-3.5-flash-lite, temperature 0.7, cùng schema và chặn tầng 1, cùng note 7e và cùng giới hạn token. Thứ tự old trước v1; thứ tự này có thể chịu nhiễu thời điểm/provider.

Baseline old giữ system 7c và nội dung ví dụ cũ; cố định ví dụ cũ số 1 và style đầu tiên để loại ngẫu nhiên. Không phải phát lại bit-for-bit mọi request 7c. v1 chọn ví dụ theo want. Đây là so sánh hai gói prompt, không cô lập riêng tác động system hoặc ví dụ.

| Bản | Ca | Có bài | Gọi | Token ghi nhận | Giây | Lỗi provider | Lỗi guard |
|---|---|---|---|---|---|---|---|
| old | 24 | Có | 1 | 3822 | 9.07 | — | — |
| old | 25 | Có | 1 | 3757 | 10.62 | — | — |
| old | 26 | Có | 1 | 3750 | 11.33 | — | — |
| old | 27 | Có | 1 | 3718 | 10.31 | — | — |
| old | 28 | Có | 1 | 3738 | 10.27 | — | — |
| old | 29 | Có | 1 | 3771 | 10.75 | — | — |
| v1 | 24 | Có | 1 | 4532 | 7.45 | — | — |
| v1 | 25 | Không | 1 | 0 | 1.03 | network | — |
| v1 | 26 | Không | 1 | 4504 | 10.18 | — | output_schema |
| v1 | 27 | Có | 1 | 4434 | 10.14 | — | — |
| v1 | 28 | Có | 1 | 4370 | 10.54 | — | — |
| v1 | 29 | Không | 1 | 4509 | 10.70 | — | answer_vague |
| v1+sửa | 24 | Không | 1 | 4592 | 7.11 | — | output_schema |
| v1+sửa | 25 | Không | 1 | 4479 | 11.19 | — | third_party, tp_action_fact |
| v1+sửa | 26 | Không | 1 | 4600 | 10.66 | — | output_schema |
| v1+sửa | 27 | Có | 1 | 4488 | 10.68 | — | — |
| v1+sửa | 28 | Có | 1 | 4403 | 15.92 | — | — |
| v1+sửa | 29 | Có | 1 | 4611 | 11.10 | — | — |

old: 6/6 có bài first-pass; 6 lần gọi; 22556 token ghi nhận; 62.35 giây xử lý (không gồm nghỉ).

v1: 3/6 có bài first-pass; 6 lần gọi; 22349 token ghi nhận; 50.04 giây xử lý (không gồm nghỉ).

Token 0 ở lỗi provider chỉ là không có usage trả về, không chứng minh không tính phí. Không chấm văn khi không có bài. Không suy chất lượng từ tỷ lệ trả HTTP 200. raw-old.json/raw-v1.json có variant và diagnostics, chỉ đọc sau bài mù. Không chạy lại để chọn bài đẹp.

old: 6/6 có bài; 6 lần gọi; 22556 token ghi nhận.
old: answer_verdict 4/6; answer_abstract 0/6; kích hoạt sửa 0/6.

v1: 3/6 có bài; 6 lần gọi; 22349 token ghi nhận.
v1: answer_verdict 4/6; answer_abstract 0/6; kích hoạt sửa 0/6.

v1+sửa: 3/6 có bài; 6 lần gọi; 27173 token ghi nhận.
v1+sửa: answer_verdict 2/6; answer_abstract 0/6; kích hoạt sửa 0/6.

Ca 20, 21, 22 trùng câu hỏi + lá của ví dụ: chỉ kiểm hợp đồng, không đo chất lượng. Ca 24–29 là bộ giữ lại, khác câu hỏi và lá ví dụ. Lượt v1+sửa là mẫu sinh độc lập, một lần primary và tối đa một lần sửa có điều kiện; không tắt chặn tầng 1. Chênh lệch không thể quy hết cho sửa vì có nhiễu sinh mẫu.

Không có call sửa nào trong lượt thứ ba (0/6 kích hoạt). Vì vậy chưa có bằng chứng live về mức cải thiện do sửa; test fake provider kiểm tra đường gọi và điều kiện nhận/từ chối. Không chạy thêm để tìm bài đẹp.
