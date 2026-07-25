import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function CustomCursor() {
  const reduce = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    if (reduce) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.getAttribute('role') === 'button' ||
          target.closest('button') !== null ||
          target.closest('a') !== null;
        setIsPointer(isClickable);
      }
    };

    const handleMouseDown = () => setIsHovered(true);
    const handleMouseUp = () => setIsHovered(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <>
      {/* Outer ambient glowing halo */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-50 rounded-full bg-honey/20 blur-xl dark:bg-honey/15"
        animate={{
          x: mousePos.x - (isPointer ? 48 : 32),
          y: mousePos.y - (isPointer ? 48 : 32),
          width: isPointer ? 96 : 64,
          height: isPointer ? 96 : 64,
          scale: isHovered ? 1.4 : 1,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25, mass: 0.5 }}
      />

      {/* Precise glowing cursor ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-50 rounded-full border border-honey/60 shadow-[0_0_15px_rgba(255,195,112,0.5)]"
        animate={{
          x: mousePos.x - (isPointer ? 18 : 12),
          y: mousePos.y - (isPointer ? 18 : 12),
          width: isPointer ? 36 : 24,
          height: isPointer ? 36 : 24,
          scale: isHovered ? 0.75 : 1,
          borderColor: isPointer ? 'var(--hm-pink)' : 'var(--hm-honey)',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
    </>
  );
}
