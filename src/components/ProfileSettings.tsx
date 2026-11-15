import type { ProfileController } from '../hooks/useProfile';
import { cards } from '../data';
import { cardSet } from '../lib/numerology';
import { lookupNumberLens } from '../lib/profileContext';
export function ProfileSettings({controller, onClear}: {controller: ProfileController; onClear: () => void}) {
  const {draft, profile, remember, update, message} = controller;
  const facetLabels = {soul: 'Tâm hồn', lesson: 'Bài học', gift: 'Món quà', purpose: 'Mục đích'};
  return <section className="device-data profile-sanctuary"><h2>Hồ sơ của bạn</h2>
    <p>Không bắt buộc. Ngày sinh và tên gọi chỉ dùng để tính trên thiết bị này.</p>
    <div className="profile-fields">
      {(['day', 'month', 'year'] as const).map((field, index) => <label key={field}>{['Ngày sinh', 'Tháng sinh', 'Năm sinh'][index]}
        <input inputMode="numeric" type="text" autoComplete="off" maxLength={field === 'year' ? 4 : 2} value={draft[field]}
          onChange={(event) => update({...draft, [field]: event.target.value.replace(/\D/g, '')})} />
      </label>)}
      <label>Tên gọi (tuỳ chọn)<input type="text" autoComplete="off" maxLength={100} value={draft.name} onChange={(event) => update({...draft, name: event.target.value})} /></label>
    </div>
    {!profile && (draft.day || draft.month || draft.year) && <p role="status">Điền ngày có thật và năm từ 1900 đến năm hiện tại.</p>}
    <label className="switch-row"><input type="checkbox" checked={remember} onChange={(event) => update(draft, event.target.checked)} />Nhớ hồ sơ trên máy này</label>
    <button onClick={onClear}>Xóa hồ sơ</button><p role="status">{message}</p>
    {profile && <div className="profile-results">
      <p>Một góc nhìn để tự đối chiếu, không định nghĩa con người bạn.</p>
      <div className="profile-triptych">{([['Lá ngày sinh', profile.birthCard], ['Lá của năm nay', profile.yearCard], ['Lá từ tên bạn', profile.nameCard]] as const).map(([label, number]) => <section className="profile-mini-card" key={label}>
        <h3>{label}{number !== null ? ` · ${number}` : ''}</h3>
        {number === null ? <p>Chưa dùng tên gọi.</p> : <ul className="profile-card-list">{cardSet(number).map((id, index) => {
          const card = cards.find((c) => c.id === id)!;
          return <li key={id}><img src={`/cards/${id}.webp`} alt={card.name_vi} width={49} height={84} loading="lazy" decoding="async"
            onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }} />
            <span>{card.name_vi}{index > 0 ? ' · Đi kèm' : ''}</span></li>;
        })}</ul>}
      </section>)}</div>
      <h3>Bốn khía cạnh</h3>
      <div className="profile-facets">{Object.entries(profile.facets).map(([key, number]) => {
        const lens = lookupNumberLens(number);
        return <details className="profile-facet" key={key}><summary><span>{facetLabels[key as keyof typeof facetLabels]}</span><b>{number}</b></summary>
          {lens ? <><p>{lens.essence}</p><p>{lens.gift}</p><p>{lens.shadow}</p><p>{lens.question}</p></> : <p>Phần này đang được bổ sung.</p>}
        </details>;
      })}</div>
    </div>}
  </section>;
}
