/** App-authored messages only: never display a provider response or raw code. */
export function aiErrorMessage(status: string): string {
  if (status === 'blocked') return 'Địa chỉ truy cập này chưa được cho phép. Bạn thử địa chỉ chính thức hoặc báo người quản trị.';
  if (status === 'rate_limit'||status==='rate_limited') return 'Bạn vừa rút khá nhiều lượt. Thử lại sau ít phút nhé.';
  if(status==='daily_budget')return 'Hôm nay bộ bài đã luận giải đủ nhiều. Hẹn bạn ngày mai, hoặc đọc theo sách bên dưới.';
  return 'Chưa soạn được luận giải lúc này. Bạn vẫn có bản đọc từ sách bên dưới.';
}
