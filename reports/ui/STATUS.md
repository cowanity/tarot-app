# Kiểm tra UI 7e — CHƯA XÁC MINH

Không có Chromium trong môi trường chạy. Playwright launch báo executable missing; cài Chromium bằng CLI trả gói không phải ZIP hợp lệ. Không có ảnh trước/sau, DOM audit hay kết quả FPS thật. Không dùng ảnh dựng hoặc số đo giả để thay thế.

Script `scripts/ui_shots.mjs` chuẩn bị 4 kích thước chụp, thêm 360px kiểm overflow; upright/reversed/longest/summary/Celtic 10. Nội dung fixture là văn bản 7d tái sử dụng để kiểm bố cục, không phải bài luận cho các lá mới. Script chụp được chạy trên browser thật sau khi cài Playwright/Chromium.

Chạy ở máy dự án:
```
npm install --no-save playwright
npx playwright install chromium
npm run dev -- --host 127.0.0.1
node scripts/ui_shots.mjs after
```
`CHROMIUM_PATH` có thể trỏ tới Chromium sẵn có; `UI_BASE_URL` đổi cổng. `scripts/ui_audit.mjs` ghi chi tiết overflow, target, số chồng tiêu đề, DOM color/contrast và FPS. Nền gradient/hình không thể suy chính xác từ màu DOM đơn lẻ được ghi unresolved, tuyệt đối không tính PASS. Cần kiểm bằng mắt và xử lý các mục này trước khi tuyên bố đáp ứng I.

Nguồn UI trước sửa được giữ ở `reports/before-7e-source/`; ZIP bản 7d là baseline đầy đủ để chạy `before` trên cùng script. Thư mục before hiện trống vì chưa chụp được.
