/** Exactly two production HTTP requests. No content or credentials in report. */
import {mkdir,writeFile} from 'node:fs/promises';
import {serve} from '@hono/node-server';
import {getConnInfo} from '@hono/node-server/conninfo';
import {config} from '../config';
import {createProvider} from '../provider';
import {createApp,type Audit} from '../app';
import {createRequestDrain,createShutdown} from '../shutdown';
import {clientIp} from '../clientIp';
import {cards,spreads} from '../../src/data';
const directory='reports/prompt-8c';await mkdir(directory,{recursive:true});
let settings:ReturnType<typeof config>|undefined;
try{settings=config();}catch{await writeFile(`${directory}/live-smoke.json`,JSON.stringify({ran:false,reason:'Không có cấu hình/khóa hợp lệ trong môi trường này',node:process.versions.node},null,2));}
if(settings){
 const logs:Audit[]=[],app=createApp({provider:createProvider(settings),providerName:settings.provider,model:settings.model,origin:settings.origin,environment:'production',serveStatic:false,cap:settings.cap,hourlyLimit:settings.hourly,ip:c=>clientIp(c.req.header('CF-Connecting-IP'),getConnInfo(c).remote.address),log:e=>logs.push(e)});
 const drain=createRequestDrain(app.fetch);
 const server=serve({fetch:drain.fetch,port:0,hostname:'127.0.0.1'});
 if(!server.listening)await new Promise<void>(resolve=>server.once('listening',resolve));
 const address=server.address();if(!address||typeof address==='string')throw Error('NO_PORT');
 const results=[];
 try{for(const id of ['celtic-cross','past-present-future']){
  const spread=spreads.find(s=>s.id===id)!;
  const body={question:'Mình nên chú ý điều gì trong công việc tuần này?',context:'',feelings:{ids:[],want:'clarity'},topic:'Sự nghiệp',spreadId:id,picks:spread.positions.map((p,i)=>({position:p.number,cardId:cards[i].id,reversed:false}))};
  const start=Date.now();const response=await fetch(`http://127.0.0.1:${address.port}/api/interpret`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const data=await response.json();
  const audit=logs.at(-1);results.push({spread:id,status:response.status,hasReading:Boolean(data.reading),calls:audit?.attempts.length??0,tokens:audit?.tokens??0,seconds:(Date.now()-start)/1000,reason:audit?.reason??null,providerError:audit?.providerError??null,attempts:audit?.attempts??[],notes:data.notes??[]});
  await writeFile(`${directory}/live-smoke.json`,JSON.stringify({ran:true,node:process.versions.node,results},null,2));
  console.log(JSON.stringify(results.at(-1)));
 }}finally{await createShutdown(server,drain)();}
}
