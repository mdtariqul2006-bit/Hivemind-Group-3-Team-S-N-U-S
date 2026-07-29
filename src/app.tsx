import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useOnboarding } from '@/state/onboarding-context';
import { useAuth } from '@/state/auth-context';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';
import { AnimatedBackground } from '@/components/motion/animated-background';
import { TopBar } from '@/components/layout/top-bar';
import { Landing } from '@/screens/landing';
import { Auth } from '@/screens/auth';
import { Personalise } from '@/screens/personalise';
import { Dashboard } from '@/screens/dashboard';
import { People } from '@/screens/people';
import { Documents } from '@/screens/documents';
import { TaskDetail } from '@/screens/task-detail';
import { Milestone } from '@/screens/milestone';
import { AdminDashboard } from '@/screens/admin-dashboard';
import { ToastStack } from '@/components/ui/toast-stack';
import { EASE_OUT } from '@/lib/motion';
import type { View } from '@/types';

const TITLES: Record<string, string> = {
  dashboard: 'Your first 30 days',
  people: 'People & support',
  documents: 'Key documents',
  admin: 'Enterprise Admin Console',
};

export function App() {
  const reduce = useReducedMotion();
  const { state, tasks } = useOnboarding();
  const { user } = useAuth();
  useSmoothScroll();

  const openTask = state.openTaskId
    ? (tasks.find((t) => t.id === state.openTaskId) ?? null)
    : null;

  // The Admin Panel is admin-only. Anyone else who lands on that view (a stale
  // link, a direct dispatch) is bounced to sign in instead of seeing it.
  const view: View = state.view === 'admin' && user?.role !== 'admin' ? 'auth' : state.view;

  const showTopBar =
    view === 'dashboard' || view === 'people' || view === 'documents' || view === 'admin';

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

      {showTopBar && <TopBar title={TITLES[view]} />}

      <main id="main">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={reduce ? { duration: 0.15 } : { duration: 0.4, ease: EASE_OUT }}
          >
            {view === 'landing' && <Landing />}
            {view === 'auth' && <Auth />}
            {view === 'personalise' && <Personalise />}
            {view === 'dashboard' && <Dashboard />}
            {view === 'people' && <People />}
            {view === 'documents' && <Documents />}
            {view === 'admin' && <AdminDashboard />}
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
