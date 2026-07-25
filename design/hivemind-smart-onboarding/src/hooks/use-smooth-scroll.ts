import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from 'framer-motion';

/**
 * High-performance Lenis smooth scroll hook.
 * Uses exponential easing formula for 60Hz-120Hz buttery smooth scrolling.
 * Automatically disabled under prefers-reduced-motion.
 */
export function useSmoothScroll(): void {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
    });

    let rafId = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [reduce]);
}
