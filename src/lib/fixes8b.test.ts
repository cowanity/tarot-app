import {expect,test} from 'vitest';
import {readFileSync} from 'node:fs';
const source=(p:string)=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('daily has its own route; welcome is native dialog, motion notice waits',()=>{
 expect(source('screens/WelcomeScreen.tsx')).not.toContain('DailyCard');
 expect(source('hooks/useHashRoute.ts')).toContain("'#/today'");
 expect(source('components/Onboarding.tsx')).toContain('.showModal()');
 expect(source('components/Onboarding.tsx')).toContain('onCancel={finishOnboarding}');
 expect(source('components/EffectsControls.tsx')).toContain('onboardingDone&&systemReduced');
});
test('8c isolates mobile cross; restores legacy board without confirmation',()=>{
 expect(source('components/SpreadBoard.tsx')).toContain("narrow&&props.spread.id==='celtic-cross'");
 expect(source('components/SpreadBoard.tsx')).toContain('position-label');
 expect(source('components/BoardCard.tsx')).toContain('flipped?onInspect?.():onFlip(index)');
 expect(source('components/SpreadBoard.tsx')).not.toContain('BottomSheet');
});
test('background is CSS stars; canvas only emits transient particles',()=>{
 expect(source('App.tsx')).toContain('<Starfield/>');
 const fx=source('fx/ParticleCanvas.tsx');expect(fx).not.toContain('lineTo(');expect(fx).not.toContain('meteor');expect(fx).toContain('active&&!reduced');
});
test('FPS overlay is explicit URL only',()=>{
 expect(source('screens/SettingsScreen.tsx')).not.toContain('showFps');
 expect(source('components/FpsOverlay.tsx')).toContain(".get('fps')!=='1'");
});
