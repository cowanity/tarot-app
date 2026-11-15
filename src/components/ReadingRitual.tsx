import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {motion, useInView} from 'framer-motion';
import {CardBack} from './CardBack';
import {useMotionPreference} from '../lib/useMotionPreference';
import {burst} from '../lib/fxEvents';
import {ritualMessage} from '../lib/readingStage';
export function ReadingRitual({onCancel}: {onCancel: () => void}) {
  const overlay = useRef<HTMLDivElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const ref = useRef<HTMLDivElement>(null); const visible = useInView(ref);
  const {level, reduced} = useMotionPreference(); const quiet = reduced || level === 'minimal';
  const [seconds, setSeconds] = useState(0); const [hidden, setHidden] = useState(() => document.hidden);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden'; document.documentElement.style.overflow = 'hidden';
    const siblings = Array.from(document.body.children).filter((node): node is HTMLElement => node instanceof HTMLElement && node !== overlay.current);
    const oldInert = siblings.map(node => node.inert);
    siblings.forEach(node => {node.inert = true;});
    cancelButton.current?.focus();
    return () => {
      document.body.style.overflow = bodyOverflow; document.documentElement.style.overflow = htmlOverflow;
      siblings.forEach((node, i) => {node.inert = oldInert[i];});
      if (previous?.isConnected && !(previous instanceof HTMLButtonElement && previous.disabled)) previous.focus({preventScroll: true});
    };
  }, []);
  useEffect(() => {
    const started = Date.now(); const clock = setInterval(() => setSeconds(Math.floor((Date.now() - started) / 1000)), 1000);
    const change = () => setHidden(document.hidden); document.addEventListener('visibilitychange', change);
    return () => {clearInterval(clock); document.removeEventListener('visibilitychange', change);};
  }, []);
  useEffect(() => {
    if (quiet || hidden || !visible) return;
    const fire = () => { const r = ref.current?.getBoundingClientRect(); if (r) burst({x: r.left + r.width / 2, y: r.top + 120, kind: 'gold', count: level === 'full' ? 8 : 4}); };
    fire(); const timer = setInterval(fire, 3200); return () => clearInterval(timer);
  }, [quiet, hidden, visible, level]);
  const moving = !quiet && !hidden && visible;
  return createPortal(<motion.div ref={overlay} className="reading-ritual-overlay" role="dialog" aria-modal="true" aria-label="Đang soạn luận giải"
    initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: quiet ? .15 : .65}}
    onKeyDown={event => {
      if (event.key === 'Escape') {event.preventDefault(); onCancel();}
      if (event.key === 'Tab') {event.preventDefault(); cancelButton.current?.focus();}
    }}>
    <motion.div ref={ref} className="reading-ritual" exit={{y: quiet ? 0 : -600, opacity: 0}} transition={{duration: quiet ? .15 : .6}}>
      <div className="ritual-orbit" aria-hidden="true"><i className="ritual-light" />{[0,1,2].map(i => {
        const angles = Array.from({length: 25}, (_, frame) => (i * 120 + frame * 15) * Math.PI / 180);
        return <motion.div key={i} className="ritual-card"
          animate={moving ? {x: angles.map(a => Math.cos(a)*100), y: angles.map(a => Math.sin(a)*65), rotate: angles.map(a => Math.sin(a)*18)} : {x: (i-1)*80, y: 0, rotate: (i-1)*10}}
          transition={moving ? {duration: 8, repeat: Infinity, ease: 'linear'} : {duration: .15}}><CardBack /></motion.div>;
      })}</div>
      <p role="status" aria-live="polite" aria-atomic="true">{ritualMessage(seconds)}</p><button ref={cancelButton} onClick={onCancel}>Hủy</button>
    </motion.div>
  </motion.div>, document.body);
}
