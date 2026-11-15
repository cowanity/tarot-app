import {useState} from 'react';
import type {ReadingFeedback} from '../lib/feedback';
export function FeedbackButtons({position,mode,value,onRate}:{position:number|null;mode:ReadingFeedback['mode'];value?:ReadingFeedback;onRate:(feedback:ReadingFeedback)=>{ok:boolean}}) {
  const [message,setMessage]=useState('');
  return <div className="reading-feedback" role="group" aria-label={position===null?'Phản hồi cả bài đọc':`Phản hồi vị trí ${position}`}>
    {(['yes','no'] as const).map(rating=><button type="button" key={rating} aria-pressed={value?.rating===rating} onClick={()=>{
      const result=onRate({position,mode,rating});
      setMessage(result.ok?'Đã lưu phản hồi trên thiết bị.':'Chưa lưu được phản hồi. Bạn có thể thử lại.');
    }}>{rating==='yes'?'Đúng với mình':'Chưa đúng'}</button>)}
    <small role="status" aria-live="polite">{message}</small>
  </div>;
}
