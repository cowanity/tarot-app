import {afterEach,expect,test,vi} from 'vitest';
import {createElement} from 'react';
import {renderToString} from 'react-dom/server';
import {createAutoReadingGate,autoPayloadReady,AUTO_READING_KEY} from './autoReading';
import {parseSettings} from './settings';
import {useAiReading} from '../hooks/useAiReading';
import {AiReadingPanel} from '../components/AiReadingPanel';
import {initialAiState} from './aiState';
import type {AiPayload} from './aiClient';
const mocks=vi.hoisted(()=>({interpret:vi.fn()}));
vi.mock('./aiClient',async original=>({...await original<typeof import('./aiClient')>(),interpret:mocks.interpret}));
afterEach(()=>{vi.unstubAllGlobals();mocks.interpret.mockReset();});
const payload:AiPayload={question:'',context:'',feelings:{ids:[]},topic:'Tổng quan',spreadId:'one-card',picks:[{position:1,cardId:'a',reversed:false}]};
const fresh={id:'reading-1',fresh:true,enabled:true,ready:true};
function storage(){const map=new Map<string,string>();return {getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v);}};}
test('new reading claims once, including repeated StrictMode-like setup and reload',()=>{
 const disk=storage(),gate=createAutoReadingGate(disk);expect(gate.claim(fresh)).toBe(true);expect(gate.claim(fresh)).toBe(false);
 expect(createAutoReadingGate(disk).claim(fresh)).toBe(false);expect(JSON.parse(disk.getItem(AUTO_READING_KEY)!)).toEqual(['reading-1']);
});
test.each([{fresh:false},{readOnly:true},{enabled:false},{ready:false},{hasReading:true}])('never claims for history/back/disabled/incomplete/existing result %o',patch=>{
 expect(createAutoReadingGate(storage()).claim({...fresh,...patch})).toBe(false);
});
test('storage failures use memory guard; corrupt session is safe',()=>{
 const gate=createAutoReadingGate({getItem:()=>{throw Error();},setItem:()=>{throw Error();}});expect(gate.claim(fresh)).toBe(true);expect(gate.claim(fresh)).toBe(false);
 expect(createAutoReadingGate({getItem:()=>'{',setItem:()=>{}}).claim(fresh)).toBe(true);
});
test('empty question ready, incomplete picks not ready; setting migration defaults on',()=>{
 expect(autoPayloadReady(payload,1)).toBe(true);expect(autoPayloadReady({...payload,picks:[]},1)).toBe(false);
 expect(autoPayloadReady({...payload,question:'x'.repeat(501)},1)).toBe(false);
 expect(parseSettings('{}').autoInterpret).toBe(true);expect(parseSettings('{"autoInterpret":false}').autoInterpret).toBe(false);
 expect(parseSettings('{"autoInterpret":"false"}').autoInterpret).toBe(true);
});
function hook(){let ai!:ReturnType<typeof useAiReading>;function Probe(){ai=useAiReading('reading-1');return null;}renderToString(createElement(Probe));return ai;}
test('hook starts once, Cancel aborts and never re-arms; new hook/F5 cannot repeat',()=>{
 vi.stubGlobal('window',{sessionStorage:storage()});mocks.interpret.mockImplementation(()=>new Promise(()=>{}));
 const ai=hook();const options={fresh:true,enabled:true,count:1};ai.autoRun('reading-1',payload,options);ai.autoRun('reading-1',payload,options);
 expect(mocks.interpret).toHaveBeenCalledTimes(1);const signal=mocks.interpret.mock.calls[0][1].signal;
 ai.cancel();expect(signal.aborted).toBe(true);ai.autoRun('reading-1',payload,options);hook().autoRun('reading-1',payload,options);
 expect(mocks.interpret).toHaveBeenCalledTimes(1);
});
test('leaving result aborts pending request; disabled/history never sends',()=>{
 vi.stubGlobal('window',{sessionStorage:storage()});mocks.interpret.mockImplementation(()=>new Promise(()=>{}));const ai=hook();
 ai.autoRun('reading-1',payload,{fresh:true,enabled:false,count:1});ai.autoRun('reading-1',payload,{fresh:false,enabled:true,count:1});expect(mocks.interpret).not.toHaveBeenCalled();
 ai.autoRun('reading-1',payload,{fresh:true,enabled:true,count:1});ai.abortPending();expect(mocks.interpret.mock.calls[0][1].signal.aborted).toBe(true);
 ai.autoRun('reading-1',payload,{fresh:true,enabled:true,count:1});expect(mocks.interpret).toHaveBeenCalledTimes(1);
});
test('automatic UI hides initial trigger; manual UI keeps it, errors retain retry countdown/offline',()=>{
 const ai={state:initialAiState,run:vi.fn(),cancel:vi.fn(),autoRun:vi.fn(),abortPending:vi.fn(),remaining:0};const info={provider:'gemini' as const,freeTier:true};
 const auto=renderToString(createElement(AiReadingPanel,{ai,info,payload,autoInterpret:true}));expect(auto).not.toContain('Luận giải theo câu hỏi của tôi');expect(auto).toContain('Đọc theo sách');
 expect(renderToString(createElement(AiReadingPanel,{ai,info,payload,autoInterpret:false}))).toContain('Luận giải theo câu hỏi của tôi');
 const failed=renderToString(createElement(AiReadingPanel,{ai:{...ai,state:{...initialAiState,status:'rate_limit'},remaining:30},info:null,payload,autoInterpret:true}));
 expect(failed).toContain('Thử lại sau 30 giây');expect(failed).toContain('disabled');expect(failed).toContain('Đọc theo sách');
});
