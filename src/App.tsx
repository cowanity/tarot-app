import {Starfield} from './components/Starfield';
import {Onboarding} from './components/Onboarding';
import {DailyCard} from './components/DailyCard';
import {PwaUpdate} from './components/PwaControls';
import {useAmbientMusic} from './hooks/useAmbientMusic';
import {AmbientDock} from './components/AmbientControls';
import { useProfile } from './hooks/useProfile';
import { lazy, Suspense, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { spreads } from './data';
import { useReadingFlow } from './hooks/useReadingFlow';
import { CinematicBackground } from './components/CinematicBackground';
import {FpsOverlay} from './components/FpsOverlay';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { SpreadScreen } from './screens/SpreadScreen';
import { ShuffleScreen } from './screens/ShuffleScreen';
import { TableScreen } from './screens/TableScreen';
import { ResultScreen } from './screens/ResultScreen';
import { Navigation } from './components/Navigation';
import { useHashRoute } from './hooks/useHashRoute';
import { useMotionPreference } from './hooks/useMotionPreference';
import { useSettings } from './hooks/useSettings';
import { useAiInfo } from './hooks/useAiInfo';
import { useAiReading } from './hooks/useAiReading';
import { buildAiPayload } from './lib/aiClient';
import { useReadingSave } from './hooks/useReadingSave';
const ParticleCanvas = lazy(() => import('./fx/ParticleCanvas'));
const LibraryScreen = lazy(() => import('./screens/LibraryScreen'));
const HistoryScreen = lazy(() => import('./screens/HistoryScreen'));
const SettingsScreen = lazy(() => import('./screens/SettingsScreen'));

export default function App() {
  const { settings } = useSettings();
  const profileController = useProfile();
  const { state, dispatch, startShuffle, pick, shuffleDone, finishFlip } = useReadingFlow(settings.allowReversedDefault);
  const { status: saveStatus, onSave, onRate, feedback, savedInterpretation } = useReadingSave(state, settings.autoSave);
  const aiInfo = useAiInfo();
  const ai = useAiReading(state.readingId);
  const route = useHashRoute();
  const music=useAmbientMusic(route==='#/' && (ai.state.status==='loading' || state.stage==='shuffling' || state.revealed.length>state.finished.length));
  const reduced = useMotionPreference(), page = useRef<HTMLElement>(null);
  const screenKey = state.stage === 'picking' || state.stage === 'revealing' ? 'table' : state.stage;
  const spread = spreads.find((item) => item.id === state.spreadId)!;
  useEffect(()=>{if(route!=='#/'||state.stage!=='result')ai.abortPending();},[route,state.stage,ai.abortPending]);
  const enterResult=()=>{
    if(route!=='#/'||state.stage!=='revealing'||state.finished.length!==spread.card_count)return;
    dispatch({type:'STAGE',stage:'result'});
    ai.autoRun(state.readingId,buildAiPayload(state),{fresh:true,enabled:settings.autoInterpret,count:spread.card_count,hasReading:Boolean(savedInterpretation)});
  };
  const flip = useCallback((index: number) => dispatch({ type: 'REVEAL', index }), []);
  const focusHeading = useCallback(() => {
    const heading = page.current?.querySelector<HTMLElement>('h1');
    if (!heading) return false;
    heading.tabIndex = -1; heading.focus({ preventScroll: true }); return true;
  }, []);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (focusHeading()) return;
    const observer = new MutationObserver(() => { if (focusHeading()) observer.disconnect(); });
    if (page.current) observer.observe(page.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [route, focusHeading]);
  return <>
    <a className="skip-link" href="#main-content" onClick={(event) => {
      event.preventDefault(); page.current?.focus(); page.current?.scrollIntoView();
    }}>Bỏ qua đến nội dung</a>
    <Onboarding/><CinematicBackground /><Starfield/><FpsOverlay/><Suspense fallback={null}><ParticleCanvas/></Suspense>
    <header className="app-header stage"><span className="brand-mark" aria-hidden="true">✧</span><span>Tarot <span className="brand-small">/ Chiêm nghiệm</span></span><Navigation route={route} /></header>
    <main id="main-content" className="app-main stage" ref={page} tabIndex={-1} aria-label="Nội dung chính">
      {route === '#/' ? <AnimatePresence mode="wait" initial={false}>
        <motion.div key={screenKey} initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -8 }} transition={{ duration: reduced ? 0.15 : 0.24 }} onAnimationComplete={focusHeading}>
          {state.stage === 'welcome' && <WelcomeScreen onStart={() => {music.firstAction();dispatch({ type: 'STAGE', stage: 'question' });}} />}
          {state.stage === 'question' && <QuestionScreen context={state.context} feelings={state.feelings}
            onContext={(context) => dispatch({ type: 'CONTEXT', context })} onFeelings={(feelings) => dispatch({ type: 'FEELINGS', feelings })} question={state.question} topic={state.topic}
            onQuestion={(question) => dispatch({ type: 'QUESTION', question })} onTopic={(topic) => dispatch({ type: 'TOPIC', topic })}
            onBack={() => dispatch({ type: 'STAGE', stage: 'welcome' })} onNext={() => dispatch({ type: 'STAGE', stage: 'spread' })} />}
          {state.stage === 'spread' && <SpreadScreen profileAvailable={Boolean(profileController.profile)} useProfile={state.profileEnabled} onProfile={(enabled) => dispatch({type: 'PROFILE_ENABLED', enabled})} spreads={spreads} selected={state.spreadId} allowReversed={state.allowReversed}
            onSelect={(id) => dispatch({ type: 'SPREAD', id })} onReversed={(value) => dispatch({ type: 'REVERSED', value })}
            onBack={() => dispatch({ type: 'STAGE', stage: 'question' })} onStart={() => {music.firstAction();startShuffle(profileController.calculate());}} />}
          {state.stage === 'shuffling' && <ShuffleScreen onDone={shuffleDone} />}
          {(state.stage === 'picking' || state.stage === 'revealing') && <TableScreen state={state} spread={spread}
            onPick={(index)=>{music.firstAction();pick(index);}} onFlip={flip} onFinish={finishFlip} onResult={enterResult} />}
          {state.stage === 'result' && <ResultScreen autoInterpret={settings.autoInterpret} savedInterpretation={savedInterpretation} ai={ai} aiInfo={aiInfo} aiPayload={buildAiPayload(state)} context={state.context} feelings={state.feelings} questionIsGeneric={state.questionIsGeneric} result={state.reading} spread={spread} question={state.question} topic={state.topic}
            onSave={onSave} saveStatus={saveStatus} onRate={onRate} feedback={feedback}
            onRestart={() => dispatch({ type: 'RESET', allowReversed: settings.allowReversedDefault })} />}
        </motion.div>
      </AnimatePresence> : <Suspense key={route} fallback={<p role="status">Đang mở trang…</p>}>
        {route === '#/not-found' && <section className="screen-panel"><h1>Chưa tìm thấy trang này</h1><p>Bạn có thể tiếp tục từ thư viện hoặc trải bài mới.</p><a className="button-link" href="#/">Về trang trải bài</a> <a className="button-link" href="#/library">Mở thư viện</a></section>}
        {route === '#/today' && <DailyCard onAsk={()=>{window.location.hash='#/';dispatch({type:'STAGE',stage:'question'});}}/>}
        {route === '#/library' && <LibraryScreen />}
        {route === '#/history' && <HistoryScreen />}
        {route === '#/settings' && <SettingsScreen music={music} aiInfo={aiInfo} profileController={profileController} onClearProfile={() => { profileController.clear(); dispatch({type: 'CLEAR_PROFILE'}); ai.cancel(); }} />}
      </Suspense>}
      {route === '#/' && state.error && <p className="care-note" role="alert">{state.error}</p>}
    </main>
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{route === '#/' ? state.announcement : ''}</div>
    <AmbientDock music={music}/><PwaUpdate/>
    <footer className="app-footer stage"><p>Giải trí và chiêm nghiệm, không dự đoán chắc chắn.</p>
    </footer>
  </>;
}
