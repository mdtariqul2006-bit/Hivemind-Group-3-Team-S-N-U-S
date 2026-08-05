import { Reveal } from '@/components/motion/reveal';
import { HIVEMIND_RESEARCH } from '@/library';

const { mission } = HIVEMIND_RESEARCH;

/**
 * The mission statement band. Sets out what HiveMind is for before the page
 * moves on to how the work is actually done.
 */
export function MissionBand() {
  return (
    <section className="relative overflow-hidden border-t border-border py-24">
      <div className="mx-auto w-full max-w-6xl px-5">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1 text-xs font-semibold tracking-wider text-honey-deep uppercase shadow-sm">
              Our mission
            </span>

            <blockquote className="mt-5">
              <p className="text-2xl font-bold leading-snug text-ink sm:text-3xl">
                {mission.statement}
              </p>
            </blockquote>

            <p className="mt-6 text-base font-medium text-ink">{mission.lead}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{mission.body}</p>

            <p className="mt-6 inline-flex rounded-2xl bg-honey-wash px-4 py-3 text-sm font-semibold text-honey-deep">
              {mission.outcome}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-soft)]">
              <img
                src={mission.image}
                alt="A team working through a shared learning structure together"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
