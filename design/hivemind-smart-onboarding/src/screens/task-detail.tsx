import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Info, Users } from 'lucide-react';
import { useOnboarding } from '@/state/onboarding-context';
import { useToast } from '@/state/toast-context';
import { LEARNING_STYLES } from '@/data/roles';
import type { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HexFrame } from '@/components/ui/hex-frame';
import { Confetti } from '@/components/ui/confetti';
import { taskIcon } from '@/lib/task-icons';
import { EASE_OUT, springSoft } from '@/lib/motion';
import { formatMinutes } from '@/lib/format';
import { cn } from '@/lib/cn';

const KIND_LABEL: Record<string, string> = {
  orient: 'Get oriented',
  do: 'Do this',
  watch: 'Watch',
  read: 'Read',
  practice: 'Practise',
  note: 'Good to know',
};

/**
 * The shared-element task detail. It shares `layoutId="task-{id}"` with the card on
 * the dashboard, so opening expands the card into this focused view and completing
 * collapses it back, the motion tells you exactly where the view came from.
 */
export function TaskDetail({ task }: { task: Task }) {
  const reduce = useReducedMotion();
  const { state, dispatch } = useOnboarding();
  const { push } = useToast();
  const done = state.completedTaskIds.includes(task.id);

  const [cardIndex, setCardIndex] = useState(0);
  const [justCompleted, setJustCompleted] = useState(false);

  const Icon = taskIcon(task.icon);
  const checked = state.checkedItems[task.id] ?? [];
  const styleCopy =
    state.learningStyle && task.formats[state.learningStyle]
      ? { style: state.learningStyle, text: task.formats[state.learningStyle] }
      : null;

  const atLastCard = cardIndex >= task.cards.length - 1;

  function complete() {
    if (done) {
      dispatch({ type: 'close-task' });
      return;
    }
    if (justCompleted) return;
    // Let the confetti play, then collapse back to the dashboard.
    setJustCompleted(true);
    window.setTimeout(
      () => {
        dispatch({ type: 'complete-task', task });
        push(`Nice work. “${task.title}” is done.`);
      },
      reduce ? 0 : 620,
    );
  }

  return (
    // data-lenis-prevent keeps Lenis's global smooth-scroll from swallowing wheel
    // events here, so this overlay scrolls natively on its own content.
    <div
      className="fixed inset-0 z-40 overflow-y-auto bg-scrim backdrop-blur-sm"
      data-lenis-prevent
    >
      <div className="min-h-full px-4 py-6 sm:px-6 sm:py-10">
        <motion.article
          layoutId={reduce ? undefined : `task-${task.id}`}
          className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-lift)]"
        >
          {justCompleted && <Confetti origin="top" />}

          {/* Header */}
          <div className="relative border-b border-border p-6 sm:p-8">
            <div
              aria-hidden
              className="absolute -right-12 -top-12 h-44 w-44 rounded-full gradient-hm opacity-[0.12] blur-2xl"
            />
            <button
              onClick={() => dispatch({ type: 'close-task' })}
              className="mb-5 inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" /> Back to your plan
            </button>
            <div className="flex items-start gap-4">
              <HexFrame accent={done ? 'honey' : 'sage'} size={54}>
                <Icon className="h-6 w-6 text-charcoal" strokeWidth={1.9} />
              </HexFrame>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="muted">{formatMinutes(task.minutes)}</Badge>
                  {done && <Badge tone="honey">Completed</Badge>}
                </div>
                <h1 className="mt-2 text-2xl font-semibold text-ink">{task.title}</h1>
                <p className="mt-1 text-muted">{task.summary}</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Micro-learning card stack */}
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted">
                  Card {cardIndex + 1} of {task.cards.length}
                </span>
                <div className="flex gap-1.5">
                  {task.cards.map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        'h-1.5 rounded-full transition-all',
                        i === cardIndex ? 'w-6 bg-honey' : 'w-1.5 bg-border',
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="relative min-h-[190px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={cardIndex}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, x: -30 }}
                    transition={reduce ? { duration: 0.15 } : { duration: 0.32, ease: EASE_OUT }}
                    className="rounded-3xl border border-border bg-sunk p-6"
                  >
                    <Badge tone="pink">{KIND_LABEL[task.cards[cardIndex]!.kind]}</Badge>
                    <h3 className="mt-3 text-lg font-semibold text-ink">
                      {task.cards[cardIndex]!.title}
                    </h3>
                    <p className="mt-2 text-muted">{task.cards[cardIndex]!.body}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setCardIndex((i) => Math.max(0, i - 1))}
                  disabled={cardIndex === 0}
                  iconLeft={<ArrowLeft className="h-4 w-4" />}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setCardIndex((i) => Math.min(task.cards.length - 1, i + 1))}
                  disabled={atLastCard}
                  iconRight={<ArrowRight className="h-4 w-4" />}
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Learning-style tailored line */}
            {styleCopy && (
              <div className="mt-6 rounded-2xl bg-honey-wash p-4">
                <p className="text-sm text-honey-deep">
                  <span className="font-semibold">
                    Because you like to{' '}
                    {LEARNING_STYLES.find((s) => s.id === styleCopy.style)?.label.toLowerCase()}:
                  </span>{' '}
                  {styleCopy.text}
                </p>
              </div>
            )}

            {/* Checklist */}
            <div className="mt-7">
              <h4 className="mb-3 text-sm font-semibold text-ink">Quick checklist</h4>
              <ul className="flex flex-col gap-2">
                {task.checklist.map((item) => {
                  const isChecked = checked.includes(item.id);
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() =>
                          dispatch({ type: 'toggle-check', taskId: task.id, itemId: item.id })
                        }
                        className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-3 text-left transition-colors hover:bg-sunk"
                        aria-pressed={isChecked}
                      >
                        <CheckBox checked={isChecked} />
                        <span className={cn('text-sm', isChecked ? 'text-muted line-through' : 'text-ink')}>
                          {item.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Trust & clarity: why this, where from */}
            <div className="mt-7 grid gap-3 rounded-2xl border border-border bg-sage-wash p-4 sm:grid-cols-2">
              <div className="flex gap-2.5">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                <p className="text-xs text-ink">
                  <span className="font-semibold">Why you’re seeing this: </span>
                  {task.why}
                </p>
              </div>
              <div className="flex gap-2.5">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                <p className="text-xs text-ink">
                  <span className="font-semibold">Where it’s from: </span>
                  {task.source}
                </p>
              </div>
            </div>

            {/* Complete */}
            <div className="mt-8 flex justify-end">
              <Button
                onClick={complete}
                disabled={!done && justCompleted}
                iconRight={done ? undefined : <Check className="h-5 w-5" strokeWidth={2.5} />}
              >
                {done ? 'Back to your plan' : 'Mark complete'}
              </Button>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}

function CheckBox({ checked }: { checked: boolean }) {
  const reduce = useReducedMotion();
  return (
    <span
      className={cn(
        'grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 transition-colors',
        checked ? 'border-honey bg-honey' : 'border-border',
      )}
    >
      <AnimatePresence>
        {checked && (
          <motion.span
            initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={springSoft}
          >
            <Check className="h-4 w-4 text-charcoal" strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
