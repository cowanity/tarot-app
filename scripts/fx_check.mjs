import {readFile,readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
async function files(dir){const out=[];for(const entry of await readdir(dir,{withFileTypes:true})){const path=`${dir}/${entry.name}`;if(entry.isDirectory())out.push(...await files(path));else if(path.endsWith('.css'))out.push(path);}return out;}
let n=0;for(const path of await files('src')){const css=await readFile(path,'utf8');for(const match of css.matchAll(/@keyframes\s+[^\s{]+\s*\{/g)){let depth=1,i=match.index+match[0].length,start=i;for(;i<css.length&&depth;i++){if(css[i]==='{')depth++;if(css[i]==='}')depth--;}const body=css.slice(start,i);assert.ok(!/(?:^|[;{\s])(?:box-shadow|filter|backdrop-filter|width|height|top|left|background-position)\s*:/.test(body),`forbidden animation in ${path}: ${match[0]}`);n++;}}
console.log(`PASS: ${n} CSS keyframes contain no forbidden layout/filter/shadow properties. This does not measure FPS or GPU layers.`);
