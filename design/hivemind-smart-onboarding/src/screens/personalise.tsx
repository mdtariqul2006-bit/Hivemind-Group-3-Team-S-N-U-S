import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useOnboarding } from '@/state/onboarding-context';
import { LEARNING_STYLES, ROLES } from '@/data/roles';
import type { LearningStyle, RoleId } from '@/types';
import { Button } from '@/components/ui/button';
import { GlowCard } from '@/components/motion/glow-card';
import { HexFrame } from '@/components/ui/hex-frame';
import { formatStartDate } from '@/lib/format';
import { EASE_OUT } from '@/lib/motion';
import { cn } from '@/lib/cn';

const STEPS = ['role', 'date', 'style'] as const;
type Step = (typeof STEPS)[number];

export function Personalise() {
  const reduce = useReducedMotion();
  const { state, dispatch } = useOnboarding();
  const [step, setStep] = useState<Step>('role');
  const [dir, setDir] = useState(1);

  const index = STEPS.indexOf(step);
  const canAdvance =
    (step === 'role' && state.role) ||
    (step === 'date' && state.startDate) ||
    (step === 'style' && state.learningStyle);

  function go(next: Step, direction: number) {
    setDir(direction);
    setStep(next);
  }

  function next() {
    if (step === 'role') go('date', 1);
    else if (step === 'date') go('style', 1);
    else dispatch({ type: 'finish-wizard' });
  }

  function back() {
    if (step === 'role') dispatch({ type: 'go', view: 'landing' });
    else if (step === 'date') go('role', -1);
    else go('date', -1);
  }

  const variants = {
    enter: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * -40 }),
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-3xl flex-col px-5 py-8">
      {/* Wizard progress bar */}
      <div className="mb-2 flex items-center justify-between text-sm text-muted">
        <span>Step {index + 1} of 3</span>
        <span>{Math.round(((index + 1) / 3) * 100)}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-sunk">
        <motion.div
          className="h-full rounded-full gradient-hm"
          animate={{ width: `${((index + 1) / 3) * 100}%` }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE_OUT }}
        />
      </div>

      <div className="relative mt-10 flex-1">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduce ? { duration: 0.15 } : { duration: 0.4, ease: EASE_OUT }}
          >
            {step === 'role' && <RoleStep />}
            {step === 'date' && <DateStep />}
            {step === 'style' && <StyleStep />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={back} iconLeft={<ArrowLeft className="h-4 w-4" />}>
          {step === 'role' ? 'Back to welcome' : 'Back'}
        </Button>
        <Button
          onClick={next}
          disabled={!canAdvance}
          iconRight={
            step === 'style' ? <Check className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />
          }
        >
          {step === 'style' ? 'Build my plan' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}

function StepHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-7">
      <h1 className="text-3xl font-semibold text-ink">{title}</h1>
      <p className="mt-2 text-muted">{sub}</p>
    </div>
  );
}

function RoleStep() {
  const { state, dispatch } = useOnboarding();
  return (
    <div>
      <StepHeading
        title="Which team are you joining?"
        sub="Your plan is built around this, a designer, an engineer and a marketer each get a genuinely different first week."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {ROLES.map((role) => {
          const selected = state.role === role.id;
          return (
            <GlowCard key={role.id} className={cn(selected && 'ring-2 ring-honey')}>
              <button
                onClick={() => dispatch({ type: 'set-role', role: role.id as RoleId })}
                aria-pressed={selected}
                className="flex h-full w-full flex-col p-5 text-left"
              >
                <div className="flex items-center justify-between">
                  <HexFrame accent={selected ? 'honey' : 'sage'} size={44}>
                    <span className="text-lg font-bold text-charcoal">{role.label[0]}</span>
                  </HexFrame>
                  {selected && (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-honey text-charcoal">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{role.label}</h3>
                <p className="text-sm text-muted">{role.blurb}</p>
                <p className="mt-3 text-xs text-muted">
                  <span className="font-medium text-ink">You’ll start with:</span> {role.preview}
                </p>
              </button>
            </GlowCard>
          );
        })}
      </div>
    </div>
  );
}

function DateStep() {
  const { state, dispatch } = useOnboarding();
  return (
    <div>
      <StepHeading
        title="When’s your first day?"
        sub="We anchor Day 1, Week 1 and Month 1 to this date so every step lands when it should."
      />
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
        <label htmlFor="start-date" className="text-sm font-medium text-ink">
          Start date
        </label>
        <input
          id="start-date"
          type="date"
          value={state.startDate ?? ''}
          onChange={(e) => dispatch({ type: 'set-start-date', date: e.target.value })}
          className="mt-2 w-full rounded-2xl border border-border bg-canvas px-4 py-3 text-ink outline-none focus-visible:outline-2 focus-visible:outline-honey"
        />
        {state.startDate && (
          <p className="mt-4 rounded-2xl bg-honey-wash px-4 py-3 text-sm text-honey-deep">
            Your first day is <span className="font-semibold">{formatStartDate(state.startDate)}</span>.
            We’ll have everything ready the night before.
          </p>
        )}
      </div>
    </div>
  );
}

function StyleStep() {
  const { state, dispatch } = useOnboarding();
  return (
    <div>
      <StepHeading
        title="How do you like to learn?"
        sub="Each step comes in a few formats. Tell us your default and we’ll lead with it. You can always switch."
      />
      <div className="grid gap-4">
        {LEARNING_STYLES.map((s) => {
          const selected = state.learningStyle === s.id;
          return (
            <button
              key={s.id}
              onClick={() => dispatch({ type: 'set-learning-style', style: s.id as LearningStyle })}
              aria-pressed={selected}
              className={cn(
                'flex items-center gap-4 rounded-3xl border p-5 text-left transition-colors',
                selected
                  ? 'border-honey bg-honey-wash'
                  : 'border-border bg-surface hover:bg-sunk',
              )}
            >
              <span
                className={cn(
                  'grid h-6 w-6 shrink-0 place-items-center rounded-full border-2',
                  selected ? 'border-honey bg-honey text-charcoal' : 'border-border',
                )}
              >
                {selected && <Check className="h-4 w-4" strokeWidth={3} />}
              </span>
              <div>
                <h3 className="font-semibold text-ink">{s.label}</h3>
                <p className="text-sm text-muted">{s.blurb}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
