/** One process, in-memory rolling IP window + UTC global daily reading budget. */
export class Limits {
 private ips=new Map<string,number[]>();private day=-1;private calls=0;
 constructor(private cap=150,private now=Date.now,private hourly=20){}
 private time(){const now=this.now(),day=Math.floor(now/86_400_000);if(day!==this.day){this.day=day;this.calls=0;}return {now,retry:Math.max(1,Math.ceil(((day+1)*86_400_000-now)/1000))};}
 request(ip:string):number{
  const {now}=this.time();for(const [key,list] of this.ips)if(!list.length||list[list.length-1]<=now-3600_000)this.ips.delete(key);
  // Keep memory bounded; excess distinct IPs share a conservative bucket.
  const key=this.ips.has(ip)||this.ips.size<10000?ip:'overflow';
  const recent=(this.ips.get(key)??[]).filter(at=>now-at<3600_000);
  if(recent.length>=this.hourly)return Math.max(1,Math.ceil((recent[0]+3600_000-now)/1000));
  recent.push(now);this.ips.set(key,recent);return 0;
 }
 /** Atomic: denied requests spend neither budget. No awaits between check and charge. */
 acquire(ip:string):{reason:'rate_limited'|'daily_budget';retryAfter:number}|null{
  const {retry}=this.time();if(this.calls>=this.cap)return {reason:'daily_budget',retryAfter:retry};
  const retryAfter=this.request(ip);if(retryAfter)return {reason:'rate_limited',retryAfter};
  this.calls++;return null;
 }
 /** Called once, immediately before the first provider call in an interpretation. */
 aiCall():number{const {retry}=this.time();if(this.calls>=this.cap)return retry;this.calls++;return 0;}
}
