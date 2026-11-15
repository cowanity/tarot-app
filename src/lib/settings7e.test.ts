import {expect,test,vi} from 'vitest';
import {DEFAULT_SETTINGS,parseSettings,readSettings,writeSettings,SETTINGS_KEY} from './settings';
import {resolveMotionPreference} from './useMotionPreference';
const memory=()=>{const data=new Map<string,string>();return {getItem:(k:string)=>data.get(k)??null,setItem:vi.fn((k:string,v:string)=>{data.set(k,v);})} as unknown as Storage;};
test('new defaults full even with OS reduce; prompt unacknowledged',()=>{const s=parseSettings(null);expect(s).toMatchObject({motion:'full',effects:'full',detail:'full',motionPromptSeen:false});expect(resolveMotionPreference(s,true)).toEqual({level:'full',reduced:false});});
test('v2 explicit off and acknowledgement survive reload',()=>{const storage=memory();writeSettings(storage,{...DEFAULT_SETTINGS,motion:'reduced',effects:'minimal',motionPromptSeen:true});expect(readSettings(storage)).toMatchObject({motion:'reduced',effects:'minimal',motionPromptSeen:true});});
test('legacy reset persists once, new choices survive migration',()=>{const storage=memory();storage.setItem(SETTINGS_KEY,JSON.stringify({motion:'system',effects:'medium',fontScale:'large'}));const migrated=readSettings(storage);expect(migrated).toMatchObject({schemaVersion:2,motion:'full',effects:'full',fontScale:'large'});const n=vi.mocked(storage.setItem).mock.calls.length;readSettings(storage);expect(vi.mocked(storage.setItem).mock.calls.length).toBe(n);writeSettings(storage,{...migrated,motion:'reduced'});expect(readSettings(storage).motion).toBe('reduced');});

test('legacy explicit reduced choice is preserved (old default was system)',()=>{expect(parseSettings('{"motion":"reduced"}')).toMatchObject({motion:'reduced',effects:'minimal',motionPromptSeen:true});});
import {createFrameHealth} from './frameHealth';
test('slow frames downgrade only after sustained two seconds; hidden resets',()=>{const sample=createFrameHealth();for(let t=0;t<2000;t+=50)expect(sample(t)).toBe(false);expect(sample(2000)).toBe(true);expect(sample(2050,true)).toBe(false);expect(sample(2100)).toBe(false);});
test('60fps and isolated slow frames do not downgrade',()=>{const sample=createFrameHealth();for(let t=0;t<4000;t+=1000/60)expect(sample(t)).toBe(false);});
