import { motion } from 'framer-motion';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { GlowCard } from '@/components/motion/glow-card';
import { HIVEMIND_RESEARCH } from '@/library';

const { insights } = HIVEMIND_RESEARCH;

/** Publication dates render as "November 2024". */
function formatInsightDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Published industry insights. Evidence that the method has been applied
 * outside this prototype.
 */
export function InsightsSection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-sunk py-24">
      <div className="mx-auto w-full max-w-6xl px-5">
        <Reveal className="mb-12 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1 text-xs font-semibold tracking-wider text-honey-deep uppercase shadow-sm">
            Why we built it this way
          </span>
          <h2 className="mt-4 text-3xl font-bold text-ink sm:text-4xl">
            The research behind the product
          </h2>
          <p className="mt-3 text-base text-muted">
            Three findings that shaped every decision in this prototype, from the
            guided roadmap to the AI assistant.
          </p>
        </Reveal>

        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {insights.map((insight) => (
            <RevealItem key={insight.title}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="h-full"
              >
                <GlowCard className="flex h-full flex-col overflow-hidden">
                  <img
                    src={insight.image}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="aspect-[16/9] w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-7">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex rounded-full bg-honey-wash px-3 py-1 text-[11px] font-bold tracking-wide text-honey-deep uppercase">
                        {insight.tag}
                      </span>
                      <time
                        dateTime={insight.date}
                        className="text-xs font-medium text-muted numeral"
                      >
                        {formatInsightDate(insight.date)}
                      </time>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-ink">{insight.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {insight.summary}
                    </p>
                  </div>
                </GlowCard>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
