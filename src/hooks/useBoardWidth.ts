import {useLayoutEffect,useState,useSyncExternalStore,type RefObject} from 'react';
import {observeBoardWidth} from '../lib/mobileCelticLayout';
export function useBoardWidth(ref:RefObject<HTMLElement|null>){const [width,setWidth]=useState(0);useLayoutEffect(()=>ref.current?observeBoardWidth(ref.current,setWidth):undefined,[ref]);return width;}
const subscribe=(cb:()=>void)=>{const m=matchMedia('(max-width: 599px)');m.addEventListener('change',cb);return()=>m.removeEventListener('change',cb);};
export function useNarrowBoard(){return useSyncExternalStore(subscribe,()=>matchMedia('(max-width: 599px)').matches,()=>false);}
