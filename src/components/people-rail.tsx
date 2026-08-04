import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { PEOPLE } from '@/data/people';
import { useOnboarding } from '@/state/onboarding-context';
import { useToast } from '@/state/toast-context';
import { Avatar } from '@/components/ui/avatar';
import { EASE_OUT } from '@/lib/motion';

/**
 * "Your people", the human-support panel. A right rail on desktop; the dashboard
 * renders it as a bottom sheet on mobile (see dashboard.tsx). Contact actions are
 * mocked but present, because the point of the panel is that help is never buried.
 */
export function PeopleRail() {
  const reduce = useReducedMotion();
  const { dispatch } = useOnboarding();
  const { push } = useToast();
  const shortlist = PEOPLE.slice(0, 4);

  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Your people</h2>
        <button
          onClick={() => dispatch({ type: 'go', view: 'people' })}
          className="inline-flex items-center gap-1 rounded-full text-xs font-medium text-honey-deep"
        >
          See all <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <ul className="flex flex-col gap-2">
        {shortlist.map((p, i) => (
          <motion.li
            key={p.id}
            initial={reduce ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.05 * i }}
          >
            <button
              onClick={() =>
                push(
                  p.relationship === 'channel'
                    ? `Opening ${p.name}…`
                    : `Message sent to ${p.name.split(' ')[0]}. They usually reply within a day.`,
                )
              }
              className="flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-colors hover:bg-sunk"
            >
              <Avatar initials={p.initials} accent={p.accent} presence={p.presence} size={40} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-ink">{p.name}</span>
                <span className="block truncate text-xs text-muted">{p.role}</span>
              </span>
              <span className="shrink-0 rounded-full bg-sunk px-3 py-1 text-xs font-medium text-ink">
                {p.action}
              </span>
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
