import {expect,test} from 'vitest';
import {readFileSync} from 'node:fs';
const read=(p:string)=>readFileSync(p,'utf8');
test('dock outside header; five-column nav; no downgrade toast',()=>{
 const app=read('src/App.tsx'),header=app.slice(app.indexOf('<header'),app.indexOf('</header>'));
 expect(header).not.toContain('AmbientDock');expect(app).toContain('<AmbientDock music={music}/><PwaUpdate/>');
 expect(read('src/theme.css')).toContain('repeat(5,minmax(0,1fr))');
 expect(read('src/theme.css')).toContain('body:has(dialog[open]) .ambient-dock');
 expect(read('src/components/EffectsControls.tsx')).not.toContain('metrics.downgrades');
 expect(read('src/fx/ParticleCanvas.tsx')).toContain('downgrades:getFxMetrics().downgrades+1');
});
