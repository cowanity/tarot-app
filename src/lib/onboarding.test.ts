import {afterEach,expect,test,vi} from 'vitest';
afterEach(()=>{vi.unstubAllGlobals();vi.resetModules();});
test('welcome finishes once, notifies waiting notice, persists through reload',async()=>{
 const store=new Map<string,string>(),dispatchEvent=vi.fn();
 vi.stubGlobal('window',{localStorage:{getItem:(k:string)=>store.get(k)??null,setItem:(k:string,v:string)=>store.set(k,v)},dispatchEvent});
 const first=await import('./onboarding');expect(first.onboardingSeen()).toBe(false);first.finishOnboarding();expect(first.onboardingSeen()).toBe(true);expect(dispatchEvent).toHaveBeenCalledOnce();
 vi.resetModules();expect((await import('./onboarding')).onboardingSeen()).toBe(true);
});
test('blocked storage still dismisses welcome for this session',async()=>{
 vi.stubGlobal('window',{get localStorage(){throw Error('blocked');},dispatchEvent:vi.fn()});
 const mod=await import('./onboarding');expect(mod.onboardingSeen()).toBe(false);mod.finishOnboarding();expect(mod.onboardingSeen()).toBe(true);
});
