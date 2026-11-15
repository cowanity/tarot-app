import { useState } from 'react';
import type { Card } from '../types';
import { titleCase } from '../lib/titleCase';

function roman(value: number): string {
  if (value === 0) return '0';
  let result = '';
  for (const [number, symbol] of [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']] as const) {
    while (value >= number) { result += symbol; value -= number; }
  }
  return result;
}
const colors = { Lửa: '#bc765f', Nước: '#719bac', Khí: '#aaa6cf', Đất: '#8aab7b' };

export function CardFace({ card }: { card: Card }) {
  const [failedId, setFailedId] = useState<string | null>(null);
  const label = `${card.name_vi} — ${titleCase(card.name_en)}`;
  return (
    <div className="card-frame card-face-art" style={{ '--element-accent': card.element ? colors[card.element] : '#c9a45c' } as React.CSSProperties}>
      {failedId !== card.id ? <img key={card.id} src={`/cards/${card.id}.webp`} alt={label}
        className="card-art card-photo" draggable={false} onError={() => setFailedId(card.id)} /> : (
        <svg viewBox="0 0 210 360" className="card-art" role="img" aria-label={label}>
          <rect width="210" height="360" rx="10" fill="#191127" />
          <g fill="none" stroke="var(--element-accent)">
            <rect x="9" y="9" width="192" height="342" rx="5" /><rect x="15" y="15" width="180" height="330" opacity=".4" />
            <path d="M30 45 Q55 45 55 70 M180 45 Q155 45 155 70 M30 315 Q55 315 55 290 M180 315 Q155 315 155 290" />
            <circle cx="105" cy="155" r="53" opacity=".4" /><path d="M105 91 L164 155 L105 219 L46 155Z" opacity=".4" />
          </g>
          <text x="105" y="62" textAnchor="middle" fill="#efe6d2" fontSize="24" fontFamily="Cormorant Garamond">
            {card.arcana === 'major' ? roman(card.number) : card.number}
          </text>
          <g fill="none" stroke="var(--element-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {card.suit === 'wands' && <><path d="M86 186 L123 119 M90 148 Q75 128 88 126 M112 148 Q137 147 132 135" /><path d="M83 181 L92 185 M118 119 L127 123" /></>}
            {card.suit === 'cups' && <><path d="M79 134 H131 Q129 165 105 169 Q81 165 79 134Z M105 169 V190 M88 192 H122" /><path d="M81 139 Q62 140 74 156 L86 159 M129 139 Q148 140 136 156 L124 159" /></>}
            {card.suit === 'swords' && <><path d="M105 116 L113 136 L107 173 H103 L97 136Z M86 176 H124 M105 177 V192" /><circle cx="105" cy="196" r="3" /></>}
            {card.suit === 'pentacles' && <><circle cx="105" cy="155" r="35" /><path d="M105 126 L123 179 L77 146 H133 L87 179Z" /></>}
          </g>
          {!card.suit && <text x="105" y="174" textAnchor="middle" fill="var(--element-accent)" fontSize="56">✧</text>}
          <foreignObject x="24" y="235" width="162" height="96">
            <div className="fallback-names"><strong>{card.name_vi}</strong><span>{titleCase(card.name_en)}</span></div>
          </foreignObject>
        </svg>
      )}
    </div>
  );
}
