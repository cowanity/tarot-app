import {useEffect, useRef} from 'react';
import {createPortal} from 'react-dom';
import {animate, motion, useMotionValue, useTransform} from 'framer-motion';
import {throwPoint} from '../lib/fxMath';
import {trail} from '../lib/fxEvents';
import {CardBack} from '../components/CardBack';
export type CardRect = {left:number;top:number;width:number;height:number};
export default function CardFlight({from,to,rotation,onDone}:{from:CardRect;to:CardRect;rotation:number;onDone:()=>void}) {
  const progress=useMotionValue(0), callback=useRef(onDone);callback.current=onDone;
  const start={x:from.left+from.width/2,y:from.top+from.height/2}, end={x:to.left+to.width/2,y:to.top+to.height/2};
  const x=useTransform(progress,t=>throwPoint(start,end,t).x-from.width/2), y=useTransform(progress,t=>throwPoint(start,end,t).y-from.height/2);
  const rotate=useTransform(progress,t=>rotation*t+Math.sin(t*Math.PI)*-18);
  const scale=useTransform(progress,t=>1+(to.width/from.width-1)*t);
  useEffect(()=>{
    trail({x:from.left+from.width/2,y:from.top+from.height/2},{x:to.left+to.width/2,y:to.top+to.height/2});
    const control=animate(progress,1,{type:'spring',stiffness:105,damping:16,mass:.7,onComplete:()=>callback.current()});
    return ()=>control.stop();
  },[from,to,progress]);
  return createPortal(<motion.div className="card-flight" aria-hidden="true" style={{x,y,rotate,scale,width:from.width,height:from.height}}><CardBack/></motion.div>,document.body);
}
