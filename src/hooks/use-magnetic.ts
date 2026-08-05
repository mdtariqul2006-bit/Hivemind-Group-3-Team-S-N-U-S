import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from 'framer-motion';

/**
 * GSAP magnetic pull: the element drifts a few pixels toward the cursor while
 * hovered and eases back out on leave. Strength is in pixels of maximum travel.
 * A no-op under reduced motion, the element just stays put.
 */
export function useMagnetic<T extends HTMLElement>(
  ref: RefObject<T | null>,
  strength = 14,
  enabled = true,
) {
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || !enabled) return;

    const quickX = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
    const quickY = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });

    function onMove(e: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      quickX((relX / rect.width) * strength * 2);
      quickY((relY / rect.height) * strength * 2);
    }

    function onLeave() {
      quickX(0);
      quickY(0);
    }

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [ref, strength, reduce, enabled]);
}
