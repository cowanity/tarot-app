import {lazy, Suspense, useEffect, useRef, useState, type CSSProperties, type ReactNode} from 'react';
import {motion, useInView} from 'framer-motion';
import {useMotionPreference} from '../lib/useMotionPreference';
import {splitSentences, scrollProgress, namedCards} from '../lib/readingStage';
import {burst} from '../lib/fxEvents';
import {burstKind} from '../lib/fxMath';
import {CardFace} from './CardFace';
import {getCardText} from '../lib/getCardText';
import {formatRefs} from '../lib/formatRefs';
import {titleCase} from '../lib/titleCase';
import {pickSymbolChips} from '../lib/pickSymbolChips';
import {cardSet, profileResonance, type Profile} from '../lib/numerology';
import {cards} from '../data';
import type {AiReading} from '../lib/aiClient';
import type {Card, DrawnCard} from '../types';
const Tilt = lazy(() => import('../fx/CardTilt'));

export function SentenceText({text, className = ''}: {text: string; className?: string}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, {once: true, amount: .15});
  const {level, reduced} = useMotionPreference();
  const quiet = reduced || level === 'minimal';
  const size = text.length <= 110 ? 'short' : text.length <= 190 ? 'medium' : 'long';
  let sentenceIndex = 0;
  return <div ref={ref} className={`stage-text ${className}`} data-text-size={size}>
    {text.split(/\r?\n/u).filter(p => p.trim()).map((paragraph, paragraphIndex) => <p className="stage-prose" key={paragraphIndex}>
      {splitSentences(paragraph).map((sentence, i) => {
        const delay = Math.min(sentenceIndex++ * .13, .8);
        return <motion.span key={i} initial={{opacity: 0, y: quiet ? 0 : 12}}
          animate={visible ? {opacity: 1, y: 0} : undefined} transition={{duration: quiet ? .15 : .5, delay: quiet ? 0 : delay}}>{sentence}{' '}</motion.span>;
      })}
    </p>)}
  </div>;
}
export function Reveal({children, className = ''}: {children: ReactNode; className?: string}) {
  const {level, reduced} = useMotionPreference();
  return <motion.section className={className} initial={{opacity: 0, y: reduced || level === 'minimal' ? 0 : 22}}
    whileInView={{opacity: 1, y: 0}} viewport={{once: true, amount: .08}} transition={{duration: .4}}>{children}</motion.section>;
}
export function GoldLine({fork = false}: {fork?: boolean}) {
  const ref = useRef<SVGSVGElement>(null); const visible = useInView(ref, {once: true});
  const {reduced, level} = useMotionPreference(); const quiet = reduced || level === 'minimal';
  // Reveal a static stroke with transform/opacity, avoiding layout/paint animation of dash arrays.
  return <svg ref={ref} className="stage-gold-line" viewBox="0 0 600 90" aria-hidden="true" preserveAspectRatio="none">
    <motion.g initial={{scaleX: quiet ? 1 : 0, opacity: 0}} animate={visible ? {scaleX: 1, opacity: 1} : undefined}
      style={{transformOrigin: '50% 0%'}} transition={{duration: quiet ? .15 : 1}}>
      <path d={fork ? 'M300 0 V24 Q300 42 150 55 L150 90 M300 24 Q300 42 450 55 L450 90' : 'M0 45 Q150 0 300 45 T600 45'} fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="300" cy={fork ? 3 : 45} r="3" fill="currentColor" />
    </motion.g>
  </svg>;
}
export function MiniCard({card, glow = false}: {card: Card; glow?: boolean}) {
  return <div className={`stage-mini ${glow ? 'is-resonant' : ''}`}><CardFace card={card} /><small>{card.name_vi}</small></div>;
}
export function CardScene({drawn, applied, detailed, reflection, feedback}: {drawn: DrawnCard; applied?: AiReading['per_card'][number]; detailed: boolean; reflection: string; feedback?: ReactNode}) {
  const {position, card, reversed} = drawn;
  const ref = useRef<HTMLElement>(null); const image = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, {once: true, amount: .18});
  const fired = useRef(false); const {level, reduced} = useMotionPreference(); const quiet = reduced || level === 'minimal';
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (!visible || fired.current) return;
    fired.current = true;
    if (quiet) return;
    const timer = setTimeout(() => {
      const rect = image.current?.getBoundingClientRect();
      if (rect && rect.bottom > 0 && rect.top < innerHeight) burst({x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, kind: burstKind(card), count: level === 'full' ? 16 : 8});
    }, 350);
    return () => clearTimeout(timer);
  }, [visible, quiet, card, level]);
  const summary = getCardText(card, reversed); const depth = getCardText(card, summary.rev_missing ? false : reversed, 'depth');
  const symbols = card.arcana === 'major' ? pickSymbolChips(card.symbols) : [];
  const accent = ({'Lửa': '#c88c70', 'Nước': '#83becb', 'Khí': '#bcb9e8', 'Đất': '#a0ba7b'} as const)[card.element!] ?? '#c9a45c';
  return <article ref={ref} id={`scene-${position.number}`} className="tarot-scene" aria-labelledby={`scene-title-${position.number}`}
    style={{'--scene-accent': accent} as CSSProperties}>
    <div className="scene-card-column"><motion.div ref={image} className="scene-card-float" initial={{opacity: 0, x: quiet ? 0 : -65, y: quiet ? 0 : 45, rotate: quiet ? 0 : -8}}
      animate={visible ? {opacity: 1, x: 0, y: 0, rotate: 0} : undefined} transition={quiet ? {duration: .15} : {type: 'spring', stiffness: 85, damping: 20}}>
      <div className="scene-aura" aria-hidden="true" />
      <Suspense fallback={<div style={{transform: reversed ? 'rotate(180deg)' : undefined}}><CardFace card={card} /></div>}>
        <Tilt><div style={{transform: reversed ? 'rotate(180deg)' : undefined}}><CardFace card={card} /></div></Tilt>
      </Suspense>
      <span className="direction-chip">{reversed ? 'Ngược' : 'Xuôi'}</span>
    </motion.div></div>
    <div className="scene-copy">
      <span className="scene-number" aria-hidden="true">{String(position.number).padStart(2, '0')}</span>
      <p className="eyebrow">{position.name_vi}</p><p className="quiet-note">{position.meaning_short}</p>
      <h2 id={`scene-title-${position.number}`}>{applied?.title ?? card.name_vi}</h2>
      <p className="scene-card-name">{applied && `${card.name_vi} · `}<span lang="en">{titleCase(card.name_en)}</span></p>
      <div className={applied ? "scene-imagery" : undefined}>{applied && <span className="scene-imagery-label">Trên lá bài</span>}<SentenceText text={applied?.scene ?? summary.text} /></div>
      <blockquote className="scene-notice">{applied?.notice ?? reflection}</blockquote>
      {detailed && <div className="scene-details">
        {applied && <SentenceText text={summary.text} />}<SentenceText text={depth.text} />
        <ul className="keyword-chips">{(expanded ? card.keywords : card.keywords.slice(0, 8)).map((k, i) => <li key={i}>{k}</li>)}</ul>
        {card.keywords.length > 8 && <button aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? 'Thu gọn' : `Xem thêm (${card.keywords.length - 8})`}</button>}
        {symbols.length > 0 && <><h3>Biểu tượng nổi bật</h3><ul className="keyword-chips">{symbols.map((s, i) => <li key={i}>{s.name}</li>)}</ul></>}
        <details className="scene-sources"><summary>Nguồn tham khảo</summary>
          {summary.quote && <blockquote>“{summary.quote}”</blockquote>}
          <p>{formatRefs([...summary.refs, ...summary.quote_ref]).join(' · ') || 'Sách không đề cập'}</p>
          <small>* Số trang Huggens là ước lượng.</small>
        </details>
      </div>}
      {feedback}
    </div>
  </article>;
}
export function ReadingProgress({reading}: {reading: DrawnCard[]}) {
  const [active, setActive] = useState(0);
  const {reduced, level} = useMotionPreference();
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let best = Infinity, index = 0;
      reading.forEach(({position}, i) => {
        const rect = document.getElementById(`scene-${position.number}`)?.getBoundingClientRect();
        if (!rect) return;
        const distance = Math.abs(scrollProgress(rect.top, rect.height, innerHeight) - .5);
        if (distance < best) { best = distance; index = i; }
      });
      setActive(index);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); addEventListener('scroll', onScroll, {passive: true}); addEventListener('resize', onScroll);
    return () => {cancelAnimationFrame(frame); removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll);};
  }, [reading]);
  return <nav className={`reading-progress ${reading.length >= 7 ? 'is-dots' : ''}`} aria-label="Các vị trí trong bài đọc" lang="vi">
    {reading.map(({position, card}, i) => <button key={position.number} aria-label={`${position.number}. ${position.name_vi} — ${card.name_vi}`}
      aria-current={i === active ? 'step' : undefined} onClick={() => {
        const target = document.getElementById(`scene-title-${position.number}`);
        target?.setAttribute('tabindex', '-1'); target?.focus({preventScroll: true});
        document.getElementById(`scene-${position.number}`)?.scrollIntoView({behavior: reduced || level === 'minimal' ? 'auto' : 'smooth', block: 'start'});
      }}>{reading.length >= 7 ? <i /> : <span aria-hidden="true"><CardFace card={card} /></span>}</button>)}
  </nav>;
}
export function PersonalScene({personal, profile, reading}: {personal: NonNullable<AiReading['personal']>; profile?: Profile; reading: DrawnCard[]}) {
  const resonance = profile ? profileResonance(profile, reading.map(r => r.card.id)) : [];
  return <Reveal className="personal-scene stage-ending-section">
    <p className="eyebrow">Bạn trong bức tranh</p><h2>{personal.title}</h2>
    {profile && <div className="personal-cards">{([['birth', 'Lá ngày sinh', profile.birthCard], ['year', 'Lá của năm nay', profile.yearCard], ['name', 'Lá từ tên bạn', profile.nameCard]] as const).map(([via, label, n]) => n !== null && <div key={via}>
      <h3>Lá {label.toLowerCase()} của bạn</h3><div className="stage-mini-row">{cardSet(n).map(id => {
        const card = cards.find(c => c.id === id); return card && <MiniCard key={id} card={card} glow={resonance.some(r => r.via === via && r.cardId === id)} />;
      })}</div>
      {resonance.some(r => r.via === via) && <><GoldLine /><div className="stage-mini-row">{reading.filter(r => resonance.some(hit => hit.via === via && hit.cardId === r.card.id)).map(r => <div key={r.card.id}><MiniCard card={r.card} glow /><small>Vị trí {r.position.number}</small></div>)}</div></>}
    </div>)}</div>}
    <SentenceText text={personal.text} />
  </Reveal>;
}
export function ReadingFinale({reading, drawn}: {reading: AiReading; drawn: DrawnCard[]}) {
  const paths = reading.paths ?? [];
  return <div className="reading-finale">
    <Reveal className="stage-ending-section"><p className="eyebrow">Những điều đang kéo về hai phía</p><SentenceText className="stage-large" text={reading.tension} /></Reveal>
    <Reveal className="stage-ending-section"><h2>Khi các lá gặp nhau</h2>
      <div className="weave-cards"><GoldLine /><div className="stage-mini-row">{drawn.map(({card}) => <MiniCard card={card} key={card.id} />)}</div></div>
      <SentenceText text={reading.weave} />
      {!paths.length && <aside className="care-note"><SentenceText text={reading.outlook} /></aside>}
      {reading.unsaid && <blockquote className="stage-unsaid"><SentenceText text={reading.unsaid} /></blockquote>}
    </Reveal>
    {paths.length > 0 && <Reveal className="stage-ending-section"><h2>Hai hướng đi</h2><SentenceText className="paths-outlook" text={reading.outlook} /><GoldLine fork />
      <div className="stage-paths">{paths.map((path, i) => <section key={i}><p className="eyebrow">0{i + 1}</p><h3>{path.label}</h3>
        <div className="stage-mini-row">{namedCards(path.body, drawn.map(r => r.card)).map(card => <MiniCard key={card.id} card={card} />)}</div>
        <SentenceText text={path.body} /></section>)}</div>
    </Reveal>}
    <Reveal className="stage-ending-section stage-closing"><h2>{reading.closing}</h2><SentenceText className="closing-question" text={reading.question} />
      {reading.experiment && <aside className="stage-experiment"><h3>Một việc nhỏ có thể thử</h3><p>{reading.experiment}</p></aside>}
    </Reveal>
  </div>;
}
