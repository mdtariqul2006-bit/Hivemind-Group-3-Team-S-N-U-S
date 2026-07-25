import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

const ACCENTS = {
  honey: 'var(--hm-honey)',
  pink: 'var(--hm-pink)',
  sage: 'var(--hm-sage)',
} as const;

/**
 * A soft hexagon frame, the brand motif applied to avatars and step icons.
 * Uses a clip-path hexagon over a tinted background.
 */
export function HexFrame({
  children,
  size = 48,
  accent = 'sage',
  className,
}: {
  children: ReactNode;
  size?: number;
  accent?: keyof typeof ACCENTS;
  className?: string;
}) {
  return (
    <span
      className={cn('relative inline-grid place-items-center', className)}
      style={{ width: size, height: size }}
    >
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background: ACCENTS[accent],
          clipPath:
            'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        }}
      />
      <span
        className="relative grid h-full w-full place-items-center"
        style={{
          clipPath:
            'polygon(50% 4%, 96% 27%, 96% 73%, 50% 96%, 4% 73%, 4% 27%)',
        }}
      >
        {children}
      </span>
    </span>
  );
}
