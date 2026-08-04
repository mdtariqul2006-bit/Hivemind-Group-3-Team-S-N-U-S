import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { toPoints, smoothPath } from './chart-utils';

const ACCENTS = {
  honey: 'var(--hm-honey)',
  pink: 'var(--hm-pink)',
  sage: 'var(--hm-sage)',
} as const;

/** A tiny trend line with a soft fill, used inside the KPI stat cards. */
export function Sparkline({
  data,
  accent = 'honey',
  width = 120,
  height = 40,
}: {
  data: number[];
  accent?: keyof typeof ACCENTS;
  width?: number;
  height?: number;
}) {
  const reduce = useReducedMotion();
  const gradientId = useId();
  const pad = 3;
  const pts = toPoints(data, width, height, pad);
  const first = pts[0];
  const last = pts[pts.length - 1];
  if (!first || !last) return null;

  const line = smoothPath(pts);
  const area = `${line} L ${last.x} ${height} L ${first.x} ${height} Z`;
  const stroke = ACCENTS[accent];

  return (
    // No fixed pixel width: the viewBox keeps the aspect ratio while w-full lets
    // the line shrink with its card. A hard width clipped the most recent point
    // inside the overflow-hidden stat card at common laptop widths.
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      className="block w-full"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <motion.path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}
