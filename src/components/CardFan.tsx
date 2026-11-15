import {useEffect, useRef, useState} from 'react';
import {motion, useMotionValue, useSpring, useTransform, type MotionValue} from 'framer-motion';
import {useMotionPreference} from '../lib/useMotionPreference';
import {dockLift} from '../lib/fxMath';
import {CardBack} from './CardBack';
function FanCard({index,cursor,quiet,onPick}:{index:number;cursor:MotionValue<number>;quiet:boolean;onPick:(index:number)=>void}) {
  const ref=useRef<HTMLButtonElement>(null), center=useMotionValue(0);const [focused,setFocused]=useState(false);
  const lift=useTransform([cursor,center],values=>quiet?0:focused?38:dockLift((values[0] as number)-(values[1] as number)));
  const smooth=useSpring(lift,{stiffness:260,damping:27});
  const y=useTransform([smooth,cursor],values=>{const n=values[0] as number;return quiet?0:-n+(Number.isFinite(values[1])?8*(1-n/38):0);});
  const scale=useTransform([smooth,cursor],values=>quiet?1:(Number.isFinite(values[1])?.97:1)+(values[0] as number)/300), glow=useTransform(smooth,n=>quiet?0:n/38);
  useEffect(()=>{const node=ref.current;if(!node)return;const measure=()=>center.set(node.offsetLeft+node.offsetWidth/2);measure();const observer=new ResizeObserver(measure);observer.observe(node);if(node.parentElement)observer.observe(node.parentElement);window.addEventListener('resize',measure);return()=>{observer.disconnect();window.removeEventListener('resize',measure);};},[center]);
  const offset=(index-10.5)/10.5;
  return <motion.button ref={ref} className="fan-card" data-pick-index={index} style={{left:`calc(var(--board-pad) + ${index} * var(--fan-step))`,top:`calc(var(--card-w) * ${.6+offset*offset*.45})`,y,scale}}
    initial={{opacity:0,rotate:quiet?0:0}} animate={{opacity:1,rotate:quiet?0:offset*23}} transition={{duration:quiet?.15:.45,delay:quiet?0:index*.008}}
    onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} onClick={()=>onPick(index)} aria-label={`Chọn lá úp ${index+1}`}>
    <CardBack/><motion.i className="fan-glow" aria-hidden="true" style={{opacity:glow}}/>
  </motion.button>;
}
export function CardFan({count,picked,onPick}:{count:number;picked:number[];onPick:(index:number)=>void}) {
  const {level,reduced}=useMotionPreference(),quiet=reduced||level==='minimal';
  const cursor=useMotionValue(Infinity),ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{const node=ref.current;if(!node)return;const mobile=matchMedia('(max-width: 767px)');const center=()=>{if(mobile.matches){node.style.removeProperty('--fan-step');node.style.removeProperty('--board-pad');cursor.set(node.scrollLeft+node.clientWidth/2);}else{const w=parseFloat(getComputedStyle(node).getPropertyValue('--card-w')) || node.querySelector<HTMLElement>('.fan-card')?.offsetWidth || 132;const cardWidth=node.querySelector<HTMLElement>('.fan-card')?.offsetWidth || w;const pad=cardWidth*.48+16;node.style.setProperty('--board-pad',pad+'px');node.style.setProperty('--fan-step',Math.max(1,(node.clientWidth-cardWidth-2*pad)/21)+'px');cursor.set(Infinity);}};center();const observer=new ResizeObserver(center);observer.observe(node);node.addEventListener('scroll',center,{passive:true});window.addEventListener('resize',center);return()=>{observer.disconnect();node.removeEventListener('scroll',center);window.removeEventListener('resize',center);};},[cursor]);
  return <div ref={ref} className="fan-scroll cinematic-fan" tabIndex={0} role="region" aria-label="Quạt bài úp, có thể cuộn ngang"
    onPointerMove={event=>{if(event.pointerType==='mouse'){const r=event.currentTarget.getBoundingClientRect();cursor.set(event.clientX-r.left+event.currentTarget.scrollLeft);}}}
    onPointerLeave={event=>{if(event.pointerType==='mouse')cursor.set(Infinity);}}>
    <div className="card-fan">{Array.from({length:Math.min(22,count)},(_,index)=>picked.includes(index)?null:<FanCard key={index} index={index} cursor={cursor} quiet={quiet} onPick={onPick}/>)}</div>
  </div>;
}
