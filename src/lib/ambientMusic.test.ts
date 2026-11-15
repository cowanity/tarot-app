import {afterEach,describe,expect,test,vi} from 'vitest';
import {AMBIENT_KEY,createAmbientMusic,parseAmbientSettings,type AmbientMedia} from './ambientMusic';
import {browserAmbientMedia} from '../hooks/useAmbientMusic';
import {parseAudioCredits} from '../components/AmbientControls';
afterEach(()=>{vi.useRealTimers();vi.unstubAllGlobals();});
function setup(raw:string|null=null,gestureResume=false){
 vi.useFakeTimers();const storage={getItem:vi.fn(()=>raw),setItem:vi.fn()};
 const player:AmbientMedia={play:vi.fn(async()=>{}),pause:vi.fn(),volume:vi.fn(),source:vi.fn(),placeholder:vi.fn()};
 let error=()=>{};const media=vi.fn((cb:()=>void)=>{error=cb;return player;});const warn=vi.fn();
 const controller=createAmbientMusic({storage,media,gestureResume,warn});
 return {controller,storage,player,media,warn,error:()=>error()};
}
describe('useAmbientMusic state and persistence controller',()=>{
 test('defaults enabled but lazy; first gesture plays, remembered decline',()=>{
  const s=setup();expect(s.controller.getSnapshot()).toMatchObject({choice:true,status:'off',volume:.25});
  expect(s.media).not.toHaveBeenCalled();s.controller.firstAction();expect(s.controller.getSnapshot().ask).toBe(false);
  s.controller.choose(false);s.controller.firstAction();expect(s.controller.getSnapshot().ask).toBe(false);expect(s.media).toHaveBeenCalledTimes(1);
  expect(s.storage.setItem).toHaveBeenCalledWith(AMBIENT_KEY,JSON.stringify({choice:false,volume:.25,track:'ambient-1.mp3'}));
 });
 test('saved on never autoplays before a gesture',()=>{const s=setup('{"choice":true}');expect(s.media).not.toHaveBeenCalled();s.controller.firstAction();expect(s.player.play).toHaveBeenCalledTimes(1);});
 test('one media instance, synchronous play, 1.5s fade in/out',async()=>{
  const s=setup();s.controller.choose(true);expect(s.player.play).toHaveBeenCalledTimes(1);await vi.advanceTimersByTimeAsync(1500);
  expect(s.player.volume).toHaveBeenLastCalledWith(.25);s.controller.choose(false);expect(s.player.pause).not.toHaveBeenCalled();
  await vi.advanceTimersByTimeAsync(1500);expect(s.player.volume).toHaveBeenLastCalledWith(0);expect(s.player.pause).toHaveBeenCalledTimes(1);
  s.controller.choose(true);expect(s.media).toHaveBeenCalledTimes(1);
 });
 test('duck restores user volume and never raises quiet music',async()=>{
  const s=setup();s.controller.volume(.6);s.controller.choose(true);await vi.advanceTimersByTimeAsync(1500);
  s.controller.duck(true);await vi.advanceTimersByTimeAsync(1500);expect(s.player.volume).toHaveBeenLastCalledWith(.1);
  s.controller.duck(false);await vi.advanceTimersByTimeAsync(1500);expect(s.player.volume).toHaveBeenLastCalledWith(.6);
  s.controller.volume(.04);s.controller.duck(true);await vi.advanceTimersByTimeAsync(1500);expect(s.player.volume).toHaveBeenLastCalledWith(.04);
 });
 test('hidden pauses immediately; desktop resumes only previously active music',async()=>{
  const s=setup();s.controller.choose(true);await vi.advanceTimersByTimeAsync(1500);
  s.controller.visibility(true);expect(s.player.pause).toHaveBeenCalled();s.controller.visibility(false);expect(s.player.play).toHaveBeenCalledTimes(2);
  s.controller.choose(false);s.controller.visibility(true);s.controller.visibility(false);expect(s.player.play).toHaveBeenCalledTimes(2);
 });
 test('iOS visibility requires next gesture; reduced motion never automatically resumes',async()=>{
  const s=setup(null,true);s.controller.choose(true);await vi.advanceTimersByTimeAsync(1500);s.controller.visibility(true);s.controller.visibility(false);
  expect(s.player.play).toHaveBeenCalledTimes(1);expect(s.controller.getSnapshot().status).toBe('paused');s.controller.toggle();expect(s.player.play).toHaveBeenCalledTimes(2);
  const quiet=setup('{"choice":true}');quiet.controller.reduced(true);quiet.controller.firstAction();expect(quiet.media).not.toHaveBeenCalled();
  quiet.controller.choose(true);await vi.advanceTimersByTimeAsync(0);expect(quiet.player.volume).toHaveBeenLastCalledWith(.25);
  quiet.controller.visibility(true);quiet.controller.visibility(false);expect(quiet.player.play).toHaveBeenCalledTimes(1);
 });
 test('late play promises cannot restart music after off/hidden',async()=>{
  const s=setup();let done!:()=>void;vi.mocked(s.player.play).mockImplementation(()=>new Promise(resolve=>{done=resolve;}));
  s.controller.choose(true);s.controller.choose(false);done();await vi.advanceTimersByTimeAsync(1500);expect(s.controller.getSnapshot().status).toBe('off');expect(s.player.pause).toHaveBeenCalled();
 });
 test('missing track warns once, stays silent, can retry with same player',async()=>{
  const s=setup();s.controller.choose(true);s.error();expect(s.controller.getSnapshot().status).toBe('error');expect(s.player.placeholder).toHaveBeenCalled();
  expect(s.warn).toHaveBeenCalledWith(expect.stringContaining('/audio/ambient-1.mp3'));s.controller.toggle();expect(s.media).toHaveBeenCalledTimes(1);
 });
 test('blocked playback stays recoverable, no crash',async()=>{
  const s=setup();vi.mocked(s.player.play).mockRejectedValue({name:'NotAllowedError'});s.controller.choose(true);await vi.advanceTimersByTimeAsync(0);
  expect(s.controller.getSnapshot()).toMatchObject({status:'paused'});expect(s.warn).not.toHaveBeenCalled();
 });
 test('corrupt storage and quota are safe; unsubscribe and suspend work',()=>{
  expect(parseAmbientSettings('{')).toEqual({choice:true,volume:.25,track:'ambient-1.mp3'});
  expect(parseAmbientSettings('{"volume":5,"choice":"yes"}').volume).toBe(.25);
  const s=setup();s.storage.setItem.mockImplementation(()=>{throw new Error();});const notify=vi.fn();const off=s.controller.subscribe(notify);
  s.controller.choose(true);expect(s.controller.getSnapshot().saved).toBe(false);off();notify.mockClear();s.controller.suspend();expect(notify).not.toHaveBeenCalled();
 });
 test('switching tracks does not create a second player',async()=>{const s=setup();s.controller.choose(true);await vi.advanceTimersByTimeAsync(1500);s.controller.track('ambient-2.mp3');expect(s.media).toHaveBeenCalledTimes(1);expect(s.player.source).toHaveBeenLastCalledWith('ambient-2.mp3');});
});
test('browser adapter uses one looped element, no load, synchronous gesture play and gain',async()=>{
 const audio={preload:'',loop:false,src:'',volume:1,addEventListener:vi.fn(),removeEventListener:vi.fn(),play:vi.fn(async()=>{}),pause:vi.fn()};
 const AudioMock=vi.fn(function(){return audio;});const gain={gain:{value:0},connect:vi.fn()};const resume=vi.fn(async()=>{});
 class Context {destination={};createGain(){return gain;}createMediaElementSource(){return {connect:vi.fn()};}resume=resume;}
 vi.stubGlobal('Audio',AudioMock);vi.stubGlobal('window',{location:{href:'http://192.168.1.6:5173'},AudioContext:Context});
 const media=browserAmbientMedia(vi.fn());expect(audio.preload).toBe('none');expect(audio.loop).toBe(true);expect(audio.play).not.toHaveBeenCalled();
 media.source('ambient-1.mp3');const pending=media.play();expect(audio.play).toHaveBeenCalledTimes(1);expect(resume).toHaveBeenCalledTimes(1);await pending;
 media.volume(.1);expect(gain.gain.value).toBe(.1);expect(AudioMock).toHaveBeenCalledTimes(1);
});
test('credits accept text and safe links only',()=>{
 expect(parseAudioCredits(null)).toEqual([]);
 expect(parseAudioCredits([{file:'ambient-2.mp3',title:'Bản 2',url:'javascript:alert(1)'},{file:'../../bad.mp3'}])).toEqual([{file:'ambient-2.mp3',title:'Bản 2',artist:'',license:'',url:undefined}]);
});

test('useAmbientMusic hook initializes off without creating audio, exposes gesture actions',async()=>{
 const {createElement}=await import('react');const {renderToString}=await import('react-dom/server');
 const {SettingsProvider}=await import('../hooks/useSettings');const {useAmbientMusic}=await import('../hooks/useAmbientMusic');
 const storage={getItem:vi.fn(()=>null),setItem:vi.fn()};const audio=vi.fn();
 vi.stubGlobal('window',{localStorage:storage});vi.stubGlobal('navigator',{userAgent:'test',platform:'Linux',maxTouchPoints:0});vi.stubGlobal('Audio',audio);
 let music!:ReturnType<typeof useAmbientMusic>;
 function Probe(){music=useAmbientMusic();return createElement('span',null,music.state.status);}
 expect(renderToString(createElement(SettingsProvider,null,createElement(Probe)))).toContain('off');expect(audio).not.toHaveBeenCalled();
 music.firstAction();expect(music.getSnapshot().ask).toBe(false);music.choose(false);
 expect(music.getSnapshot().choice).toBe(false);expect(storage.setItem).toHaveBeenCalled();expect(audio).toHaveBeenCalledTimes(1);
});
