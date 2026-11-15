# Thư viện 78 lá

Đã triển khai:
- Lưới cuộn liên tục 78 lá, tên Việt/Anh, ba từ khóa đầu từ dữ liệu sẵn có.
- Tìm kiếm tên/từ khóa có dấu hoặc không dấu; lọc Ẩn Chính, Gậy, Cốc, Kiếm, Tiền.
- Yêu thích lưu trên thiết bị, lọc riêng; chịu được storage lỗi và đồng bộ thay đổi giữa các tab.
- Trang chi tiết có ảnh, từ khóa, nghĩa xuôi/ngược, Đọc sâu hơn, biểu tượng mở riêng và nguồn đã có. Không tự viết lại sách, không tạo nghĩa ngược khi thiếu dữ liệu.
- Quay lại bộ bài giữ tìm kiếm, bộ lọc và vị trí cuộn.
- Nút Tìm hiểu lá này trên từng lá của bài luận mở dialog tại chỗ; đóng bằng nút, Esc hoặc ngoài hộp; trả focus và vị trí cuộn. Bài đọc vẫn được giữ mounted.
- Tra cứu không gọi AI, không cần tài khoản, không thêm thư viện phụ thuộc.

Kiểm tra: typecheck PASS; build PASS; 3 test tìm kiếm/lọc/lưu trữ PASS. Chưa kiểm giao diện bằng Chromium do hạn chế môi trường đã ghi ở reports/ui/STATUS.md; không có ảnh hoặc số đo hiệu suất mới.

File: src/screens/LibraryScreen.tsx, src/screens/cardLibrary.css, src/components/CardKnowledge.tsx, src/components/ReadingScenes.tsx, src/lib/cardLibrary.ts, src/lib/cardLibrary.test.ts.

Chưa thêm bài học nhập môn, câu tự hỏi hay bản viết mới Hiểu nhanh; bản này dùng nguyên nội dung đã có. Không đổi prompt, schema hay dữ liệu cards.json. Màn luận giải vẫn cuộn liên tục theo lựa chọn mới nhất.
