import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from 'framer-motion';

/**
 * Staggered GSAP entrance for a group of children inside `containerRef`. Mirrors
 * the brief's `gsap.from()` recipe: stagger 0.08s, power3.out, small scale/opacity
 * lift. Runs once on mount; pass a fresh key to `deps` to replay on data change.
 * Reduced motion sets children to their resting state with no animation at all.
 */
export function useGsapReveal(
  containerRef: RefObject<HTMLElement | null>,
  selector: string,
  deps: unknown[] = [],
) {
  const reduce = useReducedMotion();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const targets = container.querySelectorAll(selector);
    if (targets.length === 0) return;

    if (reduce) {
      gsap.set(targets, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y: 20,
        scale: 0.97,
        stagger: 0.08,
        ease: 'power3.out',
        duration: 0.6,
      });
    }, container);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, selector, reduce, ...deps]);
}
