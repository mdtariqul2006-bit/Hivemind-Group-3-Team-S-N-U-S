import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

/**
 * Decorative comb and bee for the two sign in screens.
 *
 * Deliberately not a full screen hex wallpaper. Two comb fragments sit in
 * opposite corners, the way a real piece of honeycomb breaks, and the middle is
 * left clear so the form never competes with the decoration. Only a few cells
 * carry honey, which is what makes it read as a comb rather than a texture.
 *
 * Each fragment is its own corner anchored SVG rather than one large viewBox.
 * A single wide viewBox scaled to cover a narrow phone screen crops its own
 * edges away, which left the comb invisible on mobile.
 *
 * Entirely presentational: aria-hidden, pointer-events-none, and it animates
 * only transform and opacity. Under prefers-reduced-motion nothing moves.
 */

const R = 26;
const HEX_W = Math.sqrt(3) * R;
const ROW_H = 1.5 * R;

/** Pointy top hexagon, matching LogoMark and HexFrame so it reads as the same object. */
function hexPath(cx: number, cy: number): string {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 90);
    return `${(cx + R * Math.cos(angle)).toFixed(2)},${(cy + R * Math.sin(angle)).toFixed(2)}`;
  });
  return `M${pts.join('L')}Z`;
}

/**
 * A broken off piece of comb. `filled` lists the cells that hold honey, kept
 * sparse so the fragment reads as a comb rather than a filled block.
 */
function CombFragment({
  rows,
  cols,
  filled,
  className,
}: {
  rows: number;
  cols: number;
  filled: number[];
  className?: string;
}) {
  const width = cols * HEX_W + HEX_W / 2 + R;
  const height = (rows - 1) * ROW_H + 2 * R + 4;

  const cells: Array<{ cx: number; cy: number; filled: boolean }> = [];
  let index = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cells.push({
        cx: HEX_W / 2 + col * HEX_W + (row % 2 ? HEX_W / 2 : 0),
        cy: R + 2 + row * ROW_H,
        filled: filled.includes(index),
      });
      index++;
    }
  }

  return (
    <svg
      viewBox={`0 0 ${width.toFixed(0)} ${height.toFixed(0)}`}
      className={cn('absolute', className)}
      fill="none"
    >
      {/* Static on purpose. The comb is the setting, the bee is the motion, and
          a staggered build on a sign in screen is one accessory too many. */}
      {cells.map((c, i) => (
        <path
          key={i}
          d={hexPath(c.cx, c.cy)}
          fill={c.filled ? 'var(--hm-honey)' : 'none'}
          fillOpacity={c.filled ? 0.3 : 0}
          stroke="var(--hm-honey)"
          strokeOpacity={c.filled ? 0.8 : 0.42}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

/** The bee, drawn rather than imported so it inherits the brand colours. */
function Bee({ flutter }: { flutter: boolean }) {
  const wing = flutter
    ? {
        scaleY: [1, 0.35, 1],
        transition: { duration: 0.18, repeat: Infinity, ease: 'easeInOut' as const },
      }
    : undefined;

  return (
    <svg width="46" height="34" viewBox="0 0 46 34" fill="none" aria-hidden>
      {/* Wings sit behind the body and beat independently. */}
      <motion.ellipse
        cx="20" cy="10" rx="9" ry="6"
        fill="var(--hm-sage)" opacity="0.55"
        style={{ transformOrigin: '20px 14px' }}
        animate={wing}
      />
      <motion.ellipse
        cx="30" cy="9" rx="7.5" ry="5"
        fill="var(--hm-sage)" opacity="0.45"
        style={{ transformOrigin: '30px 13px' }}
        animate={wing}
      />

      {/* Body: charcoal with honey bands, the brand pairing. */}
      <ellipse cx="26" cy="20" rx="13" ry="9" fill="var(--hm-charcoal)" />
      <path d="M22 12.2c2.6 1.1 4 4.2 4 7.8s-1.4 6.7-4 7.8" stroke="var(--hm-honey)" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M31 13.6c1.9 1.4 3 3.8 3 6.4s-1.1 5-3 6.4" stroke="var(--hm-honey)" strokeWidth="3.2" strokeLinecap="round" />

      {/* Head, eye, antennae. */}
      <circle cx="12.5" cy="19" r="6.5" fill="var(--hm-charcoal)" />
      {/* Fixed light tone, not var(--hm-canvas), which goes near black in dark
          mode and made the eye vanish against the charcoal head. */}
      <circle cx="10.6" cy="17.6" r="1.5" fill="#fbfaf7" />
      <path d="M11 12.5 8 7.5M14.5 12 13 6.5" stroke="var(--hm-charcoal)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="7" r="1.7" fill="var(--hm-honey)" />
      <circle cx="12.8" cy="6" r="1.7" fill="var(--hm-honey)" />
    </svg>
  );
}

export function HoneycombBackdrop({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  /** Wing beat and bob, shared by both bee placements. */
  const hover = reduce
    ? {}
    : {
        animate: { y: [0, -6, 0] },
        transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' as const },
      };

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {/* Warm light behind the comb, so the corners feel lit rather than papered. */}
      <div className="absolute -right-24 -top-24 h-[360px] w-[360px] rounded-full bg-honey/25 blur-[120px]" />
      <div className="absolute -bottom-28 -left-24 h-[320px] w-[320px] rounded-full bg-pink/20 blur-[120px]" />

      <CombFragment
        rows={4}
        cols={4}
        filled={[2, 5, 9]}
        className="-right-10 -top-8 w-[190px] sm:w-[260px] lg:w-[320px]"
      />
      <CombFragment
        rows={4}
        cols={4}
        filled={[1, 6, 10, 13]}
        className="-bottom-10 -left-10 w-[190px] sm:w-[260px] lg:w-[320px]"
      />

      {/* Desktop: the bee keeps to the margins rather than crossing the middle,
          so it never passes behind the card or over an input. */}
      <motion.div
        className="absolute left-0 top-0 hidden sm:block"
        initial={false}
        animate={
          reduce
            ? { x: '84vw', y: '14vh', rotate: 0 }
            : {
                x: ['7vw', '13vw', '9vw', '84vw', '90vw', '86vw', '15vw', '7vw'],
                y: ['76vh', '46vh', '20vh', '13vh', '42vh', '74vh', '82vh', '76vh'],
                rotate: [6, -6, 10, -10, 6, -4, 10, 6],
              }
        }
        transition={
          reduce
            ? { duration: 0 }
            : {
                duration: 26,
                repeat: Infinity,
                ease: 'easeInOut',
                // Uneven stops give it a drift and hover rhythm.
                times: [0, 0.14, 0.3, 0.44, 0.58, 0.72, 0.86, 1],
              }
        }
      >
        <motion.div {...hover} className="drop-shadow-[0_6px_10px_rgb(56_60_66_/_0.18)]">
          <Bee flutter={!reduce} />
        </motion.div>
      </motion.div>

      {/* Phones: the card fills the width, so there is no margin to fly through.
          The bee hovers by the top comb instead of crossing the form. */}
      <motion.div
        {...hover}
        className="absolute right-[42%] top-6 drop-shadow-[0_6px_10px_rgb(56_60_66_/_0.18)] sm:hidden"
      >
        <Bee flutter={!reduce} />
      </motion.div>
    </div>
  );
}
