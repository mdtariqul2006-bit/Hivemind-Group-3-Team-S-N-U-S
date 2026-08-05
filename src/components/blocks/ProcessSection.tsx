import { Reveal } from '@/components/motion/reveal';
import { HexFrame } from '@/components/ui/hex-frame';
import { cn } from '@/lib/cn';
import { HIVEMIND_RESEARCH } from '@/library';

const { processSteps } = HIVEMIND_RESEARCH;

const ACCENTS = ['honey', 'pink', 'sage'] as const;

/** Drops the "Step 1: " prefix so the number can carry its own visual weight. */
function stripStepPrefix(title: string): string {
  return title.replace(/^Step\s*\d+\s*:\s*/i, '');
}

/**
 * The three step engagement process, laid out as alternating rows so each step
 * reads as its own moment rather than a list item.
 */
export function ProcessSection() {
  return (
    <section className="relative overflow-hidden border-t border-border py-24">
      <div className="mx-auto w-full max-w-6xl px-5">
        <Reveal className="mb-14 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1 text-xs font-semibold tracking-wider text-honey-deep uppercase shadow-sm">
            The HiveMind process
          </span>
          <h2 className="mt-4 text-3xl font-bold text-ink sm:text-4xl">
            From first conversation to a system that runs itself
          </h2>
          <p className="mt-3 text-base text-muted">
            An engagement is an organisational upgrade in how knowledge moves, not a
            software rollout. It happens in three steps.
          </p>
        </Reveal>

        <ol className="space-y-14">
          {processSteps.map((step, i) => {
            const flipped = i % 2 === 1;

            return (
              <li key={step.step}>
                <Reveal>
                  <div className="grid items-center gap-8 lg:grid-cols-2">
                    <div className={cn(flipped && 'lg:order-2')}>
                      <div className="flex items-center gap-4">
                        <HexFrame accent={ACCENTS[i % ACCENTS.length]} size={52}>
                          <span className="text-lg font-black text-charcoal numeral">
                            {step.step}
                          </span>
                        </HexFrame>
                        <h3 className="text-2xl font-bold text-ink">
                          {stripStepPrefix(step.title)}
                        </h3>
                      </div>

                      <p className="mt-5 text-base leading-relaxed text-muted">{step.body}</p>
                      <p className="mt-3 text-sm leading-relaxed text-muted">{step.detail}</p>
                    </div>

                    <div className={cn(flipped && 'lg:order-1')}>
                      <div className="overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-soft)]">
                        <img
                          src={step.image}
                          alt=""
                          aria-hidden
                          loading="lazy"
                          className="aspect-[4/3] w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
