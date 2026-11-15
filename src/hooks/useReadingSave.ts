import type {ReadingFeedback} from '../lib/feedback';
import {storedFeelings} from '../lib/feelings';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReadingState } from './useReadingFlow';
import { useHistory } from './useHistory';

export type SaveStatus = 'idle' | 'saved' | 'error';
/** Lives with App, so route changes and StrictMode do not repeat automatic saves. */
export function useReadingSave(state: ReadingState, autoSave: boolean) {
  const { readings, save, rate } = useHistory();
  const attempted = useRef(new Set<string>());
  const [failedId, setFailedId] = useState<string | null>(null);
  const saved = readings.some((item) => item.id === state.readingId);
  const snapshot = () => ({
    v: 2 as const, feelings: storedFeelings(state.feelings), id: state.readingId, createdAt: state.createdAt,
    question: state.question, topic: state.topic, spreadId: state.spreadId,
    cards: state.reading.map(({position,card,reversed})=>({position:position.number,cardId:card.id,reversed})),
  });
  const onRate = (vote:ReadingFeedback) => {
    if(state.stage!=='result'||!state.readingId)return {ok:false};
    return rate(snapshot(),vote);
  };
  const onSave = useCallback(() => {
    if (state.stage !== 'result' || !state.readingId || saved) return;
    attempted.current.add(state.readingId);
    const result = save({
      v: 2, feelings: storedFeelings(state.feelings), id: state.readingId, createdAt: state.createdAt,
      question: state.question, topic: state.topic, spreadId: state.spreadId,
      cards: state.reading.map(({ position, card, reversed }) => ({ position: position.number, cardId: card.id, reversed })),
    });
    setFailedId(result.ok ? null : state.readingId);
  }, [state, saved, save]);
  useEffect(() => {
    if (autoSave && state.stage === 'result' && !saved && !attempted.current.has(state.readingId)) onSave();
  }, [autoSave, state.stage, state.readingId, saved, onSave]);
  const status: SaveStatus = saved ? 'saved' : failedId === state.readingId ? 'error' : 'idle';
  return { savedInterpretation: readings.find(r=>r.id===state.readingId)?.interpretation, status, onSave, onRate, feedback: readings.find(r=>r.id===state.readingId)?.feedback ?? [] };
}
