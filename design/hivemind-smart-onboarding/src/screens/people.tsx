import { ArrowLeft, BookOpen, LifeBuoy, Link2 } from 'lucide-react';
import { useOnboarding } from '@/state/onboarding-context';
import { useToast } from '@/state/toast-context';
import { PEOPLE } from '@/data/people';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HexFrame } from '@/components/ui/hex-frame';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import type { View } from '@/types';

const RESOURCES: {
  icon: typeof BookOpen;
  accent: 'sage' | 'pink' | 'honey';
  title: string;
  body: string;
  action: string;
  view: View;
}[] = [
  {
    icon: BookOpen,
    accent: 'sage',
    title: 'Key documents',
    body: 'Ways of working, the design system, every doc you’ll be pointed to. Searchable, and mostly up to date.',
    action: 'Browse documents',
    view: 'documents',
  },
  {
    icon: LifeBuoy,
    accent: 'pink',
    title: 'IT and access help',
    body: 'Laptop playing up, missing access to a tool, badge not working? This is the fastest way to a fix.',
    action: 'Get help',
    view: 'documents',
  },
  {
    icon: Link2,
    accent: 'honey',
    title: 'Key links, one place',
    body: 'Payroll, benefits, the holiday tracker and the org chart. The handful of links you’ll actually reuse.',
    action: 'See links',
    view: 'documents',
  },
];

const RELATIONSHIP_LABEL: Record<string, string> = {
  buddy: 'Your buddy',
  manager: 'Your manager',
  team: 'Your team',
  channel: 'Help channel',
};

export function People() {
  const { dispatch } = useOnboarding();
  const { push } = useToast();

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-24 pt-8">
      <button
        onClick={() => dispatch({ type: 'go', view: 'dashboard' })}
        className="mb-6 inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to your plan
      </button>

      <Reveal>
        <h1 className="text-3xl font-semibold text-ink sm:text-4xl">Your people & support</h1>
        <p className="mt-2 max-w-xl text-muted">
          Everyone who’s got your back this month, and the handful of places worth
          bookmarking. Nobody here is too busy for a new starter’s question.
        </p>
      </Reveal>

      <RevealGroup as="ul" className="mt-8 grid gap-4 sm:grid-cols-2" stagger={0.05}>
        {PEOPLE.map((p) => (
          <RevealItem
            as="li"
            key={p.id}
            className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)] sm:flex-row sm:items-start"
          >
            <Avatar initials={p.initials} accent={p.accent} presence={p.presence} size={56} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-ink">{p.name}</h3>
                {p.pronouns && <span className="text-xs text-muted">{p.pronouns}</span>}
              </div>
              <p className="text-sm text-muted">{p.role}</p>
              <Badge tone="sage" className="mt-2">
                {RELATIONSHIP_LABEL[p.relationship]}
              </Badge>
              <p className="mt-3 text-sm text-muted">{p.blurb}</p>
              <Button
                variant="secondary"
                size="md"
                className="mt-4"
                onClick={() =>
                  push(
                    p.relationship === 'channel'
                      ? `Opening ${p.name}…`
                      : `Message sent to ${p.name.split(' ')[0]}. They usually reply within a day.`,
                  )
                }
              >
                {p.action}
              </Button>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mb-4 mt-14">
        <h2 className="text-2xl font-semibold text-ink">Places worth bookmarking</h2>
      </Reveal>
      <RevealGroup className="grid gap-4 sm:grid-cols-3" stagger={0.06}>
        {RESOURCES.map((r) => (
          <RevealItem
            key={r.title}
            className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]"
          >
            <HexFrame accent={r.accent} size={48}>
              <r.icon className="h-5 w-5 text-charcoal" strokeWidth={1.9} />
            </HexFrame>
            <h3 className="mt-4 font-semibold text-ink">{r.title}</h3>
            <p className="mt-1.5 text-sm text-muted">{r.body}</p>
            <button
              onClick={() => dispatch({ type: 'go', view: r.view })}
              className="mt-4 text-sm font-medium text-honey-deep"
            >
              {r.action} →
            </button>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
