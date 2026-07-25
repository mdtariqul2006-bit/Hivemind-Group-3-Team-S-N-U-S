import { RevealGroup, RevealItem } from '@/components/motion/reveal';
import { Avatar } from '@/components/ui/avatar';
import { RECENT_ACTIVITY } from '@/data/admin-metrics';

/** A vertical timeline of the latest onboarding events. */
export function ActivityFeed() {
  return (
    <RevealGroup as="ul" className="grid gap-1">
      {RECENT_ACTIVITY.map((entry, i) => (
        <RevealItem as="li" key={entry.id}>
          <div className="relative flex gap-3 pb-5">
            {/* Connector line, skipped on the final row. */}
            {i < RECENT_ACTIVITY.length - 1 && (
              <span aria-hidden className="absolute left-[19px] top-11 h-full w-px bg-border" />
            )}
            <Avatar initials={entry.initials} accent={entry.accent} size={38} />
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug text-ink">
                <span className="font-medium">{entry.who}</span>{' '}
                <span className="text-muted">{entry.action}</span>{' '}
                <span className="font-medium">{entry.target}</span>
              </p>
              <span className="text-xs text-muted">{entry.time}</span>
            </div>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
