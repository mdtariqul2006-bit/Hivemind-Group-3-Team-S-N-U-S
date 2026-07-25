import { motion, type SpringOptions, useSpring, useTransform } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

interface SpotlightProps {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
}

/**
 * A soft light that trails the cursor across its parent. Drop it inside a
 * relative overflow-hidden container.
 *
 * Adapted for HiveMind:
 * - Uses brand honey and pink radial gradient.
 * - Eases pointer coordinates.
 */
export const Spotlight = ({
  className,
  size = 260,
  springOptions = { bounce: 0 },
}: SpotlightProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [parent, setParent] = useState<HTMLElement | null>(null);

  const mouseX = useSpring(0, springOptions);
  const mouseY = useSpring(0, springOptions);
  const left = useTransform(mouseX, (x) => `${x - size / 2}px`);
  const top = useTransform(mouseY, (y) => `${y - size / 2}px`);

  useEffect(() => {
    setParent(containerRef.current?.parentElement ?? null);
  }, []);

  const handleMove = useCallback(
    (event: MouseEvent) => {
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      mouseX.set(event.clientX - rect.left);
      mouseY.set(event.clientY - rect.top);
    },
    [mouseX, mouseY, parent],
  );

  useEffect(() => {
    if (!parent) return;

    const enter = (): void => setIsHovered(true);
    const leave = (): void => setIsHovered(false);

    parent.addEventListener('mousemove', handleMove);
    parent.addEventListener('mouseenter', enter);
    parent.addEventListener('mouseleave', leave);

    return () => {
      parent.removeEventListener('mousemove', handleMove);
      parent.removeEventListener('mouseenter', enter);
      parent.removeEventListener('mouseleave', leave);
    };
  }, [parent, handleMove]);

  return (
    <motion.div
      ref={containerRef}
      aria-hidden
      className={cn(
        'pointer-events-none absolute z-0 rounded-full blur-3xl transition-opacity duration-300',
        'bg-[radial-gradient(circle_at_center,rgba(255,195,112,0.18),rgba(244,184,189,0.06)_45%,transparent_75%)]',
        isHovered ? 'opacity-100' : 'opacity-0',
        className,
      )}
      style={{ width: size, height: size, left, top }}
    />
  );
};
