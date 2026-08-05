import { motion, useReducedMotion } from 'framer-motion';

/**
 * Whobee, the HiveMind mascot.
 *
 * Deliberately vector rather than a 3D model or a Spline scene. The bee is the
 * same creature the honeycomb background already draws (see
 * components/motion/honeycomb-canvas.tsx, drawBee): amber body with dark
 * banding, two pale oscillating wings, an amber glow. Keeping the mascot and
 * the ambient flock visually identical means Whobee reads as one of the bees
 * that has come to the front, rather than a separate character.
 *
 * Every colour is a brand custom property, so light and dark themes are handled
 * for free and nothing is baked in the way a downloaded model's textures would
 * be. The whole component is a few kilobytes and needs no runtime, no network
 * request, and no third party attribution.
 */

interface WhobeeProps {
  size?: number;
  /** Wings still, for a paused or reduced-motion state. */
  still?: boolean;
  className?: string;
  /** Softens the glow when the bee sits on an already-bright surface. */
  glow?: boolean;
}

export function Whobee({ size = 56, still = false, className, glow = true }: WhobeeProps) {
  const reduce = useReducedMotion();
  const animateWings = !still && !reduce;

  // One flap cycle. Framer drives the transform on the wing groups directly so
  // the whole thing stays on the compositor.
  const wingTransition = {
    duration: 0.18,
    repeat: Infinity,
    repeatType: 'reverse' as const,
    ease: 'easeInOut' as const,
  };

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Whobee, the HiveMind assistant"
      overflow="visible"
    >
      <defs>
        <radialGradient id="whobee-glow">
          <stop offset="0%" stopColor="var(--hm-honey)" stopOpacity="0.34" />
          <stop offset="100%" stopColor="var(--hm-honey)" stopOpacity="0" />
        </radialGradient>
        {/* Mixed rather than honey to honey-deep: in dark mode honey-deep is
            defined as honey itself, which would flatten the gradient. */}
        <linearGradient id="whobee-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--hm-honey)" />
          <stop offset="100%" stopColor="color-mix(in oklab, var(--hm-honey) 70%, #6b3d00)" />
        </linearGradient>
      </defs>

      {glow && <circle cx="50" cy="52" r="42" fill="url(#whobee-glow)" />}

      {/* Wings sit behind the body, mirrored, each rotating about its own root
          so the flap reads as a hinge rather than a slide. */}
      <motion.g
        style={{ originX: '46px', originY: '40px' }}
        animate={animateWings ? { rotate: [-16, 10] } : { rotate: -6 }}
        transition={animateWings ? wingTransition : { duration: 0 }}
      >
        <ellipse
          cx="34"
          cy="33"
          rx="17"
          ry="9"
          fill="var(--hm-wing, rgba(56,60,66,0.28))"
          transform="rotate(-24 34 33)"
        />
      </motion.g>
      <motion.g
        style={{ originX: '54px', originY: '40px' }}
        animate={animateWings ? { rotate: [16, -10] } : { rotate: 6 }}
        transition={animateWings ? wingTransition : { duration: 0 }}
      >
        <ellipse
          cx="66"
          cy="33"
          rx="17"
          ry="9"
          fill="var(--hm-wing, rgba(56,60,66,0.28))"
          transform="rotate(24 66 33)"
        />
      </motion.g>

      {/* Body */}
      <ellipse cx="50" cy="55" rx="25" ry="19" fill="url(#whobee-body)" />

      {/* Banding, clipped to the body so the stripes follow its silhouette. */}
      <clipPath id="whobee-body-clip">
        <ellipse cx="50" cy="55" rx="25" ry="19" />
      </clipPath>
      <g clipPath="url(#whobee-body-clip)" fill="var(--hm-charcoal, #383c42)" opacity="0.62">
        <rect x="52" y="34" width="7" height="42" rx="3" />
        <rect x="64" y="34" width="6" height="42" rx="3" />
      </g>

      {/* Face: two eyes and a small smile, the only part that is not shared with
          the ambient flock. It is what turns a background bee into a mascot. */}
      <circle cx="38" cy="51" r="3.6" fill="var(--hm-charcoal, #383c42)" />
      <circle cx="49" cy="51" r="3.6" fill="var(--hm-charcoal, #383c42)" />
      <circle cx="39.2" cy="49.8" r="1.2" fill="#fff" opacity="0.9" />
      <circle cx="50.2" cy="49.8" r="1.2" fill="#fff" opacity="0.9" />
      <path
        d="M38 60 Q43.5 64 49 60"
        stroke="var(--hm-charcoal, #383c42)"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />

      {/* Antennae */}
      <g
        stroke="var(--hm-charcoal, #383c42)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      >
        <path d="M40 38 Q36 30 32 27" />
        <path d="M50 37 Q52 29 56 26" />
      </g>
      <circle cx="31.4" cy="26.2" r="2.4" fill="var(--hm-honey)" />
      <circle cx="56.6" cy="25.2" r="2.4" fill="var(--hm-honey)" />
    </svg>
  );
}
