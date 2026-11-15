export const CARD_RATIO=.585;
const finite=(n:number)=>Number.isFinite(n)?Math.max(0,n):0;
export const mobileBadgeSize=(width:number)=>Math.min(24,width*.3);
export const threeCardWidth=(width:number)=>Math.max(0,(finite(width)-24)/3);
export function mobileCelticLayout(box:{width:number;height?:number}){
 const W=finite(box.width),gap=Math.min(W<340?6:8,W/32);
 const cw=Math.min(64,Math.max(0,(W-3*gap)/(3+1/CARD_RATIO)));
 const w=Math.max(0,Math.min(84,(W-3*gap)/4,(W-3*gap-cw/CARD_RATIO)/3));
 const h=w/CARD_RATIO,extra=Math.max(0,cw/CARD_RATIO-w),left=(W-4*w-3*gap-extra)/2;
 const xs=[left,left+w+gap+extra/2,left+2*(w+gap)+extra,left+3*(w+gap)+extra];
 const xy=[[1,1],[1,1],[1,2],[0,1],[1,0],[2,1],[3,3],[3,2],[3,1],[3,0]];
 return {board:{w:W,h:4*h+3*gap},controls:{x:left,y:3*(h+gap),w:3*w+2*gap+extra,h},cards:xy.map(([col,row],i)=>{const width=i===1?cw:w,height=width/CARD_RATIO;return {id:i+1,x:xs[col]+(w-width)/2,y:row*(h+gap)+(h-height)/2,w:width,h:height,rotate:i===1?90:0,z:i===1?2:1};})};
}
export function rotatedBounds(c:{x:number;y:number;w:number;h:number;rotate:number}){const w=c.rotate?c.h:c.w,h=c.rotate?c.w:c.h;return{x:c.x+(c.w-w)/2,y:c.y+(c.h-h)/2,w,h};}
/** The production observer path is injectable for tests; height is never read. */
export function observeBoardWidth(node:HTMLElement,receive:(width:number)=>void,create:(cb:(entries:readonly {contentRect:{width:number}}[])=>void)=>Pick<ResizeObserver,'observe'|'disconnect'>=cb=>new ResizeObserver(cb)){
 receive(node.getBoundingClientRect().width);
 const observer=create(entries=>{if(entries[0])receive(entries[0].contentRect.width);});observer.observe(node);return()=>observer.disconnect();
}
