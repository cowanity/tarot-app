# Tarot tiếng Việt — Giai đoạn 3c-1
Yêu cầu Node.js 20.19+ hoặc 22.12+ và npm.
`npm ci` để cài thư viện.
`npm run dev` để mở máy chủ phát triển (địa chỉ hiện trong terminal).
`npm run build` để kiểm tra TypeScript và tạo `dist/`.
`npm run preview` để xem bản build.
`src/lib/`: RNG, xào bài, rút bài và chọn nội dung theo chiều.
`src/data/`: 78 lá và 3 thế bài JSON tĩnh dùng trong app.
`src/hooks/`, `src/screens/`, `src/components/`: luồng đọc và giao diện.
Bài ngược mặc định tắt; khi bật xác suất 35%, riêng lá chéo Celtic luôn xuôi.
Nguồn H ghi trang ước lượng; vị trí tự cấu hình được ghi rõ trong trang.
Đặt ảnh `{id}.webp` vào `public/cards/`; thiếu ảnh sẽ dùng SVG dự phòng.
Điều hướng hash, cài đặt và lịch sử trên thiết bị; thư viện sẽ có ở 3c-2.
