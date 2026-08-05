import { Building2, Code2, Palette, Megaphone } from 'lucide-react';
import type { StarterRow } from '@/data/admin-metrics';

interface DepartmentStatsProps {
  items: StarterRow[];
}

const DEPT_ICONS: Record<string, typeof Code2> = {
  Engineering: Code2,
  Design: Palette,
  Marketing: Megaphone,
};

export function DepartmentStats({ items }: DepartmentStatsProps) {
  const depts = Array.from(new Set(items.map((i) => i.team)));

  const stats = depts.map((dept) => {
    const deptStarters = items.filter((i) => i.team === dept);
    const count = deptStarters.length;
    const avgProgress = Math.round(
      deptStarters.reduce((acc, curr) => acc + curr.progress, 0) / (count || 1),
    );
    const ahead = deptStarters.filter((i) => i.status === 'ahead').length;
    const atRisk = deptStarters.filter((i) => i.status === 'at-risk').length;
    const Icon = DEPT_ICONS[dept] || Building2;

    return {
      dept,
      count,
      avgProgress,
      ahead,
      atRisk,
      Icon,
    };
  });

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted">Department Workforce Breakdown</h4>
        <span className="text-xs text-muted">{items.length} total active starters</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.Icon;
          return (
            <div
              key={s.dept}
              className="flex items-center justify-between rounded-2xl border border-border bg-surface p-3.5 shadow-[var(--shadow-soft)] transition-all hover:border-honey/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sunk text-honey-deep">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-ink">{s.dept}</div>
                  <div className="text-xs text-muted">{s.count} employees</div>
                </div>
              </div>
              <div className="text-right">
                <div className="numeral text-sm font-bold text-ink">{s.avgProgress}% avg</div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted">
                  {s.ahead > 0 && <span className="text-sage font-medium">{s.ahead} ahead</span>}
                  {s.atRisk > 0 && <span className="text-pink font-medium">{s.atRisk} at-risk</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
