import {describe,expect,test} from 'vitest';
import {adaptParticleCap,burstKind,dockLift,effectParams,particleAllowance,throwPoint} from './fxMath';
describe('cinematic effect math',()=>{
  test('dock lift is symmetric, smooth, largest at center and zero outside radius',()=>{
    expect(dockLift(0)).toBe(38);expect(dockLift(90)).toBeCloseTo(19);
    expect(dockLift(-90)).toBe(dockLift(90));expect(dockLift(180)).toBe(0);expect(dockLift(Infinity)).toBe(0);
    expect(dockLift(30)).toBeGreaterThan(dockLift(60));
  });
  test('particle allocation never exceeds the global/mobile budget',()=>{
    for(const cap of [0,24,40,80,160,1000])for(let live=0;live<170;live++){
      const n=particleAllowance(live,500,cap);expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(Math.max(0,Math.min(cap,160)-live));
    }
    expect(particleAllowance(0,NaN)).toBe(0);expect(particleAllowance(0,-5)).toBe(0);
  });
  test('throw starts/ends exactly at the card centers and arcs above the midpoint',()=>{
    const from={x:25,y:300},to={x:500,y:500};
    expect(throwPoint(from,to,0)).toEqual(from);expect(throwPoint(from,to,1)).toEqual(to);
    expect(throwPoint(from,to,.5).x).toBe(262.5);expect(throwPoint(from,to,.5).y).toBeLessThan(400);
  });
  test('major has precedence; each minor suit gets its own element particles',()=>{
    expect(burstKind({arcana:'major',suit:'cups',element:'Nước'})).toBe('major');
    for(const [suit,element,kind] of [['wands','Lửa','fire'],['cups','Nước','water'],['swords','Khí','air'],['pentacles','Đất','earth']] as const){
      expect(burstKind({arcana:'minor',suit,element})).toBe(kind);
      expect(burstKind({arcana:'minor',suit,element:null})).toBe(kind);
    }
  });
  test('effect levels cap mobile particles, disable mobile tilt and respect accessibility',()=>{
    expect(effectParams('full',false,false)).toMatchObject({cap:160,tilt:true,chargeMs:450});
    expect(effectParams('full',false,true)).toMatchObject({cap:40,tilt:false});
    expect(effectParams('medium',false,false).cap).toBe(80);
    for(const level of ['full','medium','minimal'] as const) expect(effectParams(level,true,false)).toMatchObject({cap:0,burst:0,tilt:false,chargeMs:0});
    expect(effectParams('minimal',false,true).cap).toBe(0);
  });
  test('one second below 40 fps lowers the budget, healthy/short samples do not',()=>{
    expect(adaptParticleCap(0,1000,10)).toBe(0);expect(adaptParticleCap(160,1000,30)).toBe(104);expect(adaptParticleCap(40,1000,30)).toBe(26);
    expect(adaptParticleCap(160,1000,60)).toBe(160);expect(adaptParticleCap(160,500,10)).toBe(160);
  });
});
