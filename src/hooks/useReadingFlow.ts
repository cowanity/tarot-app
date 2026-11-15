import {newId} from '../lib/newId';
import type { Profile } from '../lib/numerology';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { isGenericQuestion } from '../lib/isGenericQuestion';
import { questionTemplates } from '../lib/questionTemplates';
import {feelingId, sanitizeFeelings, type Feelings} from '../lib/feelings';
import { cards, spreads } from '../data';
import { shuffle } from '../lib/shuffle';
import { dealFromDeck } from '../lib/dealFromDeck';
import type { Card, DrawnCard } from '../types';

export type Stage = 'welcome' | 'question' | 'spread' | 'shuffling' | 'picking' | 'revealing' | 'result';
export interface ReadingState {
  profileEnabled: boolean;
  profile: Profile | null;
  stage: Stage;
  question: string;
  questionIsGeneric: boolean;
  context: string;
  feelings: Feelings;
  topic: string;
  spreadId: string;
  allowReversed: boolean;
  reversedCustomized: boolean;
  readingId: string;
  createdAt: string;
  deck: Card[];
  pickedIndices: number[];
  reading: DrawnCard[];
  revealed: number[];
  finished: number[];
  announcement: string;
  error: string;
}
const initial: ReadingState = {
  profileEnabled: false, profile: null, stage: 'welcome', question: '', questionIsGeneric: true, context: '', feelings: {ids: []}, topic: 'Tổng quan', spreadId: 'one-card', allowReversed: false,
  reversedCustomized: false, readingId: '', createdAt: '',
  deck: [], pickedIndices: [], reading: [], revealed: [], finished: [], announcement: '', error: '',
};
type Action =
  | {type: 'PROFILE_ENABLED'; enabled: boolean}
  | {type: 'CLEAR_PROFILE'}
  | { type: 'STAGE'; stage: Stage }
  | { type: 'QUESTION'; question: string }
  | { type: 'TOPIC'; topic: string }
  | { type: 'CONTEXT'; context: string }
  | { type: 'FEELING'; feeling: string }
  | {type: 'FEELINGS'; feelings: Feelings}
  | { type: 'SPREAD'; id: string }
  | { type: 'REVERSED'; value: boolean }
  | { type: 'DEFAULT_REVERSED'; value: boolean }
  | { type: 'SHUFFLE'; profile: Profile | null; deck: Card[]; id: string; createdAt: string }
  | { type: 'PICK'; indices: number[]; reading: DrawnCard[]; count: number }
  | { type: 'REVEAL'; index: number }
  | { type: 'FINISH'; index: number }
  | { type: 'ERROR'; message: string }
  | { type: 'RESET'; allowReversed: boolean };

function reducer(state: ReadingState, action: Action): ReadingState {
  switch (action.type) {
    case 'PROFILE_ENABLED': return state.stage === 'spread' ? {...state, profileEnabled: action.enabled} : state;
    case 'CLEAR_PROFILE': return {...state, profile: null, profileEnabled: false};
    case 'STAGE': {
      const allowed: Partial<Record<Stage, Stage[]>> = {
        welcome: ['question'], question: ['welcome', 'spread'], spread: ['question'],
        shuffling: ['picking'], revealing: ['result'],
      };
      if (!allowed[state.stage]?.includes(action.stage)) return state;
      if (action.stage === 'result' && state.finished.length !== state.reading.length) return state;
      return { ...state, stage: action.stage, error: '' };
    }
    case 'QUESTION': {
      const question = action.question.slice(0, 500);
      return { ...state, question, questionIsGeneric: isGenericQuestion(question, Object.values(questionTemplates)) };
    }
    case 'CONTEXT': return { ...state, context: action.context.slice(0, 300) };
    case 'FEELINGS': return {...state, feelings: sanitizeFeelings(action.feelings)};
    case 'FEELING': {
      const id = feelingId(action.feeling);
      if (!id) return state;
      const ids = state.feelings.ids.includes(id) ? state.feelings.ids.filter(v => v !== id)
        : state.feelings.ids.length < 3 ? [...state.feelings.ids,id] : state.feelings.ids;
      return {...state, feelings: {...state.feelings, ids}};
    }
    case 'TOPIC': return { ...state, topic: action.topic };
    case 'SPREAD': return { ...state, spreadId: action.id };
    case 'REVERSED': return { ...state, allowReversed: action.value, reversedCustomized: true };
    case 'DEFAULT_REVERSED': return !state.reversedCustomized && state.deck.length === 0
      ? { ...state, allowReversed: action.value } : state;
    case 'SHUFFLE': return state.stage !== 'spread' ? state : {
      ...state, profile: state.profileEnabled ? action.profile : null, stage: 'shuffling', deck: action.deck, pickedIndices: [], reading: [],
      readingId: action.id, createdAt: action.createdAt,
      revealed: [], finished: [], error: '', announcement: 'Đang xào bài.',
    };
    case 'PICK': {
      if (state.stage !== 'picking' || action.indices.some((i) => state.pickedIndices.includes(i))) return state;
      const reading = [...state.reading, ...action.reading];
      if (reading.length > action.count) return state;
      return { ...state, reading, pickedIndices: [...state.pickedIndices, ...action.indices],
        stage: reading.length === action.count ? 'revealing' : 'picking', error: '',
        announcement: `Đã chọn ${reading.length} trên ${action.count} lá.`,
      };
    }
    case 'REVEAL': return state.stage !== 'revealing' || !state.reading[action.index]
      || state.revealed.includes(action.index) ? state : { ...state, revealed: [...state.revealed, action.index] };
    case 'FINISH': {
      const item = state.reading[action.index];
      if (state.stage !== 'revealing' || !item || !state.revealed.includes(action.index)
        || state.finished.includes(action.index)) return state;
      return { ...state, finished: [...state.finished, action.index],
        announcement: `Lá ${item.position.number}, ${item.position.name_vi}: ${item.card.name_vi}, ${item.reversed ? 'ngược' : 'xuôi'}.`,
      };
    }
    case 'ERROR': return { ...state, error: action.message };
    case 'RESET': return { ...initial, allowReversed: action.allowReversed };
  }
}

export function useReadingFlow(allowReversedDefault = false) {
  const [state, dispatch] = useReducer(reducer, { ...initial, allowReversed: allowReversedDefault });
  useEffect(() => { dispatch({ type: 'DEFAULT_REVERSED', value: allowReversedDefault }); }, [allowReversedDefault]);
  const current = useRef(state);
  current.current = state;
  // Synchronous guards also cover double clicks before React's next render.
  const busy = useRef(false);
  const startShuffle = useCallback((profile: Profile | null = null) => {
    if (current.current.stage !== 'spread' || busy.current) return;
    busy.current = true;
    try { dispatch({ type: 'SHUFFLE', profile, deck: shuffle(cards), id: newId(), createdAt: new Date().toISOString() }); }
    catch { dispatch({ type: 'ERROR', message: 'Chưa xào được bài. Bạn hãy thử lại.' }); }
    finally { queueMicrotask(() => { busy.current = false; }); }
  }, []);
  const pick = useCallback((requested?: number) => {
    const s = current.current;
    if (s.stage !== 'picking' || busy.current) return;
    busy.current = true;
    try {
      const spread = spreads.find((item) => item.id === s.spreadId)!;
      const remaining = s.deck.map((_, index) => index).filter((index) => !s.pickedIndices.includes(index));
      const indices = requested === undefined
        ? shuffle(remaining).slice(0, spread.card_count - s.reading.length) : [requested];
      if (indices.some((index) => s.pickedIndices.includes(index))) return;
      const reading = dealFromDeck(s.spreadId, s.deck, indices, {
        allowReversed: s.allowReversed, positionOffset: s.reading.length,
      });
      dispatch({ type: 'PICK', indices, reading, count: spread.card_count });
    } catch { dispatch({ type: 'ERROR', message: 'Chưa chọn được bài. Bạn hãy thử lại.' }); }
    finally { queueMicrotask(() => { busy.current = false; }); }
  }, []);
  const shuffleDone = useCallback(() => dispatch({ type: 'STAGE', stage: 'picking' }), []);
  const finishFlip = useCallback((index: number) => dispatch({ type: 'FINISH', index }), []);
  return { state, dispatch, startShuffle, pick, shuffleDone, finishFlip };
}
