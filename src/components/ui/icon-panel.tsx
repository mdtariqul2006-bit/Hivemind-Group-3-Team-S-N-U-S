import type { LucideIcon } from 'lucide-react';
import { HexFrame } from '@/components/ui/hex-frame';
import { cn } from '@/lib/cn';

const WASH = {
  honey: 'var(--hm-honey-wash)',
  pink: 'var(--hm-pink-wash)',
  sage: 'var(--hm-sage-wash)',
} as const;

const TINT = {
  honey: 'var(--hm-honey)',
  pink: 'var(--hm-pink)',
  sage: 'var(--hm-sage)',
} as const;

type Accent = keyof typeof WASH;

/**
 * Brand-consistent stand-in for photography: a washed accent field, an
 * optional hex-grid texture, and a centred HexFrame icon. Used anywhere the
 * research content previously carried a stock photo, so imagery never
 * competes with the honey/sage/pink/charcoal palette.
 */
export function IconPanel({
  icon: Icon,
  accent = 'honey',
  pattern = false,
  iconSize = 56,
  className,
}: {
  icon: LucideIcon;
  accent?: Accent;
  pattern?: boolean;
  iconSize?: number;
  className?: string;
}) {
  return (
    <div
      className={cn('relative flex items-center justify-center overflow-hidden', className)}
      style={{ backgroundColor: WASH[accent] }}
    >
      {pattern && (
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full opacity-[0.35]"
          style={{ color: TINT[accent] }}
        >
          <defs>
            <pattern
              id={`hex-grid-${accent}`}
              width="26"
              height="30"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(1.4)"
            >
              <path
                d="M13 0 L26 7.5 L26 22.5 L13 30 L0 22.5 L0 7.5 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#hex-grid-${accent})`} />
        </svg>
      )}
      <div
        aria-hidden
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl opacity-40"
        style={{ backgroundColor: TINT[accent] }}
      />
      <HexFrame accent={accent} size={iconSize} className="relative">
        <Icon
          className="text-charcoal"
          style={{ width: iconSize * 0.42, height: iconSize * 0.42 }}
          strokeWidth={1.8}
        />
      </HexFrame>
    </div>
  );
}
