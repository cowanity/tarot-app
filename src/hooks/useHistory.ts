import {renameHistory,clearHistoryNames} from '../lib/historyNames';
import type {ReadingFeedback} from '../lib/feedback';
import { useCallback, useEffect, useState } from 'react';
import { browserStorage } from '../lib/browserStorage';
import { saveFeedback, HISTORY_EVENT, HISTORY_KEY, LEGACY_HISTORY_KEY, clearAll, deleteReading, listReadings, saveReading, type SavedReading } from '../lib/history';

function announceChange(ok: boolean) {
  if (ok) window.dispatchEvent(new Event(HISTORY_EVENT));
  return { ok };
}
export function useHistory() {
  const [readings, setReadings] = useState(() => listReadings(browserStorage()));
  useEffect(() => {
    const refresh = () => setReadings(listReadings(browserStorage()));
    const onStorage = (event: StorageEvent) => {
      if (event.key === HISTORY_KEY || event.key === LEGACY_HISTORY_KEY || event.key === null) refresh();
    };
    window.addEventListener(HISTORY_EVENT, refresh);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(HISTORY_EVENT, refresh);
      window.removeEventListener('storage', onStorage);
    };
  }, []);
  const save = useCallback((reading: SavedReading) => announceChange(saveReading(browserStorage(), reading).ok), []);
  const remove = useCallback((id: string) => {const ok=deleteReading(browserStorage(),id).ok;if(ok)renameHistory(browserStorage(),id,'');return announceChange(ok);}, []);
  const clear = useCallback(() => {const ok=clearAll(browserStorage()).ok;if(ok)clearHistoryNames(browserStorage());return announceChange(ok);}, []);
  const rate = useCallback((reading:SavedReading, vote:ReadingFeedback)=>announceChange(saveFeedback(browserStorage(),reading,vote).ok),[]);
  return { readings, save, remove, clear, rate };
}
