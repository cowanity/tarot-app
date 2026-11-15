import {useEffect,useState} from 'react';
import {cards} from '../data';
import {deviceId,localDay,dailyCardIndex} from '../lib/dailyCard';
import {quickMeaning} from '../lib/cardQuick';
import {browserStorage} from '../lib/browserStorage';
import {CardFace} from './CardFace';
export function DailyCard({onAsk}:{onAsk:()=>void}){const [day,setDay]=useState(localDay),[id]=useState(()=>deviceId(browserStorage()));useEffect(()=>{const sync=()=>setDay(localDay());const timer=setInterval(sync,60000);document.addEventListener('visibilitychange',sync);return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',sync);};},[]);const card=cards[dailyCardIndex(day,id,cards.length)];return <section className="daily-card"><h2>Lá hôm nay</h2><div className="daily-art"><CardFace card={card}/></div><h3>{card.name_vi}</h3><p>{quickMeaning(card)}</p><ul className="library-keywords">{card.keywords.slice(0,5).map(k=><li key={k}>{k}</li>)}</ul><div className="actions"><a className="button-link" href={`#/library?card=${encodeURIComponent(card.id)}`}>Xem trong thư viện</a><button onClick={onAsk}>Hỏi sâu hơn</button></div><small>Một lá cho ngày hôm nay trên thiết bị này, không cần mạng.</small></section>;}
