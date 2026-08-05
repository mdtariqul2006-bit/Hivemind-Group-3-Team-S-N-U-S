import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useAssistant } from '@/state/assistant-context';
import { AssistantPanel } from '@/components/assistant/assistant-panel';
import { Whobee } from '@/components/assistant/whobee';
import { EASE_OUT, springPop } from '@/lib/motion';

const PANEL_TITLE_ID = 'assistant-panel-title';

/**
 * The honeycomb cell Whobee arrives out of, scaling down and dissolving behind
 * him as he scales up in front of it. Same hexagon clip-path as ui/hex-frame
 * and the logo mark, so the entrance lands in the brand's motif rather than a
 * generic circle.
 */
function HexBurst() {
  return (
    <motion.span
      aria-hidden
      className="absolute inset-0"
      style={{
        background: 'var(--hm-honey)',
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      }}
      initial={{ scale: 1.7, opacity: 0.95, rotate: 0 }}
      animate={{ scale: 0, opacity: 0, rotate: 55 }}
      transition={{ duration: 0.65, ease: EASE_OUT }}
    />
  );
}

/**
 * Whobee docked in the bottom right corner, on every screen except admin.
 *
 * Renders nothing until the assistant has "entered", which the landing page
 * triggers as the hive section scrolls past (see components/assistant/
 * hive-section.tsx and hooks/use-section-visible.ts). The flight out of the
 * hive and this arrival are two halves of one move, so the corner bee reads as
 * the same bee that just left the comb.
 *
 * The full arrival flourish only plays the first time this component mounts
 * having not already entered. A session already flagged as entered, a returning
 * mid-session user or someone who never saw the landing page, skips straight to
 * the docked bee rather than replaying it on every route change.
 */
export function AssistantLauncher() {
  const { hasEntered, isOpen, toggle } = useAssistant();
  const reduce = useReducedMotion();
  const wasAlreadyEnteredOnMount = useRef(hasEntered);

  if (!hasEntered) return null;

  const playFullEntrance = !wasAlreadyEnteredOnMount.current && !reduce;

  return (
    <>
      <AssistantPanel labelledBy={PANEL_TITLE_ID} />
      <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
        <motion.button
          onClick={toggle}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close Whobee, the onboarding assistant' : 'Open Whobee, the onboarding assistant'}
          // Arrives from up and to the left, continuing the arc he flew out of
          // the hive on, rather than simply popping into place.
          initial={playFullEntrance ? { scale: 0, rotate: -35, x: -60, y: -40 } : false}
          animate={{ scale: 1, rotate: 0, x: 0, y: 0 }}
          transition={playFullEntrance ? { ...springPop, delay: 0.2 } : { duration: 0 }}
          whileHover={reduce ? undefined : { scale: 1.08 }}
          whileTap={reduce ? undefined : { scale: 0.94 }}
          className="relative grid h-16 w-16 place-items-center overflow-visible rounded-full bg-surface/80 shadow-[var(--shadow-lift)] ring-1 ring-honey/45 backdrop-blur-md"
        >
          {playFullEntrance && <HexBurst />}
          {/* A slow hover bob, so he reads as flying in place rather than
              parked. Stops entirely under reduced motion. */}
          <motion.span
            className="relative block"
            animate={reduce ? undefined : { y: [0, -3.5, 0] }}
            transition={
              reduce ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            <Whobee size={44} glow={false} still={isOpen} />
          </motion.span>
        </motion.button>
      </div>
    </>
  );
}
