import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Whobee } from '@/components/assistant/whobee';
import { Reveal } from '@/components/motion/reveal';

/**
 * The hive Whobee comes out of.
 *
 * Replaces the old Spline robot panel. Scroll progress through this section
 * drives Whobee up and out of the centre cell of a honeycomb: as you scroll he
 * climbs clear of the comb, drifts right, and fades, and by the time the
 * section has left the viewport the docked launcher in the corner has taken
 * over (see use-section-visible.ts wired up in screens/landing.tsx). The
 * handoff is what makes the corner bee feel like the same bee that just left
 * the hive, rather than a second one appearing from nowhere.
 *
 * Under prefers-reduced-motion the bee simply sits in the comb, no scroll
 * coupled movement at all, matching every other motion component here.
 */

/** A honeycomb cell. Same hexagon geometry as ui/hex-frame and the logo mark. */
function Cell({ filled = false, className = '' }: { filled?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={`block ${className}`}
      style={{
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        background: filled
          ? 'color-mix(in oklab, var(--hm-honey) 30%, transparent)'
          : 'color-mix(in oklab, var(--hm-honey) 12%, transparent)',
      }}
    />
  );
}

export function HiveSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // 'start end' to 'end start': 0 when the section's top first meets the
  // bottom of the viewport, 1 once its bottom has passed the top.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Whobee holds still in the comb through the first third, then climbs out and
  // heads for the corner. Ranges are deliberately late so he is still visible
  // while the copy is being read.
  const beeY = useTransform(scrollYProgress, [0.3, 0.75], [0, -190]);
  const beeX = useTransform(scrollYProgress, [0.3, 0.75], [0, 130]);
  const beeScale = useTransform(scrollYProgress, [0.3, 0.75], [1, 0.45]);
  const beeOpacity = useTransform(scrollYProgress, [0.55, 0.78], [1, 0]);
  const beeRotate = useTransform(scrollYProgress, [0.3, 0.75], [0, 18]);

  return (
    <div
      ref={ref}
      className="relative my-12 w-full overflow-hidden rounded-3xl border border-border/80 bg-surface/90 shadow-2xl backdrop-blur-2xl"
    >
      <div className="relative z-10 border-b border-border/60 bg-surface/80 p-6 text-center backdrop-blur-md sm:p-8">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-honey/40 bg-honey-wash/90 px-4 py-1 text-xs font-bold uppercase tracking-wider text-honey-deep">
          Meet your guide
        </span>
        <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          This is Whobee
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-xs font-medium text-muted sm:text-sm">
          Keep scrolling and Whobee leaves the hive to follow you. He stays in the
          corner from then on, ready with the basics: what to do today, who to ask,
          where a document lives.
        </p>
      </div>

      <div className="relative h-[420px] w-full overflow-hidden bg-sunk/40">
        {/* The comb. A static lattice, purely decorative, sitting behind the bee. */}
        <div
          aria-hidden
          className="absolute inset-0 grid place-items-center opacity-[0.55]"
        >
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {Array.from({ length: 20 }).map((_, i) => (
              <Cell
                key={i}
                filled={i === 12}
                className="h-12 w-11 sm:h-16 sm:w-14"
              />
            ))}
          </div>
        </div>

        {/* Whobee, anchored over the highlighted cell. */}
        <div className="absolute inset-0 grid place-items-center">
          <motion.div
            style={
              reduce
                ? undefined
                : {
                    y: beeY,
                    x: beeX,
                    scale: beeScale,
                    opacity: beeOpacity,
                    rotate: beeRotate,
                  }
            }
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -7, 0] }}
              transition={
                reduce
                  ? undefined
                  : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <Whobee size={96} />
            </motion.div>
          </motion.div>
        </div>

        <Reveal className="absolute bottom-5 left-0 right-0 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Scroll on, he will follow
          </span>
        </Reveal>
      </div>
    </div>
  );
}
