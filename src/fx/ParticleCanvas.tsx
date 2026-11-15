import {useEffect,useRef,useState} from 'react';
import {useMotionPreference} from '../lib/useMotionPreference';
import {useSettings} from '../hooks/useSettings';
import {FxEngine,SparkPool} from '../lib/fxEngine';
import {getFxMetrics,publishFxMetrics} from '../lib/fxMetrics';
import {subscribeFx} from '../lib/fxEvents';
const colors={major:'#f3d48b',gold:'#c9a45c',fire:'#ff9e65',water:'#8abfd8',air:'#e0e0ec',earth:'#9dc58e',cold:'#b8a4ee'};
/** No background drawing. Canvas exists only while card particles are alive.
 * The one engine also monitors sustained FPS between bursts, without a canvas. */
export default function ParticleCanvas(){
 const ref=useRef<HTMLCanvasElement>(null),pool=useRef(new SparkPool()),[active,setActive]=useState(false);
 const surface=useRef<{ctx:CanvasRenderingContext2D;width:number;height:number;visible:boolean}|null>(null);
 const {level,reduced}=useMotionPreference(),{updateSettings}=useSettings();
 useEffect(()=>{
  let metricAt=0,frames=0,jsMs=0;
  const engine=new FxEngine({request:cb=>requestAnimationFrame(cb),cancel:id=>cancelAnimationFrame(id)},(dt,now)=>{
   const begin=performance.now();pool.current.step(dt);const target=surface.current;
   if(target?.visible){const {ctx,width,height}=target;ctx.clearRect(0,0,width,height);
    for(const p of pool.current.slots)if(p.active){ctx.globalAlpha=1-p.age/p.life;ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,2,2);}ctx.globalAlpha=1;
   }
   frames++;jsMs+=performance.now()-begin;if(!metricAt)metricAt=now;
   if(now-metricAt>=1000){publishFxMetrics({fps:Math.round(frames*1000/(now-metricAt)),level:engine.level,particles:pool.current.live,jsMs:Math.round(jsMs/frames*100)/100});frames=0;jsMs=0;metricAt=now;}
   if(target&&!pool.current.live)setActive(false);
  },next=>{publishFxMetrics({level:next,downgrades:getFxMetrics().downgrades+1});updateSettings({effects:next});});
  engine.configure(level,reduced);engine.setHidden(document.hidden);
  if(reduced||level==='minimal'){pool.current.clear();setActive(false);publishFxMetrics({level,fps:0,particles:0,jsMs:0});}
  const off=subscribeFx(event=>{
   if(document.hidden||reduced||level==='minimal')return;
   if(event.type==='burst')pool.current.emit(event.x,event.y,Math.min(event.count,level==='full'?24:10),colors[event.kind]);
   else for(let i=0;i<10;i++)pool.current.emit(event.from.x+(event.to.x-event.from.x)*i/10,event.from.y+(event.to.y-event.from.y)*i/10,1,colors.gold,true);
   setActive(true);
  });
  const visibility=()=>{engine.setHidden(document.hidden);metricAt=0;frames=0;jsMs=0;if(document.hidden){pool.current.clear();setActive(false);}};
  document.addEventListener('visibilitychange',visibility);
  return()=>{engine.dispose();off();document.removeEventListener('visibilitychange',visibility);};
 },[level,reduced,updateSettings]);
 useEffect(()=>{
  const canvas=ref.current,ctx=canvas?.getContext('2d');if(!active||!canvas||!ctx)return;
  let timer=0;const resize=()=>{const width=innerWidth,height=innerHeight,dpr=Math.min(devicePixelRatio||1,level==='full'?2:1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);surface.current={ctx,width,height,visible:true};};resize();
  const observer=new IntersectionObserver(entries=>{if(surface.current)surface.current.visible=entries[0]?.isIntersecting??false;});observer.observe(canvas);
  const schedule=()=>{clearTimeout(timer);timer=window.setTimeout(resize,150);};addEventListener('resize',schedule);
  return()=>{surface.current=null;observer.disconnect();clearTimeout(timer);removeEventListener('resize',schedule);};
 },[active,level]);
 return active&&!reduced&&level!=='minimal'?<canvas ref={ref} className="magic-canvas" aria-hidden="true"/>:null;
}
