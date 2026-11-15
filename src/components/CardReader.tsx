import {useEffect,useRef,useState,type ReactNode} from 'react';
import {CardScene} from './ReadingScenes';
import {CardFace} from './CardFace';
import {useMotionPreference} from '../lib/useMotionPreference';
import type {DrawnCard} from '../types';
import type {AiReading} from '../lib/aiClient';
export function CardReader({result,reading,detailed,reflections,feedbackFor}:{result:DrawnCard[];reading?:AiReading;detailed:boolean;reflections:string[];feedbackFor:(position:number)=>ReactNode}){
 const [active,setActive]=useState(0);const [inReading,setInReading]=useState(false);const root=useRef<HTMLDivElement>(null);
 const {reduced,level}=useMotionPreference();const quiet=reduced||level==='minimal';
 useEffect(()=>{
  let frame=0;
  const update=()=>{
   frame=0;const rect=root.current?.getBoundingClientRect();
   setInReading(Boolean(rect&&rect.top<innerHeight*.5&&rect.bottom>innerHeight*.5));
   let nearest=Infinity,index=0;
   root.current?.querySelectorAll<HTMLElement>('.reader-scene').forEach((scene,i)=>{
    const r=scene.getBoundingClientRect(),anchor=innerHeight*.3;
    const distance=r.top<=anchor&&r.bottom>=anchor?0:Math.min(Math.abs(r.top-anchor),Math.abs(r.bottom-anchor));
    if(distance<nearest){nearest=distance;index=i;}
   });setActive(index);
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  const observer=new ResizeObserver(schedule);if(root.current)observer.observe(root.current);
  update();addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();removeEventListener('scroll',schedule);removeEventListener('resize',schedule);};
 },[result]);
 const go=(index:number)=>{
  const number=result[index].position.number;const title=document.getElementById(`scene-title-${number}`);
  title?.setAttribute('tabindex','-1');title?.focus({preventScroll:true});
  document.getElementById(`scene-${number}`)?.scrollIntoView({behavior:quiet?'auto':'smooth',block:'start'});
 };
 return <div id="reading-scenes" ref={root} className="card-reader continuous-reader">
  {result.map((drawn,index)=><CardScene key={`${drawn.position.number}-${drawn.card.id}`} drawn={drawn} applied={reading?.per_card.find(p=>p.position===drawn.position.number)} detailed={detailed} reflection={reflections[index]} feedback={feedbackFor(drawn.position.number)} count={result.length}/>)}
  {inReading&&<nav className="reader-rail" aria-label="Cuộn đến vị trí trong bài đọc">{result.map((d,i)=><button key={d.position.number} title={`${i+1}. ${d.position.name_vi}`} aria-label={`${i+1}. ${d.position.name_vi}`} aria-current={i===active?'step':undefined} onClick={()=>go(i)}><span aria-hidden="true"><CardFace card={d.card}/></span><b>{i+1}</b></button>)}</nav>}
 </div>;
}
