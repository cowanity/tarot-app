import {useEffect,useRef,useState} from 'react';
import {finishOnboarding,useOnboardingSeen} from '../lib/onboarding';
const cards=[['Một góc nhìn để tự lắng nghe','Rút bài theo câu hỏi của bạn, hoặc khám phá ý nghĩa 78 lá trong thư viện.'],['Bắt đầu từ điều đang bận lòng','Bạn có thể hỏi mở hoặc có/không. Thêm một chút hoàn cảnh sẽ giúp câu hỏi rõ hơn.'],['Bạn giữ quyền quyết định','Bài đọc mang tính tham khảo, không thay thế tư vấn chuyên môn.']];
export function Onboarding(){
 const seen=useOnboardingSeen(),[step,setStep]=useState(0),ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(seen)return;const previous=document.activeElement;ref.current?.showModal();return()=>{if(previous instanceof HTMLElement)previous.focus();};},[seen]);
 if(seen)return null;
 return <dialog ref={ref} className="onboarding welcome-dialog" aria-labelledby="welcome-title" onCancel={finishOnboarding}>
 <p className="eyebrow">{step+1}/3 · Chào bạn</p><h2 id="welcome-title">{cards[step][0]}</h2><p>{cards[step][1]}</p>
 <div className="welcome-dots" aria-label={`Bước ${step+1} trong 3`}>{cards.map((_,i)=><span key={i} data-active={step===i}/>)}</div>
 <div className="actions"><button onClick={finishOnboarding}>Bỏ qua</button><button className="button-primary" onClick={()=>step===2?finishOnboarding():setStep(step+1)}>{step===2?'Sẵn sàng':'Tiếp theo'}</button></div></dialog>;
}
