import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { SeriesPoint } from '@/data/admin-metrics';
import { toPoints, smoothPath } from './chart-utils';

const W = 640;
const H = 240;
const PAD_X = 8;
const PAD_Y = 16;

/**
 * The headline completion trend. Draws a smooth honey line over a soft gradient
 * fill, with a moving hover marker and gridlines. Pure SVG, no chart library.
 */
export function AreaChart({ data }: { data: SeriesPoint[] }) {
  const reduce = useReducedMotion();
  const gradientId = useId();
  const [hover, setHover] = useState<number | null>(null);

  const values = data.map((d) => d.value);
  const pts = toPoints(values, W, H, PAD_Y);
  const first = pts[0];
  const last = pts[pts.length - 1];

  const line = smoothPath(pts);
  const area =
    first && last ? `${line} L ${last.x} ${H - PAD_Y} L ${first.x} ${H - PAD_Y} Z` : '';
  const gridY = [0.25, 0.5, 0.75].map((f) => PAD_Y + f * (H - PAD_Y * 2));

  const active = hover === null ? null : (pts[hover] ?? null);
  const activePoint = hover === null ? null : (data[hover] ?? null);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Onboarding completion over the last twelve weeks"
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--hm-honey)" stopOpacity="0.32" />
            <stop offset="100%" stopColor="var(--hm-honey)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {gridY.map((y) => (
          <line key={y} x1={PAD_X} y1={y} x2={W - PAD_X} y2={y} stroke="var(--hm-border)" strokeWidth={1} />
        ))}

        <motion.path
          d={area}
          fill={`url(#${gradientId})`}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke="var(--hm-honey)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Invisible hover zones per data point. */}
        {pts.map((p, i) => (
          <rect
            key={i}
            x={p.x - (W / pts.length) / 2}
            y={0}
            width={W / pts.length}
            height={H}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}

        {active && (
          <g>
            <line x1={active.x} y1={PAD_Y} x2={active.x} y2={H - PAD_Y} stroke="var(--hm-honey)" strokeWidth={1} strokeDasharray="4 4" />
            <circle cx={active.x} cy={active.y} r={6} fill="var(--hm-honey)" stroke="var(--hm-surface)" strokeWidth={3} />
          </g>
        )}
      </svg>

      {active && activePoint && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-xl border border-border bg-surface px-3 py-1.5 text-xs shadow-[var(--shadow-lift)]"
          style={{ left: `${(active.x / W) * 100}%`, top: `${(active.y / H) * 100}%` }}
        >
          <span className="font-semibold text-ink">{activePoint.value}%</span>
          <span className="ml-1 text-muted">{activePoint.label}</span>
        </div>
      )}

      <div className="mt-2 flex justify-between px-1 text-[10px] text-muted">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}
