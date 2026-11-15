import {expect,test} from 'vitest';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {createRequestDrain} from './shutdown';
import {createApp,type Audit} from './app';
import {FakeProvider} from './provider';
import {getConnInfo} from '@hono/node-server/conninfo';
import {clientIp} from './clientIp';
import {errorMetadata,failureReason} from './failureReason';
const payload={question:'Hôm nay mình nên chú ý điều gì?',context:'',feelings:{ids:[]},topic:'Tổng quan',spreadId:'one-card',picks:[{position:1,cardId:'major-00-fool',reversed:false}]};
const request=()=>new Request('http://localhost/api/interpret',{method:'POST',headers:{'Content-Type':'application/json','CF-Connecting-IP':'1.2.3.4'},body:JSON.stringify(payload)});
const env={incoming:{socket:{remoteAddress:'::ffff:127.0.0.1',remotePort:12345,remoteFamily:'IPv6'}}};
test('regression: missing adapter bindings fails before provider and logs native exception',async()=>{
 const logs:Audit[]=[],provider=new FakeProvider([]),app=createApp({provider,model:'fake',origin:'http://localhost',ip:c=>clientIp(c.req.header('CF-Connecting-IP'),getConnInfo(c).remote.address),log:e=>logs.push(e)});
 const broken=createRequestDrain(req=>app.fetch(req));expect((await broken.fetch(request())).status).toBe(500);
 expect(provider.calls).toHaveLength(0);expect(logs[0]).toMatchObject({reason:'internal_error',tokens:0,attempts:[],providerError:{name:'TypeError'}});expect(logs[0].providerError?.message).toContain('Cannot read properties');
 const fixed=createRequestDrain(app.fetch);expect((await fixed.fetch(request(),env)).status).toBe(502);expect(provider.calls).toHaveLength(3);expect(logs.at(-1)?.reason).toBe('guard_blocked');
});
test('network classification requires actual attempt; arbitrary error text is never logged',()=>{
 expect(failureReason(502,'GEMINI_NETWORK',false,0)).toBe('internal_error');expect(failureReason(502,'GEMINI_NETWORK',false,1)).toBe('provider_network');
 expect(failureReason(502,'PROVIDER_ERROR',false,1)).toBe('internal_error');
 expect(errorMetadata(new TypeError('PRIVATE_QUESTION_OR_KEY'))).toEqual({name:'TypeError',message:'[redacted error message]',cause:{code:null}});
 expect(errorMetadata(new Error('GEMINI_NETWORK',{cause:{code:'ECONNRESET'}})).cause.code).toBe('ECONNRESET');
});
test('runtime source excludes APIs unavailable on Node20.19',()=>{
 const files=(dir:string):string[]=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name)):/\.[cm]?[jt]sx?$/.test(e.name)&&!e.name.includes('.test.')?[join(dir,e.name)]:[]);
 const patterns=[/Promise\s*\.\s*withResolvers\s*\(/,/Array\s*\.\s*fromAsync\s*\(/,/RegExp\s*\.\s*escape\s*\(/,/\bIterator\s*[.(]/,/\.(?:union|intersection|difference|symmetricDifference|isSubsetOf|isSupersetOf|isDisjointFrom)\s*\(/];
 for(const path of [...files('server'),...files('src/lib')])for(const pattern of patterns)expect(readFileSync(path,'utf8'),path).not.toMatch(pattern);
});
