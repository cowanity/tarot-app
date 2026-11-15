# Máy chủ 4b-gemini — Node 22
1. `npm ci`; chép `.env.example` thành `.env`, điền key ở máy chủ.
2. `npm run server` (127.0.0.1:8787); cửa sổ khác: `npm run dev`.
3. `npm test`; `npm run server:check`; `curl http://localhost:8787/api/health`.
4. `npm run server:eval`: 18 ca, tối đa 90 lần gọi thật gồm retry, cần key.
Không đặt key trong biến VITE_* hoặc mã nguồn client.
Với Anthropic, model mới có thể từ chối temperature 0.7. Dùng model hỗ trợ hoặc sửa cấu hình provider sau khi xác nhận.
Giới hạn: 6 request/phút, 40/ngày/IP; AI_DAILY_CAP đếm một lượt cho mỗi yêu cầu có gọi nhà cung cấp; ngày UTC, bộ nhớ mất khi restart.
Không tin X-Forwarded-For; qua proxy các khách chung IP socket. Cần cơ chế proxy tin cậy trước khi triển khai nhiều người.
Guardrail là bộ lọc quy tắc, không bảo đảm mọi diễn giải đều đúng nguồn. Lỗi trả fallback offline.
Timeout từng lần gọi Gemini 30 giây, tổng lượt 60 giây; không gọi mới nếu còn dưới 15 giây. Giữ trần 5 lần gọi và tối đa 2 lần sửa guardrail riêng.
Eval và test không đọc/in văn bản sách; import dữ liệu hiện hành qua module của app.
Thiếu khóa đúng provider sẽ dừng khởi động/eval. GET health không kiểm tra khóa với nhà cung cấp.
Lấy khóa cho gói miễn phí tại Google AI Studio: https://aistudio.google.com/apikey
Đặt GEMINI_API_KEY trong .env với AI_PROVIDER=gemini; chọn AI_MODEL theo danh sách hiện hành.
Xem hạn mức của dự án/gói đang dùng trong bảng điều khiển AI Studio; không bảo đảm luôn miễn phí hoặc còn quota.
Hết ngân sách truyền tải hoặc giới hạn chung trả AI_BUSY thân thiện; giới hạn nội bộ của app trả 429 + Retry-After.
Gói miễn phí Gemini có thể dùng dữ liệu để cải thiện sản phẩm; tránh dữ liệu riêng tư của người khác.
Đặt `AI_FALLBACK_MODELS=gemini-3.5-flash-lite,gemini-3.1-flash-lite` trong `.env`; để trống để tắt. Nếu không có biến mới, vẫn nhận AI_FALLBACK_MODEL cũ; nếu cả hai vắng thì dùng chuỗi mặc định cho Gemini.
Lỗi 5xx/429/mạng/timeout chuyển ngay model kế tiếp; chỉ model cuối còn dùng được thử lại một lần sau 1 giây. 404 cũng chuyển model. Hai lỗi truyền tải liên tiếp trong 120 giây mở mạch 120 giây; sau đó chỉ một yêu cầu thử hồi phục. GET /api/health và tổng kết eval trả trạng thái mạch, không chứa khóa.
Client thử lại một lần sau 1500ms khi unavailable/network, tổng chờ tối đa 90 giây; nút Hủy dừng cả thời gian chờ.
Audit ghi một dòng mỗi request, có status, attempts (loại lần gọi, model, mã kết quả và latencyMs từng lần), latencyMs; không ghi nội dung.
`python3 scripts/check_gemini.py` kiểm tra thinkingConfig bằng câu thử tổng hợp; không in khóa/nội dung. Chỉ bật tham số sau khi model trả 200.

Schema V2: opening/tension, scene/notice theo lá, weave/unsaid, outlook/paths, closing/question/experiment; đích 550–700 từ, maxTokens 6500.
`python3 scripts/check_gemini.py --schema` thử responseSchema V2 trên model hiện tại; HTTP 400 thì bỏ tham số; chỉ bật cho đúng model đã xác minh.

Đã bật thinkingLevel=low và responseSchema V2 cho riêng `AI_MODEL=gemini-3.5-flash` theo hai phép thử HTTP 200. Model dự phòng khác tên giữ cấu hình cũ; Zod và guardrail vẫn kiểm toàn bộ đầu ra.
