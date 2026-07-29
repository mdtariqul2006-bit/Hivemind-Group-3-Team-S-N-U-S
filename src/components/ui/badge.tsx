import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'honey' | 'pink' | 'sage' | 'muted';

const tones: Record<Tone, string> = {
  honey: 'bg-honey-wash text-honey-deep',
  pink: 'bg-pink-wash text-ink',
  sage: 'bg-sage-wash text-ink',
  muted: 'bg-sunk text-muted',
};

export function Badge({
  children,
  tone = 'muted',
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
