import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { STARTERS, type StarterRow } from '@/data/admin-metrics';
import { cn } from '@/lib/cn';

const STATUS_TONE: Record<StarterRow['status'], { tone: 'honey' | 'pink' | 'sage'; label: string }> = {
  ahead: { tone: 'sage', label: 'Ahead' },
  'on-track': { tone: 'honey', label: 'On track' },
  'at-risk': { tone: 'pink', label: 'At risk' },
};

interface RosterTableProps {
  /** Controlled from outside so the topbar console search can land here directly. */
  query?: string;
  onQueryChange?: (query: string) => void;
}

/** Searchable roster of new starters with progress and buddy matching. */
export function RosterTable({ query: controlledQuery, onQueryChange }: RosterTableProps = {}) {
  const [localQuery, setLocalQuery] = useState('');
  const query = controlledQuery ?? localQuery;
  const setQuery = onQueryChange ?? setLocalQuery;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return STARTERS;
    return STARTERS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.team.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-ink">Starter roster</h3>
          <p className="text-sm text-muted">{rows.length} people onboarding right now</p>
        </div>
        <label className="relative flex items-center">
          <Search aria-hidden className="pointer-events-none absolute left-3 h-4 w-4 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people or teams"
            aria-label="Search people or teams"
            className="h-10 w-full rounded-full border border-border bg-surface pl-9 pr-4 text-sm text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-honey focus-visible:outline-offset-2 sm:w-64"
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <th className="pb-3 pl-1 font-medium">Starter</th>
              <th className="pb-3 font-medium">Team</th>
              <th className="pb-3 font-medium">Progress</th>
              <th className="pb-3 font-medium">Phase</th>
              <th className="pb-3 font-medium">Buddy</th>
              <th className="pb-3 pr-1 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const status = STATUS_TONE[s.status];
              return (
                <tr key={s.id} className="border-b border-border/60 transition-colors hover:bg-sunk/60">
                  <td className="py-3 pl-1">
                    <div className="flex items-center gap-3">
                      <Avatar initials={s.initials} accent={s.accent} size={38} />
                      <div>
                        <div className="font-medium text-ink">{s.name}</div>
                        <div className="text-xs text-muted">{s.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-muted">{s.team}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-sunk">
                        <div
                          className={cn('h-full rounded-full', s.progress === 100 ? 'bg-sage' : 'gradient-hm')}
                          style={{ width: `${s.progress}%` }}
                        />
                      </div>
                      <span className="numeral text-xs text-muted">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-muted">{s.phase}</td>
                  <td className="py-3 text-muted">{s.buddy}</td>
                  <td className="py-3 pr-1">
                    <Badge tone={status.tone}>{status.label}</Badge>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted">
                  No starters match that search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
