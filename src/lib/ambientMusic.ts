export const AMBIENT_KEY='tarot.ambient.v1';
export type AmbientTrack='ambient-1.mp3'|'ambient-2.mp3';
export interface AmbientSettings {choice:boolean|null; volume:number; track:AmbientTrack}
export function parseAmbientSettings(raw:string|null):AmbientSettings {
  const defaults:AmbientSettings={choice:true,volume:.25,track:'ambient-1.mp3'};
  try {const v=JSON.parse(raw??'null');if(!v || typeof v!=='object')return defaults;
    return {choice:typeof v.choice==='boolean'?v.choice:true,volume:typeof v.volume==='number'&&Number.isFinite(v.volume)&&v.volume>=0&&v.volume<=1?v.volume:.25,track:v.track==='ambient-2.mp3'?v.track:'ambient-1.mp3'};
  }catch{return defaults;}
}
export interface AmbientMedia {play:()=>Promise<void>;pause:()=>void;volume:(value:number)=>void;source:(track:AmbientTrack)=>void;placeholder:()=>void}
export interface AmbientSnapshot extends AmbientSettings {status:'off'|'starting'|'playing'|'paused'|'error'; ask:boolean; message:string; saved:boolean}
/** One controller per App; media is created only from a direct user action. */
export function createAmbientMusic(deps:{storage:Pick<Storage,'getItem'|'setItem'>|null; media:(onError:()=>void)=>AmbientMedia; gestureResume?:boolean; warn?:(message:string)=>void}) {
  let raw:string|null=null;try{raw=deps.storage?.getItem(AMBIENT_KEY)??null;}catch{/* private mode */}
  let state:AmbientSnapshot={...parseAmbientSettings(raw),status:'off',ask:false,message:'',saved:true};
  let media:AmbientMedia|undefined, epoch=0, timer:ReturnType<typeof setTimeout>|undefined, level=0, reduced=false, duck=false, hidden=false, resumeWanted=false;
  const listeners=new Set<()=>void>();
  const publish=(patch:Partial<AmbientSnapshot>)=>{state={...state,...patch};listeners.forEach(fn=>fn());};
  const cancelFade=()=>{clearTimeout(timer);timer=undefined;};
  const persist=()=>{try{if(!deps.storage)throw new Error();deps.storage.setItem(AMBIENT_KEY,JSON.stringify({choice:state.choice,volume:state.volume,track:state.track}));publish({saved:true});}catch{publish({saved:false});}};
  const target=()=>duck?Math.min(.1,state.volume):state.volume;
  const fade=(to:number,done?:()=>void)=>{
    cancelFade();const from=level,start=Date.now();
    const tick=()=>{const t=reduced?1:Math.min(1,(Date.now()-start)/1500);level=t===1?to:from+(to-from)*t;media?.volume(level);if(t<1)timer=setTimeout(tick,30);else{timer=undefined;done?.();}};tick();
  };
  const failed=()=>{epoch++;cancelFade();media?.pause();media?.placeholder();resumeWanted=false;
    deps.warn?.(`[ambient] Không phát được /audio/${state.track}; hãy thêm file MP3 hợp lệ vào public/audio/ rồi build lại. Dùng placeholder im lặng.`);
    publish({status:'error',message:'Chưa có nhạc nền hoặc chưa tải được. Bạn vẫn có thể đọc bài.'});
  };
  const start=()=>{
    if(hidden || state.status==='starting' || state.status==='playing')return;
    const token=++epoch;cancelFade();resumeWanted=false;
    try {
      media??=deps.media(failed);media.source(state.track);level=0;media.volume(0);
      publish({status:'starting',ask:false,message:''});
      // Called synchronously from the click handler, never delayed by fetch or an effect.
      const pending=media.play();
      void pending.then(()=>{if(token!==epoch)return;publish({status:'playing'});fade(target());},error=>{
        if(token!==epoch)return;
        if(error && typeof error==='object' && 'name' in error && error.name==='NotAllowedError'){
          media?.pause();publish({status:'paused',message:'Chạm nút loa để phát nhạc.'});
        }else failed();
      });
    }catch{failed();}
  };
  const choose=(enabled:boolean)=>{
    publish({choice:enabled,ask:false,message:''});persist();
    if(enabled)start();else{epoch++;resumeWanted=false;publish({status:'off'});fade(0,()=>media?.pause());}
  };
  return {
    getSnapshot:()=>state,
    subscribe:(listener:()=>void)=>{listeners.add(listener);return()=>{listeners.delete(listener);};},
    choose,
    toggle:()=>choose(!(state.status==='playing'||state.status==='starting')),
    firstAction:()=>{if(state.choice===null)publish({ask:true});else if(state.choice && !reduced && state.status==='off')start();},
    volume:(volume:number)=>{if(!Number.isFinite(volume))return;publish({volume:Math.min(1,Math.max(0,volume))});persist();if(state.status==='playing')fade(target());},
    track:(track:AmbientTrack)=>{if(track===state.track)return;epoch++;cancelFade();media?.pause();publish({track,status:'off'});persist();if(state.choice)start();},
    duck:(value:boolean)=>{if(duck===value)return;duck=value;if(state.status==='playing')fade(target());},
    reduced:(value:boolean)=>{reduced=value;if(value){cancelFade();if(state.status==='playing'){level=target();media?.volume(level);}else if(state.status==='off')media?.pause();}},
    visibility:(value:boolean)=>{
      hidden=value;
      if(hidden){resumeWanted=state.choice===true&&(state.status==='playing'||state.status==='starting');epoch++;cancelFade();media?.pause();if(resumeWanted)publish({status:'paused'});}
      else if(resumeWanted){resumeWanted=false;if(!reduced&&!deps.gestureResume)start();else publish({status:'paused',message:'Chạm nút loa để tiếp tục nhạc.'});}
    },
    suspend:()=>{epoch++;cancelFade();media?.pause();resumeWanted=false;if(state.status==='playing'||state.status==='starting')publish({status:'paused'});},
  };
}
