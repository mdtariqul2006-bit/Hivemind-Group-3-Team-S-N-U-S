import { motion } from 'framer-motion';
import { Compass, HeartHandshake, TrendingUp, ArrowRight } from 'lucide-react';
import { useOnboarding } from '@/state/onboarding-context';
import { Button } from '@/components/ui/button';
import { Reveal, RevealGroup } from '@/components/motion/reveal';
import { HexFrame } from '@/components/ui/hex-frame';
import ShaderShowcase from '@/components/ui/hero';
import { FloatingPaths } from '@/components/ui/background-paths';
import { AnimatedGradient } from '@/components/ui/animated-gradient';
import { GlowCard } from '@/components/motion/glow-card';
import { TiltCard } from '@/components/motion/tilt-card';
import { HIVEMIND_RESEARCH, ASSETS } from '@/library';

const PROMISES = [
  {
    icon: Compass,
    accent: 'honey' as const,
    title: 'A guided path, not a document dump',
    body: 'One clear next step at a time, Day 1, then Week 1, then Month 1. Never a 40-page handbook on your first morning.',
  },
  {
    icon: HeartHandshake,
    accent: 'pink' as const,
    title: 'Your people, one tap away',
    body: 'Your buddy, your manager and a no-wrong-questions channel are always in reach. You never have to wonder who to ask.',
  },
  {
    icon: TrendingUp,
    accent: 'sage' as const,
    title: 'Progress you can actually feel',
    body: 'A warm, always-present sense of how far you have settled in, so the first month feels like arriving, not drowning.',
  },
];

export function Landing() {
  const { dispatch } = useOnboarding();

  return (
    <div className="relative w-full overflow-x-hidden bg-canvas text-ink">
      {/* Immersive Shader Showcase Hero */}
      <div className="p-4 md:p-6 lg:p-8">
        <ShaderShowcase
          onStartClick={() => dispatch({ type: 'go', view: 'personalise' })}
          onDashboardClick={() => dispatch({ type: 'go', view: 'dashboard' })}
        />
      </div>

      {/* Structure Learning Banner */}
      <section className="relative overflow-hidden border-t border-border bg-sunk/30 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <TiltCard className="overflow-hidden">
                <img
                  src={ASSETS.structureLearning}
                  alt="Structure the way your organisation learns"
                  className="h-80 w-full object-cover transition-transform duration-500 hover:scale-105 sm:h-96"
                />
              </TiltCard>
            </div>
            <div className="lg:col-span-6">
              <Reveal>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-honey-wash px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-honey-deep border border-honey/30">
                  ⚡ Make Onboarding a Repeatable Superpower
                </span>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-4xl">
                  Structure the way your organisation learns
                </h2>
                <p className="mt-4 text-base font-normal leading-relaxed text-muted sm:text-lg">
                  HiveMind helps growing organisations turn scattered knowledge and ad-hoc onboarding into a structured, AI-supported learning system. We combine psychology-led consulting, bespoke learning journeys and an AI-powered Knowledge System so your teams can onboard faster.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Button
                    onClick={() => dispatch({ type: 'go', view: 'personalise' })}
                    iconRight={<ArrowRight className="h-4 w-4" />}
                  >
                    Explore Personalised Path
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Promises section featuring animated background paths and gradient blobs */}
      <section className="relative overflow-hidden border-t border-border bg-canvas py-24">
        <AnimatedGradient
          colors={['var(--hm-honey)', 'var(--hm-pink)', 'var(--hm-sage)']}
          speed={0.08}
          blur="heavy"
        />
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5">
          <Reveal className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 backdrop-blur-md px-4 py-1 text-xs font-semibold tracking-wider text-honey-deep uppercase shadow-sm">
              ✨ Core Promises
            </span>
            <h2 className="mt-4 text-3xl font-bold text-ink sm:text-4xl">
              What that actually means
            </h2>
            <p className="mt-3 mx-auto max-w-xl text-muted text-base">
              Three promises we make to every new starter, and the reason onboarding here
              feels different by lunchtime on day one.
            </p>
          </Reveal>

          <RevealGroup className="grid gap-6 sm:grid-cols-3" stagger={0.08}>
            {PROMISES.map((p) => (
              <motion.div
                key={p.title}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="h-full"
              >
                <GlowCard className="h-full p-8 border border-border/80 bg-surface/90 backdrop-blur-xl shadow-lg">
                  <HexFrame accent={p.accent} size={52}>
                    <p.icon className="h-6 w-6 text-charcoal" strokeWidth={1.9} />
                  </HexFrame>
                  <h3 className="mt-5 text-xl font-bold text-ink">{p.title}</h3>
                  <p className="mt-3 text-sm text-muted leading-relaxed">{p.body}</p>
                </GlowCard>
              </motion.div>
            ))}
          </RevealGroup>

          {/* Why Teams Ramp Faster (4 USPs from HiveMind Research) */}
          <div className="mt-20">
            <Reveal className="mb-10 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-honey/40 bg-honey-wash/80 px-4 py-1 text-xs font-bold uppercase tracking-wider text-honey-deep">
                🚀 Value Propositions
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
                Why Teams Ramp Faster with HiveMind
              </h2>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {HIVEMIND_RESEARCH.valuePropositions.map((item) => (
                <TiltCard key={item.id} className="h-full">
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-ink mb-2">{item.title}</h3>
                    <p className="text-xs text-muted leading-relaxed">{item.body}</p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>

          {/* Our 3-Step Process */}
          <div className="mt-24 rounded-3xl border border-border/80 bg-surface/80 backdrop-blur-2xl p-8 sm:p-12 shadow-xl">
            <Reveal className="text-center mb-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-pink-wash px-4 py-1 text-xs font-bold uppercase tracking-wider text-pink border border-pink/30">
                🔄 Transformation Methodology
              </span>
              <h2 className="mt-3 text-3xl font-black text-ink sm:text-4xl">
                Our 3-Step Process
              </h2>
            </Reveal>

            <div className="grid gap-8 lg:grid-cols-3">
              {HIVEMIND_RESEARCH.processSteps.map((proc) => (
                <div
                  key={proc.step}
                  className="rounded-2xl border border-border/60 bg-sunk/50 p-6 transition-all hover:border-honey/50 hover:shadow-md"
                >
                  <div className="relative mb-4 h-40 overflow-hidden rounded-xl">
                    <img
                      src={proc.image}
                      alt={proc.title}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-lg bg-honey font-black text-charcoal shadow-md">
                      {proc.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-ink">{proc.title}</h3>
                  <p className="mt-2 text-xs text-muted leading-relaxed">{proc.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Working Principles */}
          <div className="mt-24">
            <Reveal className="mb-10 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-sage-wash px-4 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                🌱 How We Work With You
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
                Real Partnership, Practical Impact
              </h2>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-3">
              {HIVEMIND_RESEARCH.workingPrinciples.map((wp) => (
                <GlowCard key={wp.num} className="p-6 border border-border/80 bg-surface/90">
                  <div className="relative mb-4 h-36 overflow-hidden rounded-xl">
                    <img src={wp.image} alt={wp.title} className="h-full w-full object-cover" />
                    <span className="absolute top-3 left-3 flex h-7 w-7 items-center justify-center rounded-full bg-charcoal text-white font-bold text-xs">
                      {wp.num}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-ink">{wp.title}</h3>
                  <p className="mt-2 text-xs text-muted leading-relaxed">{wp.body}</p>
                </GlowCard>
              ))}
            </div>
          </div>

          {/* Latest Insights & Thought Leadership */}
          <div className="mt-24">
            <Reveal className="mb-10 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-honey-wash px-4 py-1 text-xs font-bold uppercase tracking-wider text-honey-deep">
                💡 Insights & Research
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
                Latest Insights from HiveMind
              </h2>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2">
              {HIVEMIND_RESEARCH.insights.map((ins) => (
                <TiltCard key={ins.title} className="overflow-hidden">
                  <div className="grid sm:grid-cols-12">
                    <div className="sm:col-span-5 relative h-48 sm:h-full">
                      <img src={ins.image} alt={ins.title} className="h-full w-full object-cover" />
                      <span className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                        {ins.tag}
                      </span>
                    </div>
                    <div className="sm:col-span-7 p-6">
                      <p className="text-[11px] font-semibold text-muted mb-1">Date: {ins.date}</p>
                      <h3 className="text-base font-bold text-ink mb-2">{ins.title}</h3>
                      <p className="text-xs text-muted leading-relaxed">{ins.summary}</p>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>

          {/* Quick personalization CTA banner */}
          <Reveal className="mt-20" delay={0.05}>
            <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-surface/90 backdrop-blur-2xl p-8 shadow-xl">
              <div className="absolute right-0 top-0 -mr-16 -mt-16 h-36 w-36 rounded-full bg-honey/20 blur-2xl" />
              <div className="relative flex flex-wrap items-center justify-between gap-6">
                <div className="max-w-xl">
                  <h3 className="text-2xl font-black text-ink">Ready to get started?</h3>
                  <p className="mt-2 text-sm text-muted">
                    We will shape the whole plan around your role and how you like to learn. Setting up takes less than a minute.
                  </p>
                </div>
                <Button
                  onClick={() => dispatch({ type: 'go', view: 'personalise' })}
                  iconRight={<span className="ml-1">→</span>}
                >
                  Personalise my onboarding
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
