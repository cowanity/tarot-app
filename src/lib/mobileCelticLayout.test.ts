import {expect,test,vi} from 'vitest';
import {mobileCelticLayout,mobileBadgeSize,observeBoardWidth,rotatedBounds,threeCardWidth} from './mobileCelticLayout';
for(const width of [320,340,360,390,430,440,599])for(const height of [0,120,200])test(`actual observer path ${width}x${height}`,()=>{
 let callback!:(entries:{contentRect:{width:number;height:number}}[])=>void;
 const disconnect=vi.fn(),node={getBoundingClientRect:()=>({width:0,height:0})} as HTMLElement;
 const received:ReturnType<typeof mobileCelticLayout>[]=[];
 const stop=observeBoardWidth(node,w=>received.push(mobileCelticLayout({width:w})),cb=>{callback=cb;return{observe:vi.fn(),disconnect};});
 callback([{contentRect:{width,height}}]);const l=received.at(-1)!;
 expect(l).toEqual(mobileCelticLayout({width,height:0}));
 for(const c of l.cards){expect(c.w).toBeGreaterThanOrEqual(64);expect(mobileBadgeSize(c.w)).toBeLessThanOrEqual(Math.min(24,c.w*.3));const a=rotatedBounds(c);
 expect(a.x).toBeGreaterThanOrEqual(-.001);expect(a.y).toBeGreaterThanOrEqual(-.001);expect(a.x+a.w).toBeLessThanOrEqual(width+.001);expect(a.y+a.h).toBeLessThanOrEqual(l.board.h+.001);
 for(const d of l.cards.filter(d=>d.id>c.id)){const b=rotatedBounds(d),overlap=a.x<b.x+b.w-.001&&a.x+a.w>b.x+.001&&a.y<b.y+b.h-.001&&a.y+a.h>b.y+.001;expect(overlap).toBe(c.id===1&&d.id===2);}
 }
 expect(l.cards[1].z).toBeGreaterThan(l.cards[0].z);expect(l.cards[9].y).toBeLessThan(l.cards[6].y);stop();expect(disconnect).toHaveBeenCalledOnce();
});
test('three-card mobile row fits actual column, tiny measurements stay finite',()=>{
 for(const width of [280,302,320,344,360,390,440])expect(threeCardWidth(width)*3+24).toBeCloseTo(width);
 for(const width of [0,1,NaN,-1,Infinity])for(const c of mobileCelticLayout({width}).cards)expect(Object.values(c).every(Number.isFinite)).toBe(true);
});
