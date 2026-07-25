import type { OnboardingState } from '@/types';

const STORAGE_KEY = 'hm-onboarding-state-v1';

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
    return {
      ...initial,
      ...parsed,
      // Ensure essential fields retain fallback structure if schema evolves
      completedTaskIds: Array.isArray(parsed.completedTaskIds) ? parsed.completedTaskIds : [],
      checkedItems: parsed.checkedItems && typeof parsed.checkedItems === 'object' ? parsed.checkedItems : {},
      celebratedPhases: Array.isArray(parsed.celebratedPhases) ? parsed.celebratedPhases : [],
    };
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
