import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { useToast } from '@/state/toast-context';
import { springSoft } from '@/lib/motion';
import { cn } from '@/lib/cn';

/**
 * Renders the toast queue, bottom-centre on mobile, bottom-right on desktop, as
 * an aria-live polite region so confirmations reach screen-reader users without
 * stealing focus.
 */
export function ToastStack() {
  const { toasts, dismiss } = useToast();
  const reduce = useReducedMotion();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
            transition={springSoft}
            className={cn(
              'pointer-events-auto flex max-w-sm items-center gap-3 rounded-2xl border border-border px-4 py-3 shadow-[var(--shadow-lift)]',
              t.tone === 'honey' ? 'bg-honey-wash' : 'bg-sage-wash',
            )}
          >
            <CheckCircle2 className="h-5 w-5 shrink-0 text-honey-deep" />
            <p className="text-sm text-ink">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="ml-1 shrink-0 rounded-full p-1 text-muted transition-colors hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
