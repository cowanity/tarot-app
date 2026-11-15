import { useMotionPreference } from '../lib/useMotionPreference';
import {burst} from '../lib/fxEvents';
import type {CardRect} from '../fx/CardFlight';
import {lazy, Suspense, useCallback, useLayoutEffect, useRef, useState} from 'react';
import { motion } from 'framer-motion';
import type { DrawnCard } from '../types';
import { CardFlip } from './CardFlip';
const CardFlight=lazy(()=>import('../fx/CardFlight'));
export function OccupiedSlot({ origin, item, index, deckIndex, flipped, revealing, onFlip, onFinish, onInspect }: {
  origin?: CardRect; item: DrawnCard; index: number; deckIndex: number; flipped: boolean; revealing: boolean;
  onInspect?:()=>void; onFlip: (index: number) => void; onFinish: (index: number) => void;
}) {
  const preference=useMotionPreference(), reduced=preference.reduced||preference.level==='minimal';
  const ref=useRef<HTMLDivElement>(null);
  const [target,setTarget]=useState<CardRect|null>(null),[landed,setLanded]=useState(!origin||reduced);
  useLayoutEffect(()=>{if(reduced){setLanded(true);return;}const r=ref.current?.parentElement?.getBoundingClientRect();if(r)setTarget({left:r.left,top:r.top,width:r.width,height:r.height});},[reduced]);
  const land=useCallback(()=>{setLanded(true);const r=ref.current?.getBoundingClientRect();if(r)burst({x:r.left+r.width/2,y:r.top+r.height/2,kind:'gold',count:12});},[]);
  const complete = useCallback(() => onFinish(index), [index, onFinish]);
  return <motion.div ref={ref} className="board-card" data-deck-index={deckIndex}
    initial={reduced ? { opacity: 0 } : false} animate={{ opacity: 1, rotate: item.position.rotation ?? 0 }}
    transition={reduced ? { duration: 0.15 } : { type: 'spring', stiffness: 160, damping: 23 }}>
    {!landed&&origin&&target&&<Suspense fallback={null}><CardFlight from={origin} to={target} rotation={item.position.rotation??0} onDone={land}/></Suspense>}
    {landed&&!reduced&&<motion.i className="landing-flash" aria-hidden="true" initial={{opacity:.85,scale:.9}} animate={{opacity:0,scale:1.12}} transition={{duration:.5}}/>}
    <button style={{opacity:landed?1:0}} className="flip-button" disabled={!landed || !revealing || (flipped&&!onInspect)} onClick={() => flipped?onInspect?.():onFlip(index)}
      aria-label={flipped ? `Lá ${item.position.number}, ${item.position.name_vi}: ${item.card.name_vi}, ${item.reversed ? 'ngược' : 'xuôi'}` : `Lật lá ${item.position.number}, ${item.position.name_vi}`}>
      <CardFlip card={item.card} flipped={flipped&&landed} reversed={item.reversed} onComplete={complete} />
    </button>
  </motion.div>;
}
