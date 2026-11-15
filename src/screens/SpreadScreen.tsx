import type { Spread } from '../types';
export function SpreadScreen({ profileAvailable, useProfile, onProfile, spreads, selected, allowReversed, onSelect, onReversed, onBack, onStart }: {
  profileAvailable: boolean; useProfile: boolean; onProfile: (value: boolean) => void;
  spreads: Spread[]; selected: string; allowReversed: boolean;
  onSelect: (id: string) => void; onReversed: (enabled: boolean) => void; onBack: () => void; onStart: () => void;
}) {
  return <section className="screen-panel">
    <p className="eyebrow">02 · Chọn thế bài</p><h1>Một câu hỏi, nhiều cách nhìn.</h1>
    <p className="lede">Chọn số lá bạn muốn rút.</p>
    <div className="spread-options" role="group" aria-label="Thế bài">
      {spreads.map((spread) => <button className="spread-choice" key={spread.id} aria-pressed={selected === spread.id} onClick={() => onSelect(spread.id)}>
        <span className="spread-glyph" aria-hidden="true">{spread.card_count === 1 ? '◇' : spread.card_count === 3 ? '◇ ◇ ◇' : '✣'}</span>
        <strong>{spread.name_vi}</strong><span className="muted">{spread.card_count === 1 ? 'Một góc nhìn nhanh' : `${spread.card_count} lá`}</span>
      </button>)}
    </div>
    <label className="switch-row"><input type="checkbox" checked={allowReversed} onChange={(event) => onReversed(event.target.checked)} />
      <span><strong>Cho phép bài ngược</strong><small>Một số lá có thể xuất hiện ngược. Lá chéo của Celtic Cross luôn đọc xuôi.</small></span>
    </label>
    <label className="switch-row profile-toggle" data-active={useProfile && profileAvailable}><span className="profile-toggle-mark" aria-hidden="true">✧</span><input type="checkbox" checked={useProfile && profileAvailable} disabled={!profileAvailable} onChange={(event) => onProfile(event.target.checked)} />
      <span><strong>Dùng hồ sơ của bạn</strong><small>Thêm góc nhìn từ hồ sơ của bạn.</small></span>
    </label>
    {!profileAvailable && <p>Chưa có hồ sơ hợp lệ. Bạn có thể thêm ở <a href="#/settings">Cài đặt</a>, hoặc tiếp tục không dùng hồ sơ.</p>}
    <div className="actions"><button onClick={onBack}>Quay lại</button><button className="button-primary" onClick={onStart}>Xào bài <span aria-hidden="true">→</span></button></div>
  </section>;
}
