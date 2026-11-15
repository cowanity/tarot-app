import {aiErrorMessage} from '../lib/aiErrorMessage';
import {copyText} from '../lib/copyText';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ReadingRitual } from './ReadingRitual';
import type { AiInfo, AiPayload, AiReading } from '../lib/aiClient';
import { aiReadingText } from '../lib/aiPresentation';
import type { AiReadingController } from '../hooks/useAiReading';
export function AiReadingPanel({info, ai, payload, autoInterpret=false, careFirst=false}: {careFirst?:boolean; autoInterpret?:boolean; info: AiInfo | null; ai: AiReadingController; payload: AiPayload}) {
  const {state} = ai;
  const ask = () => {
    if (state.status === 'loading' || ai.remaining > 0) return;
    void ai.run(payload);
  };
  const failed = ['unavailable', 'network', 'blocked', 'busy', 'rate_limit'].includes(state.status);
  return <section className="ai-section" aria-label="Luận giải theo câu hỏi">
    <div role="status" aria-live="polite" aria-atomic="true" className="ai-status">
      {failed && <p>{aiErrorMessage(state.errorReason??state.status)}</p>}
      {state.status === 'ok' && <span className="sr-only">Luận giải đã sẵn sàng.</span>}
      {state.status === 'care' && <span className="sr-only">Bạn không cần đi qua điều này một mình. Lời nhắn hỗ trợ ở đầu trang.</span>}
    </div>
    {(failed || (!autoInterpret && info && state.status !== 'care')) && state.status !== 'ok' && state.status !== 'loading' && <div className="ai-invitation">
      <button className="button-primary ai-trigger" onClick={ask} disabled={ai.remaining > 0 || state.status === 'care'}>
        {state.status === 'rate_limit' && ai.remaining > 0 ? `Thử lại sau ${ai.remaining} giây` : failed ? 'Thử lại' : 'Luận giải theo câu hỏi của tôi'}
      </button>
    </div>}
    <AnimatePresence>{state.status === 'loading' && !careFirst && <ReadingRitual key="ritual" onCancel={ai.cancel} />}</AnimatePresence>
    {(failed || (autoInterpret && state.status!=='loading' && state.status!=='ok')) && <button className="ai-offline" onClick={() => {ai.cancel(); const first = document.getElementById('reading-scenes'); first?.scrollIntoView({block: 'start'}); }}>Đọc theo sách (không cần mạng)</button>}
  </section>;
}

/** Render after the individual cards so visual and copy order stay the same. */
export function AiReadingEnding({reading}: {reading: AiReading}) {
  const [copied, setCopied] = useState('');
  return <section className="ai-reading" aria-label="Các lá nối lại">
    {reading.personal && <section><h2>{reading.personal.title}</h2><p className="ai-prose">{reading.personal.text}</p></section>}
    <p className="ai-prose">{reading.weave}</p>
    {reading.unsaid && <p className="ai-prose">{reading.unsaid}</p>}
    <h2>{(reading.paths ?? []).length ? 'Chiều hướng có thể' : 'Chuẩn bị điều cần hỏi'}</h2><p className="ai-prose">{reading.outlook}</p>
    {(reading.paths ?? []).length > 0 && (reading.paths ?? []).map((path, index) => <div className="ai-subsection" key={index}><h3>{path.label}</h3><p className="ai-prose">{path.body}</p></div>)}
    <p className="ai-prose">{reading.closing}</p>
    <p className="ai-prose">{reading.question}</p>
    {reading.experiment && <p className="ai-prose">{reading.experiment}</p>}
    <button onClick={() => {
      void (async () => {
        setCopied(await copyText(aiReadingText(reading)) ? 'Đã sao chép lời đọc.' : 'Chưa sao chép được, bạn hãy chọn văn bản và sao chép tay.');
      })();
    }}>Sao chép lời đọc</button><p role="status" aria-live="polite" className="quiet-note">{copied}</p>
  </section>;
}
