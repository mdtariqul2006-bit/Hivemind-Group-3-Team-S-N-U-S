import { cn } from '@/lib/cn';

/**
 * Shimmer skeleton for first paint. The shimmer sweep is a transform-only
 * animation; under reduced motion the CSS media query in index.css freezes it to
 * a calm static block.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-sunk',
        'after:absolute after:inset-0 after:-translate-x-full',
        'after:bg-gradient-to-r after:from-transparent after:via-white/45 after:to-transparent',
        'after:[animation:hm-shimmer_1.6s_infinite]',
        className,
      )}
      aria-hidden
    />
  );
}

/** Dashboard-shaped skeleton shown while the seeded plan "loads". */
export function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10" aria-hidden>
      <div className="flex flex-col items-center gap-5">
        <Skeleton className="h-64 w-64 rounded-full" />
        <Skeleton className="h-5 w-72" />
      </div>
      <Skeleton className="mt-10 h-40 w-full rounded-3xl" />
      <div className="mt-8 flex gap-4 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-52 w-72 shrink-0 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
