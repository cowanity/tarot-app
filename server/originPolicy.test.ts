import {expect, test} from 'vitest';
import {originPolicy, parseOrigins} from './originPolicy';
import {createApp} from './app';
import {FakeProvider} from './provider';
const configured='http://localhost:5173,https://tarot.example.com';
test.each(['http://192.168.1.6:5173','http://10.2.3.4:5173','http://172.16.0.1:5173','http://172.31.255.254:5173'])('LAN dev allows %s, production rejects it', origin => {
  expect(originPolicy(configured,'development')(origin)).toBe(true);
  expect(originPolicy(configured,'production')(origin)).toBe(false);
});
test.each(['http://172.15.1.2:5173','http://172.32.1.2:5173','http://8.8.8.8:5173','http://192.168.1.6:8787','http://192.168.1.6.evil.com:5173','http://192.168.1.6:5173/path','https://192.168.1.6:5173','null','http://3232235782:5173'])('dev rejects invalid/non-private origin %s', origin => expect(originPolicy(configured,'development')(origin)).toBe(false));
test('production permits each exact configured origin, no prefix or credentials', () => {
  const allows=originPolicy(configured,'production');
  for(const origin of parseOrigins(configured)) expect(allows(origin)).toBe(true);
  expect(allows('https://tarot.example.com.evil.com')).toBe(false);
  expect(allows('http://user@localhost:5173')).toBe(false);
  expect(()=>parseOrigins('http://localhost:5173,')).toThrow('INVALID_ALLOWED_ORIGIN');
  expect(originPolicy(configured,'development',5174)('http://10.1.2.3:5174')).toBe(true);
});
test.each(['development','production'])('HTTP/preflight agree with policy; one safe audit line (%s)', async environment => {
  const logs:unknown[]=[];
  const app=createApp({provider:new FakeProvider([]),model:'test',origin:configured,environment,log:e=>logs.push(e)});
  const origin='http://192.168.1.6:5173';
  const res=await app.request('/api/info?question=PRIVATE', {headers:{Origin:origin}});
  expect(res.status).toBe(environment==='production'?403:200);
  expect(res.headers.get('Access-Control-Allow-Origin')).toBe(environment==='production'?null:origin);
  expect(logs).toHaveLength(1);
  expect(logs[0]).toMatchObject({method:'GET',path:'/api/info',status:res.status,errorCode:environment==='production'?'ORIGIN_BLOCKED':null});
  expect(JSON.stringify(logs)).not.toContain('PRIVATE');
  const preflight=await app.request('/api/interpret',{method:'OPTIONS',headers:{Origin:origin,'Access-Control-Request-Method':'POST'}});
  expect(preflight.status).toBe(environment==='production'?403:204);
  expect(logs).toHaveLength(2);
});
