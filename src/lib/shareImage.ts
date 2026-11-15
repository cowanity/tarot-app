import type {Card} from '../types';
export function shareText(verdict:string,answer:string,question:string,includeQuestion=false){return {verdict,sentence:answer.match(/^[\s\S]*?[.!?](?:\s|$)/u)?.[0]?.trim()||answer,...(includeQuestion&&question.trim()?{question:question.trim()}:{})};}
export function wrapText(text:string,maxWidth:number,measure:(s:string)=>number){const lines:string[]=[];let line='';for(const word of text.split(/\s+/u)){const next=line?`${line} ${word}`:word;if(measure(next)<=maxWidth)line=next;else{if(line)lines.push(line);line='';// Long unbroken words are split, never silently clipped.
for(const char of word){if(measure(line+char)>maxWidth&&line){lines.push(line);line='';}line+=char;}}}if(line)lines.push(line);return lines;}
export async function makeShareImage(card:Card,verdict:string,answer:string,question:string,includeQuestion=false){
 await document.fonts.load('400 36px "Be Vietnam Pro"');await document.fonts.ready;
 const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d');if(!ctx)throw Error('canvas');
 ctx.fillStyle='#100b20';ctx.fillRect(0,0,1080,1350);const g=ctx.createRadialGradient(540,450,20,540,600,800);g.addColorStop(0,'#34204d');g.addColorStop(1,'#100b20');ctx.fillStyle=g;ctx.fillRect(0,0,1080,1350);ctx.strokeStyle='#c9a45c';ctx.lineWidth=2;ctx.strokeRect(40,40,1000,1270);
 for(let i=0;i<60;i++){ctx.globalAlpha=.3+(i%4)*.12;ctx.fillStyle='#dcc28a';ctx.fillRect(60+(i*173)%960,70+(i*227)%1190,2,2);}ctx.globalAlpha=1;
 ctx.textAlign='center';ctx.fillStyle='#e4c582';ctx.font='400 42px "Be Vietnam Pro"';ctx.fillText('Tarot Việt',540,112);
 const image=new Image();image.src=`/cards/${card.id}.webp`;await image.decode();ctx.drawImage(image,380,160,320,547);
 const text=shareText(verdict,answer,question,includeQuestion);
 function block(value:string,y:number,height:number,size:number,color:string){if(!ctx)return;let lines:string[]=[];do{ctx.font=`400 ${size}px "Be Vietnam Pro"`;lines=wrapText(value,880,s=>ctx.measureText(s).width);if(lines.length*size*1.45<=height)break;size--;}while(size>12);ctx.fillStyle=color;lines.forEach((line,i)=>ctx.fillText(line,540,y+i*size*1.45));}
 block(text.verdict||card.name_vi,790,120,44,'#e4c582');block(text.sentence,930,text.question?170:270,34,'#ece6f7');if(text.question)block(text.question,1145,110,25,'#c4b4d8');
 ctx.font='400 22px "Be Vietnam Pro"';ctx.fillStyle='#c4b4d8';ctx.fillText('Một góc nhìn để bạn tự suy ngẫm',540,1270);
 const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('encode')),'image/png'));return new File([blob],'tarot-cua-ban.png',{type:'image/png'});
}
