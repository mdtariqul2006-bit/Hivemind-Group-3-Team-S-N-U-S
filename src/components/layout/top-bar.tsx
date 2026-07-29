import { motion, useReducedMotion } from 'framer-motion';
import { FileText, Users } from 'lucide-react';
import { NEW_HIRE } from '@/data/roles';
import { useOnboarding } from '@/state/onboarding-context';
import type { View } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { Wordmark } from '@/components/ui/logo';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/cn';

// Starter facing navigation only. The admin console is reached through the
// Login button on the landing page, so new starters are never shown a tab that
// leads to a sign in wall they cannot pass.
const NAV: { view: View; label: string; icon: typeof Users }[] = [
  { view: 'dashboard', label: 'Dashboard', icon: Users },
  { view: 'people', label: 'People', icon: Users },
  { view: 'documents', label: 'Documents', icon: FileText },
];

/**
 * Persistent frosted top bar: logo mark, contextual page title, theme toggle and
 * Alex's avatar. Present on every screen except the immersive landing hero, where
 * the header is part of the hero itself.
 */
export function TopBar({ title }: { title?: string }) {
  const reduce = useReducedMotion();
  const { state, dispatch } = useOnboarding();

  return (
    <motion.header
      initial={reduce ? false : { y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 border-b border-border/70 frosted"
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-5">
        <button
          onClick={() => dispatch({ type: 'go', view: state.role ? 'dashboard' : 'landing' })}
          className="shrink-0 rounded-full"
          aria-label="HiveMind home"
        >
          <Wordmark />
        </button>

        {/* The title sits in the flex flow rather than absolutely centred, so it
            can never sit underneath the navigation. It truncates instead. */}
        {title && (
          <span
            className={cn(
              'hidden min-w-0 flex-1 truncate text-center text-sm font-medium text-muted lg:block',
            )}
          >
            {title}
          </span>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <nav className="mr-1.5 hidden items-center gap-1 sm:flex" aria-label="Quick links">
            {NAV.map((n) => (
              <button
                key={n.view}
                onClick={() => dispatch({ type: 'go', view: n.view })}
                aria-current={state.view === n.view ? 'page' : undefined}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors',
                  state.view === n.view ? 'bg-honey-wash text-honey-deep' : 'text-muted hover:bg-sunk hover:text-ink',
                )}
              >
                <n.icon className="h-4 w-4" /> {n.label}
              </button>
            ))}
          </nav>
          <ThemeToggle />
          <Avatar initials="AL" accent="honey" size={38} presence="online" />
          <span className="sr-only">{NEW_HIRE}</span>
        </div>
      </div>
    </motion.header>
  );
}
