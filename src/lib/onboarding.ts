import {useSyncExternalStore} from 'react';
import {browserStorage} from './browserStorage';
let finished=false;
export function onboardingSeen(){try{return finished||browserStorage()?.getItem('tarot.welcome')==='seen';}catch{return finished;}}
export function finishOnboarding(){finished=true;try{browserStorage()?.setItem('tarot.welcome','seen');}catch{/* Session choice remains. */}window.dispatchEvent(new Event('onboarding-finished'));}
export function useOnboardingSeen(){return useSyncExternalStore(cb=>{window.addEventListener('onboarding-finished',cb);return()=>window.removeEventListener('onboarding-finished',cb);},onboardingSeen,()=>false);}
