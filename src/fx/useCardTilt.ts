import {useSettings} from '../hooks/useSettings';
import {useEffect, type RefObject} from 'react';
import {useMotionValue, useSpring} from 'framer-motion';
import {useMotionPreference} from '../lib/useMotionPreference';
export function useCardTilt(ref: RefObject<HTMLElement | null>) {
  const {level,reduced}=useMotionPreference();const {settings}=useSettings();
  const x=useMotionValue(0), y=useMotionValue(0), glare=useMotionValue(0);
  const rotateX=useSpring(x,{stiffness:180,damping:25}), rotateY=useSpring(y,{stiffness:180,damping:25});
  useEffect(()=>{
    const node=ref.current; if(!node) return;
    const fine=matchMedia('(pointer: fine)');
    let touching=false;const reset=()=>{touching=false;node.dataset.active='false';x.set(0);y.set(0);glare.set(0);};
    const touch=()=>{if(reduced||level==='minimal')return;touching=true;node.dataset.active='true';};
    const sensor=(e:DeviceOrientationEvent)=>{if(!touching||!settings.sensorTilt||reduced||level==='minimal')return;x.set(Math.max(-6,Math.min(6,((e.beta??0)-45)/8)));y.set(Math.max(-6,Math.min(6,(e.gamma??0)/8)));};
    const move=(e:PointerEvent)=>{
      if(reduced || level==='minimal' || (!fine.matches&&!touching)) return;
      const r=node.getBoundingClientRect();node.dataset.active='true';node.style.setProperty('--foil-x',`${(e.clientX-r.left-r.width/2)*.4}px`);node.style.setProperty('--foil-y',`${(e.clientY-r.top-r.height/2)*.4}px`);if(!fine.matches)return;
      x.set(Math.max(-6,Math.min(6,(.5-(e.clientY-r.top)/r.height)*12)));
      y.set(Math.max(-6,Math.min(6,((e.clientX-r.left)/r.width-.5)*12)));glare.set(.17);
    };
    reset();node.addEventListener('pointerdown',touch);node.addEventListener('pointerup',reset);node.addEventListener('pointercancel',reset);window.addEventListener('deviceorientation',sensor);node.addEventListener('pointermove',move);node.addEventListener('pointerleave',reset);fine.addEventListener('change',reset);
    return ()=>{reset();node.removeEventListener('pointerdown',touch);node.removeEventListener('pointerup',reset);node.removeEventListener('pointercancel',reset);window.removeEventListener('deviceorientation',sensor);node.removeEventListener('pointermove',move);node.removeEventListener('pointerleave',reset);fine.removeEventListener('change',reset);};
  },[ref,level,reduced,x,y,glare,settings.sensorTilt]);
  return {rotateX,rotateY,glare};
}
