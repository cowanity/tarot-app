# Chẩn đoán 7e — không thay đổi prompt, không chạy lại A/B

## 1. Lỗi schema của các lượt A/B đã lưu

`raw-v1.json` và `raw-v1-repair.json` không có thuộc tính `schemaIssues`. Kiểu Trial và lệnh ghi kết quả trong `server/eval/ab.ts` chỉ giữ diagnostics, không giữ schemaIssues hoặc toàn bộ completion bị chặn. Đây là thiếu sót của log A/B đã tạo trước đó.

Các tiêu đề dưới đây còn nguyên văn; đã kiểm lại riêng trường title bằng schema hiện hành, không gọi AI. Code `custom` là kết quả tái kiểm cục bộ, **không phải code trích từ schemaIssues cũ**. Đếm theo các phần tách bằng khoảng trắng (đúng hàm wordCount), không phải đếm từ ghép tiếng Việt. Chỉ số per_card bắt đầu từ 0.

| Bản | Ca | Path | Code tái kiểm | Độ dài | Giới hạn | Vượt |
|---|---:|---|---|---:|---:|---:|
| v1 | 26 | per_card.1.title | custom | 6 | 5 | 1 |
| v1 | 26 | per_card.2.title | custom | 6 | 5 | 1 |
| v1+sửa | 26 | per_card.0.title | custom | 6 | 5 | 1 |
| v1+sửa | 26 | per_card.1.title | custom | 7 | 5 | 2 |
| v1+sửa | 24 | per_card.1.title | custom | 6 | 5 | 1 |
| v1+sửa | 24 | per_card.2.title | custom | 6 | 5 | 1 |

Tiêu đề tương ứng: “Quan sát tiến triển hiện tại”; “Khả năng tự chủ phía trước”; “Quá khứ cân nhắc hướng đi”; “Hiện tại vun trồng chờ kết quả”; “Sự nới lỏng hoặc do dự”; “Sự công bằng và hệ quả”. Không tiêu đề nào vượt 120 ký tự; lỗi là giới hạn 5 phần cách nhau bằng khoảng trắng.

**Ca 26 cả hai bản còn lỗi tại answer.** Giới hạn của answer là 60 phần cách nhau bằng khoảng trắng và 520 ký tự theo JS length. Diagnostics chỉ giữ 180 ký tự đầu, không giữ số từ/độ dài đầy đủ hoặc code Zod. Vì vậy không xác định được nó vượt giới hạn nào, code `custom` hay `too_big`, và vượt bao nhiêu. Không lấy độ dài đoạn trích làm độ dài answer. Không chạy lại A/B để tạo một mẫu khác thay cho bằng chứng đã mất.

## 3. Vì sao answer_verdict 4/6 không đồng nghĩa có 4 lượt sửa

Note mềm và điều kiện sửa không tương đương:

- `answer_verdict`: ở câu hỏi có/không, có thể do thiếu hướng, verdict rỗng hoặc dài hơn 8 phần. Ở câu hỏi mở, có thể do dưới 3/trên 8 phần hoặc chỉ một từ trong bộ verdict cố định.
- Nhánh sửa hướng đòi đồng thời: câu hỏi có/không; verdict không khớp từ chỉ hướng/lời khuyên của hasAdvice; có note answer_verdict hoặc answer_direction.
- Nhánh trừu tượng kiểm riêng danh sách 7e trong verdict/answer; không cần note answer_verdict.
- Đường sửa mềm chỉ chạy khi đã có ứng viên qua tầng 1 (`best`), chưa sửa verdict trong request và còn call (<3). First-pass A/B còn phải bật WITH_VERDICT_REPAIR.
- hasAdvice hiện là kiểm từ khóa, không phải đánh giá ngữ nghĩa: “cân nhắc” và “cần” chưa được tính là hướng, trong khi “chưa” được tính. Đây là mô tả mã hiện tại, không đề nghị thay đổi.

Bốn ca có note trong **v1 first-pass**:

| Ca | Quan sát | Vì sao không sửa ở lượt đó |
|---|---|---|
| 24 | “Cân nhắc kỹ trước khi nhận lời.” — 7 phần, câu hỏi có/không, thiếu từ hướng theo regex | Đủ điều kiện nội dung nhưng first-pass tắt sửa |
| 27 | Verdict 10 phần; câu hỏi mở | Note độ dài, không phải thiếu hướng ở câu có/không |
| 28 | Verdict 9 phần; câu hỏi mở | Note độ dài, không phải thiếu hướng ở câu có/không |
| 29 | Verdict 9 phần, không khớp từ hướng; answer có “chưa rõ” | Có lỗi cứng answer_vague, chưa có best an toàn; first-pass cũng tắt sửa |

**v1+sửa là sáu lần sinh mới, không sửa lại chính sáu bài v1 trước đó.** Trong lượt này, ca 24/25/26 bị lỗi cứng (schema/third_party), nên không có best để vào sửa mềm. Ca 27 có note vì verdict 9 phần nhưng câu hỏi mở. Ca 28 không có điều kiện kích hoạt. Ca 29 có verdict 13 phần nhưng chứa “Chưa”, nên hasAdvice=true: độ dài đơn thuần không kích hoạt sửa. Không bài an toàn nào chứa từ trừu tượng thuộc danh sách kích hoạt. Vì vậy 0/6 có sửa là đúng với các điều kiện thực thi này, không phải bằng chứng đường sửa đã được thử và thất bại.

## Phạm vi chạy production mới

Dùng createApp production đầy đủ, firstPass không bật, promptVariant=v1; provider/model từ cấu hình hiện có. Đúng bốn HTTP request: 24,25,26,29, một request mỗi ca. Retry/repair/fallback bên trong request dùng ngân sách chung tối đa 3 call. Không retry lại request thất bại. Lưu toàn bộ completion mới, schemaIssues và diagnostics theo mỗi lần kiểm để tránh mất bằng chứng. Không sửa mã ứng dụng/prompt/schema và không ghi đè báo cáo A/B.

Launcher lần đầu lỗi biên dịch top-level await trước khi chạy mã/provider; đổi đuôi script sang .mts rồi mới bắt đầu bốn request. Không có call AI ở lần lỗi launcher.

## 2. Kết quả production mới

| Ca | Có bài | Call | Token | Giây | personal_dropped | Sửa mềm verdict |
|---|---|---:|---:|---:|---|---|
| 24 | Có | 2 | 5091 | 13.044 | Không | Kích hoạt, bị từ chối |
| 25 | Có | 1 | 4394 | 8.733 | Không | Không |
| 26 | Không | 3 | 10077 | 15.390 | Không | Không |
| 29 | Có | 2 | 5219 | 11.587 | Không | Không |

Mã theo từng call (tách lỗi cứng và note mềm):

### Ca 24
- Call 1, gemini-3.5-flash-lite, repairFields=None: hard=[]; soft=['question_anchor', 'answer_verdict', 'answer_direction', 'question_opening'].
- Call 2, gemini-3.5-flash, repairFields=['verdict', 'answer']: hard=[]; soft=['question_anchor', 'answer_abstract', 'question_opening'].

### Ca 25
- Call 1, gemini-3.5-flash-lite, repairFields=None: hard=[]; soft=['answer_verdict', 'question_opening'].

### Ca 26
- Call 1, gemini-3.5-flash-lite, repairFields=None: hard=['output_schema']; soft=[].
  Answer mới: 58 phần / 259 ký tự, vượt 0 phần; không vượt 520 ký tự.
- Call 2, gemini-3.5-flash-lite, repairFields=None: hard=['output_schema', 'answer_length']; soft=['question_opening', 'question_length', 'cliche'].
  Answer mới: 65 phần / 281 ký tự, vượt 5 phần; không vượt 520 ký tự.
- Call 3, gemini-3.5-flash, repairFields=['answer', 'verdict']: hard=['output_schema', 'answer_length']; soft=['question_opening', 'question_length', 'cliche'].
  Answer mới: 63 phần / 281 ký tự, vượt 3 phần; không vượt 520 ký tự.

### Ca 29
- Call 1, gemini-3.5-flash-lite, repairFields=None: hard=['answer_absolute']; soft=['answer_verdict'].
- Call 2, gemini-3.5-flash, repairFields=['answer']: hard=[]; soft=['answer_verdict'].

Ca 24: call 2 chỉ sinh verdict/answer. Hướng đã có nhưng answer thêm “nền tảng” → answer_abstract, giữ lại bản gốc, notes verdict_repair_triggered + verdict_repair_rejected. Không có lỗi cứng ở cả hai call.
Ca 26: call 1 tiêu đề per_card.2.title 6 phần >5; call 2 retry toàn bài còn answer quá dài; call 3 sửa cứng hai trường answer/verdict vẫn quá dài. Call 3 không phải nhánh sửa mềm verdictRepairReason. Không có best an toàn, HTTP 502/offline.
Ca 29: call 1 answer_absolute; call 2 chỉ sửa answer và qua tầng 1. Verdict vẫn có note độ dài, nhưng hasAdvice nhận chữ “chưa”, nên không kích hoạt sửa mềm.
Không ca nào có personal/profile trong fixture; không có personal_dropped. Callback onValidation có thể ghi cùng kết quả sửa hai lần; số call lấy từ audit.attempts, không đếm số callback.
Tổng: 8 call, 24781 token, 48.754 giây xử lý không gồm nghỉ; 3/4 có bài. Không có request chạy lại.

Không đề xuất thay đổi trong báo cáo này.
