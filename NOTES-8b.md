# Sửa lỗi 8b

Mốc hoàn lại: `before-8b`. Mỗi mục F1–F6 có commit riêng.

## F1
Trang hôm nay tách thành `#/today`; home không chứa lá hôm nay. Màn chào dùng native dialog, Esc/hoàn tất/bỏ qua lưu đã xem; lời nhắc giảm chuyển động đợi màn chào đóng. Test nguồn xác nhận wiring, chưa kiểm trình duyệt thật hoặc kích thước nav bằng render.

## F2
Nguyên nhân trong mã: ResizeObserver đọc vị trí top của chính board, trừ 70px khỏi phần viewport còn lại, gán ngược height rồi hàm layout lấy min theo height. Khi board ở thấp trên trang, lá bị ép còn rất nhỏ. Đã bỏ vòng đo này: observer chỉ cấp contentRect.width; board có height tính từ chiều rộng. Trang được cuộn dọc khi cần. Hai bước chọn/lật dùng cùng adapter đo. Lá chéo được dành sẵn khoảng ngang để không chạm lá cạnh; huy hiệu là span trong góc, không còn button tối thiểu 44px làm phình số. Lá úp gọi lật trực tiếp; dock mobile vào luồng header.
151 test hình học/measurement qua (H thiếu/0/120/200/844, W320–1920), gồm chồng lấn, khoảng cách, badge và hai giai đoạn. Test cũ ép board.height <= viewport đã thay vì trái yêu cầu mới cho phép cuộn dọc. Chưa chứng minh hiển thị trên Safari/Chrome thật.

## F3
Khôi phục mount Starfield cũ và thời lượng aurora 38/47/59 giây từ baseline `ebb65eb` (bản trước Prompt 8 đang có trong repo; không có lịch sử commit 7d riêng). Gỡ đường nối/sao băng và sweep/rune khỏi các màn. Canvas chỉ mount khi có hạt lật/xáo bài; hết hạt thì dừng và unmount. Giữ SparkPool, FxEngine, ánh kim, hiệu ứng lật và hạ cấp FPS. Test nguồn + engine giả; chưa so nền bằng mắt trên trình duyệt. Một engine vẫn đo FPS khi không có hạt để hạ cấp sau bốn cửa sổ chậm; không tạo canvas nền. Dừng rAF khi hidden/reduced/minimal. Chưa có số FPS thật từ thiết bị.

## F4
Đã xóa công tắc FPS và thuộc tính lưu showFps. Overlay chỉ bật bằng `?fps=1` (trong hash hoặc search URL). Test nguồn xác nhận không còn công tắc. Chưa kiểm render.

## F5 — chẩn đoán trước/sau
Không có log từ server Mac hoặc phản hồi HTTP của lượt thất bại trong ảnh, nên **chưa xác định nguyên nhân trực tiếp của các lượt trên thiết bị**; không kết luận hết quota hay lỗi Gemini.

Kiểm mã trước sửa:
- Log có errorCode/providerError/attempts nhưng 429 nội bộ chung RATE_LIMIT; AI_BUSY cuối có thể che mã 429/5xx nhà cung cấp trước đó. Chưa có reason chuẩn.
- clientIp đã nhận đủ ::1, 127.0.0.1, ::ffff:127.0.0.1; CF-Connecting-IP chỉ được tin từ loopback. Không tìm thấy lỗi gom IP trong hàm này. Cần log/kiểm đường tunnel thực tế để biết cấu hình vận hành có đúng không.
- Lỗi xác nhận được: middleware tăng bộ đếm IP trước kiểm body/care, vì vậy 400 và chặn trước provider cũng tiêu lượt.

Đã chuyển tính IP + trần ngày thành thao tác đồng bộ tại beforeCall đầu tiên. Retry/repair vẫn chung tối đa 3 call, chỉ tính một lượt. Đã từ chối thì không tiêu cả hai ngân sách. Mặc định AI_HOURLY_IP_LIMIT=20, AI_DAILY_CAP=150; cấu hình đã ghi trong .env vẫn được ưu tiên, không tự sửa .env.

Mỗi request lỗi có một dòng audit JSON metadata với reason: rate_limited, daily_budget, provider_429, provider_5xx, provider_network, timeout, guard_blocked hoặc bad_request. Giữ mã provider gốc khi tầng transport kết thúc bằng AI_BUSY. provider_network cũng là nhóm lỗi giao tiếp không có mã HTTP; provider_5xx khi chỉ biết AI_BUSY nghĩa là nhà cung cấp chưa khả dụng, không khẳng định nhận HTTP 5xx. Xem thêm providerError/attempts để phân biệt. Không ghi câu hỏi, bài đọc, khóa hoặc IP.

Ví dụ dòng rút gọn: `{"path":"/api/interpret","status":429,"reason":"daily_budget","attempts":[],"tokens":0}`. Xem log server theo ops/README.md, lọc `reason`; 429 có reason provider_429 là lỗi phía nhà cung cấp (HTTP trả client có thể 502/503), khác rate_limited của app. Bộ đếm ở RAM: restart đặt về 0; trần ngày theo UTC.

Client giữ reason qua reducer, hiển thị hai câu riêng cho giới hạn IP/ngày, vẫn có Thử lại/Đọc theo sách. Lỗi mạng ở panel dùng câu dự phòng chung theo F5; banner PWA khi offline vẫn giữ lời nhắc cần kết nối mạng. Retry-After tối đa một ngày để không hẹn sớm hơn trần ngày. Test giả kiểm 400/care không tiêu lượt, retry3 tính1, các reason, IP loopback/spoof và reset. Không gọi Gemini thật.

## F6 — kiểm tra cuối

| Mục | Đã sửa | Đã kiểm | Chưa kiểm |
| --- | --- | --- | --- |
| F1 | Trang hôm nay riêng, popup chào, xếp thứ tự nhắc chuyển động | Wiring + lưu lựa chọn qua reload/khi storage bị chặn | Native dialog, nav 360px trên trình duyệt |
| F2 | Đo theo width, height suy ra, lật ngay, dock trong header mobile, nhãn 1–2 tách dòng | 151 ca hình học/đo giả; thêm target hồi quy | Render trên Mac/iPhone, focus/touch thật |
| F3 | Nền trước 8, canvas hạt tạm thời, giữ bộ giảm FPS | Engine đồng hồ giả, pool, kiểm tĩnh CSS/source | Nền bằng mắt, FPS thật |
| F4 | Bỏ FPS khỏi Cài đặt, chỉ URL | Kiểm wiring | Overlay trên thiết bị |
| F5 | Tính lượt tại provider, reason/log và thông điệp riêng | 227 test server/client; hồi quy production IP | Lượt Gemini và log server Mac thật |
| F6 | Tag, commit riêng, checksum, báo cáo | typecheck; 773/773 test; build; kiểm tệp PWA và CSS FX; 18 SHA-256 không đổi | Chromium/Safari, Lighthouse |

Lệnh build trong môi trường này: `PWA_UNMINIFIED=1 VITE_SITE_URL=https://tarotvp.id.vn npm run build`. Đây là tùy chọn có sẵn từ 8: chỉ không minify service worker để tránh giới hạn worker của sandbox; JS/CSS app vẫn production build. Không thay cấu hình PWA. Báo cáo tại reports/prompt-8b/ (tests.json, tests.log, typecheck.log, build.log, pwa-check.log, fx-check.log, protected-check.json). 157 test hồi quy riêng đã qua sau điều chỉnh kích thước lá chéo theo desktop/tablet.

Test cũ production dùng body `{}` để tiêu quota đã đổi sang payload hợp lệ thực sự gọi provider giả; giữ kiểm IP khác nhau. Test giới hạn 10 đã đổi 20; thời gian chờ client tối đa 24 giờ để tôn trọng Retry-After trần ngày. Không sửa test nội dung/prompt/guard để né lỗi.

Ảnh đính kèm đã đọc được sau khi tệp sẵn sàng; dùng để đối chiếu lỗi cũ, không phải ảnh chụp giao diện đã sửa. Không có ảnh sau, không tuyên bố đạt hiển thị hoặc FPS trên thiết bị.

### Người dùng tự kiểm
1. Mở web: chỉ trang trải bài; “Hôm nay” là mục riêng, cả 5 mục vừa ở 360px.
2. Trình duyệt mới có popup chào, lần sau không; Esc/bỏ qua hoạt động; nhắc giảm chuyển động không chồng popup.
3. Chọn và lật 3 lá: lá đủ lớn, Mac đọc đủ nhãn, iPhone đủ ba lá ngang.
4. Celtic Cross trên iPhone: 10 lá rõ; chỉ 1–2 chồng; số nhỏ trong lá; nếu cao thì trang cuộn bình thường.
5. Chạm lá úp lật ngay; chạm lá đã lật mở sheet, đóng xong trả focus.
6. Nền như trước 8, không đường/vệt chéo; hiệu ứng lật và nút tắt vẫn hoạt động.
7. Cài đặt không còn FPS; chủ app có thể mở `#/?fps=1` khi cần.
8. Một lượt luận giải thật thành công, hoặc đúng thông điệp nguyên nhân; lấy dòng log `reason` tương ứng nếu vẫn thất bại. Chưa có căn cứ khẳng định lỗi thật trên Mac/iPhone đã hết.

### Hoàn lại
Trong repository đang làm việc có tag `before-8b`; các commit F1–F6 riêng. Danh sách hash và patch nằm ở reports/prompt-8b/. Dùng `git revert <hash>` cho mục cần hoàn lại; các mục cùng chạm App/CSS/NOTES có thể cần xử lý ngữ cảnh khi hoàn lại riêng. Nếu dùng ZIP và không có lịch sử git, các patch vẫn giúp xem chính xác thay đổi; kiểm `git apply --reverse --check <patch>` trước khi áp dụng ngược. Giữ `.env` hiện tại; không có khóa trong gói gửi lại.

### File thay đổi

- `NOTES-8b.md`
- `ops/README.md`
- `ops/environment.example`
- `server/app.test.ts`
- `server/app.ts`
- `server/callBudget.ts`
- `server/config.ts`
- `server/failureReason.ts`
- `server/limits.ts`
- `server/ops8.test.ts`
- `server/production.test.ts`
- `src/App.tsx`
- `src/components/AiReadingPanel.tsx`
- `src/components/AmbientControls.tsx`
- `src/components/EffectsControls.tsx`
- `src/components/FpsOverlay.tsx`
- `src/components/Navigation.tsx`
- `src/components/Onboarding.tsx`
- `src/components/SpreadBoard.tsx`
- `src/fx/ParticleCanvas.tsx`
- `src/hooks/useAiReading.ts`
- `src/hooks/useHashRoute.ts`
- `src/lib/aiClient.test.ts`
- `src/lib/aiClient.ts`
- `src/lib/aiErrorMessage.ts`
- `src/lib/aiState.ts`
- `src/lib/fixes8b.test.ts`
- `src/lib/onboarding.test.ts`
- `src/lib/onboarding.ts`
- `src/lib/settings.ts`
- `src/lib/spreadLayout.test.ts`
- `src/lib/spreadLayout.ts`
- `src/screens/SettingsScreen.tsx`
- `src/screens/ShuffleScreen.tsx`
- `src/screens/WelcomeScreen.tsx`
- `src/theme.css`
