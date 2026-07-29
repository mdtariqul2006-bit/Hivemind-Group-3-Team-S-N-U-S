import { motion } from 'framer-motion';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { GlowCard } from '@/components/motion/glow-card';
import { IconPanel } from '@/components/ui/icon-panel';
import { RESEARCH_ICONS } from '@/lib/research-icons';
import { HIVEMIND_RESEARCH } from '@/library';

const { valuePropositions } = HIVEMIND_RESEARCH;

/**
 * The four methodological pillars the product is built on. Each pillar pairs
 * its research image with the claim it supports.
 */
export function PillarsSection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-canvas py-24">
      <div className="mx-auto w-full max-w-6xl px-5">
        <Reveal className="mb-12 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1 text-xs font-semibold tracking-wider text-honey-deep uppercase shadow-sm">
            How we structure learning
          </span>
          <h2 className="mt-4 text-3xl font-bold text-ink sm:text-4xl">
            Four pillars behind every journey
          </h2>
          <p className="mt-3 text-base text-muted">
            Generic onboarding rarely sticks. These four principles shape how each path is
            built, so what people learn maps to the work in front of them.
          </p>
        </Reveal>

        <RevealGroup className="grid gap-6 sm:grid-cols-2" stagger={0.08}>
          {valuePropositions.map((pillar, i) => (
            <RevealItem key={pillar.id}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="h-full"
              >
                <GlowCard className="flex h-full flex-col overflow-hidden">
                  <IconPanel
                    icon={RESEARCH_ICONS[pillar.icon]}
                    accent={pillar.accent}
                    className="aspect-[16/9] w-full"
                  />
                  <div className="flex flex-1 flex-col p-7">
                    <span className="text-xs font-bold tracking-widest text-honey-deep numeral">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-2 text-xl font-bold text-ink">{pillar.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{pillar.body}</p>
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
