import {createFrameHealth} from './frameHealth';
import type {EffectLevel} from './settings';
export type FrameClock={request:(cb:(now:number)=>void)=>number;cancel:(id:number)=>void};
/** One scheduler for all canvas work. No DOM or layout reads inside the loop. */
export class FxEngine{
 private handle=0;private last:number|null=null;private sample=createFrameHealth();private hidden=false;private visible=true;private reduced=false;private disposed=false;level:EffectLevel='full';
 constructor(private clock:FrameClock,private draw:(dt:number,now:number)=>void,private downgrade:(level:EffectLevel)=>void=()=>{}){}
 configure(level:EffectLevel,reduced=false){this.level=level;this.reduced=reduced;this.reset();this.sync();}
 setHidden(value:boolean){this.hidden=value;this.reset();this.sync();}
 setVisible(value:boolean){this.visible=value;this.reset();this.sync();}
 private reset(){this.last=null;this.sample=createFrameHealth();}
 private get active(){return !this.disposed&&!this.hidden&&this.visible&&!this.reduced&&this.level!=='minimal';}
 private sync(){if(!this.active){if(this.handle)this.clock.cancel(this.handle);this.handle=0;}else if(!this.handle)this.handle=this.clock.request(this.tick);}
 private tick=(now:number)=>{this.handle=0;if(!this.active)return;
  if(this.sample(now)){this.level=this.level==='full'?'medium':'minimal';this.sample=createFrameHealth();this.downgrade(this.level);}
  const interval=this.level==='medium'?1000/30:1000/60;
  if(this.last===null||now-this.last>=interval-.5){const dt=this.last===null?0:Math.min(.06,(now-this.last)/1000);this.last=now;if(this.active)this.draw(dt,now);}
  this.sync();
 };
 dispose(){this.disposed=true;this.sync();}
}
export function initialFxLevel(cores?:number,memory?:number):EffectLevel{return (cores!==undefined&&cores<=4)||(memory!==undefined&&memory<=4)?'medium':'full';}
export type Spark={active:boolean;x:number;y:number;vx:number;vy:number;age:number;life:number;color:string};
export class SparkPool{
 readonly slots:Spark[]=Array.from({length:40},()=>({active:false,x:0,y:0,vx:0,vy:0,age:0,life:1,color:'#e4c582'}));
 get live(){let n=0;for(const p of this.slots)if(p.active)n++;return n;}
 emit(x:number,y:number,count:number,color:string,trail=false){let n=0;for(const p of this.slots){if(p.active)continue;if(n>=count)break;const a=n*2.39996,speed=trail?15:40+(n%5)*18;p.active=true;p.x=x;p.y=y;p.vx=Math.cos(a)*speed;p.vy=Math.sin(a)*speed;p.age=0;p.life=trail?.5:.8;p.color=color;n++;}}
 step(dt:number){for(const p of this.slots)if(p.active){p.age+=dt;p.active=p.age<p.life;p.x+=p.vx*dt;p.y+=p.vy*dt;}}
 clear(){for(const p of this.slots)p.active=false;}
}
