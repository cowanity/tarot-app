import {useRef, type ReactNode} from 'react';
import {motion} from 'framer-motion';
import {useCardTilt} from './useCardTilt';
export default function CardTilt({children}:{children:ReactNode}) {
  const ref=useRef<HTMLDivElement>(null);const {rotateX,rotateY,glare}=useCardTilt(ref);
  return <motion.div ref={ref} className="fx-tilt" style={{rotateX,rotateY,transformPerspective:900}}>{children}<motion.i className="fx-glare" aria-hidden="true" style={{opacity:glare}} /></motion.div>;
}
