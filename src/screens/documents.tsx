import { useMemo, useState } from 'react';
import { ArrowLeft, BookMarked, Clock, FileText, Search } from 'lucide-react';
import { useOnboarding } from '@/state/onboarding-context';
import { useToast } from '@/state/toast-context';
import { DOCUMENTS, type KeyDocument } from '@/data/documents';
import { Badge } from '@/components/ui/badge';
import { HexFrame } from '@/components/ui/hex-frame';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { cn } from '@/lib/cn';

const CATEGORIES: { id: KeyDocument['category'] | 'all'; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'policy', label: 'Policy' },
  { id: 'how-to', label: 'How to' },
  { id: 'reference', label: 'Reference' },
  { id: 'template', label: 'Template' },
];

/**
 * "Key documents, one place": a direct answer to the research finding that new
 * starters spend hours a day hunting across scattered tools. Search plus a
 * category filter, and role-specific docs surface first for a personalised feel.
 */
export function Documents() {
  const { state, dispatch } = useOnboarding();
  const { push } = useToast();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<KeyDocument['category'] | 'all'>('all');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DOCUMENTS.filter((d) => {
      const matchesQuery =
        q.length === 0 || d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
      const matchesCategory = category === 'all' || d.category === category;
      return matchesQuery && matchesCategory;
    }).sort((a, b) => {
      // Role-specific documents lead, mirroring the personalised plan.
      const aMine = state.role && a.roles !== 'all' && a.roles.includes(state.role) ? 0 : 1;
      const bMine = state.role && b.roles !== 'all' && b.roles.includes(state.role) ? 0 : 1;
      return aMine - bMine;
    });
  }, [query, category, state.role]);

  return (
    <div className="mx-auto w-full max-w-4xl px-5 pb-24 pt-8">
      <button
        onClick={() => dispatch({ type: 'go', view: 'dashboard' })}
        className="mb-6 inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to your plan
      </button>

      <Reveal>
        <h1 className="text-3xl font-semibold text-ink sm:text-4xl">Key documents</h1>
        <p className="mt-2 max-w-xl text-muted">
          The handful of documents worth knowing, not the whole wiki. Search, or filter
          by what kind of answer you need.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="mt-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents…"
            aria-label="Search documents"
            className="w-full rounded-2xl border border-border bg-surface py-3 pl-11 pr-4 text-ink outline-none focus-visible:outline-2 focus-visible:outline-honey"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              aria-pressed={category === c.id}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                category === c.id ? 'gradient-hm text-charcoal' : 'bg-sunk text-muted hover:text-ink',
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </Reveal>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {results.length} {results.length === 1 ? 'document' : 'documents'}
      </p>

      {results.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-dashed border-border p-8 text-center text-muted">
          Nothing matches “{query}”. Try a different word, or clear the filter.
        </div>
      ) : (
        <RevealGroup as="ul" className="mt-4 grid gap-3" stagger={0.04}>
          {results.map((doc) => (
            <RevealItem as="li" key={doc.id} y={12}>
              <button
                onClick={() => push(`Saved “${doc.title}” to your bookmarks.`)}
                className="flex w-full items-start gap-4 rounded-2xl border border-border bg-surface p-4 text-left shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)]"
              >
                <HexFrame accent={doc.category === 'template' ? 'pink' : 'sage'} size={42}>
                  <FileText className="h-4.5 w-4.5 text-charcoal" strokeWidth={1.9} />
                </HexFrame>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-ink">{doc.title}</h3>
                    <Badge tone="muted">{doc.category}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted">{doc.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {doc.minutes} min read
                    </span>
                    <span>{doc.updated}</span>
                  </div>
                </div>
                <BookMarked className="mt-1 h-4 w-4 shrink-0 text-muted" />
              </button>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  );
}
