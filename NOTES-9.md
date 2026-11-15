# Dọn nợ kỹ thuật 9

## P0
Trước sửa không có diff tracked của người dùng trong workspace; chỉ có các patch/report chưa track từ các lượt trước, giữ nguyên. Quy tắc dock trong bản nguồn đang thiếu các thuộc tính căn giữa được người dùng gửi, nên bổ sung đúng tại chỗ, không thay file. Commit riêng “chỉnh tay của người dùng”. Test giữ nguyên chuỗi CSS nguồn; `maintenance_check.mjs` xác nhận đầy đủ9 thuộc tính trong CSS build. Chưa kiểm thiết bị thật.

## P1 — repair và ngân sách
- Test tái hiện **ĐỎ cả targetedRepair và verdictRepair** trước sửa (`reports/prompt-9/p1-before.log`): điều kiện `overrides.repairFields && completionCalls >= 1` trong `createApp.complete.beforeCall` chặn backup thật, không phải nhánh chỉ dành cho test.
- Bỏ điều kiện đó; ngân sách chung tối đa 3 completion (kể cả kết quả không hợp lệ) và 5 lần thử. Lỗi transport không có usage không chiếm completion. Usage của Gemini được ghi trước khi kiểm MAX_TOKENS/block để không bỏ sót chi phí. Thành công không báo usage cũng tính một completion theo hướng bảo thủ.
- Repair chỉ nhận một completion; transport được đi tiếp trong ModelChainProvider. Tên model repair của Gemini lấy từ cấu hình fallback của chính provider; không còn hard-code trong hai hàm repair.
- Cập nhật các test cũ vốn chặn tất cả ở ba attempts cho đúng ngân sách mới, và test personal dùng tên model cấu hình thay hard-code; giữ nguyên chặn an toàn. Test fake không gọi Gemini thật.

## P2 — môi trường Node
- Suy cấu hình thiết bị chỉ khi có cả `window` và `document`, đọc `window.navigator`; Node có global navigator không làm thay đổi mặc định.
- Quét `src/lib`: clipboard dùng capability check trong thao tác sao chép; aiClient chỉ kiểm `onLine === false`; hai nơi này không suy cấu hình thiết bị. browserStorage đọc window trong try/catch, không truy cập localStorage toàn cục.
- Ba test hồi quy qua. Môi trường hiện có Node v24.19.0; chưa chạy Node 20/22 (không có binary tương ứng). Toàn bộ suite chạy Node 24 ở bước cuối.

## P3 — hạn mức ngày/IP
- `AI_DAILY_IP_LIMIT` mặc định40, kiểm atomically cùng hạn mức giờ/ngày chung; reset lúc 00:00 UTC. Giới hạn bộ nhớ bucket IP vẫn có; khi quá 10.000 IP lạ dùng bucket bảo thủ.
- HTTP429, log reason và client phân biệt `daily_ip_limit`, dùng đúng lời nhắn yêu cầu. README/ops có tên biến và thời điểm reset.
- Test kiểm IP khác vẫn dùng được, request bị từ chối không tăng counter, giờ trượt/ngày UTC, env, response/log. Chưa thử nhiều thiết bị/IP thật.

## P4 — ảnh thu nhỏ
- Sinh 78 ảnh WebP rộng360px vào `public/card-thumbs/`, giữ toàn bộ ảnh gốc. Script nén theo từng ảnh, mọi ảnh ≤30KiB; chưa kiểm chất lượng hình bằng mắt trên thiết bị.
- Thư viện, Hôm nay, lịch sử, hồ sơ và các ảnh mini dùng thumbnail. CardFace đặt kích thước, async decoding, mặc định lazy; thư viện chỉ 6 ảnh đầu eager. Mặt trước bàn bài chỉ mount khi đã bắt đầu lật, không tải ảnh đầy đủ từ lá úp.
- CacheFirst riêng, tối đa78 thumbnail, không precache ảnh; tải ngoại tuyến theo thứ tự thumbnail → ảnh đầy đủ, có tiến độ và hủy bằng AbortController (giữ ảnh đã lưu).
- Dung lượng đo từ tệp: 78 ảnh gốc **19.701,0KiB**, 78 thumbnail **2.166,6KiB**. Sáu ảnh đầu: **1.494,3KiB → 167,5KiB**. Đây là ngân sách ảnh eager từ build, KHÔNG phải phép đo Network thực tế: browser có thể tải thêm ảnh lazy gần viewport. Chưa xác nhận số byte trên 4G hay độ mượt.
- Tests kiểm78 tệp, trần30KiB, cache, thứ tự tải/hủy; số liệu chi tiết `reports/prompt-9/image-sizes.json`.

## P5 — render bàn bài
- React.memo trên OccupiedSlot và từng wrapper slot của bàn cũ/Celtic mobile. Geometry/style của các slot giữ bằng useMemo; callback flip/inspect giữ bằng useCallback; Map origins vốn là useRef đã ổn định, giữ nguyên.
- Vòng sáng lá tiếp theo chuyển selector sang `data-next` ở board, không truyền prop đổi qua lá chưa lật; hình học, gạch vàng, tên lá và hiệu ứng không đổi.
- Test dùng ReactDOM thật với host DOM tối thiểu tự viết (không thêm dependency), mock animation/đo kích thước. Sau một flip: đúng1 CardFlip render ở cả hàng3 và Celtic10; tiến độ mobile cập nhật1/10. Đây là test reconciliation, KHÔNG là kiểm browser/layout/FPS. Animation của chính lá lật vẫn có các render theo phase vốn có.


## P6 — font, dữ liệu và breakpoint
- Sáu @font-face tĩnh trong `src/fonts.css`, giữ font/weight đang dùng, font-display swap và Unicode range từ Fontsource. Preload3 subset tiếng Việt, URL được Vite băm; build check xác nhận đủ3 tệp và có trong precache.
- Trước sửa `dist/index.html` có modulepreload card-data. Sau sửa, static graph trang đầu chỉ có index/react/motion; card-data (229,34KB thô; 58,72KB gzip) là lazy. Danh tính lá dùng catalog nhỏ kiểm khớp100% với cards.json. Khi bắt đầu xào mới tải deck; thư viện/Hôm nay/kết quả tải nội dung khi mở. SW vẫn precache dữ liệu sau khi đăng ký để offline, không phải dependency JS chặn trang đầu.
- Tách reconstruction lịch sử và wire profile khỏi đường tải ban đầu; giữ nội dung và hợp đồng dữ liệu. Test fixture mock thêm catalog tương ứng, không bỏ assertion.
- `BREAKPOINTS`/`MEDIA` đặt tên cho đúng các ngưỡng599/767/768/850/1100 đang lặp. CSS dùng named media được plugin Vite nhỏ mở rộng về số cũ (không thêm thư viện); không dùng CSS var trong media query vốn không hợp lệ. Những ngưỡng độc lập khác giữ nguyên, không ép bố cục vào ngưỡng mới. Build check không còn named media chưa mở rộng.
- Chưa kiểm nhấp nháy font, hình thức và cache offline trên Safari/Chrome thật.

## Kiểm tra cuối và giới hạn
- `npm run typecheck`: PASS. `npm test`: **669/669**, 56 files, Node v24.19.0. `npm run build`: PASS (dùng `PWA_UNMINIFIED=1 VITE_SITE_URL=https://tarotvp.id.vn`, cờ sandbox sẵn có chỉ để SW không minify).
- `maintenance_check.mjs`, `pwa_check.mjs`, `fx_check.mjs`, `git diff --check`: PASS. 18 SHA-256 protected giữ nguyên; không đổi prompt/schema/guardrail/cards.json/care. Không sửa chuỗi prompt trong hai hàm repair. Các ảnh gốc không thay đổi.
- Chưa chạy Node20/22; chưa mở trình duyệt hoặc iPhone; chưa đo Network/4G/FPS/font flash; chưa thử cài đặt/offline/update SW trên thiết bị; không chạy Gemini thật hay A/B trong P9.
- Test dùng fixture/provider giả; bộ đếm RAM không mô phỏng nhiều process. Tất cả giới hạn vẫn dành cho một server process như trước.
- P0 và mỗi P1–P6 là commit riêng. Bản ZIP có patch tương ứng trong `reports/prompt-9/patches/` để review/hoàn lại, không có `.env`, node_modules, dist hoặc khóa API.

| Mục | Đã làm | Bằng chứng | Còn cần thiết bị thật |
| --- | --- | --- | --- |
| P0 | Giữ nguyên CSS dock nguồn | Static test + CSS build | Vị trí/căn giữa hai nút |
| P1 | Repair tới backup, trần3 completion/5 attempts | Tái hiện đỏ → xanh, test budget | Nhà cung cấp thật khi lỗi mạng |
| P2 | Tách Node navigator khỏi browser | Test giả navigator, full suite Node24 | Node20/22 chưa có |
| P3 | 40 lượt/IP/ngày UTC | Giờ/ngày/IP độc lập, HTTP429/log | Nhiều IP thật |
| P4 | 78 thumbnail/lazy/cache/hủy tải | Sáu ảnh1494,3→167,5KiB, kiểm tệp build | Bytes tải thật, chất lượng hình, offline |
| P5 | Memo slot/geometry/callback | Một flip chỉ render1 CardFlip | Hiệu ứng và độ mượt |
| P6 | Font tĩnh/preload, cards lazy, breakpoint chung | Manifest graph, font precache, tests | Font flash và bố cục |

Sau cập nhật, hãy kiểm: hai nút vẫn44×44; hàng3/Celtic và hiệu ứng lật giữ như8c; thư viện ảnh rõ, tải ngoại tuyến/hủy rồi tắt mạng; một lượt luận giải bình thường. Không cần chạy lại A/B.
