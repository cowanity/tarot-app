import { useEffect, useState } from 'react';
import { useMotionPreference } from '../lib/useMotionPreference';
export function CinematicBackground() {
  const {level, reduced} = useMotionPreference();
  const [hidden, setHidden] = useState(() => document.hidden);
  useEffect(() => {
    const change = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', change);
    return () => document.removeEventListener('visibilitychange', change);
  }, []);
  return <div className="cinematic-background" aria-hidden="true" data-paused={hidden || reduced}>
    {level !== 'minimal' && <div className="aurora-layers">{Array.from({length: level === 'full' ? 3 : 2}, (_, i) => <i key={i} className={`aurora aurora-${i}`} />)}</div>}
    <div className="stage-vignette" /><div className="stage-grain" />
  </div>;
}
