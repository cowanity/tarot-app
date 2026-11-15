import {auditViewport,measureFrames} from './ui_audit.mjs';
import {createRequire} from 'node:module';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
const require=createRequire(import.meta.url);
let playwright;try{playwright=require('playwright');}catch{if(!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES)throw new Error('Install Playwright: npm install --no-save playwright; npx playwright install chromium');playwright=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');}const {chromium}=playwright;
const cards=JSON.parse(await readFile('src/data/cards.json','utf8'));
const spreads=JSON.parse(await readFile('src/data/spreads.json','utf8'));
const source=JSON.parse(await readFile('reports/before-7e/raw-v1.json','utf8').catch(()=>readFile('reports/AB/raw-v1.json','utf8'))).find(r=>r.status===200&&r.payload.reading);
const longest=[...cards].sort((a,b)=>(b.summary_up+b.depth_up).length-(a.summary_up+a.depth_up).length)[0];
const phase=process.argv[2]||'after',dir=`reports/ui/${phase}`;await mkdir(dir,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox']});
const results=[];
for(const [width,height] of [[1440,900],[1920,1080],[768,1024],[390,844],[360,844]]){
 const context=await browser.newContext({viewport:{width,height}});const page=await context.newPage();
 for(const kind of ['upright','reversed','longest','summary','celtic','long-fields']){
  const spread=spreads.find(s=>s.id===(kind==='celtic'?'celtic-cross':'past-present-future'));
  const chosen=[kind==='longest'?longest:cards.find(c=>c.id==='cups-two'),...cards.filter(c=>c.id!==(kind==='longest'?longest.id:'cups-two'))].slice(0,spread.card_count);
  const reading=structuredClone(source.payload.reading);
  reading.per_card=chosen.map((c,i)=>({...reading.per_card[i%reading.per_card.length],position:i+1}));
  if(kind==='long-fields'){reading.verdict=Array(12).fill('Bạn').join(' ');reading.answer=Array.from({length:90},(_,i)=>i%2?'riêng':'Từ').join(' ');reading.per_card=reading.per_card.map(c=>({...c,title:Array(8).fill('Lựa').join(' ')}));}
  const fixture={v:2,id:'ui-fixture',createdAt:'2026-10-17T00:00:00Z',question:source.id===19?'Cô ấy có yêu tôi không?':'Bài đọc kiểm tra trình bày',topic:'Tổng quan',spreadId:spread.id,cards:chosen.map((c,i)=>({position:i+1,cardId:c.id,reversed:kind==='reversed'&&i===0&&!spread.positions[i].force_upright})),interpretation:{kind:'ok',mode:'full',reading,notes:[]}};
  await page.addInitScript(f=>localStorage.setItem('tarot.history.v2',JSON.stringify([f])),fixture);
  await page.goto((process.env.UI_BASE_URL||'http://127.0.0.1:5173')+'/#/history');
  await page.getByRole('button',{name:'Xem lại',exact:true}).click();
  await page.waitForTimeout(900);
  if(kind!=='summary'){
   if(phase==='before')await page.getByRole('button',{name:'Chi tiết',exact:true}).click();
   await page.locator('#reading-scenes').scrollIntoViewIfNeeded();
   await page.evaluate(()=>document.getElementById('reading-scenes').scrollIntoView({block:'start'}));
   await page.waitForTimeout(1100);
  }
  const checks=await page.evaluate(auditViewport);
  if(phase==='after'&&width===1440&&kind==='upright'){
   checks.fps=await measureFrames(page);
   const zoom=page.getByRole('button',{name:/Phóng to/}).first();await zoom.click();await page.keyboard.press('Escape');checks.lightboxFocusReturned=await zoom.evaluate(e=>e===document.activeElement);
   const more=page.getByRole('button',{name:/Đọc thêm/}).first();await more.click();await page.locator('.reader-scene').nth(1).scrollIntoViewIfNeeded();await page.locator('.reader-scene').first().scrollIntoViewIfNeeded();checks.detailRemembered=await page.getByRole('button',{name:/Thu gọn/}).count()===1;await page.getByRole('button',{name:/Thu gọn/}).click();
  }
  if(kind==='long-fields'){const hero=page.locator('.answer-hero');await hero.scrollIntoViewIfNeeded();checks.answerLayout=await hero.evaluate(e=>({overflow:e.scrollWidth>e.clientWidth,answerVisible:!!e.querySelector('.answer-body')?.textContent}));await page.locator('.reader-scene').first().scrollIntoViewIfNeeded();checks.titleLayout=await page.locator('.scene-title').first().evaluate(e=>({overflow:e.scrollWidth>e.clientWidth,clipped:e.scrollHeight>e.clientHeight}));}
  results.push({width,height,kind,...checks});
  if(width!==360)await page.screenshot({path:`${dir}/${width}-${kind}.jpg`,type:'jpeg',quality:82});
 }
 await context.close();
}
if(phase==='after'){
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const page=await context.newPage();
 const base=process.env.UI_BASE_URL||'http://127.0.0.1:5173';await page.goto(base);await page.getByRole('button',{name:'Giữ đầy đủ',exact:true}).waitFor();
 const initial=await page.evaluate(()=>({motion:document.documentElement.dataset.motion,effects:document.documentElement.dataset.effects}));
 await page.getByRole('button',{name:'Giảm hiệu ứng',exact:true}).click();await page.reload();
 const off=await page.evaluate(()=>JSON.parse(localStorage.getItem('tarot.settings.v1')));const promptCount=await page.getByRole('button',{name:'Giữ đầy đủ',exact:true}).count();
 results.push({test:'OS reduce first visit and remembered choice',initial,off,promptCount,pass:initial.motion==='full'&&initial.effects==='full'&&off.motion==='reduced'&&promptCount===0});
 await context.close();
}
await browser.close();await writeFile(`${dir}/checks.json`,JSON.stringify({fixture:'UI-only, existing 7d text reused across cards to stress layout; not an interpretation or AI evaluation. Gradients/images are unresolved in DOM contrast audit and never marked pass.',longest:longest.id,results},null,2));
