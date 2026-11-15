export function CardBack() {
  return (
    <div className="card-frame card-back"><svg viewBox="0 0 210 360" className="card-art" role="img" aria-label="Lá bài úp, chưa tiết lộ">
      <rect width="210" height="360" rx="10" fill="#140d26" />
      <g stroke="#c9a45c" fill="none">
        <rect x="9" y="9" width="192" height="342" rx="6" opacity=".7" />
        <rect x="15" y="15" width="180" height="330" rx="3" opacity=".35" />
        <path d="M105 35 Q160 105 175 180 Q160 255 105 325 Q50 255 35 180 Q50 105 105 35Z" opacity=".55" />
        <path d="M105 60 Q30 180 105 300 Q180 180 105 60Z M30 180 Q105 115 180 180 Q105 245 30 180Z" opacity=".4" />
        <circle cx="105" cy="180" r="36" /><circle cx="105" cy="180" r="43" opacity=".4" />
        <path d="M105 140 L115 170 L145 180 L115 190 L105 220 L95 190 L65 180 L95 170Z" />
        <path d="M25 40 Q55 40 55 70 M185 40 Q155 40 155 70 M25 320 Q55 320 55 290 M185 320 Q155 320 155 290" />
      </g>
      <g fill="#c9a45c"><circle cx="105" cy="180" r="4" /><circle cx="105" cy="50" r="2" /><circle cx="105" cy="310" r="2" /></g>
    </svg></div>
  );
}
