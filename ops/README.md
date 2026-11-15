# Chạy Tarot từ Mac qua Cloudflare Tunnel

## Chuẩn bị một lần
Dùng Node20.19+ hoặc Node22+ (`command -v node`), npm và cloudflared. Thư mục dự án là đường dẫn thật; tránh chạy từ thư mục đồng bộ tạm. Điền `.env` dựa trên `ops/environment.example`, giữ nguyên khóa của bạn. Không đưa `.env`, credential tunnel hay câu hỏi vào Git/log. `ALLOWED_ORIGIN` có thể chứa cả domain HTTPS và localhost, ngăn bằng dấu phẩy; không cần xóa localhost. `VITE_SITE_URL` là URL public, không bí mật, được chèn lúc build.

```sh
npm ci
node scripts/make_icons.mjs
npm run typecheck
npm test
npm run build
node scripts/pwa_check.mjs
npm run start:prod
```

Server production tự phục vụ `dist/` và API trên `127.0.0.1:8787`. Không chạy Vite dev qua tunnel lâu dài. Nếu môi trường bị lỗi Terser khi sinh SW, chỉ dùng `PWA_UNMINIFIED=1 npm run build`; SW không nén nhưng ứng dụng vẫn production. Không cần cờ này nếu Mac build bình thường.

Tunnel đã tạo trong Cloudflare: trỏ hostname về `http://127.0.0.1:8787`. Ví dụ cấu hình local (thay UUID/path đúng của bạn, không commit credential):

```yaml
tunnel: UUID_CUA_BAN
credentials-file: /Users/YOUR_USER/.cloudflared/UUID_CUA_BAN.json
ingress:
  - hostname: tarotvp.id.vn
    service: http://127.0.0.1:8787
  - service: http_status:404
```

Tên miền ở VinaHost có thể tiếp tục giữ đăng ký ở đó; DNS/tunnel phải đã được cấu hình theo zone Cloudflare của bạn. Không thay DNS trong lượt code này.

## Không ngủ và tự chạy
Cắm nguồn, vào Cài đặt hệ thống → Pin/Năng lượng → ngăn ngủ khi tắt màn hình (tên tùy phiên bản macOS). `caffeinate -is` trong một terminal riêng giữ máy thức khi lệnh còn chạy (Ctrl+C để dừng); không bảo đảm hoạt động khi đóng nắp MacBook. Plist server chạy Node trực tiếp để SIGTERM đến đúng tiến trình, không bọc bằng caffeinate. Muốn qua reboot không phụ thuộc terminal, dùng cài đặt ngăn ngủ ở trên. Để máy mở nắp/thông thoáng.

Sửa **mọi** `YOUR_USER`, thư mục dự án, đường dẫn Node/cloudflared trong hai plist. Apple Silicon Homebrew thường `/opt/homebrew/bin`; Intel thường `/usr/local/bin`; nếu dùng nvm, lấy đường dẫn Node tuyệt đối, launchd không đọc `.zshrc`. `.env` được Node đọc từ WorkingDirectory, không ghi khóa vào plist.

```sh
mkdir -p "$HOME/Library/LaunchAgents" "$HOME/Library/Logs/tarot"
cp ops/com.tarot.server.plist "$HOME/Library/LaunchAgents/"
cp ops/com.tarot.tunnel.plist "$HOME/Library/LaunchAgents/"
plutil -lint "$HOME/Library/LaunchAgents/com.tarot.server.plist"
plutil -lint "$HOME/Library/LaunchAgents/com.tarot.tunnel.plist"
launchctl bootstrap "gui/$(id -u)" "$HOME/Library/LaunchAgents/com.tarot.server.plist"
launchctl bootstrap "gui/$(id -u)" "$HOME/Library/LaunchAgents/com.tarot.tunnel.plist"
```

LaunchAgents chạy lại khi đăng nhập sau reboot và tự hồi phục khi process sập. Chúng **không** chạy trước đăng nhập; FileVault cũng yêu cầu mở khóa ổ. Nếu cần chạy ngay lúc boot trước đăng nhập, dùng LaunchDaemon do quản trị viên cài trong `/Library/LaunchDaemons`, thêm `UserName` là tài khoản không root, owner root:wheel và mode644; kiểm path/quyền truy cập dự án trước. Không khuyên bật tự đăng nhập chỉ để host.

## Cập nhật và tắt êm
Commit nguồn lên repo riêng tư trước; remote Git chưa được cấu hình bởi gói này.

```sh
git pull --ff-only
npm ci
npm run typecheck
npm test
npm run build
node scripts/pwa_check.mjs
launchctl bootout "gui/$(id -u)/com.tarot.server"
launchctl bootstrap "gui/$(id -u)" "$HOME/Library/LaunchAgents/com.tarot.server.plist"
```

Không dùng `kill -9`/`kickstart -k` cho cập nhật bình thường. SIGTERM/SIGINT đóng cổng nhận mới và chờ request đang chạy; mặc định120giây, sau đó buộc đóng, exit1. launchd ExitTimeOut130giây lớn hơn grace để không cắt sớm. Nếu đổi SHUTDOWN_TIMEOUT_MS, đổi ExitTimeOut tương ứng. Update SW chỉ hiện toast; không tự reload khi rút/đọc bài.

```sh
tail -n 100 "$HOME/Library/Logs/tarot/server.log"
tail -n 100 "$HOME/Library/Logs/tarot/server-error.log"
launchctl print "gui/$(id -u)/com.tarot.server"
curl http://127.0.0.1:8787/api/health
```

Log server chỉ metadata/mã lỗi, không nội dung. Log file launchd không tự xoay; định kỳ lưu/xóa bản cũ hoặc cấu hình newsyslog để tránh đầy ổ.

## Hạn mức và riêng tư
- AI_HOURLY_IP_LIMIT mặc định 20 lượt thực sự gọi nhà cung cấp/giờ/IP, cửa sổ trượt; vượt trả429/rate_limited.
- AI_DAILY_CAP mặc định150 lượt có gọi provider/ngày UTC, tính một lần mỗi lượt, dùng chung mọi IP; vượt trả429/daily_budget. Một lượt vẫn tối đa3 calls, nên trần150 lượt có thể là450 calls.
- Limit ở RAM cho một process: restart làm mất bộ đếm; không dùng nhiều worker để né/nhân hạn mức. Theo dõi thêm quota của provider, vì đây không phải sổ ngân sách bền vững qua restart.
- Chỉ tin CF-Connecting-IP nếu socket đến từ loopback (cloudflared trên cùng Mac). Header từ kết nối ngoài bị bỏ qua; X-Forwarded-For không dùng. Giữ bind127.0.0.1, không publish8787; người có quyền chạy code ngay trên Mac vẫn nằm trong vùng tin cậy.
- Không thay payload luận giải/hồ sơ; tên/ngày sinh giữ trên máy như trước. Câu hỏi/bối cảnh theo hợp đồng cũ vẫn gửi khi yêu cầu luận giải; không phát sinh gửi dữ liệu cho lá hôm nay/chia sẻ ảnh/lịch sử.

## Cache và kiểm sau deploy
Cloudflare → Caching → Purge Everything sau phát hành nếu thấy bản cũ; Development Mode chỉ dùng tạm khi kiểm. Đặt bypass `/api/*`, `/sw.js`, `/index.html`, `/manifest.webmanifest` (không Cache Everything/EdgeTTL dài). Hono gửi no-cache cho shell/SW/manifest và immutable cho assets có hash. Xóa cache Cloudflare không xóa service worker trên điện thoại; mở app online, chọn toast Tải lại. Trong Cài đặt có nút tải trước78ảnh (~20MB) để đủ hình offline; chưa tải thì văn bản thư viện vẫn có và ảnh chưa cache dùng hình dự phòng. Chỉ xóa dữ liệu site khi đã sao lưu lịch sử vì thao tác đó xóa localStorage.

`VITE_ALLOW_INDEX=true` rồi build lại để cho index; mặc định robots Disallow và noindex. Đây không phải khóa truy cập: preview/social có thể vẫn đọc trang; cần thử Zalo/Messenger thật. Không hứa preview khi crawler tuân thủ robots/Access chặn.

## Sao lưu
Sao lưu `.env` và credential tunnel vào nơi mã hóa ngoài Git; repo nguồn riêng tư cho code. Lịch sử nằm trên từng thiết bị, không ở server; nhắc bạn bè không xóa dữ liệu site nếu chưa giữ lại bài cần thiết. Không đưa dữ liệu riêng tư vào ảnh chia sẻ trừ khi chủ động bật Kèm câu hỏi.

Tài liệu chính thức để đối chiếu khi cài:
- Apple launchd: https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLaunchdJobs.html
- Cloudflare cấu hình tunnel: https://developers.cloudflare.com/tunnel/features/locally-managed-tunnels/configuration-file/

### Chẩn đoán lỗi luận giải (8b)
Log server là JSON metadata; xem `reason` ở dòng `/api/interpret`:
`rate_limited` (IP), `daily_budget` (ngày), `provider_429`, `provider_5xx`, `provider_network`, `timeout`, `guard_blocked`, `bad_request`.
Ví dụ rút gọn: `{"status":429,"reason":"rate_limited","attempts":[]}`.
Xem thêm `providerError` và `attempts`: AI_BUSY không luôn đồng nghĩa HTTP 5xx.
`AI_HOURLY_IP_LIMIT=20` mặc định; `.env` có giá trị cũ vẫn được ưu tiên.
Chỉ tính khi bắt đầu gọi nhà cung cấp, một lượt gồm tối đa 3 call. 400, 429, care không gọi provider không tiêu lượt.
Bộ đếm trong RAM; khởi động lại server sẽ đặt về 0, không có dữ liệu câu hỏi trong bộ đếm.


### Lỗi trước provider (8c)
`internal_error` / HTTP500 là lỗi nội bộ, không phải mất mạng. Xem `providerError.name`, `providerError.message` (tối đa200 ký tự), `providerError.cause.code`. Chỉ giữ thông báo runtime/mã lỗi an toàn; nội dung ngoại lệ tùy ý bị che để không rò câu hỏi, bài đọc, khóa.
Lớp tắt êm phải dùng `createRequestDrain(app.fetch)` để chuyển cả bindings Node incoming/outgoing; không bọc thành `request => app.fetch(request)` vì làm mất socket khi getConnInfo đọc IP.
Không dùng API chỉ có ở Node22 trong server/mã dùng chung; test tĩnh kiểm nhóm API mới. Môi trường kiểm tại đây là Node24, chưa chứng nhận bằng tiến trình Node20/22 thật.
