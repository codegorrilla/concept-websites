import { useEffect, useRef, createContext, useContext } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export const LenisContext = createContext(null);
export const useLenis = () => useContext(LenisContext);

/**
 * SmoothScrollLayout — AGENTS.md §4
 * Initializes Lenis smooth scroll and syncs it with GSAP's ticker.
 */
export default function SmoothScrollLayout({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: false,
    });

    lenisRef.current = lenis;

    // Sync Lenis RAF with GSAP ticker — AGENTS.md §4
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Tell ScrollTrigger about Lenis
    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef}>
      {children}
    </LenisContext.Provider>
  );
}
