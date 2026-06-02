import { useEffect, useRef, useState } from 'react';
import { getLocalProgress, getActiveSection } from '../constants/scrollMap';

/**
 * useScrollProgress — tracks Lenis scroll progress
 * Returns global [0,1] progress and the current active section.
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const rafRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const p = Math.min(1, Math.max(0, scrollTop / docHeight));
      setProgress(p);
      setActiveSection(getActiveSection(p));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // init
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { progress, activeSection };
}

/**
 * useLocalProgress — returns [0,1] progress local to a specific section
 * @param {string} section — key from SCROLL_MAP
 */
export function useLocalProgress(section) {
  const { progress } = useScrollProgress();
  return getLocalProgress(progress, section);
}
