import { type CSSProperties, useMemo, useRef } from 'react';
import { useDimensions } from '@/hooks/use-debounced-dimensions';
import { cn } from '@/lib/cn';

interface AnimatedGradientProps {
  /** One drifting blob per colour. Pass brand hexes. */
  colors: string[];
  /** Higher = faster drift (one cycle lasts 1 / speed seconds). */
  speed?: number;
  blur?: 'light' | 'medium' | 'heavy';
  className?: string;
}

const BLUR: Record<NonNullable<AnimatedGradientProps['blur']>, string> = {
  light: 'blur-2xl',
  medium: 'blur-3xl',
  heavy: 'blur-[100px]',
};

interface Blob {
  top: string;
  left: string;
  scale: number;
  vars: CSSProperties;
}

/**
 * Randomise once per mount.
 */
const useBlobs = (count: number, speed: number): Blob[] =>
  useMemo(
    () =>
      Array.from({ length: count }, () => ({
        top: `${Math.random() * 50}%`,
        left: `${Math.random() * 50}%`,
        scale: Math.random() < 0.5 ? 0.6 : 1.4,
        vars: {
          '--background-gradient-speed': `${1 / speed}s`,
          '--tx-1': Math.random() - 0.5,
          '--ty-1': Math.random() - 0.5,
          '--tx-2': Math.random() - 0.5,
          '--ty-2': Math.random() - 0.5,
          '--tx-3': Math.random() - 0.5,
          '--ty-3': Math.random() - 0.5,
          '--tx-4': Math.random() - 0.5,
          '--ty-4': Math.random() - 0.5,
        } as CSSProperties,
      })),
    [count, speed],
  );

/**
 * Soft, slowly drifting blobs of color (an ambient animated background).
 */
const AnimatedGradient = ({
  colors,
  speed = 5,
  blur = 'light',
  className,
}: AnimatedGradientProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useDimensions(containerRef);
  const size = Math.max(width, height);
  const blobs = useBlobs(colors.length, speed);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <div className={cn('absolute inset-0', BLUR[blur])}>
        {blobs.map((blob, index) => (
          <svg
            key={index}
            className="absolute animate-background-gradient"
            style={{ ...blob.vars, top: blob.top, left: blob.left }}
            width={size * blob.scale}
            height={size * blob.scale}
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="50"
              fill={colors[index]}
              className="opacity-30 dark:opacity-[0.15]"
            />
          </svg>
        ))}
      </div>
    </div>
  );
};

export { AnimatedGradient };
