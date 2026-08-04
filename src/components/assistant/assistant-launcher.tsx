import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useAssistant } from '@/state/assistant-context';
import { AssistantPanel } from '@/components/assistant/assistant-panel';
import { EASE_OUT, springPop } from '@/lib/motion';

const PANEL_TITLE_ID = 'assistant-panel-title';

/**
 * A decorative hexagon that scales down and dissolves as the bubble scales
 * up in front of it, the "climbs out of the box" moment. Same hexagon
 * clip-path as ui/hex-frame.tsx, the brand's motif at logo scale.
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
 * The docked launcher bubble, bottom right on every screen except admin.
 * Renders nothing until the assistant has "entered" (see
 * state/assistant-context.tsx and use-section-visible.ts for the trigger).
 * Only plays the box-opening flourish the first time it appears in this
 * component's lifetime, a session already flagged as entered (returning
 * mid-session, or a user who never saw the landing page this session) skips
 * straight to the plain docked bubble instead of replaying it on every route.
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
          aria-label={isOpen ? 'Close onboarding assistant' : 'Open onboarding assistant'}
          initial={playFullEntrance ? { scale: 0, rotate: -35 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={playFullEntrance ? { ...springPop, delay: 0.2 } : { duration: 0 }}
          whileTap={reduce ? undefined : { scale: 0.94 }}
          className="relative grid h-14 w-14 place-items-center overflow-visible rounded-full gradient-hm text-charcoal shadow-[var(--shadow-lift)]"
        >
          {playFullEntrance && <HexBurst />}
          <MessageCircle className="relative h-6 w-6" />
        </motion.button>
      </div>
    </>
  );
}
