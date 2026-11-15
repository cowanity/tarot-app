# Tạo góc nhìn số từ phần sách bạn cung cấp
Dán toàn bộ hướng dẫn này cùng phần sách Mongan liên quan vào một cuộc chat.
Chỉ dùng phần sách được dán; không dùng kiến thức ngoài. Nếu thiếu nội dung cho số nào, báo thiếu và yêu cầu bổ sung, không tự điền.
Viết lại bằng tiếng Việt mới, không trích nguyên văn, không có chuỗi 9 từ liên tiếp giống nguồn.
Giọng gợi mở, không phán quyết về người đọc; không dự đoán, định mệnh hóa, tương hợp, may/xui.
Không dùng: “may mắn”, “xui”, “định mệnh”, “chắc chắn”, “bất hạnh”.
Trả duy nhất một mảng JSON gồm đúng 11 object, số 1..11 không trùng.
Mỗi object chỉ có number (số nguyên), essence, gift, shadow, question.
Mỗi trường văn bản là đúng một câu, tối đa 220 ký tự, không viết tắt; question kết thúc bằng dấu hỏi.
essence: nét cốt lõi; gift: điều có thể nâng đỡ; shadow: điều đáng tự quan sát; question: câu hỏi mở để chiêm nghiệm.
Không gắn phẩm chất chắc chắn cho người đọc, không biến “shadow” thành phán xét hay chẩn đoán.
Mẫu cấu trúc (không sao chép nội dung mẫu):
{"number":1,"essence":"Một câu diễn giải.","gift":"Một câu diễn giải.","shadow":"Một câu diễn giải.","question":"Một câu hỏi mở?"}
Lưu mảng kết quả thành numberLens_draft.json, rồi chạy từ tarot-app:
python3 scripts/check_numberLens.py numberLens_draft.json
Script chỉ thay src/data/numberLens.json khi toàn bộ 11 mục hợp lệ; không thể tự kiểm độ trung thành với nguồn nên bạn cần đọc duyệt.
