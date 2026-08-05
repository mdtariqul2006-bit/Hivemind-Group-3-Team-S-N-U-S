import { useEffect, useState } from 'react';
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
  src,
  size = 48,
  accent = 'sage',
  presence,
  className,
}: {
  initials: string;
  /** Uploaded photo. Falls back to initials when absent or broken. */
  src?: string;
  size?: number;
  accent?: 'honey' | 'pink' | 'sage';
  presence?: Presence;
  className?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  // A src that changes should get another chance, the previous failure was
  // about the old image, not this one.
  useEffect(() => setImageFailed(false), [src]);

  const showImage = Boolean(src) && !imageFailed;

  return (
    <span className={cn('relative inline-block', className)} style={{ width: size, height: size }}>
      <HexFrame size={size} accent={accent}>
        {showImage ? (
          <img
            src={src}
            alt=""
            width={size}
            height={size}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <span
            className="font-semibold text-charcoal"
            style={{ fontSize: size * 0.34 }}
            aria-hidden
          >
            {initials}
          </span>
        )}
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
