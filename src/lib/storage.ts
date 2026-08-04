import type { LearningStyle, OnboardingState, RoleId, View } from '@/types';

const STORAGE_KEY = 'hm-onboarding-state-v1';

/**
 * Roles the app has task data for. A stored role outside this set (an older
 * schema, or hand edited storage) used to reach tasksForRole and throw on
 * ROLE_TASKS[role] being undefined, which white screened the whole app on
 * every load with no way to recover from the UI.
 */
const VALID_ROLES: RoleId[] = ['designer', 'engineer', 'marketer'];

function restorableRole(value: unknown): RoleId | null {
  return VALID_ROLES.includes(value as RoleId) ? (value as RoleId) : null;
}

const VALID_LEARNING_STYLES: LearningStyle[] = ['video', 'reading', 'hands-on'];

function restorableLearningStyle(value: unknown): LearningStyle | null {
  return VALID_LEARNING_STYLES.includes(value as LearningStyle)
    ? (value as LearningStyle)
    : null;
}

/**
 * Views that are safe to reopen on a reload. Deliberately excludes 'admin' and
 * 'auth' (both are gated on a session that is verified separately, restoring
 * them would flash a login form) and 'personalise' (a half finished wizard is
 * better restarted than resumed from a stale step).
 */
const RESTORABLE_VIEWS: View[] = ['landing', 'dashboard', 'people', 'documents'];

function restorableView(value: unknown, fallback: View): View {
  return RESTORABLE_VIEWS.includes(value as View) ? (value as View) : fallback;
}

/**
 * Guarded localStorage access.
 *
 * Touching localStorage can throw, not just fail: Safari private mode and
 * blocked third party storage raise SecurityError on plain property access,
 * and a full quota raises QuotaExceededError on write. Callers here treat
 * storage as a cache that may be unavailable rather than as something that is
 * always there, so a blocked browser degrades to "nothing saved" instead of
 * taking a screen down with it.
 */
export function safeGetItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch (err) {
    console.warn(`Could not read "${key}" from storage:`, err);
    return null;
  }
}

export function safeSetItem(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    console.warn(`Could not write "${key}" to storage:`, err);
    return false;
  }
}

export function safeRemoveItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`Could not remove "${key}" from storage:`, err);
  }
}

/**
 * Local persistence layer for HiveMind onboarding state.
 *
 * Safely restores user selections, completed task IDs, checked sub-items, and milestone
 * celebrations across page reloads and browser sessions.
 */
export function loadPersistedState(initial: OnboardingState): OnboardingState {
  if (typeof window === 'undefined') return initial;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw);
    const restored: OnboardingState = {
      ...initial,
      ...parsed,
      // Ensure essential fields retain fallback structure if schema evolves
      completedTaskIds: Array.isArray(parsed.completedTaskIds) ? parsed.completedTaskIds : [],
      checkedItems: parsed.checkedItems && typeof parsed.checkedItems === 'object' ? parsed.checkedItems : {},
      celebratedPhases: Array.isArray(parsed.celebratedPhases) ? parsed.celebratedPhases : [],
      // Both are validated against known values rather than trusted from the
      // spread above, so unrecognised data degrades to "not chosen yet"
      // instead of crashing task lookup.
      role: restorableRole(parsed.role),
      learningStyle: restorableLearningStyle(parsed.learningStyle),
      view: restorableView(parsed.view, initial.view),
      // Never restore a transient overlay. Reloading straight back into a task
      // sheet or a celebration modal is disorienting, and the celebration in
      // particular is already recorded in celebratedPhases.
      openTaskId: null,
      pendingCelebration: null,
    };
    // The dashboard renders as an empty "all caught up" shell without a role,
    // so a stored view that depends on one falls back to the landing page.
    if (!restored.role && restored.view !== 'landing') {
      restored.view = 'landing';
    }
    return restored;
  } catch (err) {
    console.warn('Failed to load persisted onboarding state from storage:', err);
    return initial;
  }
}

/**
 * Synchronizes state changes to local persistent storage.
 */
export function savePersistedState(state: OnboardingState): void {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      role: state.role,
      startDate: state.startDate,
      learningStyle: state.learningStyle,
      completedTaskIds: state.completedTaskIds,
      checkedItems: state.checkedItems,
      celebratedPhases: state.celebratedPhases,
      // Only stored when it is one of the restorable views, so a reload lands
      // back where the user was instead of on the marketing page.
      view: RESTORABLE_VIEWS.includes(state.view) ? state.view : undefined,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('Failed to persist onboarding state to storage:', err);
  }
}

/**
 * Clears stored onboarding session data.
 */
export function clearPersistedState(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear persisted onboarding state:', err);
  }
}
