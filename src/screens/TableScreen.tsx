import {useNarrowBoard} from '../hooks/useBoardWidth';
import { useCallback, useEffect, useRef } from 'react';
import { LayoutGroup } from 'framer-motion';
import type { ReadingState } from '../hooks/useReadingFlow';
import type { Spread } from '../types';
import { CardFan } from '../components/CardFan';
import type {CardRect} from '../fx/CardFlight';
import { SpreadBoard } from '../components/SpreadBoard';
export function TableScreen({ state, spread, onPick, onFlip, onFinish, onResult }: {
  state: ReadingState; spread: Spread; onPick: (index?: number) => void;
  onFlip: (index: number) => void; onFinish: (index: number) => void; onResult: () => void;
}) {
  const mobileCross=useNarrowBoard()&&spread.id==='celtic-cross';
  const ref = useRef<HTMLElement>(null), nextButton = useRef<HTMLButtonElement>(null);
  const revealing = state.stage === 'revealing', allFinished = state.finished.length === spread.card_count;
  const next = state.reading.findIndex((_, index) => !state.revealed.includes(index));
  const resultButton = useRef<HTMLButtonElement>(null);
  const flip = useCallback((index: number) => onFlip(index), [onFlip]);
  useEffect(() => { if (revealing) nextButton.current?.focus(); }, [revealing]);
  useEffect(() => { if (allFinished) resultButton.current?.focus(); }, [allFinished]);
  const origins=useRef(new Map<number,CardRect>());
  function pick(index?: number) {
    const fan=ref.current?.querySelector<HTMLElement>('.fan-scroll');
    const fallback=fan?.getBoundingClientRect();
    state.deck.forEach((_,i)=>{
      if(state.pickedIndices.includes(i))return;
      const node=ref.current?.querySelector<HTMLElement>(`[data-pick-index="${i}"]`);
      const r=node?.getBoundingClientRect();
      if(r&&node)origins.current.set(i,{left:r.left+(r.width-node.offsetWidth)/2,top:r.top+(r.height-node.offsetHeight)/2,width:node.offsetWidth,height:node.offsetHeight});
      else if(fallback)origins.current.set(i,{left:fallback.left+fallback.width/2,top:fallback.top+30,width:92,height:158});
    });
    onPick(index);
    if (index !== undefined) requestAnimationFrame(() => {
      const buttons = [...(ref.current?.querySelectorAll<HTMLButtonElement>('[data-pick-index]') ?? [])];
      (buttons.find((button) => Number(button.dataset.pickIndex) > index) ?? buttons[0] ?? nextButton.current)?.focus();
    });
  }
  return <section className="screen-panel table-screen" ref={ref}>
    <p className="eyebrow">{revealing ? '05 · Lật bài' : '04 · Chọn bài'}</p>
    <h1>{revealing ? 'Từng lá, từng góc nhìn.' : 'Chọn những lá bài của bạn.'}</h1>
    <p className="lede">{revealing ? 'Chạm từng lá hoặc lật lần lượt để khám phá.' : `Chọn ${spread.card_count} lá từ bộ bài úp.`}</p>
    {!revealing && <p className="fan-instructions"><span className="fan-mobile-hint">Trên điện thoại, kéo ngang để xem thêm</span><span className="fan-desktop-hint">Rê chuột qua quạt, bấm để chọn</span></p>}
    <LayoutGroup id="reading-table">
      {!revealing && <>
        <CardFan count={state.deck.length} picked={state.pickedIndices} onPick={pick}/>
        <div className="table-controls"><p className="muted">Đã chọn {state.reading.length}/{spread.card_count} lá</p><button onClick={() => pick()}>Rút ngẫu nhiên{state.reading.length ? ' các lá còn lại' : ''}</button></div>
      </>}
      {revealing && <div className="table-controls">
        {!mobileCross&&<p className="muted">Đã lật {state.finished.length}/{spread.card_count} lá</p>}
        {!mobileCross&&<button ref={nextButton} disabled={next < 0} onClick={() => next >= 0 && onFlip(next)}>Lật lá tiếp theo</button>}
        {allFinished && <button ref={resultButton} className="button-primary" onClick={onResult}>Xem diễn giải <span aria-hidden="true">→</span></button>}
      </div>}
      <SpreadBoard origins={origins.current} spread={spread} reading={state.reading} pickedIndices={state.pickedIndices} revealed={state.revealed}
        revealing={revealing} onFlip={flip} onFinish={onFinish} />
    </LayoutGroup>
  </section>;
}
