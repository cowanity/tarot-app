import {quickMeaning} from '../lib/cardQuick';
import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {CardFace} from './CardFace';
import {getCardText} from '../lib/getCardText';
import {formatRefs} from '../lib/formatRefs';
import {titleCase} from '../lib/titleCase';
import type {Card} from '../types';
import '../screens/cardLibrary.css';
function Prose({text}:{text:string}){return <>{text.split(/\r?\n\s*\r?\n/).filter(p=>p.trim()).map((p,i)=><p key={i}>{p.replace(/\s*\r?\n\s*/g,' ')}</p>)}</>;}
export function CardKnowledge({card}:{card:Card}){
 const [reversed,setReversed]=useState(false),[allKeywords,setAllKeywords]=useState(false);const summary=getCardText(card,reversed);const depth=getCardText(card,summary.rev_missing?false:reversed,'depth');
 const refs=formatRefs([...summary.refs,...depth.refs]);
 return <article className="card-knowledge">
  <div className="knowledge-art"><CardFace card={card}/><p>{card.arcana==='major'?'Ẩn Chính':({wands:'Bộ Gậy',cups:'Bộ Cốc',swords:'Bộ Kiếm',pentacles:'Bộ Tiền'} as const)[card.suit!]}</p></div>
  <div className="knowledge-copy"><p className="eyebrow">Tìm hiểu lá bài</p><h2>{card.name_vi}</h2><p className="knowledge-en" lang="en">{titleCase(card.name_en)}</p>
   <ul className="library-keywords">{(allKeywords?card.keywords:card.keywords.slice(0,5)).map((word,i)=><li key={i}>{word}</li>)}</ul>{card.keywords.length>5&&<button onClick={()=>setAllKeywords(!allKeywords)}>{allKeywords?'Thu gọn từ khóa':'Xem thêm từ khóa'}</button>}
   <div className="knowledge-directions" role="group" aria-label="Chiều lá bài"><button aria-pressed={!reversed} onClick={()=>setReversed(false)}>Nghĩa xuôi</button><button aria-pressed={reversed} onClick={()=>setReversed(true)}>Nghĩa ngược</button></div>
   <section aria-label={reversed?'Nghĩa ngược':'Nghĩa xuôi'}><h3>Hiểu nhanh</h3><Prose text={quickMeaning(card,reversed)}/><details><summary>Đọc thêm</summary><Prose text={summary.text}/></details></section>
   <details className="knowledge-deep"><summary>Đọc sâu hơn</summary><Prose text={depth.text}/></details>
   {card.symbols.length>0&&<section><h3>Nhìn vào biểu tượng</h3><p className="knowledge-note">Chọn một chi tiết để tìm hiểu.</p>{card.symbols.map((symbol,i)=><details key={i}><summary>{symbol.name}</summary><Prose text={symbol.meaning}/><small>{formatRefs(symbol.source_refs).join(' · ')}</small></details>)}</section>}
   <details className="knowledge-sources"><summary>Nguồn tham khảo</summary><p>{refs.join(' · ')||'Chưa có số trang trong dữ liệu của lá này.'}</p>{refs.some(ref=>ref.startsWith('Huggens'))&&<small>* Số trang Huggens là ước lượng trong dữ liệu hiện có.</small>}</details>
  </div>
 </article>;
}
/** Modal lookup leaves the live reading mounted, including its scroll and expanded details. */
export function CardKnowledgeLink({card}:{card:Card}){
 const [open,setOpen]=useState(false);const trigger=useRef<HTMLButtonElement>(null);const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(!open)return;const scroll=window.scrollY,overflow=document.body.style.overflow;dialog.current?.showModal();document.body.style.overflow='hidden';return()=>{document.body.style.overflow=overflow;window.scrollTo({top:scroll,behavior:'instant'});trigger.current?.focus({preventScroll:true});};},[open]);
 return <><button ref={trigger} className="knowledge-link" onClick={()=>setOpen(true)}>Tìm hiểu lá này ↗</button>{open&&createPortal(<dialog ref={dialog} className="knowledge-dialog" aria-label={`Tìm hiểu ${card.name_vi}`} onCancel={()=>setOpen(false)} onClick={event=>{if(event.target===event.currentTarget)setOpen(false);}}><div className="knowledge-dialog-content"><div className="knowledge-dialog-toolbar"><button autoFocus onClick={()=>setOpen(false)}>← Quay lại bài đọc</button></div><CardKnowledge card={card}/></div></dialog>,document.body)}</>;
}
