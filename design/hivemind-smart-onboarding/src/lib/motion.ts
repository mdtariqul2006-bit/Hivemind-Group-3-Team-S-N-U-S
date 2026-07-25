import type { Transition, Variants } from 'framer-motion';

/**
 * One motion language, defined once.
 *
 * Rule from the brief: ease (never bounce) for anything large, and reserve
 * spring/overshoot for small delightful moments only. So `easeOut` is the soft
 * cubic-bezier used for every entrance and layout move, and `springSoft` /
 * `springPop` are used sparingly, button presses, checkmarks, milestone pops.
 *
 * All of this is gated at the call site by `useReducedMotion()`; when a user asks
 * for reduced motion we swap these for `instant` so nothing translates or scales.
 */

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const easeOut: Transition = {
  duration: 0.55,
  ease: EASE_OUT,
};

export const easeOutFast: Transition = {
  duration: 0.32,
  ease: EASE_OUT,
};

/** Small, gentle spring, shared-element expands, panel entrances. */
export const springSoft: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 34,
  mass: 0.9,
};

/** A little overshoot, checkmarks, milestone pops, the count-up settle. */
export const springPop: Transition = {
  type: 'spring',
  stiffness: 480,
  damping: 24,
  mass: 0.7,
};

/** Reduced-motion replacement: change state with no perceived movement. */
export const instant: Transition = { duration: 0 };

/** Rise + fade entrance, the workhorse. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: easeOut },
};

/** Stagger container, children cascade 40 to 60ms apart. */
export function staggerContainer(stagger = 0.05, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}

export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: easeOut },
};

/** Press feedback for interactive elements. */
export const pressable = {
  whileTap: { scale: 0.97 },
  transition: springPop,
} as const;
