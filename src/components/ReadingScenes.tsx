import {CardKnowledgeLink} from './CardKnowledge';
import {lazy, Suspense, useEffect, useRef, useState, type CSSProperties, type ReactNode} from 'react';
import {AnimatePresence, motion, useInView} from 'framer-motion';
import {useMotionPreference} from '../lib/useMotionPreference';
import {splitSentences, namedCards} from '../lib/readingStage';
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
  return <div ref={ref} className={`stage-text ${className}`} data-text-size={size}>
    {text.split(/\r?\n\s*\r?\n/u).filter(p=>p.trim()).map((paragraph,i)=><motion.p className="stage-prose" key={i} initial={{opacity:quiet?1:0,y:quiet?0:8}} animate={visible?{opacity:1,y:0}:undefined} transition={{duration:quiet?0:.25}}>{paragraph.replace(/\s*\r?\n\s*/gu,' ')}</motion.p>)}
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
export function CardScene({drawn, applied, detailed, reflection, feedback,count=1}: {drawn: DrawnCard; applied?: AiReading['per_card'][number]; detailed: boolean; reflection: string; feedback?: ReactNode;count?:number}) {
  const {position,card,reversed}=drawn;const {level,reduced}=useMotionPreference();const quiet=reduced||level==='minimal';
  const detailKey=`tarot.meaning.${card.id}.${reversed}`;
  const [expanded,setExpanded]=useState(()=>{try{return sessionStorage.getItem(detailKey)==='1';}catch{return false;}});
  const [lightbox,setLightbox]=useState(false);const opener=useRef<HTMLButtonElement>(null);const dialog=useRef<HTMLDialogElement>(null);
  const summary=getCardText(card,reversed);const depth=getCardText(card,summary.rev_missing?false:reversed,'depth');
  const sentences=splitSentences(summary.text);const lead=sentences[0]??summary.text;const remainder=summary.text.slice(summary.text.indexOf(lead)+lead.length).trim();
  const symbols=card.arcana==='major'?pickSymbolChips(card.symbols):[];
  const accent=card.arcana==='major'?'#d9b86f':({'wands':'#e9a47b','cups':'#83c9d8','swords':'#bccde5','pentacles':'#a6c991'} as const)[card.suit??'wands'];

  useEffect(()=>{if(lightbox){dialog.current?.showModal();const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=old;opener.current?.focus({preventScroll:true});};}dialog.current?.close();},[lightbox]);
  const stage=(i:number)=>({initial:{opacity:quiet?1:0,y:quiet?0:8},whileInView:{opacity:1,y:0},viewport:{once:true,amount:.1},transition:{duration:quiet?0:.18,delay:quiet?0:i*.065}});
  return <article id={`scene-${position.number}`} className="tarot-scene reader-scene" aria-labelledby={`scene-title-${position.number}`} style={{'--scene-accent':accent} as CSSProperties}>
    <div className="scene-card-column">
      <div className="scene-card-float"><div className="scene-aura" aria-hidden="true"/>
        <button ref={opener} className="scene-enlarge" aria-label={`Phóng to ${card.name_vi}`} onClick={()=>setLightbox(true)}>
          <Suspense fallback={<CardFace card={card}/>}><Tilt><div style={{transform:reversed?'rotate(180deg)':undefined}}><CardFace card={card}/></div></Tilt></Suspense>
        </button><span className="direction-chip">{reversed?'Ngược':'Xuôi'}</span>
      </div>
      {applied?.scene&&<div className="scene-image-caption"><span className="scene-imagery-label">Trên lá bài</span><p>{applied.scene}</p></div>}
    </div>
    <div className="scene-copy-frame"><div className="scene-copy">
      <span className="scene-number" aria-hidden="true">{String(position.number).padStart(2,'0')}</span>
      <motion.div {...stage(0)}><p className="position-chip">{position.name_vi} · {position.number}/{count}</p><p className="position-description">{position.meaning_short}</p></motion.div>
      <motion.div {...stage(1)}><h2 id={`scene-title-${position.number}`} className="scene-title">{applied?.title??card.name_vi}</h2><p className="scene-card-name">{card.name_vi} · <span lang="en">{titleCase(card.name_en)}</span></p></motion.div>
      <motion.div className="scene-main" {...stage(2)}><span className="scene-section-label">Lá này nói gì với câu hỏi của bạn</span><blockquote className="scene-notice">{applied?.notice??reflection}</blockquote></motion.div>
      <motion.ul className="keyword-chips" {...stage(3)}>{card.keywords.map((k,i)=><li key={i}>{k}</li>)}</motion.ul>
      {detailed&&<motion.div className="scene-details" {...stage(4)}><span className="scene-section-label">Nghĩa của lá</span><p className="meaning-lead">{lead}</p>
        <button className="meaning-toggle" aria-expanded={expanded} aria-controls={`meaning-${position.number}`} onClick={()=>{const next=!expanded;setExpanded(next);try{sessionStorage.setItem(detailKey,next?'1':'0');}catch{}}}>{expanded?'Thu gọn':'Đọc thêm'} <span aria-hidden="true">{expanded?'−':'+'}</span></button>
        <AnimatePresence initial={false}>{expanded&&<motion.div exit={{opacity:0,y:quiet?0:6}} id={`meaning-${position.number}`} initial={{opacity:quiet?1:0,y:quiet?0:6}} animate={{opacity:1,y:0}} transition={{duration:quiet?0:.2}}>{remainder&&<SentenceText text={remainder}/>}<SentenceText text={depth.text}/>
         {symbols.length>0&&<><h3>Biểu tượng nổi bật</h3><ul className="keyword-chips">{symbols.map((symbol,i)=><li key={i}>{symbol.name}</li>)}</ul></>}
         <details className="scene-sources"><summary>Nguồn tham khảo</summary>{summary.quote&&<blockquote>“{summary.quote}”</blockquote>}<p>{formatRefs([...summary.refs,...summary.quote_ref]).join(' · ')||'Sách không đề cập'}</p><small>* Số trang Huggens là ước lượng.</small></details>
        </motion.div>}</AnimatePresence>
      </motion.div>}<CardKnowledgeLink card={card}/>{feedback}
    </div></div>
    <dialog ref={dialog} className="card-lightbox" aria-label={card.name_vi} onCancel={()=>setLightbox(false)} onClick={event=>{if(event.target===event.currentTarget)setLightbox(false);}}><div className="lightbox-content"><button autoFocus aria-label="Đóng ảnh lá bài" onClick={()=>setLightbox(false)}>Đóng ×</button><div className="lightbox-card" style={{transform:reversed?'rotate(180deg)':undefined}}><CardFace card={card}/></div><p>{applied?.scene??card.name_vi}</p></div></dialog>
  </article>;
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
