# Prompt 8 — ghi nhận kiểm chứng

Không thay prompt/schema/guardrails/care/cards.json. Kết quả luận giải vẫn cuộn liên tục. Không gọi Gemini hay A/B trong lượt này. Git được khởi tạo từ bản trước Prompt 8 vì gói nguồn ban đầu không có repository.

## 8A
- Tất cả trải bài đi qua computeSpreadLayout, Celtic Cross 4×4, cặp 1/2 là ngoại lệ chồng; lá 2 thu nhỏ. Tọa độ px, board đo ResizeObserver/visualViewport, dành 70px cuối màn hình. Không cuộn ngang.
- Mobile chỉ badge; sheet native dialog có focus trap/Esc/đóng nền/trả focus, kéo header xuống đóng, lật ngay trong sheet. Desktop nhãn có title và sheet xem đầy đủ. Dock chuyển lên trên, tự thu khi cuộn xuống.
- 121 test PASS: 120 tổ hợp spread×8 rộng×5 cao; bounds xoay, overlap, z, tâm, >=44px ở ma trận yêu cầu; trường hợp cực nhỏ hữu hạn. Lá nhỏ hơn 44px trong khung thực tế thấp hơn ma trận vẫn có nút chạm tối thiểu44; không hứa tối ưu trên mọi bàn phím/zoom.
- Typecheck PASS. CHƯA kiểm layout/touch/focus/gesture thực tế vì không có Chromium/iPhone. Kiểm toán học không thay kiểm Safari.

## 8B
- vite-plugin-pwa generateSW/prompt; precache shell, lazy JS, CSS/fonts. 78webp gần20MB dùng CacheFirst tối đa78mục/365ngày, purge khi hết quota; Cài đặt có nút tải đủ bộ trước khi offline. API GET/POST NetworkOnly và bị loại khỏi fallback; audit/API no-store. Không precache câu hỏi/kết quả; lịch sử vẫn localStorage.
- Manifest/shortcuts, icon tự vẽ và OG1200×630 sinh bằng sharp; iOS meta/safe-area. Không tạo splash riêng để tránh thêm nhiều ảnh; dùng splash từ manifest của hệ điều hành.
- Toast chỉ reload khi bấm; cài app bằng thao tác người dùng, hướng dẫn iOS dismiss được. Offline có liên kết thư viện/lịch sử; cần vào online và chờ SW cài xong trước lần offline đầu tiên.
- Build cần VITE_SITE_URL=https://<tên miền của bạn> (không bí mật), VITE_ALLOW_INDEX=true để mở index; mặc định noindex + Disallow. noindex không thay xác thực, không bảo đảm crawler preview của mọi nền tảng.
- Hono: shell/SW/manifest no-cache, assets có hash immutable1năm, ảnh/icon1ngày. Cloudflare: Purge Everything sau deploy hoặc Development Mode khi kiểm; không đặt Cache Everything/Edge TTL dài cho sw.js/index.html/manifest hay /api.
- PASS typecheck, 2 test cấu hình và scripts/pwa_check.mjs; build dùng PWA_UNMINIFIED=1 vì worker Terser thoát sớm trong sandbox. Cờ này chỉ để sinh SW không nén (disableDevLogs=true); JS ứng dụng vẫn production/minified. Trên Mac có thể bỏ cờ. Mặc định sản phẩm vẫn SW production.
- CHƯA: Lighthouse, cài/standalone/update/Cache Storage/offline thật, Safari safe-area, preview Zalo/Messenger. Nguồn API tham khảo: https://vite-pwa-org.netlify.app/guide/prompt-for-update và /workbox/generate-sw.html.

## 8C
- Một FxEngine/canvas chung: 140/70 sao sprite, chòm sao tự đặt, meteor7–14s/full, pool40 đối tượng cho trail/burst24/10. Minimal không canvas; hidden/offscreen dừng rAF; debounce resize/DPR2 hoặc1.5. Không đọc layout trong vòng rAF.
- frameHealth hạ full→medium→minimal sau4 cửa sổ500ms thấp liên tiếp, báo và Bật lại. Medium render30fps; full cap60fps. Máy mới cores/memory<=4 khởi đầu medium; lựa chọn tắt đã lưu giữ nguyên.
- Rune SVG dừng khi hidden/offscreen, nebula60–90s; overlay màu theo bộ/ngược, holo chỉ lá tương tác, cảm biến opt-in qua thao tác bấm. Không thêm âm/thư viện hiệu ứng. Trang kết quả vẫn cuộn.
- `#/?fps=1` hoặc Cài đặt → Hiển thị khung hình/giây: FPS render, cấp, hạt sống, số hạ cấp, JSms/frame. 0/minimal nghĩa canvas tắt, không phải đo FPS của trang tĩnh.
- PASS 10 test engine/settings: đồng hồ giả, hidden/offscreen/reduced/minimal, hạ cấp và pool tái sử dụng10.000chu kỳ. Script fx_check kiểm các keyframes không animate layout/filter/shadow. Chỉ3 lớp nebula khai báo will-change bằng CSS; số layer do Framer/browser cấp phải kiểm bằng máy thật.
- CHƯA có số FPS thật, trace, JS<=6ms hay số GPU layer đo được. Sensor iOS, holo/spark/glow và thao tác touch chưa được kiểm trên thiết bị. Bảng FPS là công cụ đo, không phải bằng chứng đã đạt55fps.

## 8D
- Làm quen3thẻ, bỏ qua/nhớ; Lá hôm nay dùng ngày địa phương + ID cục bộ, không server; link đến đúng lá thư viện và Hỏi sâu hơn mở nhập câu hỏi.
- Ảnh1080×1350 dùng canvas/font đã đóng gói, mặc định không câu hỏi, xem trước rồi WebShare/download. Không ghi ảnh/câu hỏi vào SW cache.
- Lịch sử đổi tên riêng trên thiết bị (không sửa schema bài đọc), xóa từng/tất cả đã có xác nhận; tên được dọn khi xóa. cardQuick.json tùy chọn đọc lúc build, thiếu chiều/id dùng summary gốc; tối đa5chip trước Xem thêm.
- Lỗi mạng có câu tiếng Việt/Thử lại, giữ state câu hỏi; 404 và tìm kiếm rỗng có liên kết tiếp. Native dialog giữ focus trap/Esc và trả focus; không khóa pinch zoom của người đọc (chỉ touch-action manipulation ở nút, input>=16px để tránh autozoom).
- Test thuần: daily determinism/range, fallback quick, chia sẻ không câu hỏi và wrap chữ, lưu/đổi tên, tương phản các token trên nền. Tương phản thực tế khi nền/glow/layer chồng nhau, screen reader/tab/sheet và ảnh canvas/font/WebShare CHƯA kiểm trên browser/iPhone.

## 8E
- IP10/giờ trượt, AI_DAILY_CAP150lượt/ngày UTC mặc định (cấu hình env); global tính1lần/lượt, repair/retry chung tối đa3calls như cũ. 429/rate_limited hoặc daily_budget; API no-store/log metadata.
- CF-Connecting-IP chỉ tin khi socket loopback; remote/malformed bị bỏ qua. Giữ backend bind127.0.0.1. Bộ đếm RAM reset khi restart; chưa có giới hạn bền vững/multi-worker.
- SIGTERM/SIGINT ngừng nhận request mới, chờ request và socket đóng, grace120s rồi forceclose/exit1. Plist ExitTimeOut130s, KeepAlive; caffeinate chạy riêng/thiết lập ngăn ngủ để Node nhận signal trực tiếp; README có .env, log, update, backup và purgeCloudflare. Không cài/chạy launchd hay đổi DNS/tunnel tự động.
- PASS10test production/ops: IP giả, cửa sổ qua nửa đêm, global UTC, 429/header, shutdown chờ/force/idempotent, template. CHƯA kiểm launchd/caffeinate/tunnel/Cloudflare trên Mac thật.

## Bạn cần kiểm trên iPhone
1. Celtic Cross vừa màn440×~850, không cắt lá/nhãn, dock không đè; thử sheet/lật/phím và các cỡ font.
2. Cài PWA → mở standalone; safe-area/statusbar, dismiss hướng dẫn, bản mới chỉ tải lại sau khi bấm.
3. `#/?fps=1` → cấp full: ghi FPS khi xáo/lật/cuộn; thử medium/minimal và Bật lại. Chưa có số đo thật từ môi trường này.
4. Chia sẻ link trên Zalo/Messenger để kiểm OG; robots/Cloudflare có thể ảnh hưởng crawler.
5. Mở online/chờ SW cài xong, tắt mạng → thư viện78lá/lịch sử vẫn mở; để đủ hình, trước đó bấm Cài đặt → Tải đủ ảnh ngoại tuyến; rút bài mới báo cần mạng. Ảnh chia sẻ xem trước/giữ câu hỏi tắt sẵn.

## Kiểm cuối và giới hạn
- Ảnh OG đã mở xem trực tiếp: đúng1200×630, chữ Việt và icon hiện đủ. Đây không phải kiểm preview Zalo/Messenger.
- Suite đầu:723/726PASS; 3test cũ còn gắn6lượt/phút, cap500 và câu lỗi mạng cũ. Đã cập nhật kỳ vọng10lượt/giờ, cap150 và câu offline mới; không bỏ test.
- Dọn compiler cache khỏi Git, không đóng gói .env/node_modules/dist. Có bản patch từng commit để chuyển lịch sử thay đổi sang repo của bạn.

### Kết quả xác nhận cuối
- Typecheck PASS; build PASS với VITE_SITE_URL=https://tarotvp.id.vn và PWA_UNMINIFIED=1 trong sandbox.
- Suite đầy đủ:726/726PASS (`tests-verified.json`). Sau thay đổi cuối về cache ảnh/ranh giới nhãn và binding rAF:128/128test liên quan PASS (`targeted-final.json`), gồm thêm1test cache ảnh; production/cache HTTP đã kiểm riêng7testPASS. Không chạy Gemini/A/B.
- pwa_check và fx_check PASS. 49mục precache, khoảng1,4MB shell/fonts/JS; ảnh20MB dùng runtime cache/tải chủ động. Không có FX trong modulepreload: chỉExplicitManualChunks tránh Rollup kéo FX vào entry do shared dependency.
- Gói entry43,62KB gzip so35,89KB trước; cộng cả FX động và helper đăng ký SW, chênh8,83KB gzip (<15KB). Đây là số build, **không phải** FPS/CPU/mạng thực tế; worker SW không nén trong sandbox được thống kê riêng, không phải entry UI.
- 13tệp prompt/schema/guardrails/cards/safety đối chiếu SHA256 giữ nguyên (`protected-files.json`). Payload hồ sơ/số/id và nội dung luận giải giữ nguyên; chỉ thêm kiểm offline trước gửi.
- Sửa cuối: nhãn desktop dành chỗ theo viewport dù cột hẹp; nút chạm có vùng44px riêng không kéo méo ảnh nhỏ; kéo sheet bắt pointer; dock không thu khi có thông báo; tệp asset mất trả404/no-store, không trả index.html/immutable.

| Mục | Đã triển khai | Đã kiểm | Chưa kiểm thực tế |
|---|---|---|---|
| 8A | Bàn px chung, Celtic4×4, sheet, dock |121test hình học, typecheck|Safari440×850, focus/touch/safe-area|
| 8B | PWA/prompt update, offline text/image cache, icon/OG/meta |Manifest/cache tests, build/SWcheck, xem PNG OG|Install/update/offline thật, Lighthouse, social preview|
| 8C | Engine chung, pool40, sao/rune/glow/holo, FPS/sensor |Clock/pool/settings tests, CSS static, gzip budget|FPS55/JS6ms/GPU layers, cảm biến và hiệu ứng trên iPhone|
| 8D | Onboard/daily/share/history/quick text/error |6test dữ liệu/riêng tư/contrast token|Canvas share, tab/screenreader, tương phản DOM tổng thể|
| 8E | Limits/trusted IP/shutdown/ops Mac |10test production/ops; plist XML parse|launchd/tunnel/caffeinate/Cloudflare thật|
