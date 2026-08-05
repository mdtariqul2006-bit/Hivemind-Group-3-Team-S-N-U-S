import { motion, useReducedMotion } from 'framer-motion';
import { FileText, LayoutDashboard, Users } from 'lucide-react';
import { useOnboarding } from '@/state/onboarding-context';
import type { View } from '@/types';
import { cn } from '@/lib/cn';

/**
 * The member's workspace destinations, defined once and shared by both the
 * top bar's inline nav and the mobile tab bar below, so the two can never
 * drift apart.
 *
 * Starter facing only. The admin console is reached through the Login button
 * on the landing page, so a new starter is never shown a tab that leads to a
 * sign in wall they cannot pass.
 */
export const WORKSPACE_NAV: { view: View; label: string; icon: typeof Users }[] = [
  { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { view: 'people', label: 'People', icon: Users },
  { view: 'documents', label: 'Resources', icon: FileText },
];

/**
 * The workspace tab bar, shown only below the `sm` breakpoint where the top
 * bar's inline nav is hidden.
 *
 * Without this there was no navigation at all on a phone: the top bar dropped
 * its links at `sm` and offered nothing in their place, so a signed in member
 * was stranded on whichever screen they happened to land on and could not
 * reach People or Resources. Usability sessions run on phones, so this was the
 * difference between the workspace being explorable and being a dead end.
 *
 * Fixed to the bottom rather than folded into a hamburger: three destinations
 * is few enough to show them all, and the bottom edge is the easiest place to
 * reach one handed.
 */
export function WorkspaceTabBar() {
  const { state, dispatch } = useOnboarding();
  const reduce = useReducedMotion();

  return (
    <nav
      aria-label="Workspace"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 frosted pb-[env(safe-area-inset-bottom)] sm:hidden"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {WORKSPACE_NAV.map((item) => {
          const active = state.view === item.view;
          return (
            <button
              key={item.view}
              onClick={() => dispatch({ type: 'go', view: item.view })}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors',
                active ? 'text-honey-deep' : 'text-muted',
              )}
            >
              {/* The active pill is one shared element that slides between
                  tabs, so the change of screen reads as movement rather than
                  two separate things blinking. */}
              {active && (
                <motion.span
                  layoutId="workspace-tab-pill"
                  aria-hidden
                  className="absolute inset-x-3 inset-y-1 -z-10 rounded-2xl bg-honey-wash"
                  transition={
                    reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }
                  }
                />
              )}
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
