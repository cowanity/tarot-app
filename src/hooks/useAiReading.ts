import {createAutoReadingGate,sessionStore,autoPayloadReady} from '../lib/autoReading';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { interpret, type AiPayload } from '../lib/aiClient';
import { aiReducer, initialAiState } from '../lib/aiState';
/** Owned by App: route changes never persist or discard the active reading's AI text. */
export function useAiReading(readingId: string) {
  const [state, dispatch] = useReducer(aiReducer, initialAiState);
  const [clock, setClock] = useState(Date.now);
  const current = useRef(state); current.current = state;
  const active = useRef<AbortController | null>(null);
  const owner = useRef(readingId);
  const [autoGate]=useState(()=>createAutoReadingGate(sessionStore()));
  const cancel = useCallback(() => {
    active.current?.abort(); active.current = null; dispatch({type: 'reset'});
  }, []);
  useEffect(() => {
    const previous = owner.current;
    if (previous !== readingId) cancel();
    owner.current = readingId;
  }, [readingId, cancel]);
  useEffect(() => () => { active.current?.abort(); active.current = null; }, []);
  useEffect(() => {
    if (state.status !== 'rate_limit') return;
    setClock(Date.now());
    const timer = setInterval(() => {
      const now = Date.now(); setClock(now);
      if (now >= state.retryUntil) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [state.status, state.retryUntil]);
  const run = useCallback(async (payload: AiPayload) => {
    if (active.current || current.current.status === 'ok' || current.current.retryUntil > Date.now()) return;
    const controller = new AbortController(); active.current = controller;
    dispatch({type: 'start'});
    const result = await interpret(payload, {signal: controller.signal});
    if (active.current !== controller) return;
    active.current = null;
    dispatch({type: 'finish', result, now: Date.now()});
  }, []);
  const autoRun=useCallback((id:string,payload:AiPayload,options:{fresh:boolean;enabled:boolean;count:number;hasReading?:boolean;readOnly?:boolean})=>{
    if(active.current||current.current.status==='ok'||current.current.retryUntil>Date.now())return;
    if(autoGate.claim({id,...options,ready:autoPayloadReady(payload,options.count)}))void run(payload);
  },[autoGate,run]);
  const abortPending=useCallback(()=>{if(active.current)cancel();},[cancel]);
  return {state, run, autoRun, abortPending, cancel, remaining: Math.max(0, Math.min(86400, Math.ceil((state.retryUntil - clock) / 1000)))};
}
export type AiReadingController = ReturnType<typeof useAiReading>;
