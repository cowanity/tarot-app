/** Four consecutive half-second windows below 30fps; pauses/background reset the sample. */
export function createFrameHealth(){
 let start:number|null=null,frames=0,slowMs=0;
 return (now:number,hidden=false)=>{
  if(hidden){start=null;frames=0;slowMs=0;return false;}
  if(start===null){start=now;return false;}
  frames++;const elapsed=now-start;if(elapsed<500)return false;
  if(elapsed>1500){slowMs=0;}else slowMs=frames*1000/elapsed<30?slowMs+elapsed:0;
  start=now;frames=0;return slowMs>=2000;
 };
}
