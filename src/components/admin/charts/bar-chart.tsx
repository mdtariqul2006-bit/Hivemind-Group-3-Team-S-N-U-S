import { motion, useReducedMotion } from 'framer-motion';
import type { SeriesPoint } from '@/data/admin-metrics';

const ACCENTS = {
  honey: 'var(--hm-honey)',
  pink: 'var(--hm-pink)',
  sage: 'var(--hm-sage)',
} as const;

/** Vertical bars for the weekly activity widget. Bars grow up on mount. */
export function BarChart({
  data,
  accent = 'honey',
  height = 180,
}: {
  data: SeriesPoint[];
  accent?: keyof typeof ACCENTS;
  height?: number;
}) {
  const reduce = useReducedMotion();
  const max = Math.max(...data.map((d) => d.value));
  const color = ACCENTS[accent];

  return (
    <div className="flex items-end justify-between gap-2 sm:gap-3" style={{ height }}>
      {data.map((d, i) => {
        const ratio = d.value / max;
        return (
          <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <div className="relative flex w-full flex-1 items-end justify-center">
              <motion.div
                className="w-full max-w-[34px] rounded-t-lg"
                style={{ background: `linear-gradient(to top, ${color}, color-mix(in srgb, ${color} 55%, transparent))` }}
                initial={reduce ? { height: `${ratio * 100}%` } : { height: 0 }}
                whileInView={{ height: `${ratio * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                title={`${d.label}: ${d.value}`}
              />
            </div>
            <span className="text-[11px] text-muted">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Horizontal ranked bars for the bottleneck widget. */
export function BarList({ data, accent = 'pink' }: { data: SeriesPoint[]; accent?: keyof typeof ACCENTS }) {
  const reduce = useReducedMotion();
  const max = Math.max(...data.map((d) => d.value));
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const color = ACCENTS[accent];

  return (
    <ul className="grid gap-4">
      {sorted.map((d, i) => (
        <li key={d.label} className="grid gap-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink">{d.label}</span>
            <span className="numeral text-xs text-muted">{d.value}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-sunk">
            <motion.div
              className="h-full rounded-full"
              style={{ background: color }}
              initial={reduce ? { width: `${(d.value / max) * 100}%` } : { width: 0 }}
              whileInView={{ width: `${(d.value / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
