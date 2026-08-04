import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Send, X } from 'lucide-react';
import { useAssistant } from '@/state/assistant-context';
import { trapFocus } from '@/components/ui/modal';
import { springSoft } from '@/lib/motion';
import { AssistantMessage } from '@/components/assistant/assistant-message';

/**
 * The expanded chat panel. Anchored above the launcher bubble, bottom right,
 * rather than a centred modal, so the rest of the page stays visible and
 * usable while it is open. Focus trapped while open, Escape closes it, focus
 * returns to the launcher on close, same contract as ui/modal.tsx.
 */
export function AssistantPanel({ labelledBy }: { labelledBy: string }) {
  const { isOpen, close, messages, ask } = useAssistant();
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    restoreRef.current = document.activeElement as HTMLElement;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') trapFocus(e, panelRef.current);
    };
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>('input')?.focus();
    });
    return () => {
      document.removeEventListener('keydown', onKey);
      restoreRef.current?.focus?.();
    };
  }, [isOpen, close]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: reduce ? 'auto' : 'smooth' });
  }, [messages, reduce]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    ask(draft);
    setDraft('');
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          className="fixed bottom-24 right-4 z-50 flex h-[min(560px,70dvh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-lift)] sm:right-6"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 16 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
          transition={reduce ? { duration: 0.15 } : springSoft}
        >
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 id={labelledBy} className="text-sm font-semibold text-ink">
              Onboarding assistant
            </h2>
            <button
              onClick={close}
              aria-label="Close assistant"
              className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-sunk hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div
            ref={listRef}
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((m) => (
              <AssistantMessage key={m.id} message={m} />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask a basic question..."
              aria-label="Ask the onboarding assistant a question"
              className="h-10 flex-1 rounded-full border border-border bg-sunk px-4 text-sm text-ink outline-none focus-visible:border-honey"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full gradient-hm text-charcoal disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
