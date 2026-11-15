import {cards} from '../data';
import {useEffect,useState} from 'react';
import {registerSW} from 'virtual:pwa-register';
import {browserStorage} from '../lib/browserStorage';
interface InstallEvent extends Event{prompt:()=>Promise<void>;userChoice:Promise<{outcome:string}>}
export function PwaUpdate(){const [ready,setReady]=useState(false),[offline,setOffline]=useState(!navigator.onLine),[update,setUpdate]=useState<(()=>void)|null>(null);
 useEffect(()=>{const apply=registerSW({onNeedRefresh:()=>setReady(true)});setUpdate(()=>()=>{void apply(true);});const sync=()=>setOffline(!navigator.onLine);addEventListener('online',sync);addEventListener('offline',sync);return()=>{removeEventListener('online',sync);removeEventListener('offline',sync);};},[]);
 return <>{ready&&<aside className="pwa-toast" role="status">Có bản mới — <button onClick={()=>update?.()}>Tải lại</button><button onClick={()=>setReady(false)}>Để sau</button></aside>}{offline&&<p className="offline-notice" role="status">Cần kết nối mạng để luận giải. <a href="#/library">Mở thư viện</a></p>}</>;
}
// Capture the event before Settings mounts. Never prompt without a user click.
let installEvent:InstallEvent|null=null;
if(typeof window!=='undefined')window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e as InstallEvent;window.dispatchEvent(new Event('tarot-install-ready'));});
export function InstallSettings(){const [available,setAvailable]=useState(Boolean(installEvent)),[dismissed,setDismissed]=useState(()=>{try{return browserStorage()?.getItem('tarot.install-help')==='seen';}catch{return false;}}),[standalone,setStandalone]=useState(()=>matchMedia('(display-mode: standalone)').matches||Boolean((navigator as Navigator&{standalone?:boolean}).standalone));
 useEffect(()=>{const ready=()=>setAvailable(true),done=()=>{setStandalone(true);installEvent=null;};addEventListener('tarot-install-ready',ready);addEventListener('appinstalled',done);return()=>{removeEventListener('tarot-install-ready',ready);removeEventListener('appinstalled',done);};},[]);
 if(standalone)return <p>Ứng dụng đã được mở độc lập.</p>;
 const ios=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 return <section><h2>Cài app</h2>{available?<button onClick={async()=>{await installEvent?.prompt();await installEvent?.userChoice;installEvent=null;setAvailable(false);}}>Cài app</button>:ios&&!dismissed?<div><p>Nhấn Chia sẻ → Thêm vào MH chính</p><button onClick={()=>{setDismissed(true);try{browserStorage()?.setItem('tarot.install-help','seen');}catch{/* memory only */}}}>Đã hiểu</button></div>:<p>Bạn có thể cài ứng dụng từ menu trình duyệt khi được hỗ trợ.</p>}</section>;
}

export function OfflineCardsSettings(){
 const [count,setCount]=useState(0),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 useEffect(()=>{if(!('caches' in window))return;void caches.open('tarot-card-images-v1').then(c=>c.keys()).then(keys=>setCount(keys.filter(k=>new URL(k.url).pathname.startsWith('/cards/')).length)).catch(()=>{});},[]);
 return <section><h2>Ảnh lá ngoại tuyến</h2><p>Văn bản thư viện và lịch sử không cần mạng. Tải trước 78 ảnh (khoảng 20 MB) để xem đủ hình khi ngoại tuyến.</p><p>{count}/78 ảnh trên thiết bị</p><button disabled={busy} onClick={async()=>{if(!navigator.onLine){setMessage('Cần mạng để tải ảnh lần đầu.');return;}setBusy(true);try{if(!('caches' in window))throw Error();const cache=await caches.open('tarot-card-images-v1');let n=0;for(const card of cards){const url=`/cards/${card.id}.webp`;if(!await cache.match(url)){const response=await fetch(url);if(!response.ok||!response.headers.get('Content-Type')?.startsWith('image/'))throw Error();await cache.put(url,response);}setCount(++n);}setMessage('Đã lưu đủ 78 ảnh. Bạn có thể thử tắt mạng.');}catch{setMessage('Chưa tải đủ ảnh. Kiểm tra mạng hoặc dung lượng rồi thử lại.');}finally{setBusy(false);}}}>{busy?'Đang tải ảnh…':'Tải đủ ảnh để dùng ngoại tuyến'}</button><p role="status">{message}</p></section>;
}
