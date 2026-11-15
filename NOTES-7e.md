# NOTES-7e

**Cập nhật theo phản hồi:** màn luận giải đã trở lại cuộn liên tục, tất cả lá cùng nằm trên trang. Bỏ phân trang, nút trước/sau và bắt vuốt ngang. Cột chữ không cuộn riêng. Thanh vị trí chỉ cuộn nhanh đến lá và theo dõi vị trí đang đọc. Giữ bố cục chữ, Đọc thêm, phóng to và hiệu ứng xuất hiện khi cuộn tới. Phần mô tả màn một lá bên dưới ghi lại bản 7e ban đầu, đã được thay bằng hành vi này. Typecheck/build được kiểm lại; chưa kiểm Chromium.

Bản triển khai để review; chưa nghiệm thu UI bằng Chromium. Không thay schema đầu ra, dữ liệu lá, bài mẫu, system prompt v1 hay chế độ care. Các chặn an toàn tầng 1 vẫn giữ. Không triển khai lên production.

## Đường sửa verdict/answer

- Production có tối đa một lượt sửa riêng cặp `{verdict, answer}` khi verdict của câu hỏi có/không chưa có hướng, hoặc một trong hai trường chứa từ trừu tượng trong danh sách 7e.
- Nhận diện hướng bỏ trường hợp “có nỗi/có sự/có điều/có một/có những/có cảm xúc” khi chỉ là lời mô tả. Đây là thay đổi note mềm hiện có, không thêm chặn.
- Input chỉ có câu hỏi, context, lá/vị trí/chiều, hai trường hiện tại, một câu lý do. Ưu tiên `gemini-3.5-flash` nếu nằm trong model cấu hình được phép; không tự gọi model ngoài cấu hình.
- Chỉ nhận bản sửa khi hết điều kiện kích hoạt và toàn bài không có lỗi cứng. Bản sửa xấu/lỗi provider giữ nguyên bản an toàn, thêm `verdict_repair_rejected`. Không sửa các lỗi mềm khác.
- Ngân sách 3 lần gọi dùng chung với primary, hard repair/retry/fallback. Mỗi lời gọi sửa chỉ có một lần transport, không retry ngầm. A/B first-pass vẫn một call; cờ sửa cho phép thêm một call chỉ cho cặp này.
- `personal_schema` ghi path + code cụ thể trong schemaIssues và diagnostics. Không thay điều kiện chặn personal, vẫn sửa một lần rồi bỏ personal nếu cần.

## UI đã triển khai trong mã

- Màn một lá với chuyển trước/sau, ←/→, vuốt ngang; cuối bài đi đến tổng hợp; rail desktop và vị trí mobile.
- Thứ tự: chip vị trí, mô tả phụ, tiêu đề, tên VI/EN, notice có nhãn, từ khóa, nghĩa đầu tiên và Đọc thêm. Hình ảnh nằm dưới lá, không lẫn trong phần dành cho người hỏi.
- Nghĩa sách giữ nguyên chữ, gộp xuống dòng đơn và giữ phân đoạn trống. Đọc thêm nhớ theo lá/chiều trong sessionStorage.
- Lightbox dùng dialog native: Esc, nhấp ngoài, focus trap của browser và trả focus. Lá có tilt tối đa ±6° chỉ con trỏ fine và hiệu ứng full.
- Cỡ chữ/token dùng chung cho AnswerHero, kết quả, Lịch sử, Cài đặt. Right column giới hạn chiều rộng và có cue khi còn nội dung; mobile một cột, safe area; số mờ đưa vào góc tránh tiêu đề.
- Chuyển cảnh chỉ transform/opacity, exit/enter 160ms mỗi chiều, chữ cách 65ms, tổng đến khối thứ năm khoảng 600ms. Ánh vàng một lần, sắc glow theo bộ; không thêm hạt mới.
- Mặc định motion/effects/detail full; quick toggle cạnh âm thanh; lời nhắc OS giảm chuyển động không chặn thao tác và lưu lựa chọn.
- Bộ theo dõi FPS dùng bốn cửa sổ khoảng 500ms liên tiếp dưới 30fps, bỏ qua tab ẩn/đoạn gián đoạn. Giảm một cấp mỗi phiên mount, có nút Bật lại. Đây là cơ chế đã test bằng thời gian giả lập, không phải bằng chứng FPS thực tế.

## Migration và khôi phục

Giữ key `tarot.settings.v1` để đọc dữ liệu cũ, nâng **schemaVersion lên 2**. Giá trị mặc định cũ (motion system, effects medium theo mobile) đổi sang full và ghi lại một lần; các trường không liên quan giữ nguyên. Dữ liệu v2 giữ lựa chọn mới qua reload.

Mã nguồn 7d thực tế không mặc định motion reduced hoặc effects minimal: đó là dấu hiệu lựa chọn tắt. Migration bảo toàn những giá trị này và đánh dấu đã trả lời lời nhắc, đáp ứng “người dùng đã tắt → giữ tắt”. Không có metadata xuất xứ trong bản cũ, nên không thể phân biệt một bản cũ khác từng mặc định reduced với người chủ động chọn reduced. Với trường hợp mơ hồ đó, ưu tiên giữ lựa chọn tắt. Không âm thầm reset toàn bộ legacy reduced.

Muốn trở lại hành vi cũ trên một máy: Cài đặt → Chuyển động → Theo hệ thống; Hiệu ứng → Vừa nếu cần; Tóm tắt ở màn kết quả. Muốn đổi mặc định cho người dùng mới: sửa DEFAULT_SETTINGS trong `src/lib/settings.ts` (motion system, effects theo deviceEffectDefault, detail summary), không hạ version đã lưu. Bản nguồn trước sửa và ZIP 7d vẫn là điểm rollback.

## Kiểm thử thay đổi

Test cũ về settings cập nhật để nhận metadata v2/full. Test số ca eval không hợp lệ chuyển 24 sang 30, vì 24–29 nay hợp lệ. Test hard-repair answer dùng verdict đã có hướng, để chỉ kiểm hard-repair mà không vô tình kích hoạt đường mềm mới. Bổ sung test riêng cho hướng thiếu, sửa bị từ chối, câu hỏi mở, trừu tượng, trần 3 call, heldouts và diagnostics personal.

## Chưa làm / chưa xác minh

- **Chưa có ảnh trước/sau**; Chromium không có sẵn, gói tải trình duyệt không phải ZIP hợp lệ. Script có ở `scripts/ui_shots.mjs` và kiểm tra ở `scripts/ui_audit.mjs`.
- **Chưa kiểm bằng mắt** 1440×900/1920×1080/768×1024/390×844; chưa xác nhận overflow 360px, mọi target 44px, vùng notice+keyword nằm trên nếp gấp, title không đè số bằng DOM thực tế.
- **Chưa chứng minh mọi chữ tương phản ≥4,5:1**. Token mới chọn màu rõ hơn, nhưng không thay kiểm tra DOM/ảnh. Script đánh dấu nền gradient/hình là unresolved, không báo pass giả.
- **Chưa đo FPS thật**; chưa xác nhận mục tiêu 55fps, chưa chạy thao tác lightbox/touch/focus bằng browser. Các phần này là điều kiện còn thiếu trước nghiệm thu E–I.
- Chưa kết luận v1 tốt hơn về giọng từ tỷ lệ ra bài. Người dùng đọc mù trước khi mở KEY; các ca không có bài không chấm chất lượng.

Xem `reports/AB/OPS.md`, các run log, `reports/production-12-7e.md`, và `reports/ui/STATUS.md` để biết kết quả thực tế. Ca 20–22 từ 7d chỉ là ca hợp đồng trùng mẫu, không được dùng làm bằng chứng chất lượng.

## File mã nguồn đã thay đổi

- `scripts/ui_audit.mjs` (new)
- `scripts/ui_shots.mjs` (new)
- `server/answerRules.ts` (modified)
- `server/app.test.ts` (modified)
- `server/app.ts` (modified)
- `server/eval/ab.ts` (modified)
- `server/eval/run.ts` (modified)
- `server/guardrails.ts` (modified)
- `server/sevenD.test.ts` (modified)
- `server/sevenE.test.ts` (new)
- `server/verdictRepair.ts` (new)
- `src/components/AmbientControls.tsx` (modified)
- `src/components/CardReader.tsx` (new)
- `src/components/EffectsControls.tsx` (new)
- `src/components/ReadingScenes.tsx` (modified)
- `src/components/answerHero.css` (modified)
- `src/fx/useCardTilt.ts` (modified)
- `src/hooks/useSettings.tsx` (modified)
- `src/lib/frameHealth.ts` (new)
- `src/lib/settings.ts` (modified)
- `src/lib/settings7e.test.ts` (new)
- `src/lib/storage.test.ts` (modified)
- `src/lib/useMotionPreference.ts` (modified)
- `src/screens/ResultScreen.tsx` (modified)
- `src/screens/readingStage.css` (modified)
- `src/theme.css` (modified)

## Kết quả chạy thật

- Ca 12 production: **có bài**, bỏ personal (`personal_dropped`), **2 call / 9.585 token / 11,153 giây**. Không gặp personal_schema ở lượt thật; gặp personal_style rồi personal_year_context. Diagnostics schema cụ thể đã test bằng fake provider.
- Heldout 24–29: old 6/6 ra bài, v1 3/6, v1+cờ sửa 3/6. Tổng 18 call, đúng một primary mỗi ca/biến thể; không tự chạy lại. Một lỗi network ở v1, các lỗi còn lại là guard. Đây là số vận hành, không phải điểm văn.
- Lượt thứ ba **0/6 kích hoạt sửa**; chưa có bằng chứng live rằng đường sửa cải thiện chất lượng. Việc so sánh dùng lượt sinh độc lập nên chịu nhiễu sinh mẫu.
- Typecheck, 573 test (38 file), build đều PASS. `cards.json`, hai schema giữ nguyên SHA-256.
