import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Share2 } from 'lucide-react';
import { useOnboarding } from '@/state/onboarding-context';
import { useToast } from '@/state/toast-context';
import { useMember, firstNameFor } from '@/state/member-context';
import { NEW_HIRE, PHASE_BY_ID, ROLES } from '@/data/roles';
import type { PhaseId } from '@/types';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/ui/rating';
import { Confetti } from '@/components/ui/confetti';
import { HexFrame } from '@/components/ui/hex-frame';
import { EASE_OUT } from '@/lib/motion';

/**
 * The emotional payoff. When a phase completes, the honeycomb bursts into full
 * colour, confetti falls, and the new hire gets a warm, earned message plus a
 * shareable "settling-in" summary. Rendered only when a phase was newly completed.
 */
export function Milestone({ phaseId }: { phaseId: PhaseId }) {
  const reduce = useReducedMotion();
  const { state, dispatch, progress, tasks } = useOnboarding();
  const { push } = useToast();
  const { user } = useMember();
  // Matches the dashboard greeting: the member's own name when signed in,
  // NEW_HIRE for the signed out demo path.
  const greetingName = user ? firstNameFor(user) || NEW_HIRE : NEW_HIRE;
  const [rating, setRating] = useState(0);

  const phase = PHASE_BY_ID[phaseId];
  const roleLabel = ROLES.find((r) => r.id === state.role)?.label ?? '';
  const doneCount = state.completedTaskIds.length;

  function close() {
    dispatch({ type: 'dismiss-celebration' });
  }

  function rate(value: number) {
    setRating(value);
    push('Thanks. That helps us make onboarding better for the next person.', 'sage');
  }

  return (
    <Modal open onClose={close} labelledBy="milestone-title">
      <div className="relative text-center">
        <Confetti origin="top" count={36} />

        <motion.div
          className="mx-auto"
          initial={reduce ? false : { scale: 0.5, opacity: 0, rotate: -12 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={reduce ? { duration: 0.15 } : { type: 'spring', stiffness: 260, damping: 18 }}
        >
          <HexFrame accent="honey" size={84} className="mx-auto">
            <span className="numeral text-2xl text-charcoal">{phase.label.split(' ')[1]}</span>
          </HexFrame>
        </motion.div>

        <motion.h2
          id="milestone-title"
          className="mt-6 text-2xl font-semibold text-ink"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 }}
        >
          {phase.celebration.title}
        </motion.h2>
        <motion.p
          className="mx-auto mt-2 max-w-sm text-muted"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.18 }}
        >
          {phase.celebration.body}
        </motion.p>

        {/* Shareable settling-in summary */}
        <div className="mt-6 rounded-3xl border border-border bg-sunk p-5 text-left">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Your settling-in summary
          </p>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="numeral text-3xl text-ink">{progress}%</p>
              <p className="text-xs text-muted">settled in</p>
            </div>
            <div className="text-right">
              <p className="numeral text-3xl text-ink">
                {doneCount}
                <span className="text-lg text-muted">/{tasks.length}</span>
              </p>
              <p className="text-xs text-muted">steps done</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-ink">{roleLabel}</p>
              <p className="text-xs text-muted">at Northwind</p>
            </div>
          </div>
        </div>

        {/* How did it feel? */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-sm text-muted">How did {phase.label.toLowerCase()} feel, {greetingName}?</p>
          <Rating value={rating} onChange={rate} label={`Rate ${phase.label}`} />
        </div>

        <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            variant="secondary"
            iconLeft={<Share2 className="h-4 w-4" />}
            onClick={() => push('Summary copied. Ready to share with your buddy or manager.')}
          >
            Share my progress
          </Button>
          <Button onClick={close} iconRight={<ArrowRight className="h-5 w-5" />}>
            Keep going
          </Button>
        </div>
      </div>
    </Modal>
  );
}
