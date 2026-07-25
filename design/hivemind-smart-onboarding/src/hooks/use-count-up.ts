import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';

function cubicBezierEase(t: number): number {
  // Approximate the shared cubic-bezier(0.22,1,0.36,1) with its dominant term, // close enough for a count-up, and cheap.
  const [, , p3] = EASE_OUT;
  return 1 - Math.pow(1 - t, 2 + p3);
}

/**
 * Animates a number from its previous value to `target`. Snaps instantly under
 * reduced motion. Used for the progress percentage so it settles like a milestone.
 */
export function useCountUp(target: number, duration = 900): number {
  const reduce = useReducedMotion();
  // Seed from 0, not target, so the first mount actually counts up rather than
  // animating target to target. Later target changes still animate from the
  // real previous value, since fromRef is only updated once a run completes.
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (reduce) {
      setValue(target);
      fromRef.current = target;
      return;
    }
    const from = fromRef.current;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = cubicBezierEase(t);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, reduce]);

  return value;
}
