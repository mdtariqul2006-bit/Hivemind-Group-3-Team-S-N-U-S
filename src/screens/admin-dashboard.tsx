import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Download,
  TrendingUp,
  FileText,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  Clock,
  UserCheck,
} from 'lucide-react';
import { AdminSidebar, NAV, type AdminSection } from '@/components/admin/admin-sidebar';
import { AdminTopbar } from '@/components/admin/admin-topbar';
import { StatCard } from '@/components/admin/stat-card';
import { RosterTable } from '@/components/admin/roster-table';
import { ActivityFeed } from '@/components/admin/activity-feed';
import { AreaChart } from '@/components/admin/charts/area-chart';
import { DonutChart } from '@/components/admin/charts/donut-chart';
import { BarChart, BarList } from '@/components/admin/charts/bar-chart';
import { GlowCard } from '@/components/motion/glow-card';
import { Reveal } from '@/components/motion/reveal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HexFrame } from '@/components/ui/hex-frame';
import { useAuth } from '@/state/auth-context';
import { useToast } from '@/state/toast-context';
import {
  KPIS,
  COMPLETION_TREND,
  ROLE_SPLIT,
  BOTTLENECKS,
  WEEKLY_ACTIVITY,
} from '@/data/admin-metrics';
import { DOCUMENTS } from '@/data/documents';
import { EASE_OUT } from '@/lib/motion';

/** Admin console shell. Rendered only once a valid token is present. */
export function AdminDashboard() {
  const [section, setSection] = useState<AdminSection>('overview');
  const [navOpen, setNavOpen] = useState(false);
  // Lifted so the topbar's console search can actually land somewhere: it
  // jumps to the starter roster and filters it, rather than doing nothing.
  const [starterQuery, setStarterQuery] = useState('');
  const reduce = useReducedMotion();

  const title = NAV.find((n) => n.id === section)?.label ?? 'Overview';

  return (
    <div className="min-h-[100dvh]">
      <AdminSidebar
        active={section}
        onSelect={(s) => {
          setSection(s);
          setNavOpen(false);
        }}
        open={navOpen}
        onClose={() => setNavOpen(false)}
      />

      <div className="lg:pl-[264px]">
        <AdminTopbar
          title={title}
          onMenu={() => setNavOpen(true)}
          searchValue={starterQuery}
          onSearchChange={setStarterQuery}
          onSearchSubmit={() => setSection('starters')}
          onNotificationsClick={() => setSection('overview')}
        />

        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={reduce ? { duration: 0.15 } : { duration: 0.35, ease: EASE_OUT }}
            >
              {section === 'overview' && <OverviewSection />}
              {section === 'starters' && (
                <StartersSection query={starterQuery} onQueryChange={setStarterQuery} />
              )}
              {section === 'analytics' && <AnalyticsSection />}
              {section === 'documents' && <DocumentsSection />}
              {section === 'security' && <SecuritySection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  blurb,
  action,
}: {
  title: string;
  blurb: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{title}</h2>
        <p className="mt-1 text-sm text-muted">{blurb}</p>
      </div>
      {action}
    </div>
  );
}

function OverviewSection() {
  const { admin } = useAuth();
  const { push } = useToast();
  const firstName = admin?.name.split(' ')[0] ?? 'there';

  return (
    <>
      <SectionHeader
        title={`Welcome back, ${firstName}`}
        blurb="Live view of every new starter across the organisation."
        action={
          <Button
            iconRight={<Download className="h-4 w-4" />}
            onClick={() => push('Report queued, you will get an email shortly.')}
          >
            Export report
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((kpi) => (
          <StatCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <GlowCard className="p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-ink">Completion trend</h3>
                <p className="text-sm text-muted">Rolling twelve week average</p>
              </div>
              <Badge tone="sage">
                <TrendingUp className="h-3 w-3" />
                Up 24 points
              </Badge>
            </div>
            <AreaChart data={COMPLETION_TREND} />
          </GlowCard>
        </Reveal>

        <Reveal delay={0.08}>
          <GlowCard className="h-full p-5 sm:p-6">
            <h3 className="mb-1 text-lg font-semibold text-ink">Starters by team</h3>
            <p className="mb-5 text-sm text-muted">Current cohort</p>
            <DonutChart data={ROLE_SPLIT} />
          </GlowCard>
        </Reveal>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <GlowCard className="p-5 sm:p-6">
            <h3 className="mb-1 text-lg font-semibold text-ink">Weekly task activity</h3>
            <p className="mb-5 text-sm text-muted">Tasks completed across the platform</p>
            <BarChart data={WEEKLY_ACTIVITY} accent="honey" />
          </GlowCard>
        </Reveal>

        <Reveal delay={0.08}>
          <GlowCard className="h-full p-5 sm:p-6">
            <h3 className="mb-1 text-lg font-semibold text-ink">Recent activity</h3>
            <p className="mb-5 text-sm text-muted">Latest events</p>
            <ActivityFeed />
          </GlowCard>
        </Reveal>
      </div>
    </>
  );
}

function StartersSection({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (query: string) => void;
}) {
  return (
    <>
      <SectionHeader
        title="Starter roster"
        blurb="Every person working through onboarding, with their buddy and progress."
      />
      <Reveal>
        <GlowCard className="p-5 sm:p-6">
          <RosterTable query={query} onQueryChange={onQueryChange} />
        </GlowCard>
      </Reveal>
    </>
  );
}

function AnalyticsSection() {
  const tiles = [
    { icon: Clock, label: 'Median setup time', value: '2.4 days', tone: 'honey' as const },
    { icon: UserCheck, label: 'Buddy match rate', value: '97%', tone: 'sage' as const },
    { icon: CheckCircle2, label: 'Tasks completed', value: '1,284', tone: 'pink' as const },
  ];

  return (
    <>
      <SectionHeader
        title="Bottleneck analytics"
        blurb="Where new starters lose time, ranked by how many people report a delay."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <Reveal>
          <GlowCard className="h-full p-5 sm:p-6">
            <h3 className="mb-1 text-lg font-semibold text-ink">Reported blockers</h3>
            <p className="mb-5 text-sm text-muted">People affected in the last 30 days</p>
            <BarList data={BOTTLENECKS} accent="pink" />
          </GlowCard>
        </Reveal>

        <Reveal delay={0.08}>
          <GlowCard className="h-full p-5 sm:p-6">
            <h3 className="mb-1 text-lg font-semibold text-ink">Completion trend</h3>
            <p className="mb-5 text-sm text-muted">Rolling twelve week average</p>
            <AreaChart data={COMPLETION_TREND} />
          </GlowCard>
        </Reveal>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {tiles.map((item, i) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.label} delay={i * 0.06}>
              <GlowCard className="flex items-center gap-4 p-5">
                <HexFrame size={44} accent={item.tone}>
                  <Icon className="h-5 w-5 text-charcoal" />
                </HexFrame>
                <div>
                  <div className="numeral text-xl text-ink">{item.value}</div>
                  <div className="text-sm text-muted">{item.label}</div>
                </div>
              </GlowCard>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}

function DocumentsSection() {
  return (
    <>
      <SectionHeader
        title="Documents"
        blurb="Policies and guides served to new starters, with their current review state."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {DOCUMENTS.map((doc, i) => (
          <Reveal key={doc.id} delay={i * 0.05}>
            <GlowCard className="h-full p-5">
              <div className="flex items-start gap-3">
                <HexFrame size={40} accent="sage">
                  <FileText className="h-4 w-4 text-charcoal" />
                </HexFrame>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-ink">{doc.title}</h3>
                  <p className="mt-1 text-sm text-muted">{doc.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge tone="honey">{doc.category}</Badge>
                    <span className="text-xs text-muted">{doc.minutes} min read</span>
                  </div>
                  <p className="mt-2 text-xs text-muted">{doc.updated}</p>
                </div>
              </div>
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </>
  );
}

function SecuritySection() {
  const { admin } = useAuth();

  const rows = [
    { label: 'Signed in as', value: admin?.email ?? '' },
    { label: 'Role', value: 'Administrator' },
    { label: 'Token type', value: 'JSON web token, HS256' },
    { label: 'Session length', value: '2 hours from sign in' },
  ];

  const steps = [
    'Credentials are checked, then a token is signed with HS256.',
    'The token carries the subject, role, issuer, audience, and an expiry.',
    'It is kept in local storage and verified again on every load.',
    'An expired or edited token is rejected and the console asks you to sign in.',
  ];

  return (
    <>
      <SectionHeader
        title="Security"
        blurb="How this console authenticates you and what the current session holds."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <Reveal>
          <GlowCard className="h-full p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <HexFrame size={44} accent="honey">
                <ShieldCheck className="h-5 w-5 text-charcoal" />
              </HexFrame>
              <div>
                <h3 className="text-lg font-semibold text-ink">Current session</h3>
                <p className="text-sm text-muted">Verified on every page load</p>
              </div>
            </div>
            <dl className="grid gap-3">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <dt className="text-sm text-muted">{row.label}</dt>
                  <dd className="text-sm font-medium text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
          </GlowCard>
        </Reveal>

        <Reveal delay={0.08}>
          <GlowCard className="h-full p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <HexFrame size={44} accent="pink">
                <KeyRound className="h-5 w-5 text-charcoal" />
              </HexFrame>
              <div>
                <h3 className="text-lg font-semibold text-ink">How sign in works</h3>
                <p className="text-sm text-muted">Prototype scope</p>
              </div>
            </div>
            <ol className="grid gap-3 text-sm text-muted">
              {steps.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-honey-wash text-xs font-semibold text-honey-deep">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 rounded-2xl bg-sunk p-3.5 text-xs leading-relaxed text-muted">
              This prototype signs tokens in the browser, so the secret ships with the
              app. A production build moves signing to a server that keeps the secret
              private. The token flow itself stays the same.
            </p>
          </GlowCard>
        </Reveal>
      </div>
    </>
  );
}
