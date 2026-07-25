import { motion, useReducedMotion } from 'framer-motion';
import type { Segment } from '@/data/admin-metrics';
import { donutSegment } from './chart-utils';

const SIZE = 180;
const R = 70;
const STROKE = 22;

/**
 * Rounds each share to a whole percent so the displayed values always sum to
 * 100, using largest-remainder rounding rather than rounding each in
 * isolation (which can drift a point off in either direction).
 */
function roundedShares(values: number[]): number[] {
  const total = values.reduce((a, b) => a + b, 0);
  const raw = values.map((v) => (v / total) * 100);
  const floors = raw.map(Math.floor);
  const remainder = 100 - floors.reduce((a, b) => a + b, 0);
  const order = raw
    .map((r, i) => ({ i, frac: r - floors[i]! }))
    .sort((a, b) => b.frac - a.frac);
  const result = [...floors];
  for (let k = 0; k < remainder; k++) result[order[k]!.i]! += 1;
  return result;
}

/** A ring chart for the role split, with an animated draw and a centre total. */
export function DonutChart({ data }: { data: Segment[] }) {
  const reduce = useReducedMotion();
  const total = data.reduce((sum, s) => sum + s.value, 0);
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const circumference = 2 * Math.PI * R;
  const shares = roundedShares(data.map((s) => s.value));

  let acc = 0;
  const segments = data.map((s, i) => {
    const start = (acc / total) * 360;
    acc += s.value;
    const end = (acc / total) * 360;
    const dash = ((end - start) / 360) * circumference;
    return { ...s, start, end, dash, percent: shares[i]! };
  });

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} role="img" aria-label="New starters by role">
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--hm-border)" strokeWidth={STROKE} opacity={0.4} />
          {segments.map((s, i) => (
            <motion.path
              key={s.label}
              d={donutSegment(cx, cy, R, s.start, s.end)}
              fill="none"
              stroke={s.color}
              strokeWidth={STROKE}
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="numeral text-3xl text-ink">{total}</div>
            <div className="text-[11px] text-muted">starters</div>
          </div>
        </div>
      </div>

      <ul className="grid w-full gap-3">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-full" style={{ background: s.color }} />
              <span className="text-ink">{s.label}</span>
            </span>
            <span className="text-muted">
              <span className="numeral text-ink">{s.value}</span>
              <span className="ml-1.5 text-xs">{s.percent}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
