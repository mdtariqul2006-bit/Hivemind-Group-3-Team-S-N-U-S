import { motion } from 'framer-motion';
import { Compass, HeartHandshake, TrendingUp } from 'lucide-react';
import { useOnboarding } from '@/state/onboarding-context';
import { useAssistant } from '@/state/assistant-context';
import { useSectionVisible } from '@/hooks/use-section-visible';
import { Button } from '@/components/ui/button';
import { Reveal, RevealGroup } from '@/components/motion/reveal';
import { HexFrame } from '@/components/ui/hex-frame';
import ShaderShowcase from '@/components/ui/hero';
import { Section as RobotSection } from '@/components/ui/robot-demo';
import { MissionBand } from '@/components/blocks/MissionBand';
import { PillarsSection } from '@/components/blocks/PillarsSection';
import { ProcessSection } from '@/components/blocks/ProcessSection';
import { PrinciplesSection } from '@/components/blocks/PrinciplesSection';
import { InsightsSection } from '@/components/blocks/InsightsSection';

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
  const { state, dispatch } = useOnboarding();
  const { playEntrance } = useAssistant();
  // The assistant "climbs out of the box" the first time this section
  // scrolls past, see docs/onboarding-assistant-spec.md section 4.
  const robotSectionRef = useSectionVisible<HTMLDivElement>(playEntrance);

  // Dashboard has nothing to show without a role, send an unpersonalised
  // visitor to the wizard first instead of a blank-looking "complete" screen.
  function goToDashboard() {
    dispatch({ type: 'go', view: state.role ? 'dashboard' : 'personalise' });
  }

  // The mark always goes home, whoever is signed in.
  function goHome() {
    dispatch({ type: 'go', view: 'landing' });
  }

  return (
    <div className="relative w-full overflow-x-hidden">
      {/* Immersive Shader Showcase Hero */}
      <div className="p-4 md:p-6 lg:p-8">
        <ShaderShowcase
          onLogoClick={goHome}
          onStartClick={() => dispatch({ type: 'go', view: 'personalise' })}
          onDashboardClick={goToDashboard}
          onAdminClick={() => dispatch({ type: 'go', view: 'admin' })}
          onSignInClick={() => dispatch({ type: 'go', view: 'auth' })}
        />
      </div>

      {/* Interactive 3D Robot Whobee Section */}
      <div ref={robotSectionRef} className="mx-auto max-w-6xl px-5">
        <RobotSection />
      </div>

      {/* Promises section featuring clean high-contrast container (flicker-free) */}
      <section className="relative overflow-hidden border-t border-border/80 bg-sunk/30 py-20">
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5">
          <Reveal className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-honey/40 bg-honey-wash/90 px-4 py-1 text-xs font-bold uppercase tracking-wider text-honey-deep shadow-sm">
              ✨ Core Promises
            </span>
            <h2 className="mt-4 text-3xl font-black text-ink sm:text-4xl">
              What that actually means
            </h2>
            <p className="mt-3 mx-auto max-w-xl text-muted text-sm sm:text-base font-normal">
              Three promises we make to every new starter, and the reason onboarding here
              feels calm and personal by day one.
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
                <div className="h-full rounded-3xl border border-border/80 bg-surface/95 backdrop-blur-xl p-8 shadow-xl transition-all duration-300 hover:border-honey/60 hover:shadow-2xl">
                  <HexFrame accent={p.accent} size={52}>
                    <p.icon className="h-6 w-6 text-charcoal" strokeWidth={1.9} />
                  </HexFrame>
                  <h3 className="mt-6 text-xl font-extrabold text-ink tracking-tight">{p.title}</h3>
                  <p className="mt-3 text-sm text-muted leading-relaxed font-normal">{p.body}</p>
                </div>
              </motion.div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* The research backed story: what we are for, then how the work is done. */}
      <MissionBand />
      <PillarsSection />
      <ProcessSection />
      <PrinciplesSection />
      <InsightsSection />

      {/* Closing personalisation CTA */}
      <section className="relative overflow-hidden border-t border-border bg-canvas py-20">
        <div className="mx-auto w-full max-w-6xl px-5">
          <Reveal delay={0.05}>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/75 backdrop-blur-md px-8 py-8 shadow-sm">
              <div className="absolute right-0 top-0 -mr-16 -mt-16 h-36 w-36 rounded-full bg-honey/10 blur-2xl" />
              <div className="relative flex flex-wrap items-center justify-between gap-6">
                <div className="max-w-xl">
                  <h3 className="text-xl font-bold text-ink">Ready to get started?</h3>
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
