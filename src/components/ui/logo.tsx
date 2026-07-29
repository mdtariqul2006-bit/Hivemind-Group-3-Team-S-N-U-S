import { cn } from '@/lib/cn';

/**
 * The HiveMind mark, a single hexagon holding a small honeycomb spiral, echoing
 * the real HiveMind Academy logo. Sage by default; the hex outline is the brand's
 * quiet motif at logo scale.
 */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={cn(className)}
      role="img"
      aria-label="HiveMind"
    >
      <path
        d="M50 4 91 27v46L50 96 9 73V27z"
        fill="none"
        stroke="var(--hm-sage)"
        strokeWidth="6"
      />
      <path
        d="M50 26 68 36v20L50 66 32 56V36z"
        fill="none"
        stroke="var(--hm-honey)"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="48" r="6" fill="var(--hm-honey)" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark size={30} />
      <span className="text-lg font-semibold tracking-tight text-ink">HiveMind</span>
    </span>
  );
}
