import {lazy, Suspense, useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import {useMotionPreference} from '../lib/useMotionPreference';
import {burstKind} from '../lib/fxMath';
import {burst} from '../lib/fxEvents';
import type {Card} from '../types';
import {CardBack} from './CardBack';
import {CardFace} from './CardFace';
const CardTilt=lazy(()=>import('../fx/CardTilt'));
export function CardFlip({card,flipped,reversed,onComplete}:{card:Card;flipped:boolean;reversed:boolean;onComplete:()=>void}) {
  const {level,reduced}=useMotionPreference(), quiet=reduced||level==='minimal';
  const [phase,setPhase]=useState<'back'|'charge'|'flip'|'settled'>('back');
  const ref=useRef<HTMLDivElement>(null), done=useRef(false), complete=useRef(onComplete);complete.current=onComplete;
  useEffect(()=>{
    if(!flipped){setPhase('back');done.current=false;return;}
    if(done.current){setPhase('settled');return;}
    setPhase(quiet?'flip':'charge');
    const timers:number[]=[];
    if(!quiet){
      timers.push(window.setTimeout(()=>setPhase('flip'),450));
      timers.push(window.setTimeout(()=>{const r=ref.current?.getBoundingClientRect();if(r)burst({x:r.left+r.width/2,y:r.top+r.height/2,kind:reversed?'cold':burstKind(card),count:level==='full'?24:10});},775));
    }
    timers.push(window.setTimeout(()=>setPhase('settled'),quiet?150:1100));
    timers.push(window.setTimeout(()=>{done.current=true;complete.current();},quiet?150:reversed?1650:1100));
    return ()=>timers.forEach(clearTimeout);
  },[flipped,quiet,reversed,card,level]);
  const face=phase==='flip'||phase==='settled';
  const art=<motion.div className="card-turn" initial={false}
    animate={quiet?{rotate:reversed&&face?180:0}:{rotate:phase==='charge'?[0,-1.4,1.4,-.8,0]:phase==='settled'&&reversed?[0,185,178,180]:0,y:phase==='settled'&&reversed?[0,12,-2,0]:0}}
    transition={{duration:quiet?0:phase==='charge'?.45:.5}}>
    {quiet?<><motion.div className="card-side" aria-hidden="true" animate={{opacity:face?0:1}} transition={{duration:.15}}><CardBack/></motion.div>
      <motion.div className="card-side" aria-hidden={!face} animate={{opacity:face?1:0}} transition={{duration:.15}}><CardFace card={card}/></motion.div></>
      :<motion.div className="card-rotator" initial={false} animate={{rotateY:face?180:0}} transition={{duration:.65,ease:[.22,.75,.25,1]}}>
        <div className="card-side card-reverse-side" aria-hidden={face}><CardBack/></div>
        <div className="card-side card-front-side" aria-hidden={!face}><CardFace card={card}/>
          {face&&<motion.span className="card-shine" aria-hidden="true" initial={{x:'-180%',opacity:0}} animate={{x:'180%',opacity:[0,.6,0]}} transition={{duration:.65,delay:.2}}/>}
        </div>
      </motion.div>}
  </motion.div>;
  return <div ref={ref} className="card-perspective" style={{'--fx-accent':reversed?'#b8a4ee':({major:'#f3d48b',gold:'#c9a45c',fire:'#ff9e65',water:'#8abfd8',air:'#e0e0ec',earth:'#9dc58e',cold:'#b8a4ee'})[burstKind(card)]} as React.CSSProperties}>
    {!quiet&&phase==='charge'&&<motion.i className="charge-ring" aria-hidden="true" initial={{scale:.85,opacity:0}} animate={{scale:1.22,opacity:[0,.8,0]}} transition={{duration:.45}}/>}
    {!quiet&&phase==='flip'&&<motion.i className="major-rays" aria-hidden="true" initial={{scale:.7,rotate:0,opacity:0}} animate={{scale:1.45,rotate:40,opacity:[0,.6,0]}} transition={{duration:.65,delay:.25}}/>}
    {quiet?art:<Suspense fallback={art}><CardTilt>{art}</CardTilt></Suspense>}
    {phase==='settled'&&<motion.span className="card-nameplate" initial={{opacity:0,scaleX:quiet?1:.92}} animate={{opacity:1,scaleX:1}} transition={{duration:quiet?.15:.45}}>{card.name_vi}<motion.i aria-hidden="true" initial={{scaleX:quiet?1:0}} animate={{scaleX:1}} transition={{duration:.45}}/></motion.span>}
  </div>;
}
