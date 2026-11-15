import { useEffect, useState } from 'react';
import { getAiInfo, type AiInfo } from '../lib/aiClient';
export function useAiInfo() {
  const [info, setInfo] = useState<AiInfo | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    void getAiInfo({signal: controller.signal}).then((value) => { if (!controller.signal.aborted) setInfo(value); });
    return () => controller.abort();
  }, []);
  return info;
}
