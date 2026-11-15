import {useEffect,useRef,useState} from 'react';
import {cards} from '../data';
import {CardFace} from '../components/CardFace';
import {CardKnowledge} from '../components/CardKnowledge';
import {browserStorage} from '../lib/browserStorage';
import {FAVORITES_KEY,filterLibrary,readFavorites} from '../lib/cardLibrary';
import './cardLibrary.css';
const groups=[['all','Tất cả'],['major','Ẩn Chính'],['wands','Gậy'],['cups','Cốc'],['swords','Kiếm'],['pentacles','Tiền']] as const;
const ids=cards.map(c=>c.id);
export default function LibraryScreen(){
 const [query,setQuery]=useState(''),[group,setGroup]=useState('all'),[onlyFavorites,setOnlyFavorites]=useState(false);
 const [favorites,setFavorites]=useState(()=>readFavorites(browserStorage(),ids));const [selected,setSelected]=useState<string|null>(()=>new URLSearchParams(location.hash.split('?')[1]??'').get('card'));const [message,setMessage]=useState('');
 const savedScroll=useRef(0),heading=useRef<HTMLHeadingElement>(null);
 const card=cards.find(c=>c.id===selected);const shown=filterLibrary(cards,query,group,favorites,onlyFavorites);
 useEffect(()=>{if(card){window.scrollTo({top:0,behavior:'instant'});heading.current?.focus({preventScroll:true});}},[card]);
 useEffect(()=>{const sync=(event:StorageEvent)=>{if(event.key===FAVORITES_KEY||event.key===null)setFavorites(readFavorites(browserStorage(),ids));};addEventListener('storage',sync);return()=>removeEventListener('storage',sync);},[]);
 const favorite=(id:string)=>{const next=favorites.includes(id)?favorites.filter(value=>value!==id):[...favorites,id];setFavorites(next);try{const storage=browserStorage();if(!storage)throw new Error();storage.setItem(FAVORITES_KEY,JSON.stringify(next));setMessage(next.includes(id)?'Đã đánh dấu yêu thích trên thiết bị.':'Đã bỏ đánh dấu yêu thích.');}catch{setMessage('Đã áp dụng, nhưng chưa lưu được trên thiết bị.');}};
 const back=()=>{const id=selected;setSelected(null);requestAnimationFrame(()=>{window.scrollTo({top:savedScroll.current,behavior:'instant'});document.getElementById(`library-${id}`)?.focus({preventScroll:true});});};
 return <section className="library-screen">
  {card?<><div className="library-detail-toolbar"><button onClick={back}>← Về bộ bài</button><button aria-pressed={favorites.includes(card.id)} onClick={()=>favorite(card.id)}>{favorites.includes(card.id)?'♥ Đã yêu thích':'♡ Yêu thích'}</button></div><h1 ref={heading} tabIndex={-1} className="sr-only">{card.name_vi}</h1><CardKnowledge key={card.id} card={card}/></>:<>
   <header className="library-header"><p className="eyebrow">Khám phá bộ bài</p><h1>Thư viện 78 lá</h1><p>Tìm một lá bạn vừa gặp, hoặc thong thả khám phá từng bộ.</p></header>
   <div className="library-tools"><label htmlFor="library-search">Tìm tên lá hoặc từ khóa</label><input id="library-search" type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Ví dụ: Nữ Tu, The Moon, tình cảm…"/>
    <div className="library-filters" role="group" aria-label="Bộ bài">{groups.map(([value,label])=><button key={value} aria-pressed={group===value} onClick={()=>setGroup(value)}>{label}</button>)}</div>
    <label className="library-favorite-filter"><input type="checkbox" checked={onlyFavorites} onChange={event=>setOnlyFavorites(event.target.checked)}/>Chỉ xem yêu thích ({favorites.length})</label>
   </div>
   <p className="library-count" role="status">{shown.length} lá{query?' khớp tìm kiếm':''}</p>
   {shown.length?<ul className="library-grid">{shown.map(c=><li key={c.id}><button id={`library-${c.id}`} className="library-card" onClick={()=>{savedScroll.current=window.scrollY;setSelected(c.id);}} aria-label={`Tìm hiểu ${c.name_vi}`}><CardFace card={c}/><strong>{c.name_vi}</strong><span lang="en">{c.name_en}</span><span className="library-card-keywords">{c.keywords.slice(0,3).join(' · ')}</span></button><button className="library-heart" aria-label={`${favorites.includes(c.id)?'Bỏ yêu thích':'Yêu thích'} ${c.name_vi}`} aria-pressed={favorites.includes(c.id)} onClick={()=>favorite(c.id)}>{favorites.includes(c.id)?'♥':'♡'}</button></li>)}</ul>:<div className="library-empty"><h2>{onlyFavorites?'Chưa có lá yêu thích phù hợp':'Chưa tìm thấy lá phù hợp'}</h2><p>Thử tên ngắn hơn hoặc đổi bộ lọc.</p><button onClick={()=>{setQuery('');setGroup('all');setOnlyFavorites(false);}}>Xem tất cả 78 lá</button></div>}
  </>}
  <p className="knowledge-note" role="status">{message}</p>
 </section>;
}
