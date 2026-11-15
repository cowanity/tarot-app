# PROMPT 7d — bàn giao

## Thay đổi

- Giữ cấu trúc schema, UI, care và ngân sách production tối đa ba lần gọi. Chỉ tăng giới hạn answer theo yêu cầu: 60 từ/520 ký tự, tối đa ba câu trong chẩn đoán. Care vẫn dùng lời ứng dụng sở hữu.
- answer_vague so NFC có dấu và ranh giới chữ, chỉ ở verdict/câu đầu answer. Không còn nhầm “Tuy nhiên” với “tùy”. hasAnswerDirection không còn nhầm “Cô” với “Có”.
- Verdict có/không nhận mệnh đề kỳ vọng/lời khuyên, không bắt đầu bằng một trong năm từ; answer_verdict/answer_direction chỉ note, không sửa hay retry.
- Bộ ba golden_v1 đầy đủ input/output, có verdict, không scene. Chọn decision → decision-work; listen/comfort → listen-breakup; còn lại → clarity-third-party. Mỗi lượt một ví dụ.
- Chỉnh duy nhất một câu trong ví dụ clarity-third-party: bỏ câu phụ “Mình đọc bài theo đúng câu hỏi đó, không đoán anh ấy nghĩ gì.” vì bộ dò hiện hành bắt “anh ấy nghĩ” là third_party hard. Không nới chặn người thứ ba. Bản đính kèm gốc không bị sửa; bản ứng dụng nằm server/prompts/golden_v1.json. Cả ba ví dụ qua parseAndGuard và fake provider với một lần gọi.
- Thay các khối giọng cũ bằng v0 điều chỉnh, giữ an toàn/personal/output. Chất thơ: tối đa một ẩn dụ ở weave và một câu đáng giữ ở closing. Mỗi trường một vai trò; notice 1–2 câu, không bắt có hình. Unsaid rỗng được cả hai renderer ẩn sẵn.
- Xóa styleCard.ts và toàn bộ chỗ gọi. Bản production không xoay phong cách theo requestId.
- Xóa ConsentDialog không dùng, bỏ aiConsent khỏi settings và dời thông báo lịch sử sang historyNotice.ts; cấu hình cũ đọc được, bỏ qua aiConsent cũ.
- /api/health trả {ok:true} cho tất cả caller, kể cả localhost: cách tối thiểu tránh lộ circuits qua tunnel/Host spoof. Endpoint info giữ nguyên.
- Thêm .gitignore, xóa eval.log/shuffle_dump.txt nếu có và data/cards.json.bak. Không đưa .env, node_modules, dist hoặc nguồn thô vào ZIP.

## Luật đã gỡ hoặc hạ mức tác động

- Bỏ so bỏ dấu của answer_vague và hasAnswerDirection.
- Thu hẹp answer_vague khỏi câu thứ hai/thứ ba; không áp dụng vào các trường khác.
- Bỏ bắt verdict mở bằng từ cố định. Verdict cần hướng trả lời chỉ đo mềm.
- Tăng answer từ 45 lên 60 từ, 400 lên 520 ký tự; trần câu từ hai lên ba.
- Bỏ random style card và ép opening/tension/unsaid/experiment theo mẫu ngẫu nhiên.
- Bỏ bắt notice đúng hai câu, bỏ giới hạn 16 từ cho câu hình và yêu cầu phải có câu hình. notice_rhythm chỉ đo ngoài khoảng 1–2 câu.
- question_opening (gồm “Điều gì”, “Khi nào”), unsaid_opening (“Có thể bạn”), answer_abstract, tension_vague và example_parrot vẫn là note. Tắt hoàn toàn đường sửa trường do các lỗi mềm, kể cả khi chỉ có 1–2 trường.
- Không thêm rule an toàn mới. Schema/care/injection/chắc chắn/đe dọa/third_party hard giữ nguyên. Những rule tầng 1 khác hiện hữu không được âm thầm bỏ.

## Kiểm tra

Đã chạy đúng chuỗi: npm run typecheck && npm test && npm run build.
Kết quả: typecheck PASS; 36 file / 560 test PASS; build PASS.
Log trong reports/7d-validation.log. Test thêm cho dấu tiếng Việt, giới hạn câu/từ/ký tự, ba ví dụ, health, unsaid hiện tại, first-pass không retry kể cả transport và báo cáo X/Y.

## Cách đọc và chạy A/B

Đọc reports/AB/case-12.md, case-19.md, case-20.md, case-21.md, case-22.md, case-23.md trước. X/Y xáo độc lập từng ca. Đọc KEY.md, OPS.md và raw JSON sau để tránh biết nhãn trước khi chấm. Bản không có bài không được chấm văn.

Lệnh tại thư mục dự án với .env của chủ dự án:

```bash
PROMPT_VARIANT=old npm run server:eval:ab
PROMPT_VARIANT=v1 npm run server:eval:ab
```

PROMPT_VARIANT mặc định v1, chỉ nhận old|v1; eval thường cũng đọc biến này. A/B dùng gemini-3.5-flash-lite, temperature 0.7, cùng giới hạn token/schema/guard. Mỗi ca một lần gọi thực tế, không repair, không fallback, không retry transport. Production vẫn tối đa ba lần.

Baseline old là snapshot system và mẫu 7c; cố định mẫu số 1 và các lựa chọn style đầu tiên, không giữ random runtime. Điều này chọn một cấu hình cũ có thể xảy ra, không tái tạo mọi biến thiên 7c. Ghi rõ trong OPS; so sánh hai gói prompt, không khẳng định tác động riêng của từng chỉnh sửa. Các file old chỉ phục vụ đối chứng; không chọn mặc định cho production.

Không tự chạy lại khi bài kém hoặc lỗi. Chỉ một lượt mỗi biến thể. First-pass có thể bị chặn do personal hard vì không gọi sửa/bỏ personal để cải thiện kết quả; xem diagnostics để phân biệt với lỗi provider.

## Nhạc — chưa có nguồn để ghi công

public/audio/ambient-1.mp3 đang có, nhưng credits.json là [] và file không có ID3v2/ID3v1. README chỉ mô tả cách điền, không cho nguồn. Chưa xác định được title, artist, license, url. Giữ credits.json trống, không đoán hoặc ghi giấy phép giả. Chủ dự án cần cung cấp link nguồn hoặc thông tin bản nhạc để hoàn tất mục này.

Báo cáo các bản trước được giữ dưới reports/before-7d/; không dùng chúng làm kết quả A/B mới.

## Lượt A/B đã thực hiện

Đã chạy 12 lần gọi thực tế, một lượt cho mỗi ca/biến thể. Không lỗi provider; 9 phản hồi có bài, 3 phản hồi bị guard tầng 1 từ chối. Không sửa hoặc chạy lại các phản hồi này. Xem OPS sau khi đọc mù để biết chi tiết từng biến thể.
