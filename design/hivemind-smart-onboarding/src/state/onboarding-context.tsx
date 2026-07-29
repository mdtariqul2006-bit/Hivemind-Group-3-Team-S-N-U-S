import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import type {
  LearningStyle,
  OnboardingState,
  PhaseId,
  RoleId,
  Task,
  View,
} from '@/types';
import { PHASES } from '@/data/roles';
import { tasksForRole } from '@/data/tasks';

type Action =
  | { type: 'go'; view: View }
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
        celebratedPhases: pending
          ? [...state.celebratedPhases, pending]
          : state.celebratedPhases,
      };
    }
    case 'dismiss-celebration':
      return { ...state, pendingCelebration: null };
    case 'reset':
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
  const [state, dispatch] = useReducer(reducer, initialState);

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
