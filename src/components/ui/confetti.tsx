import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * A short honey/pink hex-confetti burst for task completion and milestones.
 * Purely decorative and aria-hidden. Renders nothing at all under reduced motion, * there is no motion-free "confetti" that would still be meaningful.
 */
export function Confetti({ count = 28, origin = 'center' }: { count?: number; origin?: 'center' | 'top' }) {
  const reduce = useReducedMotion();
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 340,
        y: -(120 + Math.random() * 260),
        rot: Math.random() * 360,
        delay: Math.random() * 0.12,
        color: i % 2 === 0 ? 'var(--hm-honey)' : 'var(--hm-pink)',
        size: 7 + Math.random() * 7,
      })),
    [count],
  );

  if (reduce) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-30 overflow-visible"
      style={{ ['--o' as string]: origin === 'top' ? '18%' : '50%' }}
    >
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute left-1/2 top-[var(--o)]"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
          animate={{ opacity: [1, 1, 0], x: p.x, y: p.y, rotate: p.rot, scale: 0.6 }}
          transition={{ duration: 1.1 + Math.random() * 0.5, ease: 'easeOut', delay: p.delay }}
        />
      ))}
    </div>
  );
}
