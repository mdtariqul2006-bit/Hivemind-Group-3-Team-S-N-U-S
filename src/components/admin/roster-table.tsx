import { useMemo, useState } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, ArrowRight } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { StarterRow } from '@/data/admin-metrics';
import { cn } from '@/lib/cn';

const STATUS_TONE: Record<StarterRow['status'], { tone: 'honey' | 'pink' | 'sage'; label: string }> = {
  ahead: { tone: 'sage', label: 'Ahead' },
  'on-track': { tone: 'honey', label: 'On track' },
  'at-risk': { tone: 'pink', label: 'At risk' },
};

type SortKey = 'name' | 'team' | 'startDate' | 'progress' | 'status';
type SortOrder = 'asc' | 'desc';

interface RosterTableProps {
  query?: string;
  onQueryChange?: (query: string) => void;
  items: StarterRow[];
  onSelectStarter: (starter: StarterRow) => void;
}

export function RosterTable({
  query: controlledQuery,
  onQueryChange,
  items,
  onSelectStarter,
}: RosterTableProps) {
  const [localQuery, setLocalQuery] = useState('');
  const query = controlledQuery ?? localQuery;
  const setQuery = onQueryChange ?? setLocalQuery;

  const [sortKey, setSortKey] = useState<SortKey>('progress');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  }

  const processedRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filtered = items;
    if (q) {
      filtered = items.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.role.toLowerCase().includes(q) ||
          s.team.toLowerCase().includes(q) ||
          s.buddy.toLowerCase().includes(q),
      );
    }

    return [...filtered].sort((a, b) => {
      let compA: string | number = a[sortKey] ?? '';
      let compB: string | number = b[sortKey] ?? '';

      if (typeof compA === 'string') compA = compA.toLowerCase();
      if (typeof compB === 'string') compB = compB.toLowerCase();

      if (compA < compB) return sortOrder === 'asc' ? -1 : 1;
      if (compA > compB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [items, query, sortKey, sortOrder]);

  function renderSortIndicator(key: SortKey) {
    if (sortKey !== key) return <ChevronsUpDown className="ml-1 inline h-3.5 w-3.5 text-muted/60" />;
    return sortOrder === 'asc' ? (
      <ChevronUp className="ml-1 inline h-3.5 w-3.5 text-honey-deep font-bold" />
    ) : (
      <ChevronDown className="ml-1 inline h-3.5 w-3.5 text-honey-deep font-bold" />
    );
  }

  return (
    <div>
      {/* Search Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-ink">Starter Roster & Profiles</h3>
          <p className="text-sm text-muted">
            Showing {processedRows.length} of {items.length} onboarding employees. Click any row to view profile.
          </p>
        </div>
        <label className="relative flex items-center w-full sm:w-auto">
          <Search aria-hidden className="pointer-events-none absolute left-3 h-4 w-4 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search starter, role, team..."
            aria-label="Search starter, role, or team"
            className="h-10 w-full rounded-full border border-border bg-surface pl-9 pr-4 text-sm text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-honey focus-visible:outline-offset-2 sm:w-64"
          />
        </label>
      </div>

      {/* DESKTOP TABLE VIEW (md breakpoint and above) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted select-none">
              <th className="pb-3 pl-1 font-medium">
                <button
                  type="button"
                  onClick={() => handleSort('name')}
                  className="flex items-center hover:text-ink focus-visible:outline-none"
                >
                  Starter Name {renderSortIndicator('name')}
                </button>
              </th>
              <th className="pb-3 font-medium">
                <button
                  type="button"
                  onClick={() => handleSort('team')}
                  className="flex items-center hover:text-ink focus-visible:outline-none"
                >
                  Department / Team {renderSortIndicator('team')}
                </button>
              </th>
              <th className="pb-3 font-medium">
                <button
                  type="button"
                  onClick={() => handleSort('startDate')}
                  className="flex items-center hover:text-ink focus-visible:outline-none"
                >
                  Start Date {renderSortIndicator('startDate')}
                </button>
              </th>
              <th className="pb-3 font-medium">
                <button
                  type="button"
                  onClick={() => handleSort('progress')}
                  className="flex items-center hover:text-ink focus-visible:outline-none"
                >
                  Progress {renderSortIndicator('progress')}
                </button>
              </th>
              <th className="pb-3 font-medium">Buddy</th>
              <th className="pb-3 pr-1 font-medium">
                <button
                  type="button"
                  onClick={() => handleSort('status')}
                  className="flex items-center hover:text-ink focus-visible:outline-none"
                >
                  Status {renderSortIndicator('status')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {processedRows.map((s) => {
              const status = STATUS_TONE[s.status];
              return (
                <tr
                  key={s.id}
                  onClick={() => onSelectStarter(s)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectStarter(s);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View profile for ${s.name}`}
                  className="group cursor-pointer border-b border-border/60 transition-colors hover:bg-sunk/80 focus-visible:bg-sunk/80 focus-visible:outline-2 focus-visible:outline-honey"
                >
                  <td className="py-3.5 pl-1">
                    <div className="flex items-center gap-3">
                      <Avatar initials={s.initials} accent={s.accent} size={38} />
                      <div>
                        <div className="font-semibold text-ink group-hover:text-honey-deep transition-colors">
                          {s.name}
                        </div>
                        <div className="text-xs text-muted">{s.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-muted font-medium">{s.team}</td>
                  <td className="py-3.5 text-muted text-xs">{s.startDate}</td>
                  <td className="py-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-sunk">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-300',
                              s.status === 'ahead' ? 'bg-sage' : s.status === 'at-risk' ? 'bg-pink' : 'gradient-hm',
                            )}
                            style={{ width: `${s.progress}%` }}
                          />
                        </div>
                        <span className="numeral text-xs font-bold text-ink">{s.progress}%</span>
                      </div>
                      <div className="text-[11px] text-muted">
                        {s.completedTasksCount}/{s.totalTasks} Tasks Completed
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-muted">{s.buddy}</td>
                  <td className="py-3.5 pr-1">
                    <Badge tone={status.tone}>{status.label}</Badge>
                  </td>
                </tr>
              );
            })}
            {processedRows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted">
                  No starters match that search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW (screens below md) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {processedRows.map((s) => {
          const status = STATUS_TONE[s.status];
          return (
            <div
              key={s.id}
              onClick={() => onSelectStarter(s)}
              className="rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-soft)] transition-all hover:border-honey/50 active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar initials={s.initials} accent={s.accent} size={42} />
                  <div>
                    <h4 className="font-bold text-ink text-base">{s.name}</h4>
                    <p className="text-xs text-muted">{s.role}</p>
                  </div>
                </div>
                <Badge tone={status.tone}>{status.label}</Badge>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted border-t border-border/60 pt-3">
                <div>
                  <span className="block font-semibold text-ink">Department:</span>
                  {s.team}
                </div>
                <div>
                  <span className="block font-semibold text-ink">Start Date:</span>
                  {s.startDate}
                </div>
              </div>

              {/* Progress Visualization */}
              <div className="mt-3 rounded-xl bg-sunk/60 p-3">
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-muted">Progress</span>
                  <span className="numeral font-bold text-ink">
                    {s.completedTasksCount}/{s.totalTasks} Tasks ({s.progress}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-border/60">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      s.status === 'ahead' ? 'bg-sage' : s.status === 'at-risk' ? 'bg-pink' : 'gradient-hm',
                    )}
                    style={{ width: `${s.progress}%` }}
                  />
                </div>
              </div>

              {/* Touch-Friendly View Profile Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectStarter(s);
                }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-xs font-semibold text-surface shadow-xs transition-opacity active:opacity-80"
              >
                View Profile <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}

        {processedRows.length === 0 && (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-muted">
            No starters match that search query.
          </div>
        )}
      </div>
    </div>
  );
}
