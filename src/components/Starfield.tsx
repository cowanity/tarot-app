import {useEffect, useMemo, useRef} from 'react';
import {useMotionPreference} from '../lib/useMotionPreference';
/** CSS stars leave the single canvas available for transient card particles. */
export function Starfield() {
  const ref=useRef<HTMLDivElement>(null);const {level,reduced}=useMotionPreference();
  const stars=useMemo(()=>Array.from({length:90},(_,i)=>({x:(i*37.73)%100,y:(i*61.17)%100,size:.7+(i%4)*.35})),[]);
  useEffect(()=>{
    const node=ref.current;if(!node)return;
    const mobile=matchMedia('(max-width: 767px), (pointer: coarse)');let frame=0,x=0,y=0;
    const paint=()=>{frame=0;node.style.transform=`translate3d(${x}px,${y}px,0)`;};
    const schedule=()=>{if(!document.hidden&&!frame)frame=requestAnimationFrame(paint);};
    const pointer=(e:PointerEvent)=>{if(reduced||level==='minimal'||mobile.matches)return;x=(e.clientX/innerWidth-.5)*16;y=(e.clientY/innerHeight-.5)*12;schedule();};
    const scroll=()=>{if(reduced||level==='minimal'||!mobile.matches)return;y=Math.sin(scrollY/900)*16;schedule();};
    const visible=()=>{node.dataset.paused=String(document.hidden);if(document.hidden){cancelAnimationFrame(frame);frame=0;}};
    paint();visible();addEventListener('pointermove',pointer,{passive:true});addEventListener('scroll',scroll,{passive:true});document.addEventListener('visibilitychange',visible);
    return ()=>{cancelAnimationFrame(frame);removeEventListener('pointermove',pointer);removeEventListener('scroll',scroll);document.removeEventListener('visibilitychange',visible);};
  },[level,reduced]);
  const count=reduced||level==='minimal'?18:level==='full'?90:54;
  return <div ref={ref} className="starfield css-starfield" data-level={level} aria-hidden="true"><div>{stars.slice(0,count).map((s,i)=><i key={i} style={{left:`${s.x}%`,top:`${s.y}%`,width:s.size,height:s.size}} />)}</div></div>;
}
