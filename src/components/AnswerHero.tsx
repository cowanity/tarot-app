import {motion} from 'framer-motion';
import {useMotionPreference} from '../lib/useMotionPreference';
import './answerHero.css';
export function AnswerHero({verdict,answer,loading=false,yesNo=false,thirdParty=false}:{verdict?:string;answer?:string;loading?:boolean;yesNo?:boolean;thirdParty?:boolean}){
 const {reduced}=useMotionPreference();
 const prefix=Boolean(verdict&&answer?.toLocaleLowerCase('vi').startsWith(verdict.toLocaleLowerCase('vi')));
 return <motion.section className="answer-hero" aria-label="Câu trả lời cho bạn" aria-busy={loading} initial={reduced?false:{opacity:0}} animate={{opacity:1}} transition={{duration:reduced?0:.4}}>
  <p className="answer-hero-label">Câu trả lời cho bạn</p>
  {loading?<div className="answer-hero-skeleton" aria-label="Đang soạn câu trả lời"><span/><span/><span/></div>:<>
   {verdict&&<p className="answer-verdict">{verdict}</p>}
   <p className="answer-body">{prefix?<><strong>{answer!.slice(0,verdict!.length)}</strong>{answer!.slice(verdict!.length)}</>:answer}</p>
   {(thirdParty||yesNo)&&<p className="answer-disclaimer">{thirdParty?'Bài chỉ cho thấy xu hướng cảm xúc, không phải lời hay hành động của họ.':'Đây là hướng các lá nghiêng về lúc này, không phải điều chắc chắn.'}</p>}
  </>}
 </motion.section>;
}
