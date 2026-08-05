import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useOnboarding } from '@/state/onboarding-context';
import { useMember } from '@/state/member-context';
import { Wordmark } from '@/components/ui/logo';
import { ThemeToggle } from './theme-toggle';
import { ProfileMenu } from './profile-menu';
import { ProfileModal } from './profile-modal';
import { SettingsModal } from './settings-modal';
import { WORKSPACE_NAV } from './workspace-nav';
import { cn } from '@/lib/cn';

/**
 * Persistent frosted top bar: logo mark, contextual page title, theme toggle and
 * Alex's avatar. Present on every screen except the immersive landing hero and
 * the admin console, which ship their own headers.
 */
export function TopBar({ title }: { title?: string }) {
  const reduce = useReducedMotion();
  const { state, dispatch } = useOnboarding();
  const { user, signOut } = useMember();
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  function handleSignOut() {
    signOut();
    // Clear the onboarding plan too, otherwise the next person to sign up on
    // this browser inherits the previous starter's role and completed tasks.
    dispatch({ type: 'reset' });
  }

  return (
    <motion.header
      initial={reduce ? false : { y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 border-b border-border/70 frosted"
    >
      {/* The title sits beside the logo as a breadcrumb, in the flex flow, so it
          cannot draw underneath the navigation the way the old centred version did. */}
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5">
        <div className="flex min-w-0 items-center gap-3">
          {/* The mark always goes home, for signed in members too. A logo that
              lands somewhere different depending on who you are is the kind of
              thing people stop trusting, and there are nav links for the
              dashboard already. */}
          <button
            onClick={() => dispatch({ type: 'go', view: 'landing' })}
            className="flex shrink-0 items-center gap-2.5 rounded-full"
            aria-label="HiveMind home"
          >
            <Wordmark />
          </button>

          {title && (
            <div className="hidden min-w-0 items-center gap-2 sm:flex">
              <span className="text-border">/</span>
              <span className={cn('truncate text-xs font-semibold text-muted')}>{title}</span>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {/* Hidden below sm, where the fixed WorkspaceTabBar takes over. */}
          <nav className="mr-1.5 hidden items-center gap-1 sm:flex" aria-label="Workspace">
            {WORKSPACE_NAV.map((n) => (
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
          {/* Signing out lives inside this menu now, rather than as its own
              button beside a decorative avatar that did nothing when clicked.
              The dashboard is reachable without an account, through the
              personalise wizard, so signed out visitors get a way in rather
              than an empty space where the avatar would be. */}
          {user ? (
            <ProfileMenu
              onOpenProfile={() => setProfileOpen(true)}
              onOpenSettings={() => setSettingsOpen(true)}
              onSignOut={handleSignOut}
            />
          ) : (
            <button
              onClick={() => dispatch({ type: 'go', view: 'auth' })}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:bg-sunk"
            >
              Sign in
            </button>
          )}
        </div>
      </div>

      {user && (
        <>
          <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
          <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </>
      )}
    </motion.header>
  );
}
