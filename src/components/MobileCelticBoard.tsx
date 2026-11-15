import {useRef,useState,type CSSProperties} from 'react';
import type {SpreadBoardProps} from './SpreadBoard';
import {OccupiedSlot} from './BoardCard';
import {mobileCelticLayout,mobileBadgeSize} from '../lib/mobileCelticLayout';
import {useBoardWidth} from '../hooks/useBoardWidth';
/** This component is used ONLY for Celtic Cross below 600px. */
export function MobileCelticBoard({origins,spread,reading,pickedIndices,revealed,revealing,onFlip,onFinish}:SpreadBoardProps){
 const ref=useRef<HTMLDivElement>(null),width=useBoardWidth(ref),layout=mobileCelticLayout({width}),[touched,setTouched]=useState<number|null>(null);
 const next=reading.findIndex((_,i)=>!revealed.includes(i));
 const last=touched??revealed.at(-1),position=last===undefined?null:spread.positions[last],item=last===undefined?null:reading[last];
 const flip=(i:number)=>{setTouched(i);if(!revealed.includes(i))onFlip(i);};
 return <div ref={ref} className="mobile-celtic" role="region" aria-label="Bàn Celtic Cross">
 <div className="mobile-cross-board" style={{height:layout.board.h}}>
 {width>0&&layout.cards.map((c,i)=><div key={c.id} className="mobile-cross-slot" data-next={revealing&&next===i} style={{left:c.x,top:c.y,width:c.w,height:c.h,zIndex:c.z,'--card-w':`${c.w}px`,'--card-h':`${c.h}px`} as CSSProperties}>
 {reading[i]?<OccupiedSlot origin={origins.get(pickedIndices[i])} item={reading[i]} index={i} deckIndex={pickedIndices[i]} flipped={revealed.includes(i)} revealing={revealing} onFlip={flip} onInspect={()=>setTouched(i)} onFinish={onFinish}/>:<div className="empty-slot" style={{transform:`rotate(${c.rotate}deg)`}}/>}
 <span className="mobile-cross-badge" style={{width:mobileBadgeSize(c.w),height:mobileBadgeSize(c.w),left:(c.rotate?(c.w-c.h)/2:0)+3,top:(c.rotate?(c.h-c.w)/2:0)+3}} aria-hidden="true">{c.id}</span>
 </div>)}
 {revealing&&<div className="mobile-cross-controls" style={{left:layout.controls.x,top:layout.controls.y,width:layout.controls.w,height:layout.controls.h}}><p>Đã lật {revealed.length}/10</p><button disabled={next<0} onClick={()=>flip(next)}>Lật lá tiếp theo</button></div>}
 </div><p className="mobile-cross-caption" aria-live="polite">{position?`${position.number}. ${position.name_vi}${item&&revealed.includes(last!)?` · ${item.card.name_vi}`:''}`:'Chọn từng lá để bắt đầu.'}</p>
 </div>;
}
