import {CARE_ANSWER} from '../lib/safetyText';
import {AnswerHero} from '../components/AnswerHero';
import type {SavedInterpretation} from '../lib/history';
import {FeedbackButtons} from '../components/FeedbackButtons';
import type {ReadingFeedback} from '../lib/feedback';
import {copyText} from '../lib/copyText';
import {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion, useInView, useScroll, useTransform} from 'framer-motion';
import {useMotionPreference} from '../lib/useMotionPreference';
import {AiReadingPanel} from '../components/AiReadingPanel';
import {CareNotice} from '../components/CareNotice';
import {MiniCard, CardScene, PersonalScene, ReadingFinale, ReadingProgress, Reveal, SentenceText} from '../components/ReadingScenes';
import type {AiReadingController} from '../hooks/useAiReading';
import type {AiInfo, AiPayload} from '../lib/aiClient';
import {aiReadingText, splitThirdPartyLimit} from '../lib/aiPresentation';
import {headlineSize} from '../lib/readingStage';
import {LOCAL_HISTORY_NOTICE} from '../lib/historyNotice';
import {buildOfflineReading} from '../lib/offlineReading';
import {getCardText} from '../lib/getCardText';
import {summarizeReading} from '../lib/summarizeReading';
import {readingSensitivity, type Feelings} from '../lib/feelings';
import type {DrawnCard, Spread} from '../types';
import type {SaveStatus} from '../hooks/useReadingSave';
import './readingStage.css';

export function ResultScreen({ autoInterpret=false, savedInterpretation, result, spread, question, topic, ai, aiInfo = null, aiPayload, context = '', feelings = {ids: []}, onRestart, readOnly = false, onBack, onSave, saveStatus = 'idle', feedback = [], onRate }: {
  autoInterpret?:boolean; savedInterpretation?:SavedInterpretation;
  feedback?: ReadingFeedback[]; onRate?: (vote:ReadingFeedback)=>{ok:boolean};
  ai?: AiReadingController; aiInfo?: AiInfo | null; aiPayload?: AiPayload;
  result: DrawnCard[]; spread: Spread; question: string; topic: string; onRestart?: () => void;
  questionIsGeneric?: boolean; context?: string; feelings?: Feelings;
  readOnly?: boolean; onBack?: () => void; onSave?: () => void; saveStatus?: SaveStatus;
}) {
  const [detailed, setDetailed] = useState(false);
  const [copied, setCopied] = useState('');
  const {reduced, level} = useMotionPreference(); const quiet = reduced || level === 'minimal';
  const stats = summarizeReading(result);
  const sensitive = readingSensitivity(question, context, feelings);
  const offline = buildOfflineReading(result, {question, topic, context, feelings});
  const response = savedInterpretation ?? (!readOnly && ai?.state.status === 'ok' ? ai.state.result : null);
  const reading = response?.reading;
  const mode = response?.mode ?? (sensitive === 'crisis' || ai?.state.status === 'care' ? 'care' : 'offline');
  const feedbackFor = (position:number|null) => onRate ? <FeedbackButtons key={mode} position={position} mode={mode}
    value={feedback.find(f=>f.position===position&&f.mode===mode)} onRate={onRate} /> : null;

  const opening = reading ? splitThirdPartyLimit(reading.opening, response?.notes ?? []) : null;
  const hero = useRef<HTMLElement>(null);
  const heroVisible = useInView(hero);
  const {scrollYProgress} = useScroll({target: hero, offset: ['start end', 'end start']});
  const glowY = useTransform(scrollYProgress, [0, 1], [-35, 35]);
  const headline = reading?.headline ?? (mode==='care' ? 'Một lời dành cho bạn' : undefined) ?? 'Những lá bài dành cho bạn';
  const previous = useRef(Boolean(reading));
  useEffect(() => {
    const arrived = Boolean(reading) && !previous.current;
    previous.current = Boolean(reading);
    if (!arrived) return;
    // Wait for the ritual portal to exit and release inert/scroll lock.
    const timer = setTimeout(() => {
      document.getElementById('reading-hero-title')?.focus({preventScroll: true});
      hero.current?.scrollIntoView({behavior: quiet ? 'auto' : 'smooth', block: 'start'});
    }, quiet ? 180 : 700);
    return () => clearTimeout(timer);
  }, [reading, quiet]);
  const copy = async () => {
    const text = reading ? aiReadingText(reading, response?.notes) : [headline, question, spread.name_vi,
      ...result.flatMap(({position, card, reversed}, i) => [position.name_vi, card.name_vi, reversed ? 'Ngược' : 'Xuôi',
        getCardText(card, reversed).text, ...(detailed ? [getCardText(card, reversed && !card.rev_missing, 'depth').text] : []), offline.reflections[i].text]),
      ...offline.connections, ...offline.closing].filter(Boolean).join('\n\n');
    setCopied(await copyText(text) ? 'Đã sao chép lời đọc.' : 'Chưa sao chép được, bạn hãy chọn văn bản và sao chép tay.');
  };
  return <section className="result-stage" data-long-reading={result.length >= 7}>
    <header ref={hero} className="reading-hero">
      <motion.div aria-hidden="true" className="hero-halo" style={{y: !quiet && heroVisible ? glowY : 0}} />
      <p className="eyebrow">{spread.id === 'celtic-cross' ? 'Celtic Cross · 10 lá' : `Trải ${result.length} lá · ${result.length === 3 ? result.map(r => r.position.name_vi).join(' · ') : spread.name_vi.replace(/\s*\/\s*/g, ' · ')}`}</p>
      {(sensitive === 'crisis' || (!readOnly && ai?.state.status === 'care')) && <CareNotice feelings={feelings} crisis={readingSensitivity(question, context, {ids: [], other: feelings.other}) === 'crisis'} />}
      {(reading || ai?.state.status==='loading' || mode==='care') && <AnswerHero verdict={reading?.verdict ?? (mode==='care'?'Bạn xứng đáng được lắng nghe':undefined)} answer={reading?.answer ?? (mode==='care' ? ai?.state.careAnswer ?? CARE_ANSWER : undefined)} loading={!reading && mode!=='care'} yesNo={/có.*không|có nên|liệu/iu.test(question)} thirdParty={response?.notes?.includes('third_party_limit') || /cô ấy|anh ấy|người ấy|đối phương/iu.test(question)} />}
      {opening?.limit && <aside className="care-note third-party-note">{opening.limit}</aside>}
      <AnimatePresence mode="wait"><motion.div key={reading ? 'online' : 'offline'} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: .35}}>
        {(reading || ai?.state.status === 'care') && <div className="answer-cards stage-mini-row" aria-label="Các lá đã rút">{result.map(({card, reversed}) => <div key={card.id} style={{transform: reversed ? 'rotate(180deg)' : undefined}}><MiniCard card={card} /></div>)}</div>}
        <h1 id="reading-hero-title" tabIndex={-1} className={`hero-title headline-${headlineSize(headline)}`}>
          {headline.split(/\s+/u).map((word, i) => <motion.span key={i} initial={{opacity: 0, y: quiet ? 0 : 18}} whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}} transition={{duration: quiet ? .15 : .55, delay: quiet ? 0 : Math.min(i * .055, .65)}}>{word}{' '}</motion.span>)}
        </h1>
        {opening?.opening ? <SentenceText className="hero-opening" text={opening.opening} /> : <p className="hero-opening">{question.trim() || 'Dành một chút thời gian để nhìn lại điều đang ở trong bạn.'}</p>}
      </motion.div></AnimatePresence>
      <p className="quiet-note">Chủ đề · {topic}</p>
      {(sensitive === 'professional' || response?.mode === 'reflective_only') && <aside className="care-note">Chủ đề này chỉ nhằm giúp bạn nhìn lại cảm xúc, không đưa dự đoán. Hãy trao đổi với chuyên gia sức khỏe, tài chính hoặc pháp lý phù hợp trước quyết định quan trọng.</aside>}
      {!readOnly && !savedInterpretation && ai && aiPayload && <AiReadingPanel careFirst={sensitive==='crisis'} autoInterpret={autoInterpret} info={aiInfo} ai={ai} payload={aiPayload} />}
      <div className="reading-mode" role="group" aria-label="Cách xem bài">
        <button aria-pressed={!detailed} onClick={() => setDetailed(false)}>Tóm tắt</button><button aria-pressed={detailed} onClick={() => setDetailed(true)}>Chi tiết</button>
      </div>
      <a className="reading-scroll-cue" href="#scene-first" onClick={e => {e.preventDefault(); const title = document.getElementById(`scene-title-${result[0]?.position.number}`); title?.setAttribute('tabindex', '-1'); title?.focus({preventScroll: true}); document.getElementById('reading-scenes')?.scrollIntoView({behavior: quiet ? 'auto' : 'smooth'});}}>Xem từng lá <span aria-hidden="true">↓</span></a>
    </header>
    <ReadingProgress reading={result} />
    <motion.div id="reading-scenes" key={reading ? 'interpreted-scenes' : 'book-scenes'} initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: quiet ? .15 : .5}}>
      {result.map((drawn, index) => <CardScene key={`${drawn.position.number}-${drawn.card.id}`} drawn={drawn} detailed={detailed}
        feedback={feedbackFor(drawn.position.number)} applied={reading?.per_card.find(p => p.position === drawn.position.number)} reflection={offline.reflections[index].text} />)}
    </motion.div>
    {reading?.personal && <PersonalScene personal={reading.personal} profile={aiPayload?.profile} reading={result} />}
    {reading ? <ReadingFinale reading={reading} drawn={result} /> : <>
      {offline.connections.length > 0 && <Reveal className="stage-ending-section"><h2>Điểm gặp nhau</h2>{offline.connections.map(text => <SentenceText key={text} text={text} />)}</Reveal>}
      <Reveal className="stage-ending-section stage-closing"><p className="eyebrow">Một câu hỏi mang theo</p>{offline.closing.map(text => <SentenceText className="stage-large" key={text} text={text} />)}</Reveal>
    </>}
    {detailed && <details className="scene-sources reading-statistics"><summary>Tổng quan nhanh · thống kê, không phải kết luận</summary>
      <p>{stats.total} lá: {stats.major} Ẩn Chính, {stats.minor} Ẩn Phụ; {stats.reversed} ngược, {stats.total - stats.reversed} xuôi.</p>
      {stats.minor > 0 && <p>Theo nguyên tố (chỉ tính lá Ẩn Phụ): {Object.entries(stats.elements).filter(([,n]) => n > 0).map(([element,n]) => `${element} ${n}`).join(', ')}.</p>}
    </details>}
    {onRate && <section className="reading-feedback-end"><h2>Lời đọc có đúng với bạn?</h2>
      {feedbackFor(null)}<small>Phản hồi và bài đọc chỉ lưu trên máy này.</small>
    </section>}
    <footer className="reading-actions">
      {readOnly ? <button className="button-primary" onClick={onBack}>Quay lại lịch sử</button> : <>
        <button onClick={onSave} disabled={saveStatus === 'saved'}>{saveStatus === 'saved' ? 'Đã lưu' : 'Lưu vào lịch sử'}</button>
        <button onClick={() => void copy()}>Sao chép lời đọc</button>
        <button className="button-primary" onClick={onRestart}>Đọc bài mới ↗</button>
        <small>{LOCAL_HISTORY_NOTICE}</small>
        <p role="status" aria-live="polite">{saveStatus === 'saved' ? 'Đã lưu' : saveStatus === 'error' ? 'Chưa lưu được. Bạn có thể thử lại.' : ''}</p>
      </>}
      <p role="status" aria-live="polite">{copied}</p>
    </footer>
  </section>;
}
