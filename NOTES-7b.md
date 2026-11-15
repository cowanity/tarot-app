# Bản sửa 7b

- Verdict bắt buộc cho bài mới; bản History cũ thiếu verdict vẫn đọc được.
- Answer tối đa 45 từ; loại câu né tránh, sửa verdict/answer bằng một lượt repair; nếu không đạt, thử toàn bài bằng model dự phòng một lần rồi trả AI_BUSY.
- Scene do server lấy từ cardImagery; prompt model không còn scene. Thêm kiểm tra notice_copy, tension_vague, card_name_variant và mở đầu bị cấm.
- AnswerHero ở đầu kết quả: verdict vàng, answer có chữ đầu in đậm, chú thích tĩnh, reduced-motion và skeleton. Sao chép/Lịch sử bắt đầu bằng verdict + answer.
- Giữ nhạc mặc định bật; test xác nhận chỉ phát sau thao tác người dùng.

## Kiểm tra

Typecheck thành công. 532 test qua / 34 file. Production build thành công.
Eval thật bị duyệt tự động chặn: xem reports/EVAL_VOICE.md. Không có bài đọc 7b giả.
Những tiêu chí ngữ nghĩa như không bịa chuyện, chất thơ, đúng hai lực cụ thể và thứ tự diễn giải vẫn cần đọc duyệt trên output thật; các guard từ vựng không chứng minh toàn bộ chất lượng.

## Áp dụng

Đây là bản mã nguồn đầy đủ. Giải nén ra thư mục riêng để đối chiếu hoặc chép đè mã nguồn vào tarot-app hiện tại. Giữ nguyên .env của bạn; ZIP không chứa khóa API, node_modules hoặc dist.
Chạy npm ci, npm run typecheck && npm test, npm run build rồi khởi động lại server.
Các báo cáo cũ trong ZIP được đặt dưới reports/before-7b để không nhầm với eval mới.

## File mã nguồn thay đổi

- `server/answerRules.test.ts`
- `server/answerRules.ts`
- `server/app.test.ts`
- `server/app.ts`
- `server/eval/quality.ts`
- `server/eval/repetition.ts`
- `server/eval/run.ts`
- `server/gemini.test.ts`
- `server/geminiResponseSchema.json`
- `server/guardrails.ts`
- `server/prompts/goldenExamples.ts`
- `server/prompts/system.ts`
- `server/prompts/user.ts`
- `server/provider.ts`
- `server/schema.ts`
- `server/styleCard.ts`
- `server/targetedRepair.ts`
- `server/thirdParty.test.ts`
- `server/thirdParty.ts`
- `server/voiceRules.test.ts`
- `server/voiceRules.ts`
- `src/components/AnswerHero.tsx`
- `src/components/answerHero.css`
- `src/lib/aiClient.ts`
- `src/lib/aiPresentation.ts`
- `src/lib/ambientMusic.test.ts`
- `src/lib/readingStage.test.ts`
- `src/lib/readingV2.ts`
- `src/screens/HistoryScreen.tsx`
- `src/screens/ResultScreen.tsx`
