import {useOnboardingSeen} from '../lib/onboarding';
import {useEffect,useState} from 'react';
import {useSettings} from '../hooks/useSettings';
import {useMotionPreference} from '../lib/useMotionPreference';

export function EffectsControls(){
 const {settings,updateSettings}=useSettings();const {reduced,level}=useMotionPreference();
 const [systemReduced,setSystemReduced]=useState(false);
 useEffect(()=>{const query=matchMedia('(prefers-reduced-motion: reduce)');const sync=()=>setSystemReduced(query.matches);sync();query.addEventListener('change',sync);return()=>query.removeEventListener('change',sync);},[]);
 const onboardingDone=useOnboardingSeen();
 const quiet=reduced||level==='minimal';
 return <>
  {onboardingDone&&systemReduced&&!settings.motionPromptSeen&&<div className="effects-message" role="status"><p>Máy bạn đang bật giảm chuyển động. Giữ hiệu ứng đầy đủ?</p><div><button onClick={()=>updateSettings({motion:'full',effects:'full'})}>Giữ đầy đủ</button><button onClick={()=>updateSettings({motion:'reduced',effects:'minimal'})}>Giảm hiệu ứng</button></div></div>}
  <button className="effects-toggle" aria-label={quiet?'Bật hiệu ứng':'Tắt hiệu ứng'} aria-pressed={!quiet} title={quiet?'Bật hiệu ứng':'Tắt hiệu ứng'} onClick={()=>updateSettings({motion:quiet?'full':'reduced',effects:quiet?'full':'minimal'})}><span aria-hidden="true">✧</span></button>
 </>;
}
