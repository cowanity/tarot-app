import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMotionPreference } from '../lib/useMotionPreference';
import { burst,trail } from '../lib/fxEvents';
import { CardBack } from '../components/CardBack';

const COUNT = 12;

export function ShuffleScreen({ onDone }: { onDone: () => void }) {
  const { level, reduced } = useMotionPreference();
  const quiet = reduced || level === 'minimal';
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finish = setTimeout(onDone, quiet ? 250 : 2700);
    const trails=quiet?undefined:setInterval(()=>{const r=ref.current?.getBoundingClientRect();if(r)trail({x:r.left+r.width*.3,y:r.top+80},{x:r.left+r.width*.7,y:r.top+130});},350);
    const flash = setTimeout(() => {
      if (quiet) return;
      const r = ref.current?.getBoundingClientRect();
      if (r) burst({ x: r.left + r.width / 2, y: r.top + r.height * 0.7, kind: 'gold', count: 50 });
    }, 2250);
    return () => {
      clearTimeout(finish);
      clearTimeout(flash);clearInterval(trails);
    };
  }, [onDone, quiet]);

  return (
    <section className="screen-panel shuffle-screen">
      <p className="eyebrow">03 · Xào bài</p>
      <h1>Giữ một khoảng tĩnh.</h1>
      <p className="lede">Bộ bài đang được xào trước khi bạn chọn.</p>
      <div ref={ref} className="shuffle-stage cinematic-shuffle" aria-hidden="true">
        {Array.from({ length: COUNT }, (_, i) => {
          const side = i < 6 ? -1 : 1;
          const layer = i % 6;
          // Trạng thái khởi đầu = keyframe đầu tiên, để hoạt ảnh luôn chạy (dev và bản build).
          const start = quiet
            ? { opacity: 0.4 }
            : { x: '0%', y: 0, z: layer * 2, rotate: 0, rotateY: 0, opacity: 1 };
          const keyframes = quiet
            ? { opacity: [0.4, 1] }
            : {
                x: ['0%', `${side * 70}%`, `${side * 42}%`, `${side * (6 - layer)}%`, '0%', `${(i - 5.5) * 18}%`],
                y: [0, -30, -115 - layer * 4, -15 - layer * 2, 0, Math.abs(i - 5.5) * 5 - 25],
                z: [layer * 2, layer * 8, 30 + layer * 5, layer * 4, layer * 2, 0],
                rotate: [0, side * 14, side * 25, -side * 3, 0, (i - 5.5) * 7],
                rotateY: [0, side * 20, side * -15, 0, 0, 0],
                opacity: [1, 1, 1, 1, 1, 0],
              };
          return (
            <motion.div
              key={i}
              className="shuffle-card"
              style={{ zIndex: i, transformPerspective: 1000 }}
              initial={start}
              animate={keyframes}
              transition={{
                duration: quiet ? 0.2 : 2.5,
                times: quiet ? undefined : [0, 0.2, 0.43, 0.7, 0.86, 1],
                ease: 'easeInOut',
                delay: quiet ? 0 : layer * 0.015,
              }}
            >
              <CardBack />
              <span className="shuffle-edge" />
            </motion.div>
          );
        })}
      </div>
      <button onClick={onDone}>Bỏ qua</button>
    </section>
  );
}