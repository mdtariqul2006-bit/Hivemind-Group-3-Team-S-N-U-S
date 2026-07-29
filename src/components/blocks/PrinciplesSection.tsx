import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { IconPanel } from '@/components/ui/icon-panel';
import { RESEARCH_ICONS } from '@/lib/research-icons';
import { HIVEMIND_RESEARCH } from '@/library';

const { workingStyle, workingPrinciples } = HIVEMIND_RESEARCH;

/**
 * How the team actually engages with a client. Leads with the promise that no
 * pre-written playbook is coming, then shows the three phases that replace it.
 */
export function PrinciplesSection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-canvas py-24">
      <div className="mx-auto w-full max-w-6xl px-5">
        <Reveal className="mb-12 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1 text-xs font-semibold tracking-wider text-honey-deep uppercase shadow-sm">
            Working style
          </span>
          <h2 className="mt-4 text-3xl font-bold text-ink sm:text-4xl">
            {workingStyle.intro}
          </h2>
          <p className="mt-3 text-base text-muted">{workingStyle.body}</p>
        </Reveal>

        <RevealGroup className="grid gap-8 sm:grid-cols-3" stagger={0.08}>
          {workingPrinciples.map((principle) => (
            <RevealItem key={principle.num} className="h-full">
              <article className="flex h-full flex-col">
                <IconPanel
                  icon={RESEARCH_ICONS[principle.icon]}
                  accent={principle.accent}
                  className="aspect-[4/3] w-full rounded-3xl border border-border shadow-[var(--shadow-soft)]"
                />

                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-sm font-black text-honey-deep numeral">
                    {String(principle.num).padStart(2, '0')}
                  </span>
                  <h3 className="text-lg font-bold text-ink">{principle.title}</h3>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted">{principle.body}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{principle.detail}</p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
