import { HexFrame } from './hex-frame';
import { cn } from '@/lib/cn';

type Presence = 'online' | 'away' | 'offline';

const presenceColor: Record<Presence, string> = {
  online: 'bg-[color:var(--hm-honey)]',
  away: 'bg-[color:var(--hm-pink)]',
  offline: 'bg-[color:var(--hm-border)]',
};

/** An avatar in a hex frame, with an optional presence dot. */
export function Avatar({
  initials,
  size = 48,
  accent = 'sage',
  presence,
  className,
}: {
  initials: string;
  size?: number;
  accent?: 'honey' | 'pink' | 'sage';
  presence?: Presence;
  className?: string;
}) {
  return (
    <span className={cn('relative inline-block', className)} style={{ width: size, height: size }}>
      <HexFrame size={size} accent={accent}>
        <span
          className="font-semibold text-charcoal"
          style={{ fontSize: size * 0.34 }}
          aria-hidden
        >
          {initials}
        </span>
      </HexFrame>
      {presence && (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 block rounded-full ring-2 ring-[color:var(--hm-surface)]',
            presenceColor[presence],
          )}
          style={{ width: size * 0.24, height: size * 0.24 }}
          aria-label={presence}
        />
      )}
    </span>
  );
}
