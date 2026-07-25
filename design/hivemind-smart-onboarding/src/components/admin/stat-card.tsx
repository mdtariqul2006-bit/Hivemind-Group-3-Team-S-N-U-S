import { Users, TrendingUp, Clock, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { GlowCard } from '@/components/motion/glow-card';
import { HexFrame } from '@/components/ui/hex-frame';
import { Sparkline } from './charts/sparkline';
import { useCountUp } from '@/hooks/use-count-up';
import type { Kpi } from '@/data/admin-metrics';
import { cn } from '@/lib/cn';

const ICONS = {
  users: Users,
  trend: TrendingUp,
  clock: Clock,
  award: Award,
} as const;

/** A single KPI tile: animated value, delta pill, and a matching sparkline. */
export function StatCard({ kpi }: { kpi: Kpi }) {
  const Icon = ICONS[kpi.icon];
  const value = useCountUp(kpi.value);
  // A falling time to productive is good, so treat its negative delta as positive.
  const positive = kpi.id === 'time' ? kpi.delta < 0 : kpi.delta > 0;
  const DeltaIcon = kpi.delta >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <GlowCard className="p-5">
      <div className="flex items-start justify-between">
        <HexFrame size={44} accent={kpi.accent}>
          <Icon className="h-5 w-5 text-charcoal" />
        </HexFrame>
        <span
          className={cn(
            'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
            positive ? 'bg-sage-wash text-ink' : 'bg-pink-wash text-ink',
          )}
        >
          <DeltaIcon className="h-3 w-3" />
          {Math.abs(kpi.delta)}%
        </span>
      </div>

      <div className="mt-4">
        <div className="numeral text-3xl text-ink">
          {kpi.prefix}
          {value}
          {kpi.suffix}
        </div>
        <div className="mt-0.5 text-sm text-muted">{kpi.label}</div>
      </div>

      <div className="mt-3">
        <Sparkline data={kpi.spark} accent={kpi.accent} width={220} height={38} />
      </div>
    </GlowCard>
  );
}
