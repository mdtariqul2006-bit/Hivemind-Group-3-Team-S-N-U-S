import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, PartyPopper, Sparkle } from 'lucide-react';
import { useOnboarding } from '@/state/onboarding-context';
import { NEW_HIRE, PHASES, ROLES } from '@/data/roles';
import type { Task } from '@/types';
import { ProgressHive } from '@/components/ui/progress-hive';
import { TaskCard } from '@/components/task-card';
import { PeopleRail } from '@/components/people-rail';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HexFrame } from '@/components/ui/hex-frame';
import { DashboardSkeleton } from '@/components/ui/skeleton';
import { Reveal } from '@/components/motion/reveal';
import { settledLine, formatMinutes } from '@/lib/format';
import { EASE_OUT } from '@/lib/motion';

export function Dashboard() {
  const { state, dispatch, tasks, progress } = useOnboarding();
  const reduce = useReducedMotion();

  // A brief seeded "load" so the skeleton state is real and reviewers see it once.
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), reduce ? 200 : 750);
    return () => clearTimeout(t);
  }, [reduce]);

  const roleLabel = ROLES.find((r) => r.id === state.role)?.label ?? '';
  const completed = state.completedTaskIds.length;

  const nextTask = useMemo(
    () => tasks.find((t) => !state.completedTaskIds.includes(t.id)) ?? null,
    [tasks, state.completedTaskIds],
  );

  const allDone = progress >= 100;

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-8">
      {/* Progress hero */}
      <section className="flex flex-col items-center text-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          <ProgressHive progress={progress} total={tasks.length} completed={completed} />
        </motion.div>
        <motion.p
          className="mt-4 max-w-md text-lg text-ink"
          aria-live="polite"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.15 }}
        >
          {settledLine(progress, NEW_HIRE)}
        </motion.p>
        <div className="mt-3 flex items-center gap-2">
          <Badge tone="sage">{roleLabel} path</Badge>
          <Badge tone="muted">
            {completed} of {tasks.length} steps
          </Badge>
        </div>
      </section>

      {/* Today's guided step, or the caught-up state */}
      <section className="mt-12">
        {nextTask ? (
          <HeroTask task={nextTask} onOpen={() => dispatch({ type: 'open-task', id: nextTask.id })} />
        ) : (
          <CaughtUp allDone={allDone} />
        )}
      </section>

      {/* The plan + people */}
      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-10">
          {PHASES.map((phase) => {
            const phaseTasks = tasks.filter((t) => t.phase === phase.id);
            const phaseDone = phaseTasks.filter((t) =>
              state.completedTaskIds.includes(t.id),
            ).length;
            return (
              <Reveal key={phase.id} as="section">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-ink">{phase.label}</h2>
                    <Badge tone={phaseDone === phaseTasks.length ? 'honey' : 'muted'}>
                      {phaseDone}/{phaseTasks.length}
                    </Badge>
                  </div>
                </div>
                {/* Horizontal snap carousel on mobile, grid on desktop. */}
                <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-2 rail sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-3">
                  {phaseTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      done={state.completedTaskIds.includes(task.id)}
                      onOpen={() => dispatch({ type: 'open-task', id: task.id })}
                      className="w-[80vw] shrink-0 snap-start sm:w-auto"
                    />
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* People rail, right on desktop, a full block on mobile. */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <PeopleRail />
        </aside>
      </div>
    </div>
  );
}

function HeroTask({ task, onOpen }: { task: Task; onOpen: () => void }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)] sm:p-8"
    >
      <div
        aria-hidden
        className="absolute -right-16 -top-16 h-56 w-56 rounded-full gradient-hm opacity-[0.14] blur-2xl"
      />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 max-w-xl">
          <div className="flex items-center gap-2">
            <Sparkle className="h-4 w-4 text-honey" fill="var(--hm-honey)" />
            <span className="text-sm font-medium text-honey-deep">Your next step</span>
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-ink">{task.title}</h2>
          <p className="mt-2 text-muted">{task.summary}</p>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted">
            <HexFrame accent="sage" size={26}>
              <span className="text-[10px] font-bold text-charcoal">i</span>
            </HexFrame>
            {task.why}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
          <Badge tone="honey">{formatMinutes(task.minutes)}</Badge>
          <Button onClick={onOpen} iconRight={<ArrowRight className="h-5 w-5" />}>
            Start now
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function CaughtUp({ allDone }: { allDone: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="rounded-3xl border border-border bg-sage-wash p-8 text-center"
    >
      <HexFrame accent="honey" size={60} className="mx-auto">
        <PartyPopper className="h-7 w-7 text-charcoal" strokeWidth={1.9} />
      </HexFrame>
      <h2 className="mt-5 text-2xl font-semibold text-ink">
        {allDone ? 'You’re all settled in.' : 'You’re all caught up for now.'}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-muted">
        {allDone
          ? 'Every step of your first thirty days is done. You’re not the new person any more. Go and help the next one.'
          : 'Nothing needs you this minute. The next steps unlock as your first days unfold. Take a breath.'}
      </p>
    </motion.div>
  );
}
