import { type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { cn } from '@/lib/cn';

interface GlowCardProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
}

/**
 * A card with a soft glowing border that tracks the cursor.
 * Uses the GlowingEffect component for smooth conic border trails.
 */
export function GlowCard({ children, className, ...rest }: GlowCardProps) {
  const reduce = useReducedMotion();

  return (
    <div
      className={cn(
        'group/glow relative overflow-hidden rounded-3xl border border-border bg-surface',
        'shadow-[var(--shadow-soft)] transition-shadow duration-300',
        'hover:shadow-[var(--shadow-lift)]',
        className,
      )}
      {...rest}
    >
      {!reduce && (
        <GlowingEffect
          blur={0}
          borderWidth={1.5}
          spread={24}
          glow
          disabled={false}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
