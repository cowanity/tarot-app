import {EffectsControls} from './EffectsControls';
import {useEffect,useState} from 'react';
import type {AmbientController} from '../hooks/useAmbientMusic';
import type {AmbientTrack} from '../lib/ambientMusic';
interface Credit {file:AmbientTrack;title:string;artist:string;license:string;url?:string}
export function parseAudioCredits(value:unknown):Credit[] {
  if(!Array.isArray(value))return [];
  return value.slice(0,10).flatMap(item=>{
    if(!item||typeof item!=='object'||!['ambient-1.mp3','ambient-2.mp3'].includes(item.file))return [];
    const text=(v:unknown)=>typeof v==='string'?v.slice(0,200):'';
    return [{file:item.file,title:text(item.title),artist:text(item.artist),license:text(item.license),
      url:typeof item.url==='string'&&/^https?:\/\//i.test(item.url)?item.url:undefined}];
  });
}
export function AmbientDock({music}:{music:AmbientController}) {
  const {state}=music;const active=state.status==='playing'||state.status==='starting';
  return <aside className="ambient-dock" aria-label="Âm thanh và hiệu ứng"><EffectsControls/>
    {state.ask&&<div className="ambient-invite"><span>Bật nhạc nền?</span><button onClick={()=>music.choose(true)}>Bật</button><button onClick={()=>music.choose(false)}>Không bật</button></div>}
    <span className="sr-only" role="status" aria-live="polite">{state.message}</span>
    <button type="button" className="ambient-speaker" aria-pressed={active} aria-label={active?'Tắt nhạc nền':'Bật nhạc nền'} title={state.message||(active?'Tắt nhạc nền':'Bật nhạc nền')} onClick={music.toggle}>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4Z"/>{active?<><path d="M16 8q4 4 0 8M19 5q7 7 0 14"/></>:<path d="m17 9 5 6m0-6-5 6"/>}</svg>
    </button>
  </aside>;
}
export function AmbientSettings({music}:{music:AmbientController}) {
  const [credits,setCredits]=useState<Credit[]>([]);
  useEffect(()=>{
    const controller=new AbortController();
    void fetch('/audio/credits.json',{signal:controller.signal}).then(async response=>{if(!response.ok)throw new Error();return response.json();}).then(value=>setCredits(parseAudioCredits(value))).catch(()=>{});
    return()=>controller.abort();
  },[]);
  const active=music.state.status==='playing'||music.state.status==='starting';
  return <fieldset className="settings-options"><legend>Nhạc nền</legend>
    <label className="switch-row"><input type="checkbox" checked={active} onChange={event=>music.choose(event.target.checked)}/><span>Bật nhạc nền</span></label>
    <label className="ambient-volume">Âm lượng · {Math.round(music.state.volume*100)}%<input type="range" min="0" max="1" step="0.01" value={music.state.volume} onChange={event=>music.volume(Number(event.target.value))}/></label>
    {(credits.some(c=>c.file==='ambient-2.mp3')||music.state.track==='ambient-2.mp3')&&<label>Bản nhạc<select value={music.state.track} onChange={event=>music.track(event.target.value as AmbientTrack)}><option value="ambient-1.mp3">{credits.find(c=>c.file==='ambient-1.mp3')?.title||'Bản nhạc 1'}</option><option value="ambient-2.mp3">{credits.find(c=>c.file==='ambient-2.mp3')?.title||'Bản nhạc 2'}</option></select></label>}
    <small role="status">{music.state.message||(!music.state.saved?'Đã áp dụng nhưng chưa lưu được lựa chọn trên máy.':'Chỉ tải nhạc khi bạn bật. Bạn có thể tắt bất cứ lúc nào.')}</small>
    {credits.length>0&&<details><summary>Ghi công nhạc</summary><ul>{credits.map((credit,i)=><li key={i}>{credit.title} · {credit.artist} · {credit.license} {credit.url&&<a href={credit.url} target="_blank" rel="noreferrer">Nguồn nhạc</a>}</li>)}</ul></details>}
  </fieldset>;
}
