import { animate } from 'framer-motion';
import { type CSSProperties, memo, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

interface GlowingEffectProps {
  blur?: number;
  /** Dead zone in the middle of the box where the glow stays off (0 to 1). */
  inactiveZone?: number;
  /** How far outside the box the pointer still counts as near, in px. */
  proximity?: number;
  spread?: number;
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}

/**
 * A conic gradient that lights up the border of its parent and follows the
 * pointer. Drop it as the first child of a relative box.
 *
 * Adapted for HiveMind:
 * - Uses brand colors: Honey (var(--hm-honey)), Pink (var(--hm-pink)), Sage (var(--hm-sage)).
 * - Respects prefers-reduced-motion.
 */
const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 1,
    disabled = false,
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>(0);

    const handleMove = useCallback(
      (e?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current) return;

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;

          const { left, top, width, height } = element.getBoundingClientRect();
          const mouseX = e?.x ?? lastPosition.current.x;
          const mouseY = e?.y ?? lastPosition.current.y;

          if (e) {
            lastPosition.current = { x: mouseX, y: mouseY };
          }

          const centerX = left + width * 0.5;
          const centerY = top + height * 0.5;
          const distanceFromCenter = Math.hypot(mouseX - centerX, mouseY - centerY);
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty('--active', '0');
            return;
          }

          const isActive =
            mouseX > left - proximity &&
            mouseX < left + width + proximity &&
            mouseY > top - proximity &&
            mouseY < top + height + proximity;

          element.style.setProperty('--active', isActive ? '1' : '0');
          if (!isActive) return;

          const currentAngle = parseFloat(element.style.getPropertyValue('--start')) || 0;
          const targetAngle = (180 * Math.atan2(mouseY - centerY, mouseX - centerX)) / Math.PI + 90;
          const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
          const newAngle = currentAngle + angleDiff;

          // Reduced motion: light the border but skip the easing sweep.
          if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            element.style.setProperty('--start', String(newAngle));
            return;
          }

          animate(currentAngle, newAngle, {
            duration: movementDuration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value: number) => {
              element.style.setProperty('--start', String(value));
            },
          });
        });
      },
      [inactiveZone, proximity, movementDuration],
    );

    useEffect(() => {
      if (disabled) return;

      const handleScroll = (): void => handleMove();
      const handlePointerMove = (e: PointerEvent): void => handleMove(e);

      window.addEventListener('scroll', handleScroll, { passive: true });
      document.body.addEventListener('pointermove', handlePointerMove, { passive: true });

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        window.removeEventListener('scroll', handleScroll);
        document.body.removeEventListener('pointermove', handlePointerMove);
      };
    }, [handleMove, disabled]);

    if (disabled) return null;

    return (
      <div
        ref={containerRef}
        aria-hidden
        style={
          {
            '--blur': `${blur}px`,
            '--spread': spread,
            '--start': '0',
            '--active': '0',
            '--glowingeffect-border-width': `${borderWidth}px`,
            '--repeating-conic-gradient-times': '5',
            '--gradient': `radial-gradient(circle, var(--hm-honey) 10%, #ffc37000 20%),
              radial-gradient(circle at 40% 40%, var(--hm-pink) 5%, #f4b8bd00 15%),
              radial-gradient(circle at 60% 60%, var(--hm-sage) 10%, #bac9c500 20%),
              repeating-conic-gradient(
                from 236.84deg at 50% 50%,
                var(--hm-honey) 0%,
                var(--hm-pink) calc(25% / var(--repeating-conic-gradient-times)),
                var(--hm-sage) calc(50% / var(--repeating-conic-gradient-times)),
                var(--hm-honey) calc(100% / var(--repeating-conic-gradient-times))
              )`,
          } as CSSProperties
        }
        className={cn(
          'pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity',
          glow && 'opacity-100',
          blur > 0 && 'blur-[var(--blur)]',
          className,
        )}
      >
        <div
          className={cn(
            'rounded-[inherit]',
            'after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))] after:rounded-[inherit] after:content-[""]',
            'after:[border:var(--glowingeffect-border-width)_solid_transparent]',
            'after:[background:var(--gradient)] after:[background-attachment:fixed]',
            'after:opacity-[var(--active)] after:transition-opacity after:duration-300',
            'after:[mask-clip:padding-box,border-box]',
            'after:[mask-composite:intersect]',
            'after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]',
          )}
        />
      </div>
    );
  },
);

GlowingEffect.displayName = 'GlowingEffect';

export { GlowingEffect };
