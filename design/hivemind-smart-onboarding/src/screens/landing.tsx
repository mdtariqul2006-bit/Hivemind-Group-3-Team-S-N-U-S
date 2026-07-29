import { lazy, Suspense } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Compass, HeartHandshake, TrendingUp } from 'lucide-react';
import { useOnboarding } from '@/state/onboarding-context';
import { NEW_HIRE } from '@/data/roles';
import { Button } from '@/components/ui/button';
import { Wordmark } from '@/components/ui/logo';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { HexFrame } from '@/components/ui/hex-frame';
import { EASE_OUT } from '@/lib/motion';

// The hero visual is the heaviest thing on the landing screen, so it is lazy-loaded
// behind a Suspense boundary, first paint shows text and CTA immediately.
const HeroHive = lazy(() =>
  import('@/components/hero-hive').then((m) => ({ default: m.HeroHive })),
);

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
  const reduce = useReducedMotion();
  const { dispatch } = useOnboarding();

  return (
    <div className="relative">
      {/* Hero's own light header, the persistent TopBar starts after this screen. */}
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
        <Wordmark />
        <ThemeToggle />
      </div>

      {/* Hero */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-5 pb-16 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:pt-16">
        <div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            <Badge tone="honey" className="mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-honey" /> Northwind · Smart Onboarding
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl font-semibold text-ink sm:text-6xl"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.05 }}
          >
            Welcome to the hive,{' '}
            <span className="bg-gradient-to-r from-[color:var(--hm-honey-deep)] to-[color:var(--hm-pink)] bg-clip-text text-transparent">
              {NEW_HIRE}
            </span>
            .
          </motion.h1>

          <motion.p
            className="mt-5 max-w-lg text-lg text-muted"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.12 }}
          >
            Your first thirty days, made calm and personal. One clear step at a time,
            the right people beside you, and a real sense of settling in, instead of a
            folder of PDFs and a hopeful good luck.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
          >
            <Button
              size="lg"
              onClick={() => dispatch({ type: 'go', view: 'personalise' })}
              iconRight={<ArrowRight className="h-5 w-5" />}
            >
              Start my first day
            </Button>
            <span className="text-sm text-muted">Takes about a minute to set up.</span>
          </motion.div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <Suspense fallback={<div className="h-[340px] w-[340px]" />}>
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
            >
              <HeroHive />
            </motion.div>
          </Suspense>
        </div>
      </section>

      {/* Three promises, revealed on scroll with a stagger. */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-24">
        <Reveal className="mb-10">
          <h2 className="text-2xl font-semibold text-ink sm:text-3xl">
            What that actually means
          </h2>
          <p className="mt-2 max-w-xl text-muted">
            Three promises we make to every new starter, and the reason onboarding here
            feels different by lunchtime on day one.
          </p>
        </Reveal>

        <RevealGroup className="grid gap-5 sm:grid-cols-3" stagger={0.06}>
          {PROMISES.map((p) => (
            <RevealItem
              key={p.title}
              className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]"
            >
              <HexFrame accent={p.accent} size={52}>
                <p.icon className="h-6 w-6 text-charcoal" strokeWidth={1.9} />
              </HexFrame>
              <h3 className="mt-5 text-lg font-semibold text-ink">{p.title}</h3>
              <p className="mt-2 text-sm text-muted">{p.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-12" delay={0.05}>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-sage-wash px-6 py-6">
            <p className="max-w-md text-ink">
              Ready when you are. We will shape the whole plan around your role and how
              you like to learn.
            </p>
            <Button
              variant="secondary"
              onClick={() => dispatch({ type: 'go', view: 'personalise' })}
              iconRight={<ArrowRight className="h-4 w-4" />}
            >
              Personalise my onboarding
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
