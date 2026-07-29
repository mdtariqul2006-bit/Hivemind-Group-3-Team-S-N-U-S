import { motion, useReducedMotion } from 'framer-motion';

/**
 * A light, web-only floating honeycomb object for the hero, a CSS/SVG hex cluster
 * rather than a real 3D scene, as the brief asks. Cells breathe on staggered loops;
 * under reduced motion they hold still and simply read as the brand mark writ large.
 */
export function HeroHive({ size = 340 }: { size?: number }) {
  const reduce = useReducedMotion();

  const cells = [
    { x: 0, y: 0, r: 1, fill: 'gradient', delay: 0 },
    { x: 0, y: -1, r: 0.82, fill: 'honey', delay: 0.2 },
    { x: 0.87, y: -0.5, r: 0.82, fill: 'pink', delay: 0.4 },
    { x: 0.87, y: 0.5, r: 0.7, fill: 'sage', delay: 0.6 },
    { x: 0, y: 1, r: 0.82, fill: 'honey', delay: 0.3 },
    { x: -0.87, y: 0.5, r: 0.82, fill: 'pink', delay: 0.5 },
    { x: -0.87, y: -0.5, r: 0.7, fill: 'sage', delay: 0.1 },
  ];

  const unit = size * 0.19;
  const cx = size / 2;
  const cy = size / 2;

  function hex(x: number, y: number, r: number): string {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 180) * (60 * i - 90);
      return `${(x + r * Math.cos(a)).toFixed(1)} ${(y + r * Math.sin(a)).toFixed(1)}`;
    });
    return 'M' + pts.join('L') + 'Z';
  }

  const fillFor = (f: string) =>
    f === 'gradient'
      ? 'url(#hero-grad)'
      : f === 'honey'
        ? 'var(--hm-honey)'
        : f === 'pink'
          ? 'var(--hm-pink)'
          : 'var(--hm-sage)';

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="drop-shadow-[0_24px_48px_rgba(56,60,66,0.18)]"
      aria-hidden
    >
      <defs>
        <linearGradient id="hero-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--hm-honey)" />
          <stop offset="100%" stopColor="var(--hm-pink)" />
        </linearGradient>
      </defs>
      {cells.map((c, i) => {
        const px = cx + c.x * unit * 1.75;
        const py = cy + c.y * unit * 1.52;
        const r = unit * c.r;
        return (
          <motion.path
            key={i}
            d={hex(px, py, r)}
            fill={fillFor(c.fill)}
            fillOpacity={c.fill === 'sage' ? 0.55 : 0.95}
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            animate={
              reduce
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    scale: 1,
                    y: [0, -6, 0],
                  }
            }
            transition={
              reduce
                ? { duration: 0 }
                : {
                    opacity: { duration: 0.5, delay: c.delay },
                    scale: { duration: 0.6, delay: c.delay, ease: [0.22, 1, 0.36, 1] },
                    y: {
                      duration: 5 + i * 0.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: c.delay,
                    },
                  }
            }
            style={{ transformOrigin: `${px}px ${py}px` }}
          />
        );
      })}
    </svg>
  );
}
