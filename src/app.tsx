import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useOnboarding } from '@/state/onboarding-context';
import { useAuth } from '@/state/auth-context';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';
import { useHistorySync } from '@/hooks/use-history-sync';
import { HoneycombCanvas } from '@/components/motion/honeycomb-canvas';
import { TopBar } from '@/components/layout/top-bar';
import { WorkspaceTabBar } from '@/components/layout/workspace-nav';
import { Landing } from '@/screens/landing';
import { Auth } from '@/screens/auth';
import { Personalise } from '@/screens/personalise';
import { Dashboard } from '@/screens/dashboard';
import { People } from '@/screens/people';
import { Documents } from '@/screens/documents';
import { TaskDetail } from '@/screens/task-detail';
import { Milestone } from '@/screens/milestone';
import { AdminDashboard } from '@/screens/admin-dashboard';
import { AdminLogin } from '@/screens/admin-login';
import { ToastStack } from '@/components/ui/toast-stack';
import { AssistantLauncher } from '@/components/assistant/assistant-launcher';
import { EASE_OUT } from '@/lib/motion';
import { cn } from '@/lib/cn';

const TITLES: Record<string, string> = {
  dashboard: 'Your first 30 days',
  people: 'People & support',
  documents: 'Key documents',
};

export function App() {
  const reduce = useReducedMotion();
  const { state, tasks } = useOnboarding();
  const { isAuthenticated, ready } = useAuth();
  useSmoothScroll();
  useHistorySync();

  const openTask = state.openTaskId
    ? (tasks.find((t) => t.id === state.openTaskId) ?? null)
    : null;

  // The admin console ships its own sidebar and header, so the site top bar is
  // deliberately left out of that view.
  const showTopBar =
    state.view === 'dashboard' || state.view === 'people' || state.view === 'documents';

  return (
    // overflow-x-clip, not hidden: decorative glows and blur blobs are placed
    // deliberately outside their cards and must not drag the whole document
    // into sideways scrolling on a phone. `clip` does this without creating a
    // scroll container or a containing block, so position:fixed children like
    // the workspace tab bar and Whobee still anchor to the viewport.
    <div className="relative min-h-[100dvh] overflow-x-clip">
      <HoneycombCanvas />

      {/* Skip link, keyboard users land straight on the content. */}
      <a
        href="#main"
        className="sr-only rounded-full bg-surface px-4 py-2 text-sm font-medium text-ink shadow-[var(--shadow-soft)] focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>

      {showTopBar && <TopBar title={TITLES[state.view]} />}

      {/* The tab bar is fixed over the content, so the workspace screens need
          room underneath them or the last card sits behind it. Only on the
          screens that actually show it, and only below sm where it exists. */}
      <main id="main" className={cn(showTopBar && 'pb-[4.5rem] sm:pb-0')}>
        <AnimatePresence mode="wait">
          <motion.div
            key={state.view}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={reduce ? { duration: 0.15 } : { duration: 0.4, ease: EASE_OUT }}
          >
            {state.view === 'landing' && <Landing />}
            {state.view === 'auth' && <Auth />}
            {state.view === 'personalise' && <Personalise />}
            {state.view === 'dashboard' && <Dashboard />}
            {state.view === 'people' && <People />}
            {state.view === 'documents' && <Documents />}
            {/* Protected route: the console renders only against a valid token.
                While the stored token is being checked we hold the frame so the
                login form does not flash for an already signed in admin. */}
            {state.view === 'admin' &&
              (!ready ? (
                <div className="min-h-[60dvh]" />
              ) : isAuthenticated ? (
                <AdminDashboard />
              ) : (
                <AdminLogin />
              ))}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Task detail overlays the current screen and shares a layoutId with its card. */}
      <AnimatePresence>{openTask && <TaskDetail key="task" task={openTask} />}</AnimatePresence>

      {/* Milestone celebration, only when a phase was just completed. */}
      <AnimatePresence>
        {state.pendingCelebration && <Milestone key="milestone" phaseId={state.pendingCelebration} />}
      </AnimatePresence>

      {/* Only on the workspace screens, which are the ones the tab bar's
          destinations point at. The landing page and the wizard have their own
          full-screen flow and no business showing tabs. */}
      {showTopBar && <WorkspaceTabBar />}

      {/* Not shown on the admin console, that surface has its own audience and
          chrome, see docs/onboarding-assistant-spec.md section 4. Lifted clear
          of the tab bar on the screens that show one, otherwise Whobee sits on
          top of the Resources tab and blocks it. */}
      {state.view !== 'admin' && <AssistantLauncher liftedForTabBar={showTopBar} />}

      <ToastStack />
    </div>
  );
}
