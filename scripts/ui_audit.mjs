// Executed inside Chromium; do not count unresolved gradients/images as contrast passes.
export function auditViewport(){
 const visible=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&s.visibility!=='hidden'&&Number(s.opacity)>0;};
 const parse=s=>{const n=s.match(/[\d.]+/g)?.map(Number);return n?.length>=3?[n[0],n[1],n[2],n[3]??1]:[0,0,0,0];};
 const blend=(fg,bg)=>fg.slice(0,3).map((v,i)=>v*fg[3]+bg[i]*(1-fg[3]));
 const luminance=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
 const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
 const text=[],targets=[],overlap=[];
 for(const e of document.querySelectorAll('body *')){
  if(!visible(e)||e.closest('[aria-hidden="true"],svg,canvas'))continue;
  if([...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())){
   const chain=[];for(let p=e;p;p=p.parentElement)chain.unshift(p);let bg=[7,5,15],unresolved=false,opacity=1;
   for(const p of chain){const s=getComputedStyle(p);bg=blend(parse(s.backgroundColor),bg);if(s.backgroundImage!=='none')unresolved=true;opacity*=Number(s.opacity);}
   const style=getComputedStyle(e),fg=parse(style.color);fg[3]*=opacity;const ratio=contrast(blend(fg,bg),bg);
   text.push({tag:e.tagName,class:e.className,text:e.textContent.trim().slice(0,70),size:parseFloat(style.fontSize),ratio:Number(ratio.toFixed(2)),unresolvedBackground:unresolved,pass:!unresolved&&ratio>=4.5});
  }
  if(e.matches('button,a[href],input,select,textarea,summary')&&!e.disabled){const target=e.matches('input')?(e.closest('label')??e):e,r=target.getBoundingClientRect();targets.push({label:e.getAttribute('aria-label')||e.textContent.trim().slice(0,50),width:r.width,height:r.height,pass:r.width>=44&&r.height>=44});}
 }
 for(const number of document.querySelectorAll('.scene-number'))if(visible(number)){const title=number.closest('article')?.querySelector('h2');if(title){const a=number.getBoundingClientRect(),b=title.getBoundingClientRect();overlap.push({overlap:a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top});}}
 return {horizontal:document.documentElement.scrollWidth>innerWidth,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,text,targets,overlap};
}
export async function measureFrames(page){
 await page.evaluate(()=>{window.__frameTimes=[];window.__frameStop=false;let last=0;function tick(t){if(last)window.__frameTimes.push(t-last);last=t;if(!window.__frameStop)requestAnimationFrame(tick);}requestAnimationFrame(tick);});
 for(let i=0;i<8;i++){await page.locator('.reader-scene').nth(i%2).scrollIntoViewIfNeeded();await page.waitForTimeout(750);}
 return page.evaluate(()=>{window.__frameStop=true;const times=window.__frameTimes;return {samples:times.length,averageFps:1000/(times.reduce((a,b)=>a+b,0)/times.length),minFrameMs:Math.min(...times),maxFrameMs:Math.max(...times),note:'Headless test host only; not a hardware-wide guarantee.'};});
}
