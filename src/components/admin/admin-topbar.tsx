import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, Search, Bell, LogOut, ArrowLeftRight } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { useAuth } from '@/state/auth-context';
import { useOnboarding } from '@/state/onboarding-context';
import { easeOutFast } from '@/lib/motion';

/** Sticky header: menu trigger on mobile, search, theme toggle, and account menu. */
export function AdminTopbar({ title, onMenu }: { title: string; onMenu: () => void }) {
  const { admin, logout } = useAuth();
  const { dispatch } = useOnboarding();
  const reduce = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = admin?.name.split(' ').map((p) => p[0]).join('') ?? 'A';

  return (
    <header className="sticky top-0 z-30 border-b border-border frosted">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          onClick={onMenu}
          aria-label="Open navigation"
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-ink hover:bg-sunk lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="mr-auto truncate text-base font-semibold text-ink sm:text-lg">{title}</h1>

        <label className="relative hidden items-center md:flex">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted" />
          <input
            placeholder="Search console"
            className="h-10 w-56 rounded-full border border-border bg-surface pl-9 pr-4 text-sm text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-honey focus-visible:outline-offset-2"
          />
        </label>

        <button
          aria-label="Notifications"
          className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-ink hover:bg-sunk"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-honey ring-2 ring-[color:var(--hm-surface)]" />
        </button>

        <ThemeToggle />

        <div className="relative">
          <motion.button
            onClick={() => setMenuOpen((v) => !v)}
            whileTap={reduce ? undefined : { scale: 0.94 }}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="grid h-10 w-10 place-items-center rounded-full gradient-hm text-sm font-semibold text-charcoal"
          >
            {initials}
          </motion.button>

          <AnimatePresence>
            {menuOpen && (
              <>
                <button
                  aria-hidden
                  tabIndex={-1}
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setMenuOpen(false)}
                />
                <motion.div
                  role="menu"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.97 }}
                  transition={easeOutFast}
                  className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-lift)]"
                >
                  <div className="border-b border-border px-4 py-3">
                    <div className="text-sm font-medium text-ink">{admin?.name}</div>
                    <div className="truncate text-xs text-muted">{admin?.email}</div>
                  </div>
                  <button
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      dispatch({ type: 'go', view: 'dashboard' });
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-sunk"
                  >
                    <ArrowLeftRight className="h-4 w-4 text-muted" />
                    Switch to starter view
                  </button>
                  <button
                    role="menuitem"
                    onClick={logout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-sunk"
                  >
                    <LogOut className="h-4 w-4 text-muted" />
                    Sign out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
