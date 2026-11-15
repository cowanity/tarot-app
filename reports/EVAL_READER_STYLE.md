# Eval — bản đọc trực tiếp

## Kết quả thực tế

Chưa có kết quả từ nhà cung cấp cho 11 ca được yêu cầu. Không tính kiểm thử FakeProvider là eval chất lượng thật.

Lệnh npm gặp `EPERM` khi tsx mở socket IPC. Chạy lại cùng mã qua `node --import tsx` vượt qua bước này, nhưng cấu hình không có khóa: `MISSING_ANTHROPIC_API_KEY`; chỉ định Gemini cho kết quả `MISSING_GEMINI_API_KEY`. Không gọi dịch vụ và không phát sinh token.

| Ca | Trạng thái | Mã lỗi |
|---|---|---|
| 1 | Chưa chạy | MISSING_GEMINI_API_KEY |
| 2 | Chưa chạy | MISSING_GEMINI_API_KEY |
| 3 | Chưa chạy | MISSING_GEMINI_API_KEY |
| 4 | Chưa chạy | MISSING_GEMINI_API_KEY |
| 11 | Chưa chạy | MISSING_GEMINI_API_KEY |
| 12 | Chưa chạy | MISSING_GEMINI_API_KEY |
| 13 | Chưa chạy | MISSING_GEMINI_API_KEY |
| 15 | Chưa chạy | MISSING_GEMINI_API_KEY |
| 16 | Chưa chạy | MISSING_GEMINI_API_KEY |
| 17 | Chưa chạy | MISSING_GEMINI_API_KEY |
| 18 | Chưa chạy | MISSING_GEMINI_API_KEY |

## Chạy lại trên máy có .env hợp lệ

```bash
npm run server:eval -- 1 2 3 4 11 12 13 15 16 17 18 --show-opening
```

Nếu tsx CLI không mở được IPC, dùng cùng entry qua loader:

```bash
node --import tsx server/eval/run.ts 1 2 3 4 11 12 13 15 16 17 18 --show-opening
```

Không đưa khóa vào lệnh hay log. Giữ AI_PROVIDER và khóa tương ứng trong cấu hình máy chủ như hiện có.

## Chỉ số mới trong mỗi dòng eval

- `quality.answer`: số từ, lỗi từ tuyệt đối/ngày tháng/số câu, hướng trả lời cho câu hỏi có-không ở full. Care dùng câu cố định, không gọi model; reflective_only không bị ép dự đoán.
- `quality.openingQuote`: đối chiếu trích nguyên văn 2–6 từ với câu hỏi cố định. Trống/quá ngắn: not_applicable; tiêm lệnh hoặc không khớp: review.
- `quality.rhythm`: số câu ≤10 và ≥18 từ, tỷ lệ câu ngắn 25–60%; là chỉ số biên tập, không tạo retry.
- `quality.restrictedAbstract`: số lần mỗi cụm năng lượng/vũ trụ/thông điệp/hành trình.
- `quality.imagery`: so khớp tên biểu tượng đã có trong ngữ cảnh lá, đếm dấu hiệu so sánh; luôn requiresHumanReview. Lá không có biểu tượng cần đối chiếu mô tả gốc khi duyệt.
- `quality.closingEcho`: đếm từ có nghĩa trùng answer/closing; luôn requiresHumanReview.

Giới hạn: kiểm tra từ khóa không chứng minh được số ẩn dụ mới, độ phù hợp của hình ảnh hay closing nhắc đúng ý. Cần đọc lại các tiêu chí này; không báo chúng “qua” tự động. Eval không in nội dung cảm xúc tự nhập.

## Log gốc

### reader-eval.log

```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

> tarot-viet@0.1.0 server:eval
> tsx server/eval/run.ts 1 2 3 4 11 12 13 15 16 17 18 --show-opening

node:net:2145
      const error = new UVExceptionWithHostPort(rval, 'listen', address, port);
                    ^

Error: listen EPERM: operation not permitted /tmp/tsx-0/18.pipe
    at Server.setupListenHandle [as _listen2] (node:net:2145:21)
    at listenInCluster (node:net:2224:12)
    at Server.listen (node:net:2361:5)
    at file:///workspace/scratch/d7e43694ecdf/tarot-app/node_modules/tsx/dist/cli.mjs:53:32174
    at new Promise (<anonymous>)
    at createIpcServer (file:///workspace/scratch/d7e43694ecdf/tarot-app/node_modules/tsx/dist/cli.mjs:53:32152)
    at async file:///workspace/scratch/d7e43694ecdf/tarot-app/node_modules/tsx/dist/cli.mjs:55:542 {
  code: 'EPERM',
  errno: -1,
  syscall: 'listen',
  address: '/tmp/tsx-0/18.pipe',
  port: -1
}

Node.js v24.19.0

```

### reader-eval-loader.log

```text
MISSING_ANTHROPIC_API_KEY

```

### reader-eval-gemini.log

```text
MISSING_GEMINI_API_KEY

```
