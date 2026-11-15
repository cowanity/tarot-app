# Production trên Mac qua Cloudflare Tunnel
Chạy từ thư mục `tarot-app`, dùng Node 22+, giữ máy hoạt động và tunnel chạy.
`.env` (giữ khóa thật trên máy; không đặt khóa trong `VITE_*`):
```dotenv
NODE_ENV=production
AI_PROVIDER=gemini
GEMINI_API_KEY=dien_khoa_tren_may
AI_MODEL=gemini-3.5-flash
ALLOWED_ORIGIN=https://tarot.ten-mien.com,http://localhost:5173
AI_DAILY_CAP=100
```
Chạy `npm ci`, rồi `npm run build && npm run start:prod`; chỉ Hono ở `127.0.0.1:8787`, không chạy Vite/proxy.
Trong cấu hình tunnel đã tạo, giữ `tunnel`/`credentials-file` và đặt:
```yaml
ingress:
  - hostname: tarot.ten-mien.com
    service: http://localhost:8787
  - service: http_status:404
```
Tạo DNS trỏ hostname vào tunnel; chạy `cloudflared tunnel run <tên-tunnel>`.
Thay `tarot.ten-mien.com` bằng tên miền thật, ví dụ `tarotvp.id.vn`, ở cả ingress, DNS và `.env`.
Kiểm tra: `curl -i http://localhost:8787/` và `curl -i http://localhost:8787/api/health` (đều 200).
Kiểm tra ngoài mạng: `curl -i https://tarot.ten-mien.com/api/health`; sau đổi `.env` hãy khởi động lại server.
API dùng `/api/...` tương đối; URL ngoài `/api` về SPA. `SERVE_STATIC=true` cũng bật phục vụ dist khi phát triển.
`CF-Connecting-IP` dùng để giới hạn từng khách; chỉ cho tunnel đi vào loopback, không mở cổng 8787 ra Internet.
