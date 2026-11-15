import {mkdtemp, mkdir, writeFile, rm} from 'node:fs/promises';
import {join} from 'node:path';
import {expect, test} from 'vitest';
import {createApp, type Audit} from './app';
import {FakeProvider} from './provider';
import {clientIp} from './clientIp';
import {originPolicy} from './originPolicy';
test('production serves built assets, SPA fallback, and never falls back for API', async () => {
  const root=await mkdtemp(join(process.cwd(), '.static-test-'));
  try {
    await mkdir(join(root,'assets')); await writeFile(join(root,'index.html'),'<html>SPA_TEST</html>'); await writeFile(join(root,'assets/app.js'),'const staticAsset = true;');
    const logs:Audit[]=[];
    const app=createApp({provider:new FakeProvider([]),model:'test',origin:'https://tarot.test/',environment:'production',staticRoot:root,log:e=>logs.push(e)});
    for(const path of ['/','/library','/deep/route']) {const r=await app.request(path); expect(r.status).toBe(200);expect(await r.text()).toContain('SPA_TEST');}
    expect(await (await app.request('/assets/app.js')).text()).toContain('staticAsset');
    expect((await app.request('/api/health')).status).toBe(200);
    const absent=await app.request('/assets/missing-abcd1234.js');expect(absent.status).toBe(404);expect(absent.headers.get('Cache-Control')).toBe('no-store');expect(await absent.text()).not.toContain('SPA_TEST');
    for(const path of ['/api/no-route','/api','/apiary']) {const r=await app.request(path);expect(r.status).toBe(404);expect(await r.text()).not.toContain('SPA_TEST');}
    const blocked=await app.request('/api/info?question=PRIVATE',{headers:{Origin:'https://blocked.test'}});
    expect(await blocked.json()).toEqual({error:'origin_blocked'});
    expect(logs.filter(l=>l.status===403)).toHaveLength(1);
    expect(logs.at(-1)).toMatchObject({origin:'https://blocked.test',errorCode:'ORIGIN_BLOCKED',method:'GET',path:'/api/info'});
    expect(JSON.stringify(logs)).not.toContain('PRIVATE');
    const allowed=await app.request('/api/info',{headers:{Origin:'https://tarot.test'}}); expect(allowed.status).toBe(200);
    const forced=createApp({provider:new FakeProvider([]),model:'test',origin:'http://localhost:5173',environment:'development',serveStatic:true,staticRoot:root});
    expect((await forced.request('/')).status).toBe(200);
  } finally {await rm(root,{recursive:true,force:true});}
});
test('production normalizes trailing slashes and keeps exact allowlist',()=>{
 const allowed=originPolicy(' https://tarot.test///,http://localhost:5173/ ','production');
 expect(allowed('https://tarot.test')).toBe(true);expect(allowed('http://localhost:5173/')).toBe(true);
 expect(allowed('https://tarot.test.evil')).toBe(false);
});
test('Cloudflare visitor IP drives separate Limits; malformed forwarded IP falls back',async()=>{
 expect(clientIp('2001:db8::1','127.0.0.1')).toBe('2001:db8::1');
 expect(clientIp('1.2.3.4, 5.6.7.8','127.0.0.1')).toBe('127.0.0.1');
 const app=createApp({provider:new FakeProvider([]),model:'test',origin:'https://tarot.test',environment:'production',hourlyLimit:1,ip:c=>clientIp(c.req.header('CF-Connecting-IP'),'127.0.0.1')});
 const post=(ip:string)=>app.request('/api/interpret',{method:'POST',headers:{'CF-Connecting-IP':ip,'Content-Type':'application/json'},body:JSON.stringify({question:'Hôm nay mình nên chú ý điều gì?',context:'',feelings:{ids:[]},topic:'Tổng quan',spreadId:'one-card',picks:[{position:1,cardId:'major-00-fool',reversed:false}]})});
 expect((await post('1.2.3.4')).status).toBe(502);
 expect((await post('1.2.3.4')).status).toBe(429);expect((await post('5.6.7.8')).status).toBe(502);
});

test('production audio MIME, byte ranges, HEAD and missing-file 404',async()=>{
 const root=await mkdtemp(join(process.cwd(),'.audio-test-'));
 try{
  await mkdir(join(root,'audio'));await writeFile(join(root,'index.html'),'SPA');await writeFile(join(root,'audio/ambient-1.mp3'),Buffer.from('0123456789'));
  const app=createApp({provider:new FakeProvider([]),model:'test',origin:'https://tarot.test',environment:'production',staticRoot:root});
  const full=await app.request('/audio/ambient-1.mp3');expect(full.status).toBe(200);expect(full.headers.get('content-type')).toBe('audio/mpeg');expect(full.headers.get('accept-ranges')).toBe('bytes');
  const partial=await app.request('/audio/ambient-1.mp3',{headers:{Range:'bytes=2-5'}});expect(partial.status).toBe(206);expect(partial.headers.get('content-range')).toBe('bytes 2-5/10');expect(await partial.text()).toBe('2345');
  const suffix=await app.request('/audio/ambient-1.mp3',{headers:{Range:'bytes=-2'}});expect(suffix.status).toBe(206);expect(await suffix.text()).toBe('89');
  expect((await app.request('/audio/ambient-1.mp3',{headers:{Range:'bytes=99-'}})).status).toBe(416);
  const head=await app.request('/audio/ambient-1.mp3',{method:'HEAD'});expect(head.headers.get('content-length')).toBe('10');expect(await head.text()).toBe('');
  const missing=await app.request('/audio/ambient-2.mp3');expect(missing.status).toBe(404);expect(await missing.text()).not.toContain('SPA');
 }finally{await rm(root,{recursive:true,force:true});}
});
