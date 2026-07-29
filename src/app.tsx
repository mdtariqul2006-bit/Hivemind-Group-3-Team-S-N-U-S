import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useOnboarding } from '@/state/onboarding-context';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';
import { AnimatedBackground } from '@/components/motion/animated-background';
import { TopBar } from '@/components/layout/top-bar';
import { Landing } from '@/screens/landing';
import { Personalise } from '@/screens/personalise';
import { Dashboard } from '@/screens/dashboard';
import { People } from '@/screens/people';
import { Documents } from '@/screens/documents';
import { TaskDetail } from '@/screens/task-detail';
import { Milestone } from '@/screens/milestone';
import { AdminDashboard } from '@/screens/admin-dashboard';
import { AdminLogin } from '@/screens/admin-login';
import { ToastStack } from '@/components/ui/toast-stack';
import { useAuth } from '@/state/auth-context';
import { EASE_OUT } from '@/lib/motion';

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

  const openTask = state.openTaskId
    ? (tasks.find((t) => t.id === state.openTaskId) ?? null)
    : null;

  // The admin console ships its own sidebar and header, so the site top bar is
  // deliberately left out of that view.
  const showTopBar =
    state.view === 'dashboard' || state.view === 'people' || state.view === 'documents';

  return (
    <div className="relative min-h-[100dvh]">
      <AnimatedBackground />

      {/* Skip link, keyboard users land straight on the content. */}
      <a
        href="#main"
        className="sr-only rounded-full bg-surface px-4 py-2 text-sm font-medium text-ink shadow-[var(--shadow-soft)] focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>

      {showTopBar && <TopBar title={TITLES[state.view]} />}

      <main id="main">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.view}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={reduce ? { duration: 0.15 } : { duration: 0.4, ease: EASE_OUT }}
          >
            {state.view === 'landing' && <Landing />}
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
      {state.pendingCelebration && <Milestone phaseId={state.pendingCelebration} />}

      <ToastStack />
    </div>
  );
}
