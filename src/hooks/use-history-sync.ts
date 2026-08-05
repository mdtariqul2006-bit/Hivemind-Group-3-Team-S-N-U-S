import { useEffect, useRef } from 'react';
import { useOnboarding } from '@/state/onboarding-context';
import type { AdminSection, View } from '@/types';

/**
 * Keeps the browser URL in step with the view state, so back and forward work.
 *
 * The app navigates by dispatching to a reducer, which never touched the URL.
 * That left the browser with a single history entry, so back exited the site
 * instead of returning to the previous screen, and a refresh always dropped the
 * user on the landing page.
 *
 * Routing lives in the hash rather than the path because this is a static site
 * with no server. A path like /dashboard would 404 on refresh anywhere that
 * cannot rewrite unknown paths to index.html, GitHub Pages for example. A hash
 * never reaches the server, so deep links and refreshes work on any host with
 * no configuration.
 */

const VIEW_SEGMENTS: Record<View, string> = {
  landing: '',
  auth: 'sign-in',
  personalise: 'personalise',
  dashboard: 'dashboard',
  people: 'people',
  documents: 'documents',
  admin: 'admin',
};

const SEGMENT_TO_VIEW = new Map<string, View>(
  (Object.entries(VIEW_SEGMENTS) as [View, string][]).map(([view, seg]) => [seg, view]),
);

export interface Route {
  view: View;
  taskId: string | null;
  /** Only meaningful for the admin view. */
  section: AdminSection | null;
}

const ADMIN_SECTIONS: AdminSection[] = [
  'overview',
  'starters',
  'analytics',
  'documents',
  'security',
];

/**
 * The route the page was opened on. Used to seed the reducer so the very first
 * render is already the right screen. Dispatching this from a mount effect
 * instead would make the app render the landing page and then transition away
 * from it, which AnimatePresence treats as a real exit and can leave stuck at
 * opacity zero, showing a blank screen on a deep link.
 */
export function routeFromHash(): Route {
  if (typeof window === 'undefined') return { view: 'landing', taskId: null, section: null };
  return parseHash(window.location.hash);
}

function parseHash(hash: string): Route {
  const segments = hash.replace(/^#/, '').split('/').filter(Boolean);
  const view = segments.length === 0 ? 'landing' : (SEGMENT_TO_VIEW.get(segments[0]!) ?? 'landing');
  const taskId = segments[1] === 'task' && segments[2] ? segments[2] : null;
  // The admin console addresses its own sections, for example #/admin/analytics.
  const candidate = segments[1] as AdminSection | undefined;
  const section =
    view === 'admin' && candidate && ADMIN_SECTIONS.includes(candidate) ? candidate : null;
  return { view, taskId, section };
}

function buildHash({ view, taskId, section }: Route): string {
  const parts = [VIEW_SEGMENTS[view]].filter(Boolean);
  if (view === 'admin' && section) parts.push(section);
  else if (taskId) parts.push('task', taskId);
  return parts.length ? `#/${parts.join('/')}` : '#/';
}

function sameRoute(a: Route, b: Route): boolean {
  return a.view === b.view && a.taskId === b.taskId && a.section === b.section;
}

export function useHistorySync(): void {
  const { state, dispatch } = useOnboarding();

  /** The first write normalises the address bar, it is not a navigation. */
  const firstWrite = useRef(true);

  // Follow back and forward. The first render is already seeded from the URL by
  // the reducer, so there is deliberately no apply on mount here.
  useEffect(() => {
    function applyRoute() {
      const route = parseHash(window.location.hash);
      dispatch({ type: 'go', view: route.view });
      dispatch({ type: 'set-admin-section', section: route.section ?? 'overview' });
      if (route.taskId) dispatch({ type: 'open-task', id: route.taskId });
      else dispatch({ type: 'close-task' });
    }

    window.addEventListener('popstate', applyRoute);
    window.addEventListener('hashchange', applyRoute);
    return () => {
      window.removeEventListener('popstate', applyRoute);
      window.removeEventListener('hashchange', applyRoute);
    };
  }, [dispatch]);

  /**
   * Write the URL when the app itself navigates.
   *
   * This compares against the address bar rather than holding a "we are
   * applying a route from the URL" flag. That flag was a trap: applying a route
   * for the view the app is already on dispatches a no-op, so none of this
   * effect's dependencies change, the effect never runs, and the flag is never
   * cleared. From then on every real navigation hit the guard and returned
   * without writing, so the view changed while the URL sat frozen on whatever
   * it was. Landing on #/dashboard and then clicking People was enough to
   * reproduce it.
   *
   * Comparing to the URL needs no flag. This effect only runs after the state
   * it reads has already updated, so on back or forward the state has caught up
   * by the time it runs, the built hash matches the bar, and nothing is
   * written, which is exactly the no-duplicate-history-entry behaviour the flag
   * was there to protect.
   */
  useEffect(() => {
    const current: Route = {
      view: state.view,
      taskId: state.openTaskId,
      section: state.view === 'admin' ? state.adminSection : null,
    };
    const currentHash = window.location.hash || '#/';
    const next = buildHash(current);

    // Already correct: either the app just followed the URL, or nothing moved.
    if (sameRoute(parseHash(currentHash), current) && next === currentHash) {
      firstWrite.current = false;
      return;
    }
    if (next === currentHash) {
      firstWrite.current = false;
      return;
    }
    if (firstWrite.current) {
      // Tidy the bar on first paint, for example "#" becoming "#/", without
      // adding an entry the user would have to press back through.
      firstWrite.current = false;
      window.history.replaceState(null, '', next);
      return;
    }
    window.history.pushState(null, '', next);
  }, [state.view, state.openTaskId, state.adminSection]);
}
