# Rà soát chữ giao diện

Phạm vi: chữ viết sẵn trong mã nguồn src, gồm nhãn, tiêu đề, thông báo, placeholder và trợ năng; không đọc src/data/*.json. Chuỗi động được liệt kê bằng vị trí hiển thị, không đưa nội dung sách hay dữ liệu người dùng vào báo cáo. Một số chuỗi trong hàm thuần là ứng viên cần đối chiếu với giao diện.

## Đã áp dụng

| Vị trí | Chữ cũ | Vấn đề | Chữ mới |
|---|---|---|---|
| src/screens/QuestionScreen.tsx | Một câu hỏi mở có thể giúp bạn nhìn lại trải nghiệm của mình. | Dài, mơ hồ hoặc lặp ý | Bạn muốn nhìn rõ hơn chuyện gì? |
| src/screens/QuestionScreen.tsx | Gợi ý chủ đề | Dài, mơ hồ hoặc lặp ý | Chủ đề |
| src/screens/QuestionScreen.tsx | Càng cụ thể (chuyện gì, đang phân vân điều gì), lời đọc càng sát với bạn. | Dài, mơ hồ hoặc lặp ý | Kể chuyện đang xảy ra và điều bạn còn phân vân. |
| src/screens/QuestionScreen.tsx | Bối cảnh thêm | Dài, mơ hồ hoặc lặp ý | Kể thêm |
| src/screens/QuestionScreen.tsx | Có điều gì trong tình huống này bạn muốn ghi lại thêm? | Dài, mơ hồ hoặc lặp ý | Có điều gì khác bạn muốn kể? |
| src/screens/SpreadScreen.tsx | Chọn độ rộng của câu chuyện bạn muốn khám phá. | Dài, mơ hồ hoặc lặp ý | Chọn số lá bạn muốn rút. |
| src/screens/SpreadScreen.tsx | Một thông điệp ngắn | Dài, mơ hồ hoặc lặp ý | Một góc nhìn nhanh |
| src/screens/SpreadScreen.tsx | Chỉ gửi các con số tính từ hồ sơ; ngày sinh và tên của bạn không rời khỏi thiết bị. | Dài, mơ hồ hoặc lặp ý | Thêm góc nhìn từ hồ sơ của bạn. |
| src/components/FeelingsPicker.tsx | Kể thêm để buổi đọc sát hơn (không bắt buộc) | Dài, mơ hồ hoặc lặp ý | Kể thêm (có thể bỏ qua) |
| src/components/FeelingsPicker.tsx | Mức độ chung | Dài, mơ hồ hoặc lặp ý | Cảm xúc mạnh đến đâu? |
| src/components/ProfileSettings.tsx | Các kết quả dưới đây là góc nhìn để bạn tự suy ngẫm, không mô tả cố định con người bạn. | Dài, mơ hồ hoặc lặp ý | Một góc nhìn để tự đối chiếu, không định nghĩa con người bạn. |
| src/components/ProfileSettings.tsx | Góc nhìn số đang chờ bổ sung; chưa có diễn giải cho mục này. | Dài, mơ hồ hoặc lặp ý | Phần này đang được bổ sung. |
| src/screens/SettingsScreen.tsx | Bật chuyển động trong ứng dụng | Dài, mơ hồ hoặc lặp ý | Bật chuyển động |
| src/screens/SettingsScreen.tsx | Bật đầy đủ hiệu ứng trong ứng dụng | Dài, mơ hồ hoặc lặp ý | Bật đầy đủ hiệu ứng |
| src/screens/SettingsScreen.tsx | Cho phép bài ngược mặc định | Dài, mơ hồ hoặc lặp ý | Bật bài ngược cho lần sau |
| src/screens/SettingsScreen.tsx | Lưu khi bài đọc đến trang diễn giải. | Dài, mơ hồ hoặc lặp ý | Lưu khi có bài đọc. |
| src/screens/SettingsScreen.tsx | Cài đặt vẫn được áp dụng, nhưng chưa lưu được trên thiết bị này. | Dài, mơ hồ hoặc lặp ý | Đã áp dụng, nhưng chưa lưu được cài đặt. |
| src/screens/SettingsScreen.tsx | Xóa toàn bộ lịch sử trên thiết bị này? Thao tác này không thể hoàn tác. | Dài, mơ hồ hoặc lặp ý | Xóa hết lịch sử? Bạn không thể khôi phục sau khi xóa. |
| src/screens/SettingsScreen.tsx | Sao chép phản hồi của tôi | Dài, mơ hồ hoặc lặp ý | Sao chép phản hồi |
| src/screens/SettingsScreen.tsx | Phản hồi để sao chép tay | Dài, mơ hồ hoặc lặp ý | Chọn văn bản để sao chép |
| src/screens/ResultScreen.tsx | Đi vào từng lá | Dài, mơ hồ hoặc lặp ý | Xem từng lá |
| src/screens/ResultScreen.tsx | Mức độ diễn giải | Dài, mơ hồ hoặc lặp ý | Cách xem bài |
| src/screens/ResultScreen.tsx | Lời đọc này có gần với bạn? | Dài, mơ hồ hoặc lặp ý | Lời đọc có đúng với bạn? |
| src/screens/ResultScreen.tsx | Bắt đầu bài đọc mới ↗ | Dài, mơ hồ hoặc lặp ý | Đọc bài mới ↗ |
| src/screens/ResultScreen.tsx | Bấm phản hồi sẽ lưu bài đọc và đánh giá vào lịch sử trên thiết bị này. Không gửi phản hồi đi đâu. | Dài, mơ hồ hoặc lặp ý | Phản hồi và bài đọc chỉ lưu trên máy này. |
| ConsentDialog / AiReadingPanel | Hộp đồng ý và chặn nút | Bước dư theo yêu cầu | Bỏ hộp thoại; bấm là chạy |
| SettingsScreen | Trạng thái đồng ý / rút lại | Không còn phù hợp | Một dòng thông báo gửi câu hỏi đúng nội dung yêu cầu |
| ResultScreen | headline | Có thể lặp câu trả lời | Dùng answer dưới dải lá bài |

## Năm chỗ còn phân vân — chưa đổi

| Vị trí | Hiện tại | Đề xuất | Cần cân nhắc |
|---|---|---|---|
| src/components/ProfileSettings.tsx | Lá Bổn mạng | Lá theo ngày sinh | Dễ hiểu hơn, nhưng đổi thuật ngữ đã dùng xuyên suốt. |
| src/components/ProfileSettings.tsx | Lá Năm tuổi | Lá của năm sinh nhật này | Rõ cách tính, nhưng nhãn dài hơn. |
| src/components/ProfileSettings.tsx | Tâm hồn · Bài học · Món quà · Mục đích | Điều bên trong · Điều học hỏi · Điểm tựa · Hướng đi | Dễ đọc hơn nhưng có thể lệch tên khía cạnh của nguồn. |
| src/screens/ResultScreen.tsx | Ẩn Chính · Ẩn Phụ | Nhóm chính · Nhóm theo chất bài | Giảm thuật ngữ, nhưng khó đối chiếu với thư viện lá. |
| src/screens/SpreadScreen.tsx | Celtic Cross | Chữ thập Celtic | Dễ đọc hơn; cần thống nhất tên với dữ liệu và lịch sử. |

## Danh mục chữ trước khi sửa (501 mục)

| Vị trí | Chữ hiện tại trước sửa | Vấn đề | Đề xuất / kết quả |
|---|---|---|---|
| src/App.tsx:54 | Bỏ qua đến nội dung | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/App.tsx:56 | ✧ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/App.tsx:56 | Tarot | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/App.tsx:56 | / Chiêm nghiệm | Thuật ngữ cần cân nhắc | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/App.tsx:57 | Nội dung chính | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/App.tsx:76 | Đang mở trang… | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/App.tsx:84 | Giải trí và chiêm nghiệm, không dự đoán chắc chắn. | Thuật ngữ cần cân nhắc | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/AiReadingPanel.tsx:29 | Luận giải theo câu hỏi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/AiReadingPanel.tsx:32 | Luận giải đã sẵn sàng. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/AiReadingPanel.tsx:33 | Bạn không cần đi qua điều này một mình. Lời nhắn hỗ trợ ở đầu trang. | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/AiReadingPanel.tsx:37 | Thử lại sau ${ai.remaining} giây | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/AiReadingPanel.tsx:37 | Thử lại | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/AiReadingPanel.tsx:37 | Luận giải theo câu hỏi của tôi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/AiReadingPanel.tsx:41 | Đọc theo sách (không cần mạng) | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/AiReadingPanel.tsx:49 | Các lá nối lại | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/AiReadingPanel.tsx:53 | Chiều hướng có thể | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/AiReadingPanel.tsx:53 | Chuẩn bị điều cần hỏi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/AiReadingPanel.tsx:60 | Đã sao chép lời đọc. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/AiReadingPanel.tsx:60 | Chưa sao chép được, bạn hãy chọn văn bản và sao chép tay. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/AiReadingPanel.tsx:62 | Sao chép lời đọc | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/CardBack.tsx:3 | Lá bài úp, chưa tiết lộ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/CardFace.tsx:38 | ✧ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/CardFan.tsx:16 | Chọn lá úp ${index+1} | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/CardFan.tsx:24 | Quạt bài úp, có thể cuộn ngang | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/CareNotice.tsx:4 | Khó gọi tên | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/CareNotice.tsx:5 | Lời nhắn quan tâm | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/CareNotice.tsx:6 | Bạn không cần đi qua điều này một mình. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/CareNotice.tsx:7 | Bạn đã chia sẻ cảm xúc | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/CareNotice.tsx:7 | . Cảm xúc này xứng đáng được lắng nghe. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/CareNotice.tsx:8 | Bạn có thể nói chuyện với một người tin cậy hoặc chuyên gia để được lắng nghe và hỗ trợ, theo nhịp phù hợp với bạn. | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/CareNotice.tsx:9 | Nếu bạn đang nghĩ đến việc làm đau bản thân, hãy liên hệ một người bạn tin cậy hoặc chuyên gia để được ở bên và hỗ trợ. Nếu bạn đang gặp nguy hiểm ngay lúc này, hãy gọi số cấp cứu tại địa phương hoặc đến cơ sở cấp cứu gần nhất. | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/CareNotice.tsx:10 | Bạn vẫn có thể xem bài đọc dưới đây, nhưng đừng để những lá bài thay thế sự giúp đỡ trực tiếp. | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/CareNotice.tsx:11 | Thông tin hỗ trợ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ConfirmAction.tsx:10 | Xác nhận xóa | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ConfirmAction.tsx:10 | Hủy | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ConsentDialog.tsx:25 | Bạn quyết định khi nào gửi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Đã bỏ hộp thoại |
| src/components/ConsentDialog.tsx:25 | Luận giải theo câu hỏi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Đã bỏ hộp thoại |
| src/components/ConsentDialog.tsx:26 | Chỉ gửi khi bạn chủ động bấm nút luận giải theo câu hỏi. Lần này, “Đồng ý và tiếp tục” sẽ gửi yêu cầu. | Dài hơn 15 từ; cân nhắc rút gọn | Đã bỏ hộp thoại |
| src/components/ConsentDialog.tsx:27 | Nội dung gửi gồm câu hỏi, bối cảnh, cảm xúc đã chọn hoặc tự nhập, mức độ, mong muốn từ buổi đọc, thời gian kéo dài, chủ đề, tên thế bài, các lá và chiều xuôi/ngược. Không gửi lịch sử hoặc phản hồi của bạn. | Dài hơn 15 từ; cân nhắc rút gọn | Đã bỏ hộp thoại |
| src/components/ConsentDialog.tsx:28 | Nếu bật dùng hồ sơ: gửi thêm các con số đã tính và id lá, không gửi ngày sinh hay tên gọi trong hồ sơ. | Dài hơn 15 từ; cân nhắc rút gọn | Đã bỏ hộp thoại |
| src/components/ConsentDialog.tsx:29 | Để soạn luận giải theo câu hỏi, ứng dụng gửi những nội dung trên tới dịch vụ luận giải bên ngoài của | Dài hơn 15 từ; cân nhắc rút gọn | Đã bỏ hộp thoại |
| src/components/ConsentDialog.tsx:29 | . | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Đã bỏ hộp thoại |
| src/components/ConsentDialog.tsx:30 | Ở gói miễn phí, nhà cung cấp có thể dùng nội dung để cải thiện sản phẩm của họ. Đừng nhập thông tin định danh của bạn hoặc người khác. | Dài hơn 15 từ; cân nhắc rút gọn | Đã bỏ hộp thoại |
| src/components/ConsentDialog.tsx:31 | Luận giải dựa trên nội dung hai cuốn sách để bạn chiêm nghiệm. | Thuật ngữ cần cân nhắc | Đã bỏ hộp thoại |
| src/components/ConsentDialog.tsx:32 | Máy chủ của ứng dụng không lưu câu hỏi hay câu trả lời, không ghi cảm xúc, mong muốn hoặc thời gian vào log. Bạn có thể xóa lịch sử và phản hồi bất cứ lúc nào trong Cài đặt. Bạn có thể rút lại đồng ý trong Cài đặt. | Dài hơn 15 từ; cân nhắc rút gọn | Đã bỏ hộp thoại |
| src/components/ConsentDialog.tsx:33 | Đồng ý và tiếp tục | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Đã bỏ hộp thoại |
| src/components/ConsentDialog.tsx:33 | Để sau | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Đã bỏ hộp thoại |
| src/components/FeedbackButtons.tsx:5 | Phản hồi cả bài đọc | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeedbackButtons.tsx:5 | Phản hồi vị trí ${position} | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeedbackButtons.tsx:8 | Đã lưu phản hồi trên thiết bị. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeedbackButtons.tsx:8 | Chưa lưu được phản hồi. Bạn có thể thử lại. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeedbackButtons.tsx:9 | Đúng với mình | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeedbackButtons.tsx:9 | Chưa đúng | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeelingsPicker.tsx:11 | Cảm xúc và mong muốn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeelingsPicker.tsx:12 | Cảm xúc lúc này | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeelingsPicker.tsx:12 | /3 · Có thể bỏ qua | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeelingsPicker.tsx:13 | Nặng nề | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeelingsPicker.tsx:13 | Giằng co | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeelingsPicker.tsx:13 | Sáng | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeelingsPicker.tsx:13 | Đặc biệt | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeelingsPicker.tsx:17 | Cảm xúc khác | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeelingsPicker.tsx:18 | Viết theo cách của bạn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeelingsPicker.tsx:19 | /40 · Không lưu nội dung này vào lịch sử. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeelingsPicker.tsx:21 | Kể thêm để buổi đọc sát hơn (không bắt buộc) | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Kể thêm (có thể bỏ qua) |
| src/components/FeelingsPicker.tsx:22 | Mức độ chung | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Cảm xúc mạnh đến đâu? |
| src/components/FeelingsPicker.tsx:24 | Nhẹ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeelingsPicker.tsx:24 | Hơi nặng | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeelingsPicker.tsx:24 | Vừa | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeelingsPicker.tsx:24 | Nặng | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeelingsPicker.tsx:24 | Rất nặng | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeelingsPicker.tsx:26 | Bạn mong điều gì từ buổi đọc? | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeelingsPicker.tsx:30 | Chuyện này kéo dài bao lâu? | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/FeelingsPicker.tsx:34 | Bấm lại lựa chọn đang bật để bỏ chọn. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/Navigation.tsx:3 | Trải bài | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/Navigation.tsx:3 | Thư viện | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/Navigation.tsx:4 | Lịch sử | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/Navigation.tsx:4 | Cài đặt | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/Navigation.tsx:7 | Điều hướng chính | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ProfileSettings.tsx:7 | Tâm hồn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ProfileSettings.tsx:7 | Bài học | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ProfileSettings.tsx:7 | Món quà | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ProfileSettings.tsx:7 | Mục đích | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ProfileSettings.tsx:8 | Hồ sơ của bạn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ProfileSettings.tsx:9 | Không bắt buộc. Ngày sinh và tên gọi chỉ dùng để tính trên thiết bị này. | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ProfileSettings.tsx:11 | Ngày sinh | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ProfileSettings.tsx:11 | Tháng sinh | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ProfileSettings.tsx:11 | Năm sinh | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ProfileSettings.tsx:15 | Tên gọi (tuỳ chọn) | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ProfileSettings.tsx:17 | Điền ngày có thật và năm từ 1900 đến năm hiện tại. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ProfileSettings.tsx:18 | Nhớ hồ sơ trên máy này | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ProfileSettings.tsx:19 | Xóa hồ sơ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ProfileSettings.tsx:21 | Các kết quả dưới đây là góc nhìn để bạn tự suy ngẫm, không mô tả cố định con người bạn. | Dài hơn 15 từ; cân nhắc rút gọn | Một góc nhìn để tự đối chiếu, không định nghĩa con người bạn. |
| src/components/ProfileSettings.tsx:22 | Lá Bổn mạng | Thuật ngữ cần cân nhắc | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ProfileSettings.tsx:22 | Lá Năm tuổi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ProfileSettings.tsx:22 | Lá Tên gọi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ProfileSettings.tsx:24 | Chưa dùng tên gọi. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ProfileSettings.tsx:28 | · Đi kèm | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ProfileSettings.tsx:31 | Bốn khía cạnh | Thuật ngữ cần cân nhắc | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ProfileSettings.tsx:35 | Góc nhìn số đang chờ bổ sung; chưa có diễn giải cho mục này. | Thuật ngữ cần cân nhắc | Phần này đang được bổ sung. |
| src/components/ReadingRitual.tsx:40 | Đang soạn luận giải | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingRitual.tsx:53 | Hủy | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:73 | Lửa | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:73 | Nước | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:73 | Khí | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:73 | Đất | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:82 | Ngược | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:82 | Xuôi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:94 | Thu gọn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:94 | Xem thêm (${card.keywords.length - 8}) | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:95 | Biểu tượng nổi bật | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:96 | Nguồn tham khảo | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:97 | “ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:97 | ” | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:98 | Sách không đề cập | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:99 | * Số trang Huggens là ước lượng. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:126 | Các vị trí trong bài đọc | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:138 | Bạn trong bức tranh | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:139 | Bổn mạng | Thuật ngữ cần cân nhắc | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:139 | Năm tuổi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:139 | Tên gọi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:140 | Lá | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:140 | của bạn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:143 | Vị trí | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:151 | Những điều đang kéo về hai phía | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:152 | Khi các lá gặp nhau | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:158 | Hai hướng đi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:159 | 0 | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/ReadingScenes.tsx:164 | Một việc nhỏ có thể thử | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/SpreadBoard.tsx:25 | Lá ${item.position.number}, ${item.position.name_vi}: ${item.card.name_vi}, ${item.reversed ? 'ngược' : 'xuôi'} | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/SpreadBoard.tsx:25 | ngược | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/SpreadBoard.tsx:25 | xuôi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/SpreadBoard.tsx:25 | Lật lá ${item.position.number}, ${item.position.name_vi} | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/SpreadBoard.tsx:40 | Bố cục thế bài, có thể cuộn ngang | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/components/SpreadBoard.tsx:50 | . | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:7 | Tình yêu | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:7 | chuyện tình cảm | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:7 | Sự nghiệp | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:7 | công việc | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:7 | Tài chính | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:7 | chuyện tiền bạc | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:8 | Bản thân | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:8 | bản thân bạn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:8 | Tổng quan | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:8 | hiện tại của bạn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:11 | Ở vị trí ${position}, từ khóa “${keyword}” gợi bạn muốn tìm hiểu điều gì về ${topic}? | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:12 | Khi nhìn ${topic} qua vị trí ${position}, bạn muốn tự hỏi điều gì từ từ khóa “${keyword}”? | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:13 | Với từ khóa “${keyword}” ở vị trí ${position}, trải nghiệm nào về ${topic} bạn muốn nhìn lại? | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:16 | Lo lắng | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:16 | điều gì có thể giúp bạn cảm thấy được hỗ trợ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:17 | Phân vân | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:17 | bạn đang cân nhắc giữ lại hay buông điều gì | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:18 | Hy vọng | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:18 | bạn muốn dành sự chăm sóc cho mong muốn nào | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:19 | Kiệt sức | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:19 | bạn muốn cho mình khoảng nghỉ như thế nào | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:20 | Tò mò | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:20 | bạn muốn tìm hiểu thêm điều gì | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:21 | Bình yên | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:21 | bạn muốn dành thời gian quan sát điều gì | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:24 | Trong chuyện tình cảm, điều gì bạn muốn nói rõ hơn với chính mình hoặc người kia | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:25 | Trong công việc, điều gì bạn muốn làm rõ trước khi chọn bước tiếp theo | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:26 | Trong chuyện tiền bạc, thông tin nào bạn muốn kiểm tra trước khi quyết định | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:27 | Về bản thân bạn, nhu cầu nào bạn muốn lắng nghe kỹ hơn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/data/appPhrases.vi.ts:28 | Trong hiện tại của bạn, điều gì bạn muốn dành sự chú ý trước tiên | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/hooks/useProfile.ts:9 | Hồ sơ được nhớ khi ngày hợp lệ. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/hooks/useProfile.ts:9 | Chỉ giữ trong phiên này. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/hooks/useProfile.ts:9 | Chưa ghi hoặc xóa được dữ liệu trên máy. Bạn có thể thử lại. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/hooks/useReadingFlow.ts:36 | Tổng quan | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/hooks/useReadingFlow.ts:93 | Đang xào bài. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/hooks/useReadingFlow.ts:101 | Đã chọn ${reading.length} trên ${action.count} lá. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/hooks/useReadingFlow.ts:111 | Lá ${item.position.number}, ${item.position.name_vi}: ${item.card.name_vi}, ${item.reversed ? 'ngược' : 'xuôi'}. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/hooks/useReadingFlow.ts:111 | ngược | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/hooks/useReadingFlow.ts:111 | xuôi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/hooks/useReadingFlow.ts:130 | Chưa xào được bài. Bạn hãy thử lại. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/hooks/useReadingFlow.ts:147 | Chưa chọn được bài. Bạn hãy thử lại. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/aiConsent.ts:7 | Lịch sử chỉ lưu trên thiết bị này. Câu hỏi chỉ được gửi đi khi bạn chủ động bấm nút luận giải theo câu hỏi. | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/aiErrorMessage.ts:3 | Chưa kết nối được. Bạn kiểm tra mạng rồi thử lại. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/aiErrorMessage.ts:4 | Địa chỉ truy cập này chưa được cho phép. Bạn thử địa chỉ chính thức hoặc báo người quản trị. | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/aiErrorMessage.ts:5 | Bạn thử lại sau ít phút nhé. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/aiErrorMessage.ts:6 | Hệ thống đang bận, thử lại sau ít phút. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/aiErrorMessage.ts:7 | Chưa soạn được luận giải lúc này. Bạn vẫn có bản đọc từ sách bên dưới. | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/aiPresentation.ts:10 | Vị trí ${p.position}: ${p.title} | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/dealFromDeck.ts:14 | Không tìm thấy thế bài | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/dealFromDeck.ts:17 | Xác suất không hợp lệ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/dealFromDeck.ts:21 | Số vị trí không hợp lệ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/dealFromDeck.ts:26 | Bộ bài hoặc chỉ số chọn không hợp lệ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:3 | tự (tử\|sát\|vẫn\|hại) | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:4 | làm (hại\|đau) bản thân | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:5 | muốn chết | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:5 | chán sống | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:5 | muốn biến mất | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:5 | không đáng sống | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:6 | kết thúc (cuộc đời\|cuộc sống\|mạng sống) | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:7 | chấm dứt (tất cả\|cuộc sống\|cuộc đời) | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:8 | không muốn tỉnh dậy | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:8 | kết liễu | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:9 | (không\|chẳng\|hết) (còn )?(muốn\|thiết) (tiếp tục )?(sống\|tồn tại) | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:12 | sức khỏe | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:12 | bệnh | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:12 | thuốc | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:12 | điều trị | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:12 | chẩn đoán | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:12 | phẫu thuật | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:12 | có thai | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:13 | đau đầu | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:13 | đau bụng | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:13 | đau ngực | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:13 | đau lưng | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:13 | đau răng | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:13 | cơn đau | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:14 | vay tiền | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:14 | vay nợ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:14 | khoản vay | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:14 | mắc nợ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:14 | trả nợ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:14 | nợ nần | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:14 | đầu tư | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:14 | chứng khoán | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:14 | tài chính | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:15 | khởi kiện | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:15 | bị kiện | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:15 | vụ kiện | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:15 | kiện tụng | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:15 | luật sư | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:15 | pháp luật | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:15 | pháp lý | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:15 | hợp đồng | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/detectSensitive.ts:15 | ly hôn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/drawSpread.ts:14 | Không tìm thấy thế bài | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/drawSpread.ts:17 | Xác suất bài ngược phải nằm trong khoảng 0 đến 1 | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/drawSpread.ts:20 | Cấu hình thế bài không hợp lệ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:3 | Lo lắng | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:3 | Nặng nề | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:3 | Sợ hãi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:4 | Buồn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:4 | Cô đơn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:5 | Tủi thân | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:5 | Giận | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:6 | Thất vọng | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:6 | Tội lỗi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:7 | Xấu hổ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:7 | Kiệt sức | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:8 | Trống rỗng | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:8 | Bế tắc | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:9 | Tuyệt vọng | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:10 | Phân vân | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:10 | Giằng co | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:10 | Rối bời | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:11 | Mâu thuẫn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:11 | Chông chênh | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:12 | Áp lực | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:12 | Ngổn ngang | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:13 | Hy vọng | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:13 | Sáng | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:13 | Háo hức | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:14 | Biết ơn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:14 | Bình yên | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:15 | Nhẹ nhõm | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:15 | Tự tin | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:16 | Tò mò | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:16 | Yêu thương | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:17 | Khó gọi tên | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:17 | Đặc biệt | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:19 | Muốn rõ hơn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:19 | Muốn được an ủi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:19 | Muốn cân nhắc quyết định | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:19 | Muốn được lắng nghe | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:19 | Muốn khám phá | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:20 | Mới xảy ra | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:20 | Vài tuần | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:20 | Vài tháng | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/feelings.ts:20 | Đã lâu | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/fxMath.ts:18 | Lửa | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/fxMath.ts:18 | Nước | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/fxMath.ts:18 | Khí | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/fxMath.ts:18 | Đất | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/getCardText.ts:4 | Sách không bàn rõ nghĩa ngược của lá này | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/offlineReading.ts:13 | Tổng quan | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/offlineReading.ts:18 | Ở vị trí ${position.name_vi}, bạn muốn tự hỏi điều gì về ${topic}? | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/offlineReading.ts:29 | Từ khóa '${keyword}' xuất hiện ở các vị trí ${[...positions.values()].join(' và ')}. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/offlineReading.ts:29 | và | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/offlineReading.ts:31 | , khi nhìn lại bối cảnh bạn vừa chia sẻ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/offlineReading.ts:32 | , khi trở lại câu hỏi của bạn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/offlineReading.ts:34 | ${topicClosings[options.topic] ?? topicClosings['Tổng quan']}${anchor}? | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/offlineReading.ts:36 | Với những cảm xúc bạn chọn (${feelings.join(', ')}), ${feelings.map((feeling) => feelingPrompts[feeling as Feeling] ?? 'bạn muốn được hỗ trợ như thế nào').join('; ')}? | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/offlineReading.ts:36 | bạn muốn được hỗ trợ như thế nào | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/offlineReading.ts:37 | Khi nghĩ về ${topic}, bạn muốn cho mình thêm thời gian hoặc sự hỗ trợ như thế nào? | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/questionTemplates.ts:2 | Tình yêu | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/questionTemplates.ts:2 | Mình và người ấy hay hiểu lầm nhau, mình nên nhìn chuyện này thế nào? | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/questionTemplates.ts:3 | Sự nghiệp | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/questionTemplates.ts:3 | Mình đang phân vân giữa ở lại công việc hiện tại và chuyển việc, mình cần nhìn rõ điều gì? | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/questionTemplates.ts:4 | Tài chính | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/questionTemplates.ts:4 | Mình hay chi vượt kế hoạch mỗi tháng, mình cần nhìn lại thói quen nào? | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/questionTemplates.ts:5 | Bản thân | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/questionTemplates.ts:5 | Mình thường nhận lời giúp người khác dù đã rất mệt, mình cần hiểu điều gì về giới hạn của mình? | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/questionTemplates.ts:6 | Tổng quan | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/questionTemplates.ts:6 | Gần đây mình có quá nhiều việc phải lo và khó chọn ưu tiên, mình nên nhìn lại điều gì? | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/readingContext.ts:49 | Cốc | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/readingContext.ts:49 | Kiếm | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/readingContext.ts:49 | Gậy | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/readingContext.ts:49 | Tiền | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/readingContext.ts:49 | sách không đề cập | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/readingStage.ts:22 | Đang trải các lá bài của bạn… | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/readingStage.ts:22 | Đang nối các lá với câu chuyện của bạn… | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/readingStage.ts:23 | Lời đọc đang dần thành hình, chờ thêm chút nhé… | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/readingStage.ts:23 | Vẫn đang soạn lời đọc. Bạn có thể chờ thêm hoặc đọc theo sách trước. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/rng.ts:14 | Giới hạn RNG không hợp lệ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/rng.ts:20 | RNG phải trả về số nguyên uint32 | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/rng.ts:28 | Xác suất phải nằm trong khoảng 0 đến 1 | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/safetyText.ts:2 | Các lá bài không cho biết người kia nghĩ hay cảm thấy gì. Lời đọc dưới đây nói về điều bạn cảm nhận và những gì nằm trong tầm tay bạn. | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/summarizeReading.ts:6 | Lửa | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/summarizeReading.ts:6 | Nước | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/summarizeReading.ts:6 | Khí | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/lib/summarizeReading.ts:6 | Đất | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/HistoryScreen.tsx:20 | ${name}, ${card.reversed ? 'ngược' : 'xuôi'} | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/HistoryScreen.tsx:20 | ngược | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/HistoryScreen.tsx:20 | xuôi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/HistoryScreen.tsx:42 | Bài đọc này không còn trong lịch sử. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/HistoryScreen.tsx:57 | Những lần chiêm nghiệm | Thuật ngữ cần cân nhắc | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/HistoryScreen.tsx:57 | Lịch sử | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/HistoryScreen.tsx:58 | Các bài đọc được lưu trên thiết bị này, tối đa 100 mục. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/HistoryScreen.tsx:61 | Một trang mới đang chờ bạn. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/HistoryScreen.tsx:62 | Khi lưu một bài đọc, bạn có thể quay lại và nhìn ngắm nó ở đây. | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/HistoryScreen.tsx:62 | Về trang trải bài | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/HistoryScreen.tsx:64 | bài đọc | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/HistoryScreen.tsx:64 | Xóa tất cả | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/HistoryScreen.tsx:65 | Xóa tất cả bài đọc đã lưu? Thao tác này không thể hoàn tác. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/HistoryScreen.tsx:68 | Đã xóa tất cả bài đọc. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/HistoryScreen.tsx:68 | Chưa xóa được. Bạn hãy thử lại. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/HistoryScreen.tsx:75 | Một góc nhìn tổng quan cho hiện tại. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/HistoryScreen.tsx:76 | Các lá đã rút | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/HistoryScreen.tsx:77 | Xem lại | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/HistoryScreen.tsx:78 | Xóa bài đọc ngày ${new Date(reading.createdAt).toLocaleDateString('vi-VN')} | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/HistoryScreen.tsx:79 | Xóa | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/HistoryScreen.tsx:80 | Xóa bài đọc này khỏi lịch sử? | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/HistoryScreen.tsx:85 | Đã xóa bài đọc. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/LibraryScreen.tsx:2 | Khám phá bộ bài | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/LibraryScreen.tsx:3 | Thư viện 78 lá — sắp có | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/LibraryScreen.tsx:3 | Một nơi để tìm hiểu từng lá bài sẽ được mở ở bước tiếp theo. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/LibraryScreen.tsx:4 | Về trang trải bài | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/QuestionScreen.tsx:4 | Tình yêu | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/QuestionScreen.tsx:4 | Sự nghiệp | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/QuestionScreen.tsx:4 | Tài chính | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/QuestionScreen.tsx:4 | Bản thân | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/QuestionScreen.tsx:4 | Tổng quan | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/QuestionScreen.tsx:12 | 01 · Đặt câu hỏi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/QuestionScreen.tsx:12 | Bạn đang nghĩ về điều gì? | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/QuestionScreen.tsx:13 | Một câu hỏi mở có thể giúp bạn nhìn lại trải nghiệm của mình. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Bạn muốn nhìn rõ hơn chuyện gì? |
| src/screens/QuestionScreen.tsx:14 | Gợi ý chủ đề | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Chủ đề |
| src/screens/QuestionScreen.tsx:20 | Câu hỏi của bạn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/QuestionScreen.tsx:20 | (có thể để trống) | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/QuestionScreen.tsx:22 | Ví dụ: ${prompts[topic]} | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/QuestionScreen.tsx:23 | Dùng câu gợi ý | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/QuestionScreen.tsx:24 | Càng cụ thể (chuyện gì, đang phân vân điều gì), lời đọc càng sát với bạn. | Dài hơn 15 từ; cân nhắc rút gọn | Kể chuyện đang xảy ra và điều bạn còn phân vân. |
| src/screens/QuestionScreen.tsx:25 | Bối cảnh thêm | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Kể thêm |
| src/screens/QuestionScreen.tsx:25 | (không bắt buộc) | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/QuestionScreen.tsx:27 | Có điều gì trong tình huống này bạn muốn ghi lại thêm? | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Có điều gì khác bạn muốn kể? |
| src/screens/QuestionScreen.tsx:28 | /300 · Bối cảnh và cảm xúc tự nhập không lưu vào lịch sử. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/QuestionScreen.tsx:30 | Với sức khỏe, tài chính, pháp lý hoặc tự hại, hãy tìm sự hỗ trợ từ chuyên gia phù hợp. | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/QuestionScreen.tsx:31 | Quay lại | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/QuestionScreen.tsx:31 | Chọn thế bài | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/QuestionScreen.tsx:31 | → | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:47 | Những lá bài, một khoảng lặng. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:62 | Ngược | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:62 | Xuôi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:65 | Đã sao chép lời đọc. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:65 | Chưa sao chép được, bạn hãy chọn văn bản và sao chép tay. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:70 | Celtic Cross · 10 lá | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:70 | Trải ${result.length} lá · ${result.length === 3 ? result.map(r => r.position.name_vi).join(' · ') : spread.name_vi.replace(/\s*\/\s*/g, ' · ')} | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:78 | Dành một chút thời gian để nhìn lại điều đang ở trong bạn. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:80 | Chủ đề · | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:81 | Chủ đề này chỉ nhằm giúp bạn nhìn lại cảm xúc, không đưa dự đoán. Hãy trao đổi với chuyên gia sức khỏe, tài chính hoặc pháp lý phù hợp trước quyết định quan trọng. | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:83 | Mức độ diễn giải | Thuật ngữ cần cân nhắc | Cách xem bài |
| src/screens/ResultScreen.tsx:84 | Tóm tắt | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:84 | Chi tiết | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:86 | Đi vào từng lá | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Xem từng lá |
| src/screens/ResultScreen.tsx:86 | ↓ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:95 | Điểm gặp nhau | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:96 | Một câu hỏi mang theo | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:98 | Tổng quan nhanh · thống kê, không phải kết luận | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:99 | lá: | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:99 | Ẩn Chính, | Thuật ngữ cần cân nhắc | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:99 | Ẩn Phụ; | Thuật ngữ cần cân nhắc | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:99 | ngược, | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:99 | xuôi. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:100 | Theo nguyên tố (chỉ tính lá Ẩn Phụ): | Thuật ngữ cần cân nhắc | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:100 | . | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:102 | Lời đọc này có gần với bạn? | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Lời đọc có đúng với bạn? |
| src/screens/ResultScreen.tsx:103 | Bấm phản hồi sẽ lưu bài đọc và đánh giá vào lịch sử trên thiết bị này. Không gửi phản hồi đi đâu. | Dài hơn 15 từ; cân nhắc rút gọn | Phản hồi và bài đọc chỉ lưu trên máy này. |
| src/screens/ResultScreen.tsx:106 | Quay lại lịch sử | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:107 | Đã lưu | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:107 | Lưu vào lịch sử | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:108 | Sao chép lời đọc | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ResultScreen.tsx:109 | Bắt đầu bài đọc mới ↗ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Đọc bài mới ↗ |
| src/screens/ResultScreen.tsx:111 | Chưa lưu được. Bạn có thể thử lại. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:15 | Theo hệ thống | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:15 | Giảm chuyển động | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:15 | Bật chuyển động trong ứng dụng | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Bật chuyển động |
| src/screens/SettingsScreen.tsx:18 | Nhỏ · 92% | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:18 | Vừa · 100% | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:18 | Lớn · 112% | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:32 | Theo cách của bạn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:32 | Cài đặt | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:34 | Hiệu ứng | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:35 | Đầy đủ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:35 | Vừa | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:35 | Tối giản | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:36 | Đang áp dụng: | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:36 | Hiệu ứng đầy đủ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:36 | Hiệu ứng vừa | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:36 | Hiệu ứng tối giản | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:36 | . | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:38 | Bạn đang bật Giảm chuyển động trong ứng dụng. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:38 | Thiết bị đang yêu cầu giảm chuyển động; ứng dụng đang theo hệ thống. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:38 | Vì vậy, các hiệu ứng xào, bay và lật được thay bằng chuyển cảnh nhẹ. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:39 | Bật đầy đủ hiệu ứng trong ứng dụng | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Bật đầy đủ hiệu ứng |
| src/screens/SettingsScreen.tsx:42 | Chuyển động | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:45 | “Theo hệ thống” dùng thiết lập của thiết bị. “Giảm chuyển động” luôn tắt các hiệu ứng mạnh; “Bật chuyển động trong ứng dụng” cho phép hiệu ứng dù thiết bị đang giảm chuyển động. | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:47 | Cỡ chữ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:50 | Đang chọn: | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:54 | Cho phép bài ngược mặc định | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Bật bài ngược cho lần sau |
| src/screens/SettingsScreen.tsx:54 | Đang bật | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:54 | Đang tắt | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:54 | · Áp dụng cho bài đọc mới. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:58 | Tự lưu bài đọc | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:58 | · Lưu khi bài đọc đến trang diễn giải. | Thuật ngữ cần cân nhắc | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:60 | Đã lưu cài đặt. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:61 | Cài đặt vẫn được áp dụng, nhưng chưa lưu được trên thiết bị này. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Đã áp dụng, nhưng chưa lưu được cài đặt. |
| src/screens/SettingsScreen.tsx:62 | Luận giải theo câu hỏi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:63 | Đã đồng ý với ${providerLabel(settings.aiConsent.provider)}. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:63 | Bạn chưa đồng ý gửi câu hỏi tới dịch vụ luận giải. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:64 | Luận giải trực tuyến hiện chưa khả dụng. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:65 | Đã rút lại đồng ý. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:65 | Rút lại đồng ý | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:68 | Dữ liệu trên máy này | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:68 | bài đọc đang được lưu. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:69 | Xóa toàn bộ lịch sử | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:70 | Xóa toàn bộ lịch sử trên thiết bị này? Thao tác này không thể hoàn tác. | Dài hơn 15 từ; cân nhắc rút gọn | Xóa hết lịch sử? Bạn không thể khôi phục sau khi xóa. |
| src/screens/SettingsScreen.tsx:72 | Đã xóa toàn bộ lịch sử. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:72 | Chưa xóa được lịch sử. Bạn hãy thử lại. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:77 | Phản hồi của tôi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:78 | Chỉ sao chép id lá, chế độ đọc, id cảm xúc, mong muốn, thời gian và đánh giá. Không gồm bối cảnh, cảm xúc tự nhập hay nội dung luận giải. | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:79 | Kèm câu hỏi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:84 | Bạn chưa lưu phản hồi nào. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:84 | Đã sao chép phản hồi. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:84 | Chưa sao chép được, bạn hãy chọn văn bản và sao chép tay. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:85 | Sao chép phản hồi của tôi | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Sao chép phản hồi |
| src/screens/SettingsScreen.tsx:87 | Phản hồi để sao chép tay | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Chọn văn bản để sao chép |
| src/screens/SettingsScreen.tsx:89 | Giới thiệu | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:90 | Huggens: Tarot Nhập Môn; Pollack: Tarot 78 Độ Minh Triết. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:91 | Ảnh bài Rider-Waite-Smith 1909 của Pamela Colman Smith, bản quét từ Wikimedia Commons, phạm vi công cộng. | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:92 | Phần luận giải theo câu hỏi được soạn bằng dịch vụ luận giải ( | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SettingsScreen.tsx:92 | ) từ nội dung hai cuốn sách. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ShuffleScreen.tsx:13 | 03 · Xào bài | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ShuffleScreen.tsx:13 | Giữ một khoảng tĩnh. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ShuffleScreen.tsx:13 | Bộ bài đang được xào trước khi bạn chọn. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/ShuffleScreen.tsx:22 | Bỏ qua | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SpreadScreen.tsx:8 | 02 · Chọn thế bài | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SpreadScreen.tsx:8 | Một câu hỏi, nhiều cách nhìn. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SpreadScreen.tsx:9 | Chọn độ rộng của câu chuyện bạn muốn khám phá. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Chọn số lá bạn muốn rút. |
| src/screens/SpreadScreen.tsx:10 | Thế bài | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SpreadScreen.tsx:13 | Một thông điệp ngắn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Một góc nhìn nhanh |
| src/screens/SpreadScreen.tsx:13 | ${spread.card_count} lá | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SpreadScreen.tsx:17 | Cho phép bài ngược | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SpreadScreen.tsx:17 | Một số lá có thể xuất hiện ngược. Lá chéo của Celtic Cross luôn đọc xuôi. | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SpreadScreen.tsx:19 | ✧ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SpreadScreen.tsx:20 | Dùng hồ sơ của bạn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SpreadScreen.tsx:20 | Chỉ gửi các con số tính từ hồ sơ; ngày sinh và tên của bạn không rời khỏi thiết bị. | Dài hơn 15 từ; cân nhắc rút gọn | Thêm góc nhìn từ hồ sơ của bạn. |
| src/screens/SpreadScreen.tsx:22 | Chưa có hồ sơ hợp lệ. Bạn có thể thêm ở | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SpreadScreen.tsx:22 | Cài đặt | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SpreadScreen.tsx:22 | , hoặc tiếp tục không dùng hồ sơ. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SpreadScreen.tsx:23 | Quay lại | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SpreadScreen.tsx:23 | Xào bài | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/SpreadScreen.tsx:23 | → | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/TableScreen.tsx:37 | 05 · Lật bài | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/TableScreen.tsx:37 | 04 · Chọn bài | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/TableScreen.tsx:38 | Từng lá, từng góc nhìn. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/TableScreen.tsx:38 | Chọn những lá bài của bạn. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/TableScreen.tsx:39 | Chạm từng lá hoặc lật lần lượt để khám phá. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/TableScreen.tsx:39 | Chọn ${spread.card_count} lá từ bộ bài úp. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/TableScreen.tsx:40 | Trên điện thoại, kéo ngang để xem thêm | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/TableScreen.tsx:40 | Rê chuột qua quạt, bấm để chọn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/TableScreen.tsx:44 | Đã chọn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/TableScreen.tsx:44 | / | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/TableScreen.tsx:44 | lá | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/TableScreen.tsx:44 | Rút ngẫu nhiên | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/TableScreen.tsx:44 | các lá còn lại | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/TableScreen.tsx:47 | Đã lật | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/TableScreen.tsx:48 | Lật lá tiếp theo | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/TableScreen.tsx:49 | Xem diễn giải | Thuật ngữ cần cân nhắc | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/TableScreen.tsx:49 | → | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/WelcomeScreen.tsx:5 | Một khoảng lặng dành cho bạn | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/WelcomeScreen.tsx:6 | Để những lá bài | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/WelcomeScreen.tsx:6 | mở một góc nhìn mới. | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/WelcomeScreen.tsx:7 | Giữ trong lòng một câu hỏi. Chậm lại, lắng nghe và tìm điều đáng suy ngẫm trong câu chuyện của mình. | Dài hơn 15 từ; cân nhắc rút gọn | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/WelcomeScreen.tsx:8 | Bắt đầu trải bài | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/screens/WelcomeScreen.tsx:8 | ↗ | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/types.ts:3 | Lửa | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/types.ts:3 | Nước | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/types.ts:3 | Khí | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |
| src/types.ts:3 | Đất | Không có lỗi rõ; giữ nếu đúng ngữ cảnh | Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ |

## Vị trí văn bản động (453 mục)

| Vị trí | Biểu thức nguồn | Xử lý |
|---|---|---|
| src/App.tsx:55 | null | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:56 | route | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:57 | page | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:57 | -1 | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:58 | false | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:59 | screenKey | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:60 | focusHeading | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:62 | state.context | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:62 | state.feelings | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:63 | state.question | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:63 | state.topic | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:66 | Boolean(profileController.profile) | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:66 | state.profileEnabled | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:66 | spreads | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:66 | state.spreadId | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:66 | state.allowReversed | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:68 | () => startShuffle(profileController.calculate()) | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:69 | shuffleDone | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:70 | state | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:70 | spread | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:71 | pick | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:71 | flip | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:71 | finishFlip | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:72 | ai | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:72 | aiInfo | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:72 | buildAiPayload(state) | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:72 | state.context | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:72 | state.feelings | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:72 | state.questionIsGeneric | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:72 | state.reading | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:72 | spread | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:72 | state.question | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:72 | state.topic | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:73 | onSave | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:73 | saveStatus | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:73 | onRate | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:73 | feedback | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:76 | route | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:76 | <p role="status">Đang mở trang…</p> | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:77 | route === '#/library' && <LibraryScreen /> | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:78 | route === '#/history' && <HistoryScreen /> | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:79 | aiInfo | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:79 | profileController | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:81 | state.error | Giữ liên kết dữ liệu; render text thuần |
| src/App.tsx:83 | route === '#/' ? state.announcement : '' | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:31 | aiErrorMessage(state.status) | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:32 | state.status === 'ok' && <span className="sr-only">Luận giải đã sẵn sàng.</span> | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:33 | state.status === 'care' && <span className="sr-only">Bạn không cần đi qua điều này một mình. Lời nhắn hỗ trợ ở đầu trang.</span> | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:36 | ask | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:36 | state.status === 'loading' | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:36 | state.status === 'loading' \|\| ai.remaining > 0 \|\| state.status === 'care' | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:40 | ai.cancel | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:42 | info | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:42 | accept | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:42 | () => setConsent(false) | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:50 | reading.personal.title | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:50 | reading.personal.text | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:51 | reading.weave | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:52 | reading.unsaid | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:53 | (reading.paths ?? []).length ? 'Chiều hướng có thể' : 'Chuẩn bị điều cần hỏi' | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:53 | reading.outlook | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:54 | index | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:54 | path.label | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:54 | path.body | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:55 | reading.closing | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:56 | reading.question | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:57 | reading.experiment | Giữ liên kết dữ liệu; render text thuần |
| src/components/AiReadingPanel.tsx:62 | copied | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFace.tsx:20 | card.id | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFace.tsx:20 | label | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFace.tsx:21 | false | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFace.tsx:21 | () => setFailedId(card.id) | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFace.tsx:22 | label | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFace.tsx:30 | card.arcana === 'major' ? roman(card.number) : card.number | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFace.tsx:33 | card.suit === 'wands' && <><path d="M86 186 L123 119 M90 148 Q75 128 88 126 M112 148 Q137 147 132 135" /><path d="M83 181 L92 185 M118 119 L127 123" /></> | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFace.tsx:35 | card.suit === 'swords' && <><path d="M105 116 L113 136 L107 173 H103 L97 136Z M86 176 H124 M105 177 V192" /><circle cx="105" cy="196" r="3" /></> | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFace.tsx:36 | card.suit === 'pentacles' && <><circle cx="105" cy="155" r="35" /><path d="M105 126 L123 179 L77 146 H133 L87 179Z" /></> | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFace.tsx:38 | !card.suit && <text x="105" y="174" textAnchor="middle" fill="var(--element-accent)" fontSize="56">✧</text> | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFace.tsx:40 | card.name_vi | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFace.tsx:40 | titleCase(card.name_en) | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFan.tsx:14 | ref | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFan.tsx:14 | index | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFan.tsx:16 | ()=>setFocused(true) | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFan.tsx:16 | ()=>setFocused(false) | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFan.tsx:16 | ()=>onPick(index) | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFan.tsx:24 | ref | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFan.tsx:24 | 0 | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFan.tsx:27 | index | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFan.tsx:27 | index | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFan.tsx:27 | cursor | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFan.tsx:27 | quiet | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFan.tsx:27 | onPick | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFlip.tsx:28 | false | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFlip.tsx:32 | !face | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFlip.tsx:32 | card | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFlip.tsx:33 | false | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFlip.tsx:34 | face | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFlip.tsx:35 | !face | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFlip.tsx:35 | card | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFlip.tsx:40 | ref | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFlip.tsx:43 | art | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFlip.tsx:43 | art | Giữ liên kết dữ liệu; render text thuần |
| src/components/CardFlip.tsx:44 | card.name_vi | Giữ liên kết dữ liệu; render text thuần |
| src/components/CareNotice.tsx:7 | labels.join(', ').toLocaleLowerCase('vi') | Giữ liên kết dữ liệu; render text thuần |
| src/components/CareNotice.tsx:8 | !crisis && <p>Bạn có thể nói chuyện với một người tin cậy hoặc chuyên gia để được lắng nghe và hỗ trợ, theo nhịp phù hợp với bạn.</p> | Giữ liên kết dữ liệu; render text thuần |
| src/components/CareNotice.tsx:11 | item.label | Giữ liên kết dữ liệu; render text thuần |
| src/components/CareNotice.tsx:11 | item.label | Giữ liên kết dữ liệu; render text thuần |
| src/components/CareNotice.tsx:11 | item.url | Giữ liên kết dữ liệu; render text thuần |
| src/components/CinematicBackground.tsx:11 | hidden \|\| reduced | Giữ liên kết dữ liệu; render text thuần |
| src/components/CinematicBackground.tsx:12 | i | Giữ liên kết dữ liệu; render text thuần |
| src/components/ConfirmAction.tsx:8 | message | Giữ liên kết dữ liệu; render text thuần |
| src/components/ConfirmAction.tsx:9 | message | Giữ liên kết dữ liệu; render text thuần |
| src/components/ConfirmAction.tsx:10 | confirm | Giữ liên kết dữ liệu; render text thuần |
| src/components/ConfirmAction.tsx:10 | onConfirm | Giữ liên kết dữ liệu; render text thuần |
| src/components/ConfirmAction.tsx:10 | onCancel | Giữ liên kết dữ liệu; render text thuần |
| src/components/ConsentDialog.tsx:16 | dialog | Giữ liên kết dữ liệu; render text thuần |
| src/components/ConsentDialog.tsx:16 | titleId | Giữ liên kết dữ liệu; render text thuần |
| src/components/ConsentDialog.tsx:25 | titleId | Giữ liên kết dữ liệu; render text thuần |
| src/components/ConsentDialog.tsx:29 | providerLabel(info.provider) | Giữ liên kết dữ liệu; render text thuần |
| src/components/ConsentDialog.tsx:33 | onAccept | Giữ liên kết dữ liệu; render text thuần |
| src/components/ConsentDialog.tsx:33 | cancel | Giữ liên kết dữ liệu; render text thuần |
| src/components/ConsentDialog.tsx:33 | onClose | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeedbackButtons.tsx:6 | rating | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeedbackButtons.tsx:6 | value?.rating===rating | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeedbackButtons.tsx:9 | rating==='yes'?'Đúng với mình':'Chưa đúng' | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeedbackButtons.tsx:10 | message | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeelingsPicker.tsx:12 | value.ids.length | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeelingsPicker.tsx:13 | group | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeelingsPicker.tsx:13 | group | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeelingsPicker.tsx:14 | f.id | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeelingsPicker.tsx:14 | value.ids.includes(f.id) | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeelingsPicker.tsx:15 | value.ids.length>=3&&!value.ids.includes(f.id) | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeelingsPicker.tsx:15 | ()=>toggle(f.id) | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeelingsPicker.tsx:15 | f.label | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeelingsPicker.tsx:18 | otherDraft | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeelingsPicker.tsx:18 | 40 | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeelingsPicker.tsx:19 | otherDraft.length | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeelingsPicker.tsx:23 | n | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeelingsPicker.tsx:23 | value.intensity===n | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeelingsPicker.tsx:24 | n | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeelingsPicker.tsx:24 | ['Nhẹ','Hơi nặng','Vừa','Nặng','Rất nặng'][n-1] | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeelingsPicker.tsx:27 | id | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeelingsPicker.tsx:27 | value.want===id | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeelingsPicker.tsx:28 | WANT_LABELS[id] | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeelingsPicker.tsx:31 | id | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeelingsPicker.tsx:31 | value.duration===id | Giữ liên kết dữ liệu; render text thuần |
| src/components/FeelingsPicker.tsx:32 | DURATION_LABELS[id] | Giữ liên kết dữ liệu; render text thuần |
| src/components/Navigation.tsx:8 | item.route | Giữ liên kết dữ liệu; render text thuần |
| src/components/Navigation.tsx:8 | item.route | Giữ liên kết dữ liệu; render text thuần |
| src/components/Navigation.tsx:8 | route === item.route ? 'page' : undefined | Giữ liên kết dữ liệu; render text thuần |
| src/components/Navigation.tsx:8 | item.label | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:11 | field | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:11 | ['Ngày sinh', 'Tháng sinh', 'Năm sinh'][index] | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:12 | field === 'year' ? 4 : 2 | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:12 | draft[field] | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:15 | 100 | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:15 | draft.name | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:17 | !profile && (draft.day \|\| draft.month \|\| draft.year) && <p role="status">Điền ngày có thật và năm từ 1900 đến năm hiện tại.</p> | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:18 | remember | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:18 | (event) => update(draft, event.target.checked) | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:19 | onClear | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:19 | message | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:22 | label | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:23 | label | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:26 | id | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:26 | card.name_vi | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:26 | 49 | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:26 | 84 | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:28 | card.name_vi | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:28 | index > 0 ? ' · Đi kèm' : '' | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:34 | key | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:34 | facetLabels[key as keyof typeof facetLabels] | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:34 | number | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:35 | lens.essence | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:35 | lens.gift | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:35 | lens.shadow | Giữ liên kết dữ liệu; render text thuần |
| src/components/ProfileSettings.tsx:35 | lens.question | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingRitual.tsx:40 | overlay | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingRitual.tsx:46 | ref | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingRitual.tsx:49 | i | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingRitual.tsx:53 | ritualMessage(seconds) | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingRitual.tsx:53 | cancelButton | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingRitual.tsx:53 | onCancel | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:25 | ref | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:25 | size | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:26 | paragraphIndex | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:29 | i | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:30 | sentence | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:37 | className | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:38 | children | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:44 | ref | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:47 | fork ? 'M300 0 V24 Q300 42 150 55 L150 90 M300 24 Q300 42 450 55 L450 90' : 'M0 45 Q150 0 300 45 T600 45' | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:48 | fork ? 3 : 45 | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:53 | card | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:53 | card.name_vi | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:74 | ref | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:76 | image | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:79 | card | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:80 | card | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:82 | reversed ? 'Ngược' : 'Xuôi' | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:85 | String(position.number).padStart(2, '0') | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:86 | position.name_vi | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:86 | position.meaning_short | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:87 | applied?.title ?? card.name_vi | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:88 | titleCase(card.name_en) | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:89 | applied?.scene ?? summary.text | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:90 | applied?.notice ?? reflection | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:92 | summary.text | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:92 | depth.text | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:93 | i | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:93 | k | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:94 | expanded | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:94 | () => setExpanded(!expanded) | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:95 | i | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:95 | s.name | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:97 | summary.quote | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:98 | formatRefs([...summary.refs, ...summary.quote_ref]).join(' · ') \|\| 'Sách không đề cập' | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:102 | feedback | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:127 | position.number | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:128 | i === active ? 'step' : undefined | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:132 | card | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:138 | personal.title | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:139 | via | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:140 | label.toLowerCase() | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:141 | id | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:141 | card | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:141 | resonance.some(r => r.via === via && r.cardId === id) | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:143 | r.card.id | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:143 | r.card | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:143 | r.position.number | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:145 | personal.text | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:151 | reading.tension | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:153 | card | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:153 | card.id | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:154 | reading.weave | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:155 | reading.outlook | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:156 | reading.unsaid | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:158 | reading.outlook | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:159 | i | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:159 | i + 1 | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:159 | path.label | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:160 | card.id | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:160 | card | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:161 | path.body | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:163 | reading.closing | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:163 | reading.question | Giữ liên kết dữ liệu; render text thuần |
| src/components/ReadingScenes.tsx:164 | reading.experiment | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:19 | ref | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:19 | deckIndex | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:22 | null | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:22 | origin | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:22 | target | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:22 | item.position.rotation??0 | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:22 | land | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:24 | !landed \|\| !revealing \|\| flipped | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:24 | () => onFlip(index) | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:26 | item.card | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:26 | flipped&&landed | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:26 | item.reversed | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:26 | complete | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:40 | 0 | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:45 | position.number | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:47 | position.number | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:48 | origins.get(pickedIndices[index]) | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:48 | reading[index] | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:48 | index | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:48 | pickedIndices[index] | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:49 | revealed.includes(index) | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:49 | revealing | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:49 | onFlip | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:49 | onFinish | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:50 | position.number | Giữ liên kết dữ liệu; render text thuần |
| src/components/SpreadBoard.tsx:50 | position.name_vi | Giữ liên kết dữ liệu; render text thuần |
| src/components/Starfield.tsx:19 | ref | Giữ liên kết dữ liệu; render text thuần |
| src/components/Starfield.tsx:19 | level | Giữ liên kết dữ liệu; render text thuần |
| src/components/Starfield.tsx:19 | i | Giữ liên kết dữ liệu; render text thuần |
| src/fx/CardTilt.tsx:6 | ref | Giữ liên kết dữ liệu; render text thuần |
| src/fx/CardTilt.tsx:6 | children | Giữ liên kết dữ liệu; render text thuần |
| src/fx/ParticleCanvas.tsx:62 | ref | Giữ liên kết dữ liệu; render text thuần |
| src/hooks/useSettings.tsx:28 | quiet ? 'always' : 'never' | Giữ liên kết dữ liệu; render text thuần |
| src/hooks/useSettings.tsx:28 | children | Giữ liên kết dữ liệu; render text thuần |
| src/hooks/useSettings.tsx:50 | children | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:22 | 42 | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:22 | 72 | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:22 | () => setFailed(true) | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:52 | selected.id | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:52 | rebuildReading(selected) | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:52 | spreadMap.get(selected.spreadId)! | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:53 | selected.question | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:53 | selected.topic | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:53 | selected.feelings | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:53 | selected.feedback | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:53 | vote=>rate(selected,vote) | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:56 | section | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:59 | LOCAL_HISTORY_NOTICE | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:60 | message | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:64 | readings.length | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:64 | clearButton | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:71 | reading.id | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:73 | reading.createdAt | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:74 | spreadMap.get(reading.spreadId)?.name_vi | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:75 | shorten(reading.question) \|\| 'Một góc nhìn tổng quan cho hiện tại.' | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:76 | card.cardId | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:76 | card | Giữ liên kết dữ liệu; render text thuần |
| src/screens/HistoryScreen.tsx:77 | () => open(reading.id) | Giữ liên kết dữ liệu; render text thuần |
| src/screens/QuestionScreen.tsx:15 | value | Giữ liên kết dữ liệu; render text thuần |
| src/screens/QuestionScreen.tsx:15 | topic === value | Giữ liên kết dữ liệu; render text thuần |
| src/screens/QuestionScreen.tsx:17 | value | Giữ liên kết dữ liệu; render text thuần |
| src/screens/QuestionScreen.tsx:21 | question | Giữ liên kết dữ liệu; render text thuần |
| src/screens/QuestionScreen.tsx:21 | (event) => onQuestion(event.target.value) | Giữ liên kết dữ liệu; render text thuần |
| src/screens/QuestionScreen.tsx:21 | 500 | Giữ liên kết dữ liệu; render text thuần |
| src/screens/QuestionScreen.tsx:22 | 4 | Giữ liên kết dữ liệu; render text thuần |
| src/screens/QuestionScreen.tsx:23 | () => onQuestion(prompts[topic]) | Giữ liên kết dữ liệu; render text thuần |
| src/screens/QuestionScreen.tsx:26 | context | Giữ liên kết dữ liệu; render text thuần |
| src/screens/QuestionScreen.tsx:26 | (event) => onContext(event.target.value) | Giữ liên kết dữ liệu; render text thuần |
| src/screens/QuestionScreen.tsx:27 | 300 | Giữ liên kết dữ liệu; render text thuần |
| src/screens/QuestionScreen.tsx:27 | 3 | Giữ liên kết dữ liệu; render text thuần |
| src/screens/QuestionScreen.tsx:28 | context.length | Giữ liên kết dữ liệu; render text thuần |
| src/screens/QuestionScreen.tsx:29 | feelings | Giữ liên kết dữ liệu; render text thuần |
| src/screens/QuestionScreen.tsx:29 | onFeelings | Giữ liên kết dữ liệu; render text thuần |
| src/screens/QuestionScreen.tsx:31 | onBack | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:39 | mode | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:39 | position | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:39 | mode | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:40 | feedback.find(f=>f.position===position&&f.mode===mode) | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:40 | onRate | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:67 | result.length >= 7 | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:68 | hero | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:71 | feelings | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:72 | opening.limit | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:73 | reading ? 'online' : 'offline' | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:74 | -1 | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:75 | i | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:76 | word | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:78 | opening.opening | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:78 | question.trim() \|\| 'Dành một chút thời gian để nhìn lại điều đang ở trong bạn.' | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:80 | topic | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:82 | aiInfo | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:82 | ai | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:82 | aiPayload | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:84 | !detailed | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:84 | () => setDetailed(false) | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:84 | detailed | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:84 | () => setDetailed(true) | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:88 | result | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:89 | reading ? 'interpreted-scenes' : 'book-scenes' | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:90 | drawn | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:90 | detailed | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:91 | feedbackFor(drawn.position.number) | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:91 | reading?.per_card.find(p => p.position === drawn.position.number) | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:91 | offline.reflections[index].text | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:93 | reading.personal | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:93 | aiPayload?.profile | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:93 | result | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:94 | reading | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:94 | result | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:95 | text | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:95 | text | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:96 | text | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:96 | text | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:99 | stats.total | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:99 | stats.major | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:99 | stats.minor | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:99 | stats.reversed | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:99 | stats.total - stats.reversed | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:103 | feedbackFor(null) | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:106 | onBack | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:107 | onSave | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:107 | saveStatus === 'saved' | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:107 | saveStatus === 'saved' ? 'Đã lưu' : 'Lưu vào lịch sử' | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:108 | () => void copy() | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:109 | onRestart | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:110 | LOCAL_HISTORY_NOTICE | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:111 | saveStatus === 'saved' ? 'Đã lưu' : saveStatus === 'error' ? 'Chưa lưu được. Bạn có thể thử lại.' : '' | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ResultScreen.tsx:113 | copied | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:33 | profileController | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:33 | onClearProfile | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:35 | value | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:35 | settings.effects === value | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:35 | label | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:36 | reduced ? 'Giảm chuyển động' : level === 'full' ? 'Hiệu ứng đầy đủ' : level === 'medium' ? 'Hiệu ứng vừa' : 'Hiệu ứng tối giản' | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:43 | value | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:43 | value | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:44 | settings.motion === value | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:44 | label | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:48 | value | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:48 | value | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:49 | settings.fontScale === value | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:49 | label | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:50 | sizes.find((item) => item.value === settings.fontScale)?.label | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:52 | settings.allowReversedDefault | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:54 | settings.allowReversedDefault ? 'Đang bật' : 'Đang tắt' | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:56 | settings.autoSave | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:58 | settings.autoSave ? 'Đang bật' : 'Đang tắt' | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:60 | saveStatus === 'saved' ? 'Đã lưu cài đặt.' : saveStatus === 'error'<br>      ? 'Cài đặt vẫn được áp dụng, nhưng chưa lưu được trên thiết bị này.' : '' | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:64 | aiInfo === null && <p>Luận giải trực tuyến hiện chưa khả dụng.</p> | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:66 | LOCAL_HISTORY_NOTICE | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:68 | readings.length | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:68 | LOCAL_HISTORY_NOTICE | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:69 | clearButton | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:69 | () => setConfirm(true) | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:71 | close | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:75 | message | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:79 | includeQuestion | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:86 | exportMessage | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:87 | 6 | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:87 | exportFallback | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:87 | e=>e.currentTarget.select() | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SettingsScreen.tsx:92 | aiInfo?.provider === 'anthropic' ? 'Anthropic Claude' : 'Google Gemini' | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ShuffleScreen.tsx:14 | ref | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ShuffleScreen.tsx:16 | i | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ShuffleScreen.tsx:17 | false | Giữ liên kết dữ liệu; render text thuần |
| src/screens/ShuffleScreen.tsx:22 | onDone | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SpreadScreen.tsx:11 | spread.id | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SpreadScreen.tsx:11 | selected === spread.id | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SpreadScreen.tsx:11 | () => onSelect(spread.id) | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SpreadScreen.tsx:12 | spread.card_count === 1 ? '◇' : spread.card_count === 3 ? '◇ ◇ ◇' : '✣' | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SpreadScreen.tsx:13 | spread.name_vi | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SpreadScreen.tsx:16 | allowReversed | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SpreadScreen.tsx:16 | (event) => onReversed(event.target.checked) | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SpreadScreen.tsx:19 | useProfile && profileAvailable | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SpreadScreen.tsx:19 | useProfile && profileAvailable | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SpreadScreen.tsx:19 | !profileAvailable | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SpreadScreen.tsx:19 | (event) => onProfile(event.target.checked) | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SpreadScreen.tsx:22 | !profileAvailable && <p>Chưa có hồ sơ hợp lệ. Bạn có thể thêm ở <a href="#/settings">Cài đặt</a>, hoặc tiếp tục không dùng hồ sơ.</p> | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SpreadScreen.tsx:23 | onBack | Giữ liên kết dữ liệu; render text thuần |
| src/screens/SpreadScreen.tsx:23 | onStart | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:36 | ref | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:37 | revealing ? '05 · Lật bài' : '04 · Chọn bài' | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:38 | revealing ? 'Từng lá, từng góc nhìn.' : 'Chọn những lá bài của bạn.' | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:43 | state.deck.length | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:43 | state.pickedIndices | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:43 | pick | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:44 | state.reading.length | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:44 | spread.card_count | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:44 | () => pick() | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:44 | state.reading.length ? ' các lá còn lại' : '' | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:47 | state.finished.length | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:47 | spread.card_count | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:48 | nextButton | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:48 | next < 0 | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:48 | () => next >= 0 && onFlip(next) | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:49 | resultButton | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:49 | onResult | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:51 | origins.current | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:51 | spread | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:51 | state.reading | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:51 | state.pickedIndices | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:51 | state.revealed | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:52 | revealing | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:52 | flip | Giữ liên kết dữ liệu; render text thuần |
| src/screens/TableScreen.tsx:52 | onFinish | Giữ liên kết dữ liệu; render text thuần |
| src/screens/WelcomeScreen.tsx:8 | onStart | Giữ liên kết dữ liệu; render text thuần |

Các câu nhắc an toàn, xác nhận xóa không thể hoàn tác, tên sách/tác giả và dòng quyền riêng tư được yêu cầu giữ đủ nghĩa, không áp trần 15 từ máy móc. PRIVACY.md và AI_FREE_TIER không đổi. Không gộp schema tension/weave/unsaid; prompt giảm lặp ý.
