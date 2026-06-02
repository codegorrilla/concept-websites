import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import './ScrollProgress.css';

export default function ScrollProgress() {
  const lineRef = useRef(null);
  const { progress } = useScrollProgress();

  useEffect(() => {
    if (lineRef.current) {
      gsap.set(lineRef.current, { scaleY: progress });
    }
  }, [progress]);

  return (
    <div className="scroll-progress-track" aria-hidden="true">
      <div ref={lineRef} className="scroll-progress-fill" style={{ transform: `scaleY(${progress})` }} />
      <div className="scroll-progress-dot" style={{ top: `${progress * 100}%` }} />
    </div>
  );
}
