import {useEffect,useState,useSyncExternalStore} from 'react';
import {createAmbientMusic,type AmbientMedia} from '../lib/ambientMusic';
import {browserStorage} from '../lib/browserStorage';
import {useMotionPreference} from '../lib/useMotionPreference';

export function browserAmbientMedia(onError:()=>void):AmbientMedia {
  const audio=new Audio();audio.preload='none';audio.loop=true;
  audio.addEventListener('error',()=>{if(!audio.src.endsWith('/placeholder.wav'))onError();});
  // GainNode controls volume on iOS too, where audio.volume may be ignored.
  let context:AudioContext|undefined,gain:GainNode|undefined;
  try {
    const Constructor=window.AudioContext??(window as unknown as {webkitAudioContext?:typeof AudioContext}).webkitAudioContext;
    if(Constructor){context=new Constructor();gain=context.createGain();gain.gain.value=0;context.createMediaElementSource(audio).connect(gain);gain.connect(context.destination);}
  }catch{context=undefined;gain=undefined;console.warn('[ambient] Không có bộ chỉnh âm; dùng điều khiển âm lượng trình duyệt.');}
  return {
    source:track=>{const url=new URL(`/audio/${track}`,window.location.href).href;if(audio.src!==url)audio.src=url;},
    play:()=>{const resumed=context?.resume();const played=audio.play();return Promise.all([resumed,played]).then(()=>{});},
    pause:()=>audio.pause(),
    volume:value=>{if(gain)gain.gain.value=value;else audio.volume=value;},
    placeholder:()=>{audio.src='/audio/placeholder.wav';audio.preload='none';},
  };
}
export function useAmbientMusic(ducked=false) {
  const {reduced}=useMotionPreference();
  const [controller]=useState(()=>createAmbientMusic({storage:browserStorage(),media:browserAmbientMedia,
    gestureResume:/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),warn:message=>console.warn(message)}));
  const state=useSyncExternalStore(controller.subscribe,controller.getSnapshot,controller.getSnapshot);
  useEffect(()=>{controller.duck(ducked);},[controller,ducked]);
  useEffect(()=>{
    const query=window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => controller.reduced(reduced);sync();query.addEventListener('change',sync);
    return()=>query.removeEventListener('change',sync);
  },[controller,reduced]);
  useEffect(()=>{
    const visibility=()=>controller.visibility(document.hidden);
    visibility();document.addEventListener('visibilitychange',visibility);
    return()=>{document.removeEventListener('visibilitychange',visibility);controller.suspend();};
  },[controller]);
  return {state,...controller};
}
export type AmbientController=ReturnType<typeof useAmbientMusic>;
