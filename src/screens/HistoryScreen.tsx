import {readHistoryNames,renameHistory,clearHistoryNames} from '../lib/historyNames';
import {browserStorage} from '../lib/browserStorage';
import { LOCAL_HISTORY_NOTICE } from '../lib/historyNotice';
import { useEffect, useRef, useState } from 'react';
import { cards, spreads } from '../data';
import { useHistory } from '../hooks/useHistory';
import { rebuildReading, type SavedReading } from '../lib/history';
import { CardBack } from '../components/CardBack';
import { ConfirmAction } from '../components/ConfirmAction';
import { ResultScreen } from './ResultScreen';

const cardMap = new Map(cards.map((card) => [card.id, card]));
const spreadMap = new Map(spreads.map((spread) => [spread.id, spread]));
const shorten = (question: string) => {
  const chars = Array.from(question.trim());
  return chars.length > 80 ? `${chars.slice(0, 79).join('')}…` : chars.join('');
};
function Thumbnail({ card }: { card: SavedReading['cards'][number] }) {
  const [failed, setFailed] = useState(false);
  const name = cardMap.get(card.cardId)?.name_vi ?? card.cardId;
  return <span className={`history-thumb ${card.reversed ? 'history-thumb-reversed' : ''}`}>
    {failed ? <span role="img" aria-label={`${name}, ${card.reversed ? 'ngược' : 'xuôi'}`}><span aria-hidden="true"><CardBack /></span></span>
      : <img src={`/cards/${card.cardId}.webp`} alt={`${name}, ${card.reversed ? 'ngược' : 'xuôi'}`} loading="lazy" decoding="async"
        width={42} height={72} onError={() => setFailed(true)} />}
  </span>;
}
export default function HistoryScreen() {
  const { readings, remove, clear, rate } = useHistory();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmAll, setConfirmAll] = useState(false);
  const [message, setMessage] = useState('');
  const [names,setNames]=useState(()=>readHistoryNames(browserStorage())),[renaming,setRenaming]=useState<string|null>(null),[name,setName]=useState('');
  const section = useRef<HTMLElement>(null);
  const savedScroll = useRef(0);
  const clearButton = useRef<HTMLButtonElement>(null);
  const selected = readings.find((reading) => reading.id === selectedId);
  const restoreList = (id: string | null, scroll: number) => requestAnimationFrame(() => {
    const item = id ? document.getElementById(`history-${id}`) : null;
    const target = item?.querySelector<HTMLElement>('button') ?? section.current?.querySelector<HTMLElement>('h1');
    if (target) { target.tabIndex = target.tagName === 'H1' ? -1 : target.tabIndex; target.focus({ preventScroll: true }); }
    window.scrollTo({ top: scroll, behavior: 'instant' });
  });
  useEffect(() => {
    if (selectedId && !selected) { setSelectedId(null); setMessage('Bài đọc này không còn trong lịch sử.'); }
  }, [selectedId, selected]);
  const open = (id: string) => {
    savedScroll.current = window.scrollY; setSelectedId(id); setDeleteId(null); setConfirmAll(false);
    requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>('#main-content h1');
      if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  };
  if (selected) return <ResultScreen savedInterpretation={selected.interpretation} key={selected.id} result={rebuildReading(selected)} spread={spreadMap.get(selected.spreadId)!}
    question={selected.question} topic={selected.topic} feelings={selected.feelings} feedback={selected.feedback} onRate={vote=>rate(selected,vote)} readOnly onBack={() => {
      const id = selected.id; setSelectedId(null); restoreList(id, savedScroll.current);
    }} />;
  return <section ref={section} className="screen-panel history-screen">
    <p className="eyebrow">Những lần chiêm nghiệm</p><h1>Lịch sử</h1>
    <p className="lede">Các bài đọc được lưu trên thiết bị này, tối đa 100 mục.</p>
    <p className="quiet-note">{LOCAL_HISTORY_NOTICE}</p>
    <p className="status-note" role="status" aria-live="polite">{message}</p>
    {readings.length === 0 ? <div className="history-empty"><h2>Một trang mới đang chờ bạn.</h2>
      <p>Khi lưu một bài đọc, bạn có thể quay lại và nhìn ngắm nó ở đây.</p><a className="button-link" href="#/">Về trang trải bài</a>
    </div> : <>
      <div className="history-toolbar"><span>{readings.length} bài đọc</span><button ref={clearButton} onClick={() => { setConfirmAll(true); setDeleteId(null); }}>Xóa tất cả</button></div>
      {confirmAll && <ConfirmAction message="Xóa tất cả bài đọc đã lưu? Thao tác này không thể hoàn tác."
        onCancel={() => { setConfirmAll(false); requestAnimationFrame(() => clearButton.current?.focus({ preventScroll: true })); }}
        onConfirm={() => {
          const result = clear(); setMessage(result.ok ? 'Đã xóa tất cả bài đọc.' : 'Chưa xóa được. Bạn hãy thử lại.');
          if (result.ok) {clearHistoryNames(browserStorage());setNames({});setConfirmAll(false); restoreList(null, window.scrollY); }
        }} />}
      <ol className="history-list">{readings.map((reading, index) => <li id={`history-${reading.id}`} key={reading.id}>
        <article aria-labelledby={`history-heading-${reading.id}`}>
          <time dateTime={reading.createdAt}>{new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(reading.createdAt))}</time>
          {reading.interpretation && <p>{[reading.interpretation.reading.verdict,reading.interpretation.reading.answer].filter(Boolean).join(' — ')}</p>}
          <h2 id={`history-heading-${reading.id}`}>{names[reading.id]||spreadMap.get(reading.spreadId)?.name_vi}</h2>
          <p className="history-question">{shorten(reading.question) || 'Một góc nhìn tổng quan cho hiện tại.'}</p>
          <div className="history-thumbnails" aria-label="Các lá đã rút">{reading.cards.map((card) => <Thumbnail key={card.cardId} card={card} />)}</div>
          <div className="actions"><button onClick={() => open(reading.id)}>Xem lại</button><button onClick={()=>{setRenaming(reading.id);setName(names[reading.id]||'');}}>Đổi tên</button>
            <button aria-label={`Xóa bài đọc ngày ${new Date(reading.createdAt).toLocaleDateString('vi-VN')}`}
              onClick={() => { setDeleteId(reading.id); setConfirmAll(false); }}>Xóa</button></div>
          {renaming===reading.id&&<form onSubmit={e=>{e.preventDefault();if(renameHistory(browserStorage(),reading.id,name)){setNames(readHistoryNames(browserStorage()));setRenaming(null);setMessage('Đã đổi tên trên thiết bị.');}else setMessage('Chưa lưu được tên mới.');}}><label>Tên bài đọc<input autoFocus maxLength={80} value={name} onChange={e=>setName(e.target.value)}/></label><button type="submit">Lưu tên</button><button type="button" onClick={()=>setRenaming(null)}>Hủy</button></form>}
          {deleteId === reading.id && <ConfirmAction message="Xóa bài đọc này khỏi lịch sử?"
            onCancel={() => { setDeleteId(null); restoreList(reading.id, window.scrollY); }}
            onConfirm={() => {
              const scroll = window.scrollY;
              const nextId = readings[index + 1]?.id ?? readings[index - 1]?.id ?? null;
              const result = remove(reading.id); setMessage(result.ok ? 'Đã xóa bài đọc.' : 'Chưa xóa được. Bạn hãy thử lại.');
              if (result.ok) { setDeleteId(null); restoreList(nextId, scroll); }
            }} />}
        </article>
      </li>)}</ol>
    </>}
  </section>;
}
