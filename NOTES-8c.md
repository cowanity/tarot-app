# Sửa lỗi 8c

Mốc trước sửa: `before-8c`. Nguồn UI cũ: `ebb65eb` (Baseline before Prompt 8), không lấy từ tag 8b/8c.

## F1
Kiểm lại bản 8b: home không chứa DailyCard; route #/today và nav đã tồn tại; onboarding là native dialog, lưu đã xem, lời nhắc OS đợi đóng. Giữ nguyên các sửa này. Test onboarding và wiring đã qua; chưa kiểm trình duyệt thật.

## F2
Khôi phục SpreadBoard và TableScreen từ `ebb65eb`, tách OccupiedSlot cũ thành BoardCard để dùng chung hiệu ứng. CardFan/CardFlight/CardTilt hiện đã giống baseline; giữ nguyên. CardFlip giữ chuyển động và tên/gạch vàng cũ, chỉ giữ ngân sách hạt/màu theo bộ từ 8C theo F3. CSS fan/slot/tên cũ còn nguyên; xóa hệ fit-slot/BottomSheet và spreadLayout của 8A/8b.

Bố cục mới chỉ ở MobileCelticBoard khi viewport <600px. ResizeObserver chỉ đọc width, không đọc height để tính lá. Trải 3 lá mobile dùng width cột thật, gap12px, chừa chiều cao cho nhãn và tên lá. Trải khác/desktop dùng board cũ. Chạm úp lật ngay; lá đã lật không mở dialog. Celtic mobile cập nhật dòng chú thích, không có nhãn dưới từng lá.

Test đi qua observer factory giả cùng hàm đang được hook gọi, với H=0/120/200, W=320–599; kiểm bounding box đã xoay, chỉ 1–2 chồng, badge <=24/.3W, min64 khi cột >=320. Cột nhỏ hơn320 giảm tương ứng để không tràn. Có test hàng3 với chiều rộng cột 280–440. Chưa kiểm render thật; không coi hình học là bằng chứng hiển thị.

## F3
Giữ bản sửa nền 8b: Starfield/CinematicBackground từ trước Prompt8, không đường nối/sao băng; canvas chỉ mount khi có hạt. Engine đo FPS riêng vòng dùng chung, hidden/minimal dừng; chưa có FPS thật. Không thêm lớp nền mới. Kiểm nguồn và test engine; chưa đối chiếu bằng mắt trên Safari/Chrome.

## F4
Giữ sửa 8b: không có công tắc FPS trong Cài đặt, overlay chỉ URL ?fps=1. Kiểm wiring source đã qua trong F2. Không đổi settings khác.

## F5 — nguyên nhân đã tái hiện
Không tìm thấy API Node22-only trong server/mã dùng chung thuộc nhóm yêu cầu quét. `process.loadEnvFile` hiện dùng có từ Node20.12, phù hợp20.19. Môi trường đang chạy Node24.19; không có binary Node20/22, nên chưa kiểm trực tiếp hai runtime đó. engines đã nới >=20.19.0; test tĩnh chống dùng nhóm API mới đã thêm.

**Lỗi thực sự tìm thấy:** 8E dùng `createRequestDrain(request => app.fetch(request))`, làm mất tham số bindings `{incoming,outgoing}` từ @hono/node-server. `getConnInfo(c)` đọc `c.env...incoming.socket` ném TypeError trước beforeCall. Đây là lỗi khớp attempts=[], tokens0 và thời gian rất ngắn, không phụ thuộc Node20. Test tái hiện đường mất bindings rồi kiểm đường sửa cùng Hono/getConnInfo, không giả lập riêng hàm IP. Sửa drain chuyển tiếp toàn bộ tham số, production truyền trực tiếp `app.fetch`.

app.onError và catch trong request trả HTTP500/internal_error cho lỗi lập trình/cấu hình; provider_network chỉ dành cho mã network thật và attempts>0. Log providerError nay là {name,message,cause:{code}}, tối đa200 ký tự. Thông báo runtime chuẩn (ví dụ Cannot read properties...) và mã provider được giữ; ngoại lệ tùy ý bị che, cause.code chỉ nhận mã mạng đã biết để không rò câu hỏi/bài đọc/khóa. Không log stack hay request. HTTP4xx từ provider coi là lỗi nội bộ/cấu hình, không gọi nhầm network.

Giữ nguyên mức20/IP/giờ (AI_HOURLY_IP_LIMIT),150/ngày (AI_DAILY_CAP), tính đúng một lượt ở beforeCall đầu, và ba dạng loopback tin CF header. Test cũ mong HTTP502 cho lỗi chưa gọi provider và lỗi cấu hình nay đổi500 theo yêu cầu, không sửa guard/schema.

### Hai lượt thật — không chạy lại
Chạy script `server/eval/smoke8c.ts` qua HTTP localhost + @hono/node-server + drain + getConnInfo, production pipeline đầy đủ, khóa hiện có; không phải provider giả. Mỗi trải đúng một request, không A/B.

| Trải | HTTP | Ra bài | Call | Token | Giây |
| --- | --- | --- | --- | --- | --- |
| Celtic Cross | 200 | Có | 2 | 8597 | 19,412 |
| Ba lá | 200 | Có | 1 | 4576 | 10,213 |

Celtic: primary gemini-3.5-flash-lite + fallback gemini-3.5-flash, verdict repair bị từ chối và giữ bản gốc. Ba lá: primary flash-lite. reason/providerError đều null. Notes mềm vẫn giữ, không sửa prompt/schema/guard. Chi tiết metadata: reports/prompt-8c/live-smoke.json. Không lưu câu hỏi hay bài đọc trong log này. Đây là kiểm trên môi trường Node24 của phiên làm việc, không phải máy Mac của người dùng.

## F7
Dock đưa ra khỏi header, fixed góc dưới phải, nút44px, safe-area và đệm đáy88px. CSS ẩn dock khi native dialog hoặc aria-modal dialog đang mở. Nav đổi đúng từ lưới4 thành lưới5 (đây là nguyên nhân mục thứ5 rớt dòng trên desktop), không wrap, chữ co13–16px. Xóa toast hạ FPS; engine vẫn hạ im lặng, đổi lại trong Cài đặt. Kiểm source/test wiring, chưa kiểm một hàng hay vị trí bằng render thật.

## F8 — kiểm tra cuối

| Phần | Kết quả | Đã kiểm | Chưa kiểm |
| --- | --- | --- | --- |
| F1 | Giữ trang Hôm nay riêng và dialog một lần | Test lưu lựa chọn, wiring | Dialog/nav trên Safari/Chrome |
| F2 | Board/fan cũ; Celtic mobile riêng; lật ngay | 22 test layout/observer thật qua factory giả; nguồn UI | Kích thước, chữ, tương tác trên thiết bị |
| F3 | Nền trước8, không vệt chéo | Engine giả + CSS/source | FPS, nhìn nền thật |
| F4 | FPS chỉ URL | Wiring | Overlay thiết bị |
| F5 | Sửa mất Node bindings, lỗi nội bộ/log | Tái hiện qua Hono/drain; hai lượt Gemini thật 200 | Node20/22 thật, Mac của người dùng |
| F7 | Dock dưới, nav5 cột, giảm FPS im lặng | Wiring + CSS/source | Một hàng ở360, dock không đè nội dung thật |
| F8 | Tag và commit riêng; file bảo vệ nguyên SHA | Typecheck; 648/648 test; build; PWA/FX check;18 SHA | Trình duyệt thật/Lighthouse |

Số test giảm vì bỏ151 test layout chung8A/8b và thay bằng22 test layout dành riêng Celtic mobile/observer và hàng3; thêm test hồi quy server/UI. Không xóa test prompt/schema/guard. Lượt test riêng F5 ban đầu có một timeout5s ở fixture eval cũ; toàn bộ648 test lượt cuối đã qua với timeout mặc định, không thay gate.

Build: `PWA_UNMINIFIED=1 VITE_SITE_URL=https://tarotvp.id.vn npm run build`. Tùy chọn có sẵn chỉ bỏ minify service worker trong sandbox; không đổi cấu hình PWA, app JS/CSS vẫn production. Không thêm thư viện. Không chạy lại A/B hay hai lượt live để lấy bài khác.

Trước khi kết luận trên thiết bị, người dùng tự kiểm:
1. Home chỉ trải bài; Hôm nay là mục riêng.
2. Lần đầu có popup, lần sau không; OS notice không chồng popup.
3. Giàn bài và lật như bản cũ, tên/gạch vàng dưới lá; ba lá không bị cắt iPhone.
4. Celtic iPhone10 lá rõ, chỉ cặp1–2 chồng; chú thích dưới board đủ chữ.
5. Chạm úp lật ngay; không cửa sổ xác nhận, chạm lá đã lật không dialog.
6. Nền cũ, không đường/sao băng.
7. Cài đặt không FPS.
8. Một lượt thật trên máy Mac sau cập nhật thành công hoặc log reason đúng; hai lượt ở môi trường này đã thành công.
9. Hai nút nổi góc dưới, nav một hàng, không toast giảm hiệu ứng; dock ẩn khi dialog mở.

Tag `before-8c` và các commit F1,F2,F3,F4,F5,F7,F8 riêng (prompt không có mục F6). Có patch và danh sách hash trong reports/prompt-8c/. Hoàn lại bằng git revert hash tương ứng; file App/CSS/NOTES dùng chung có thể cần xử lý ngữ cảnh khi revert riêng. Giữ .env hiện tại, không có khóa trong gói giao.
