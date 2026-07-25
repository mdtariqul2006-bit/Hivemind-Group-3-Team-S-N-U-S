import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useCountUp } from '@/hooks/use-count-up';
import { springPop, EASE_OUT } from '@/lib/motion';

interface ProgressHiveProps {
  /** 0 to 100. */
  progress: number;
  /** Total number of onboarding steps, the hive has one cell per step. */
  total: number;
  completed: number;
  size?: number;
}

/** Flat-top hexagon path for a given centre and radius. */
function hexPath(cx: number, cy: number, r: number): string {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  return 'M' + pts.map(([x, y]) => `${x?.toFixed(2)} ${y?.toFixed(2)}`).join('L') + 'Z';
}

/**
 * The hero motion piece. A ring of honeycomb cells that fill one-by-one as steps
 * complete, wrapped around a spring count-up of the percentage. When a new cell
 * fills it gives a gentle pulse. The whole thing is an aria-live progressbar so a
 * screen-reader hears "40% settled in" the moment it changes.
 */
export function ProgressHive({ progress, total, completed, size = 260 }: ProgressHiveProps) {
  const reduce = useReducedMotion();
  const shown = useCountUp(progress);

  const { cells, viewR } = useMemo(() => {
    const cx = size / 2;
    const cy = size / 2;
    const ring = size * 0.34;
    const cellR = size * 0.072;
    // Centre cell + 12 around: a compact hive that reads at a glance.
    const inner = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 180) * (60 * i - 90);
      return { x: cx + ring * 0.55 * Math.cos(a), y: cy + ring * 0.55 * Math.sin(a) };
    });
    const outer = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 180) * (60 * i - 60);
      return { x: cx + ring * Math.cos(a), y: cy + ring * Math.sin(a) };
    });
    const positions = [{ x: cx, y: cy }, ...inner, ...outer];
    return {
      cells: positions.map((p) => hexPath(p.x, p.y, cellR)),
      viewR: cellR,
    };
  }, [size]);

  // Map the ring of cells to completion. Cells fill proportionally to progress so
  // the hive is always honest even when steps and cells do not divide evenly.
  const filledCells = Math.round((progress / 100) * cells.length);

  return (
    <div
      className="relative select-none"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Onboarding progress: ${progress}% settled in, ${completed} of ${total} steps complete`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
      >
        <defs>
          <linearGradient id="hive-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--hm-honey)" />
            <stop offset="100%" stopColor="var(--hm-pink)" />
          </linearGradient>
        </defs>
        {cells.map((d, i) => {
          const filled = i < filledCells;
          return (
            <motion.path
              key={i}
              d={d}
              fill={filled ? 'url(#hive-fill)' : 'var(--hm-surface-sunk)'}
              stroke={filled ? 'transparent' : 'var(--hm-border)'}
              strokeWidth={1.5}
              initial={false}
              animate={
                reduce
                  ? { opacity: 1, scale: 1 }
                  : {
                      scale: filled ? [1, 1.16, 1] : 1,
                      opacity: 1,
                    }
              }
              transition={
                reduce
                  ? { duration: 0 }
                  : { ...springPop, delay: filled ? i * 0.015 : 0 }
              }
              style={{ transformOrigin: `${viewR}px ${viewR}px`, transformBox: 'fill-box' }}
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex items-start">
          <motion.span
            key={progress >= 100 ? 'done' : 'count'}
            className="numeral text-6xl leading-none text-ink"
            initial={reduce ? false : { scale: 0.9, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE_OUT }}
          >
            {shown}
          </motion.span>
          <span className="numeral mt-1 text-2xl text-muted">%</span>
        </div>
        <span className="mt-1 text-sm font-medium text-muted">settled in</span>
      </div>
    </div>
  );
}
