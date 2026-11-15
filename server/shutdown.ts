export function createRequestDrain<Args extends unknown[]>(handler:(request:Request,...args:Args)=>Response|Promise<Response>){
 let active=0,closing=false;const idle=new Set<()=>void>();
 return {
  fetch:async(request:Request,...args:Args)=>{if(closing)return Response.json({error:'AI_BUSY'},{status:503,headers:{'Retry-After':'10','Cache-Control':'no-store'}});active++;try{return await handler(request,...args);}finally{active--;if(!active){idle.forEach(fn=>fn());idle.clear();}}},
  stop:()=>{closing=true;},
  wait:()=>active===0?Promise.resolve():new Promise<void>(resolve=>idle.add(resolve)),
  get active(){return active;}
 };
}
export interface ClosableServer{close:(cb:(error?:Error)=>void)=>unknown;closeIdleConnections?:()=>void;closeAllConnections?:()=>void}
export function createShutdown(server:ClosableServer,drain:{stop:()=>void;wait:()=>Promise<void>},graceMs=120000){
 let pending:Promise<boolean>|undefined;
 return ()=>pending??=(async()=>{
  drain.stop();let timer:ReturnType<typeof setTimeout>|undefined;
  const closed=new Promise<void>(resolve=>{server.close(()=>resolve());server.closeIdleConnections?.();});
  const success=await Promise.race([Promise.all([closed,drain.wait()]).then(()=>true),new Promise<boolean>(resolve=>{timer=setTimeout(()=>{server.closeAllConnections?.();resolve(false);},graceMs);})]);
  clearTimeout(timer);return success;
 })();
}
