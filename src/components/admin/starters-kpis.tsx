import { Users, CheckCircle2, TrendingUp, AlertTriangle, Award } from 'lucide-react';
import type { StarterRow } from '@/data/admin-metrics';
import { cn } from '@/lib/cn';

interface StartersKpisProps {
  items: StarterRow[];
}

export function StartersKpis({ items }: StartersKpisProps) {
  const total = items.length;
  const onTrack = items.filter((i) => i.status === 'on-track').length;
  const ahead = items.filter((i) => i.status === 'ahead').length;
  const atRisk = items.filter((i) => i.status === 'at-risk').length;
  
  const avgProgress = total > 0
    ? Math.round(items.reduce((acc, curr) => acc + curr.progress, 0) / total)
    : 0;

  const cards = [
    {
      label: 'Total Starters',
      value: `${total} Starters`,
      sub: 'Active onboarding cohort',
      icon: Users,
      accentClass: 'border-honey/30 bg-surface text-ink',
      iconClass: 'bg-honey-wash text-honey-deep',
    },
    {
      label: 'On Track',
      value: `${onTrack} On Track`,
      sub: 'Progressing as planned',
      icon: CheckCircle2,
      accentClass: 'border-sage/30 bg-surface text-ink',
      iconClass: 'bg-sage-wash text-sage',
    },
    {
      label: 'Ahead',
      value: `${ahead} Ahead`,
      sub: 'Surpassing milestones',
      icon: TrendingUp,
      accentClass: 'border-honey/40 bg-surface text-ink',
      iconClass: 'bg-honey-wash text-honey-deep',
    },
    {
      label: 'At Risk',
      value: `${atRisk} At Risk`,
      sub: 'Requires manager sync',
      icon: AlertTriangle,
      accentClass: 'border-pink/30 bg-surface text-ink',
      iconClass: 'bg-pink-wash text-pink',
    },
    {
      label: 'Completion Rate',
      value: `${avgProgress}%`,
      sub: 'Cohort average progress',
      icon: Award,
      accentClass: 'border-honey/30 bg-surface text-ink',
      iconClass: 'bg-honey-wash text-honey-deep',
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={cn(
              'relative overflow-hidden rounded-2xl border p-4 shadow-[var(--shadow-soft)] transition-all hover:border-honey/50',
              card.accentClass,
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">{card.label}</span>
              <div className={cn('flex h-8 w-8 items-center justify-center rounded-xl', card.iconClass)}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold tracking-tight text-ink sm:text-2xl">{card.value}</div>
            <div className="mt-1 text-xs text-muted">{card.sub}</div>
          </div>
        );
      })}
    </div>
  );
}
