export type RoleId = 'designer' | 'engineer' | 'marketer';

export type LearningStyle = 'video' | 'reading' | 'hands-on';

export type PhaseId = 'day-1' | 'week-1' | 'month-1';

export type View = 'landing' | 'auth' | 'personalise' | 'dashboard' | 'people' | 'documents' | 'admin';

export interface Role {
  id: RoleId;
  label: string;
  blurb: string;
  team: string;
  /** Shown on the wizard card so the choice feels consequential before it is made. */
  preview: string;
}

export interface Phase {
  id: PhaseId;
  label: string;
  /** Days after the start date this phase is anchored to. */
  offsetDays: number;
  /** The warm line shown when this phase is completed. */
  celebration: { title: string; body: string };
}

export interface MicroCard {
  title: string;
  body: string;
  kind: 'orient' | 'do' | 'watch' | 'read' | 'practice' | 'note';
}

export interface ChecklistItem {
  id: string;
  label: string;
}

export interface Task {
  id: string;
  phase: PhaseId;
  title: string;
  summary: string;
  minutes: number;
  icon: string;
  /** Micro-learning stack, 3 to 5 cards. */
  cards: MicroCard[];
  checklist: ChecklistItem[];
  /**
   * Trust & clarity microcopy, the handbook requires that a user can always see
   * why a step is being shown, where it came from, and who to ask.
   */
  why: string;
  source: string;
  /** Learning-style-specific closing card copy. */
  formats: Record<LearningStyle, string>;
}

export interface Person {
  id: string;
  name: string;
  pronouns: string;
  role: string;
  relationship: 'buddy' | 'manager' | 'team' | 'channel';
  presence: 'online' | 'away' | 'offline';
  blurb: string;
  action: string;
  initials: string;
  accent: 'honey' | 'pink' | 'sage';
}

export interface OnboardingState {
  view: View;
  role: RoleId | null;
  startDate: string | null;
  learningStyle: LearningStyle | null;
  completedTaskIds: string[];
  checkedItems: Record<string, string[]>;
  openTaskId: string | null;
  celebratedPhases: PhaseId[];
  pendingCelebration: PhaseId | null;
}
