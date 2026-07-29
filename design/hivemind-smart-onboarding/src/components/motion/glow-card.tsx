import {
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface GlowCardProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  /** Honey glow radius. */
  glow?: number;
}

/**
 * A card with a soft honey spotlight that tracks the cursor across its surface.
 * The glow is a radial-gradient positioned from pointer coords via CSS variables,
 * so moving it only updates custom properties, no layout, no repaint of children.
 * Pointer tracking is skipped entirely under reduced motion.
 */
export function GlowCard({ children, className, glow = 380, ...rest }: GlowCardProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    ref.current.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      className={cn(
        'group/glow relative overflow-hidden rounded-3xl border border-border bg-surface',
        'shadow-[var(--shadow-soft)] transition-shadow duration-300',
        'hover:shadow-[var(--shadow-lift)]',
        className,
      )}
      style={{ '--glow': `${glow}px` } as React.CSSProperties}
      {...rest}
    >
      {!reduce && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300"
          style={{
            opacity: active ? 1 : 0,
            background:
              'radial-gradient(var(--glow) circle at var(--mx, 50%) var(--my, 0%), rgb(255 195 112 / 0.18), transparent 60%)',
          }}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
