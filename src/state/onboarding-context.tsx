import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import type {
  AdminSection,
  LearningStyle,
  OnboardingState,
  PhaseId,
  RoleId,
  Task,
  View,
} from '@/types';
import { PHASES } from '@/data/roles';
import { tasksForRole } from '@/data/tasks';
import { loadPersistedState, savePersistedState } from '@/lib/storage';
import { routeFromHash } from '@/hooks/use-history-sync';

/** Views that render nothing meaningful until a role has been picked. */
const ROLE_DEPENDENT: View[] = ['dashboard', 'people', 'documents'];

type Action =
  | { type: 'go'; view: View }
  | { type: 'set-admin-section'; section: AdminSection }
  | { type: 'set-role'; role: RoleId }
  | { type: 'set-start-date'; date: string }
  | { type: 'set-learning-style'; style: LearningStyle }
  | { type: 'finish-wizard' }
  | { type: 'open-task'; id: string }
  | { type: 'close-task' }
  | { type: 'toggle-check'; taskId: string; itemId: string }
  | { type: 'complete-task'; task: Task }
  | { type: 'dismiss-celebration' }
  | { type: 'reset' };

function defaultStartDate(): string {
  // Next Monday, so the seeded demo always opens on a sensible "first day".
  const d = new Date();
  const day = d.getDay();
  const add = ((8 - day) % 7) || 7;
  d.setDate(d.getDate() + add);
  return d.toISOString().slice(0, 10);
}

export const initialState: OnboardingState = {
  view: 'landing',
  adminSection: 'overview',
  role: null,
  startDate: defaultStartDate(),
  learningStyle: null,
  completedTaskIds: [],
  checkedItems: {},
  openTaskId: null,
  celebratedPhases: [],
  pendingCelebration: null,
};

function phaseNewlyComplete(
  role: RoleId,
  completedIds: string[],
  alreadyCelebrated: PhaseId[],
): PhaseId | null {
  const tasks = tasksForRole(role);
  for (const phase of PHASES) {
    if (alreadyCelebrated.includes(phase.id)) continue;
    const inPhase = tasks.filter((t) => t.phase === phase.id);
    const done = inPhase.every((t) => completedIds.includes(t.id));
    if (inPhase.length > 0 && done) return phase.id;
  }
  return null;
}

export function reducer(state: OnboardingState, action: Action): OnboardingState {
  switch (action.type) {
    case 'go':
      return { ...state, view: action.view };
    case 'set-admin-section':
      return { ...state, adminSection: action.section };
    case 'set-role':
      return { ...state, role: action.role };
    case 'set-start-date':
      return { ...state, startDate: action.date };
    case 'set-learning-style':
      return { ...state, learningStyle: action.style };
    case 'finish-wizard':
      return { ...state, view: 'dashboard' };
    case 'open-task':
      return { ...state, openTaskId: action.id };
    case 'close-task':
      return { ...state, openTaskId: null };
    case 'toggle-check': {
      const current = state.checkedItems[action.taskId] ?? [];
      const next = current.includes(action.itemId)
        ? current.filter((i) => i !== action.itemId)
        : [...current, action.itemId];
      return {
        ...state,
        checkedItems: { ...state.checkedItems, [action.taskId]: next },
      };
    }
    case 'complete-task': {
      if (state.completedTaskIds.includes(action.task.id)) return state;
      if (!state.role) return state;
      const completedTaskIds = [...state.completedTaskIds, action.task.id];
      const pending = phaseNewlyComplete(
        state.role,
        completedTaskIds,
        state.celebratedPhases,
      );
      return {
        ...state,
        completedTaskIds,
        openTaskId: null,
        pendingCelebration: pending,
      };
    }
    case 'dismiss-celebration':
      // A phase counts as celebrated once the modal has actually been seen and
      // dismissed. Recording it at completion time meant a reload while the
      // modal was open lost that phase's celebration permanently.
      return {
        ...state,
        pendingCelebration: null,
        celebratedPhases: state.pendingCelebration
          ? [...state.celebratedPhases, state.pendingCelebration]
          : state.celebratedPhases,
      };
    case 'reset':
      // No storage call here on purpose. Reducers must stay pure (React 19
      // StrictMode double invokes them), and the persistence effect below
      // writes the reset state straight back anyway, so clearing was both
      // impure and redundant.
      return { ...initialState, startDate: state.startDate };
    default:
      return state;
  }
}

interface OnboardingContextValue {
  state: OnboardingState;
  dispatch: Dispatch<Action>;
  tasks: Task[];
  progress: number;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const restored = loadPersistedState(init);
    // Re-arm a celebration that was on screen when the page was reloaded.
    // celebratedPhases is only written on dismissal, so an undismissed phase
    // is still eligible here and the milestone is not lost.
    const pending = restored.role
      ? phaseNewlyComplete(restored.role, restored.completedTaskIds, restored.celebratedPhases)
      : null;

    // A URL wins over the stored view, so a deep link or a refresh opens the
    // screen that was asked for. Seeding it here rather than dispatching after
    // mount means the first render is already correct, with no transition away
    // from the landing page. Role dependent screens still fall back when there
    // is no role, matching the rule the persistence layer already applies.
    const route = routeFromHash();
    const wanted =
      !restored.role && ROLE_DEPENDENT.includes(route.view) ? 'landing' : route.view;

    return {
      ...restored,
      view: wanted,
      adminSection: route.section ?? 'overview',
      openTaskId: wanted === route.view ? route.taskId : null,
      pendingCelebration: pending,
    };
  });

  useEffect(() => {
    savePersistedState(state);
  }, [state]);

  const value = useMemo<OnboardingContextValue>(() => {
    const tasks = state.role ? tasksForRole(state.role) : [];
    const progress =
      tasks.length === 0
        ? 0
        : Math.round((state.completedTaskIds.length / tasks.length) * 100);
    return { state, dispatch, tasks, progress };
  }, [state]);

  return (
    <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return ctx;
}
