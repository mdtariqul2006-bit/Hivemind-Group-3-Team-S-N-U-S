/**
 * Seeded analytics for the admin console. All of this is demo data so the
 * dashboard reads like a live product without needing a backend. Numbers are
 * internally consistent (the KPIs line up with the series below them).
 */

export interface Kpi {
  id: string;
  label: string;
  value: number;
  /** Rendered suffix, for example "%" or "d". */
  suffix?: string;
  prefix?: string;
  /** Percentage change versus the previous period. Positive is good. */
  delta: number;
  /** A short trend series for the card sparkline. */
  spark: number[];
  accent: 'honey' | 'pink' | 'sage';
  icon: 'users' | 'trend' | 'clock' | 'award';
}

export const KPIS: Kpi[] = [
  {
    id: 'starters',
    label: 'Active starters',
    value: 128,
    delta: 12.4,
    spark: [88, 92, 90, 101, 110, 118, 121, 128],
    accent: 'honey',
    icon: 'users',
  },
  {
    id: 'completion',
    label: 'Onboarding completion',
    value: 86,
    suffix: '%',
    delta: 5.1,
    spark: [71, 73, 76, 78, 80, 82, 84, 86],
    accent: 'sage',
    icon: 'award',
  },
  {
    id: 'time',
    label: 'Avg time to productive',
    value: 14,
    suffix: 'd',
    delta: -8.3,
    spark: [21, 20, 19, 18, 17, 16, 15, 14],
    accent: 'pink',
    icon: 'clock',
  },
  {
    id: 'engagement',
    label: 'Weekly engagement',
    value: 94,
    suffix: '%',
    delta: 3.7,
    spark: [80, 83, 85, 88, 90, 91, 93, 94],
    accent: 'honey',
    icon: 'trend',
  },
];

/** Twelve week onboarding completion trend, feeds the main area chart. */
export interface SeriesPoint {
  label: string;
  value: number;
}

export const COMPLETION_TREND: SeriesPoint[] = [
  { label: 'W1', value: 62 },
  { label: 'W2', value: 65 },
  { label: 'W3', value: 68 },
  { label: 'W4', value: 66 },
  { label: 'W5', value: 71 },
  { label: 'W6', value: 74 },
  { label: 'W7', value: 77 },
  { label: 'W8', value: 79 },
  { label: 'W9', value: 81 },
  { label: 'W10', value: 83 },
  { label: 'W11', value: 84 },
  { label: 'W12', value: 86 },
];

/** New starters by role, feeds the donut chart. */
export interface Segment {
  label: string;
  value: number;
  color: string;
}

export const ROLE_SPLIT: Segment[] = [
  { label: 'Engineering', value: 52, color: 'var(--hm-honey)' },
  { label: 'Design', value: 34, color: 'var(--hm-pink)' },
  { label: 'Marketing', value: 42, color: 'var(--hm-sage)' },
];

/** Where new starters get stuck, feeds the horizontal bottleneck bars. */
export const BOTTLENECKS: SeriesPoint[] = [
  { label: 'Access & accounts', value: 38 },
  { label: 'First code review', value: 27 },
  { label: 'Meeting the team', value: 19 },
  { label: 'Tooling setup', value: 44 },
  { label: 'Compliance training', value: 31 },
];

/** Task activity across a working week, feeds the weekly bar chart. */
export const WEEKLY_ACTIVITY: SeriesPoint[] = [
  { label: 'Mon', value: 42 },
  { label: 'Tue', value: 58 },
  { label: 'Wed', value: 51 },
  { label: 'Thu', value: 64 },
  { label: 'Fri', value: 47 },
  { label: 'Sat', value: 18 },
  { label: 'Sun', value: 11 },
];

export interface ActivityEntry {
  id: string;
  who: string;
  initials: string;
  accent: 'honey' | 'pink' | 'sage';
  action: string;
  target: string;
  time: string;
}

export const RECENT_ACTIVITY: ActivityEntry[] = [
  {
    id: 'a1',
    who: 'Priya Anand',
    initials: 'PA',
    accent: 'honey',
    action: 'completed',
    target: 'Week 1 environment setup',
    time: '4m ago',
  },
  {
    id: 'a2',
    who: 'Dev Sharma',
    initials: 'DS',
    accent: 'sage',
    action: 'was matched with buddy',
    target: 'Rana Yilmaz',
    time: '22m ago',
  },
  {
    id: 'a3',
    who: 'Sam Okonjo',
    initials: 'SO',
    accent: 'pink',
    action: 'approved',
    target: '3 compliance documents',
    time: '1h ago',
  },
  {
    id: 'a4',
    who: 'Rana Yilmaz',
    initials: 'RY',
    accent: 'honey',
    action: 'reached',
    target: 'the 30 day milestone',
    time: '3h ago',
  },
  {
    id: 'a5',
    who: 'New cohort',
    initials: 'NC',
    accent: 'sage',
    action: 'started onboarding',
    target: '8 new joiners',
    time: 'Yesterday',
  },
];

/** Roster rows for the starter table, richer than the People directory. */
export interface StarterRow {
  id: string;
  name: string;
  initials: string;
  accent: 'honey' | 'pink' | 'sage';
  role: string;
  team: string;
  progress: number;
  phase: 'Day 1' | 'Week 1' | 'Month 1' | 'Complete';
  status: 'on-track' | 'at-risk' | 'ahead';
  buddy: string;
}

export const STARTERS: StarterRow[] = [
  {
    id: 's1',
    name: 'Priya Anand',
    initials: 'PA',
    accent: 'honey',
    role: 'Product Designer',
    team: 'Design',
    progress: 92,
    phase: 'Month 1',
    status: 'ahead',
    buddy: 'Sam Okonjo',
  },
  {
    id: 's2',
    name: 'Dev Sharma',
    initials: 'DS',
    accent: 'sage',
    role: 'Platform Engineer',
    team: 'Engineering',
    progress: 74,
    phase: 'Week 1',
    status: 'on-track',
    buddy: 'Priya Anand',
  },
  {
    id: 's3',
    name: 'Rana Yilmaz',
    initials: 'RY',
    accent: 'honey',
    role: 'Growth Marketer',
    team: 'Marketing',
    progress: 41,
    phase: 'Week 1',
    status: 'at-risk',
    buddy: 'Dev Sharma',
  },
  {
    id: 's4',
    name: 'Leon Ferreira',
    initials: 'LF',
    accent: 'pink',
    role: 'Frontend Engineer',
    team: 'Engineering',
    progress: 63,
    phase: 'Week 1',
    status: 'on-track',
    buddy: 'Priya Anand',
  },
  {
    id: 's5',
    name: 'Mei Tanaka',
    initials: 'MT',
    accent: 'sage',
    role: 'Brand Designer',
    team: 'Design',
    progress: 100,
    phase: 'Complete',
    status: 'ahead',
    buddy: 'Sam Okonjo',
  },
  {
    id: 's6',
    name: 'Omar Haddad',
    initials: 'OH',
    accent: 'pink',
    role: 'Content Strategist',
    team: 'Marketing',
    progress: 28,
    phase: 'Day 1',
    status: 'at-risk',
    buddy: 'Rana Yilmaz',
  },
  {
    id: 's7',
    name: 'Grace Owusu',
    initials: 'GO',
    accent: 'honey',
    role: 'Data Engineer',
    team: 'Engineering',
    progress: 81,
    phase: 'Month 1',
    status: 'on-track',
    buddy: 'Dev Sharma',
  },
];
