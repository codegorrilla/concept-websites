import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * useGSAPTimeline — AGENTS.md §6
 * Wraps animations in gsap.context() for proper cleanup on unmount.
 * @param {Function} buildFn — receives the GSAP context and builds animations
 * @param {Array} deps — useEffect dependency array
 */
export function useGSAPTimeline(buildFn, deps = []) {
  const contextRef = useRef(null);

  useEffect(() => {
    contextRef.current = gsap.context(() => {
      buildFn(contextRef.current);
    });

    return () => {
      contextRef.current?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return contextRef;
}
