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
export interface StarterTask {
  id: string;
  title: string;
  phase: 'Day 1' | 'Week 1' | 'Month 1';
  status: 'completed' | 'in-progress' | 'pending';
  minutes: number;
}

export interface StarterDoc {
  id: string;
  name: string;
  status: 'signed' | 'pending' | 'review';
  category: string;
}

export interface StarterNote {
  id: string;
  author: string;
  date: string;
  text: string;
}

export interface StarterMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  with: string;
  status: 'scheduled' | 'completed';
}

export interface StarterTimelineItem {
  id: string;
  title: string;
  date: string;
  type: 'milestone' | 'task' | 'meeting' | 'document';
}

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
  email: string;
  phone: string;
  location: string;
  startDate: string;
  manager: string;
  totalTasks: number;
  completedTasksCount: number;
  assignedTasks: StarterTask[];
  documents: StarterDoc[];
  notes: StarterNote[];
  meetings: StarterMeeting[];
  timeline: StarterTimelineItem[];
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
    email: 'priya.anand@hivemind.co',
    phone: '+44 7700 900123',
    location: 'London, UK (Hybrid)',
    startDate: '2026-07-06',
    manager: 'Sarah Jenkins',
    totalTasks: 12,
    completedTasksCount: 11,
    assignedTasks: [
      { id: 't1', title: 'Setup Figma workspace & design tokens', phase: 'Day 1', status: 'completed', minutes: 20 },
      { id: 't2', title: 'Complete HiveMind brand & UI system review', phase: 'Day 1', status: 'completed', minutes: 30 },
      { id: 't3', title: 'Meet design buddy Sam Okonjo for 1:1', phase: 'Week 1', status: 'completed', minutes: 15 },
      { id: 't4', title: 'Review accessibility & contrast guidelines', phase: 'Week 1', status: 'completed', minutes: 25 },
      { id: 't5', title: 'Deliver first design component PR', phase: 'Month 1', status: 'completed', minutes: 45 },
      { id: 't6', title: 'Final 30-day onboarding feedback review', phase: 'Month 1', status: 'in-progress', minutes: 15 },
    ],
    documents: [
      { id: 'd1', name: 'Employee Contract & NDA', status: 'signed', category: 'HR' },
      { id: 'd2', name: 'Design System Guidelines', status: 'signed', category: 'Team' },
      { id: 'd3', name: 'Information Security Policy', status: 'signed', category: 'Compliance' },
    ],
    notes: [
      { id: 'n1', author: 'Sarah Jenkins (Manager)', date: '2026-07-20', text: 'Priya is progressing ahead of schedule. Great initiative on design token sync.' },
      { id: 'n2', author: 'Sam Okonjo (Buddy)', date: '2026-07-10', text: '1:1 went smoothly. Priya had great questions about component workflow.' },
    ],
    meetings: [
      { id: 'm1', title: 'Weekly 1:1 Sync', date: '2026-08-07', time: '10:00 AM', with: 'Sarah Jenkins', status: 'scheduled' },
      { id: 'm2', title: 'Buddy Coffee Sync', date: '2026-08-04', time: '2:30 PM', with: 'Sam Okonjo', status: 'completed' },
    ],
    timeline: [
      { id: 'tl1', title: 'Completed 11/12 onboarding tasks (92%)', date: 'Yesterday', type: 'task' },
      { id: 'tl2', title: 'Submitted 30-day design feedback', date: '3 days ago', type: 'document' },
      { id: 'tl3', title: 'Matched with buddy Sam Okonjo', date: '2026-07-06', type: 'meeting' },
    ],
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
    email: 'dev.sharma@hivemind.co',
    phone: '+44 7700 900456',
    location: 'London, UK (Office)',
    startDate: '2026-07-20',
    manager: 'Alex Thorne',
    totalTasks: 12,
    completedTasksCount: 9,
    assignedTasks: [
      { id: 't101', title: 'Clone repository & environment config', phase: 'Day 1', status: 'completed', minutes: 30 },
      { id: 't102', title: 'First PR build & local dev verification', phase: 'Day 1', status: 'completed', minutes: 40 },
      { id: 't103', title: 'Architecture walkthrough with Alex', phase: 'Week 1', status: 'completed', minutes: 45 },
      { id: 't104', title: 'Set up JWT auth token & secrets', phase: 'Week 1', status: 'in-progress', minutes: 30 },
      { id: 't105', title: 'Platform deployment pipeline check', phase: 'Month 1', status: 'pending', minutes: 60 },
    ],
    documents: [
      { id: 'd101', name: 'Software Development Security Policy', status: 'signed', category: 'Compliance' },
      { id: 'd102', name: 'Engineering Handbook 2026', status: 'review', category: 'Engineering' },
    ],
    notes: [
      { id: 'n101', author: 'Alex Thorne (Manager)', date: '2026-07-28', text: 'Dev picked up the architecture quickly. On track for first sprint release.' },
    ],
    meetings: [
      { id: 'm101', title: 'Architecture Check-in', date: '2026-08-06', time: '11:30 AM', with: 'Alex Thorne', status: 'scheduled' },
    ],
    timeline: [
      { id: 'tl101', title: 'Completed environment setup task', date: '4m ago', type: 'task' },
      { id: 'tl102', title: 'Signed engineering security policy', date: '2026-07-21', type: 'document' },
    ],
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
    email: 'rana.yilmaz@hivemind.co',
    phone: '+44 7700 900789',
    location: 'Remote (UK)',
    startDate: '2026-07-27',
    manager: 'Claire Dupont',
    totalTasks: 12,
    completedTasksCount: 5,
    assignedTasks: [
      { id: 't201', title: 'Marketing stack access & SSO setup', phase: 'Day 1', status: 'completed', minutes: 25 },
      { id: 't202', title: 'Review Growth strategy handbook', phase: 'Week 1', status: 'in-progress', minutes: 40 },
      { id: 't203', title: '1:1 with Marketing Lead', phase: 'Week 1', status: 'pending', minutes: 30 },
    ],
    documents: [
      { id: 'd201', name: 'Brand & Marketing Guidelines', status: 'pending', category: 'Marketing' },
    ],
    notes: [
      { id: 'n201', author: 'Claire Dupont (Manager)', date: '2026-08-02', text: 'Stuck on tool access permissions. IT request submitted.' },
    ],
    meetings: [
      { id: 'm201', title: 'Unblock Access 1:1', date: '2026-08-05', time: '2:00 PM', with: 'Claire Dupont', status: 'scheduled' },
    ],
    timeline: [
      { id: 'tl201', title: 'Access request flagged as blocked', date: 'Yesterday', type: 'milestone' },
    ],
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
    email: 'leon.ferreira@hivemind.co',
    phone: '+44 7700 900321',
    location: 'London, UK (Hybrid)',
    startDate: '2026-07-20',
    manager: 'Alex Thorne',
    totalTasks: 12,
    completedTasksCount: 8,
    assignedTasks: [
      { id: 't301', title: 'Node & Vite dev server setup', phase: 'Day 1', status: 'completed', minutes: 20 },
      { id: 't302', title: 'Component library review', phase: 'Week 1', status: 'completed', minutes: 35 },
    ],
    documents: [
      { id: 'd301', name: 'Code Style & Formatting Specs', status: 'signed', category: 'Engineering' },
    ],
    notes: [],
    meetings: [],
    timeline: [
      { id: 'tl301', title: 'Submitted first UI component', date: '2 days ago', type: 'task' },
    ],
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
    email: 'mei.tanaka@hivemind.co',
    phone: '+44 7700 900654',
    location: 'London, UK (Office)',
    startDate: '2026-07-01',
    manager: 'Sarah Jenkins',
    totalTasks: 12,
    completedTasksCount: 12,
    assignedTasks: [
      { id: 't401', title: 'All Day 1, Week 1, Month 1 tasks completed', phase: 'Month 1', status: 'completed', minutes: 120 },
    ],
    documents: [
      { id: 'd401', name: 'All Compliance & Design Docs Signed', status: 'signed', category: 'HR' },
    ],
    notes: [
      { id: 'n401', author: 'Sarah Jenkins', date: '2026-07-30', text: 'Onboarding 100% complete! Fully integrated into sprint work.' },
    ],
    meetings: [],
    timeline: [
      { id: 'tl401', title: 'Completed full 30-day onboarding roadmap (100%)', date: '2026-07-30', type: 'milestone' },
    ],
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
    email: 'omar.haddad@hivemind.co',
    phone: '+44 7700 900987',
    location: 'Remote (UK)',
    startDate: '2026-08-03',
    manager: 'Claire Dupont',
    totalTasks: 12,
    completedTasksCount: 3,
    assignedTasks: [
      { id: 't501', title: 'Complete profile setup & learning style', phase: 'Day 1', status: 'completed', minutes: 15 },
    ],
    documents: [
      { id: 'd501', name: 'Content Guidelines', status: 'pending', category: 'Marketing' },
    ],
    notes: [],
    meetings: [],
    timeline: [
      { id: 'tl501', title: 'Started onboarding roadmap', date: '2 days ago', type: 'task' },
    ],
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
    email: 'grace.owusu@hivemind.co',
    phone: '+44 7700 900147',
    location: 'London, UK (Hybrid)',
    startDate: '2026-07-13',
    manager: 'Alex Thorne',
    totalTasks: 12,
    completedTasksCount: 10,
    assignedTasks: [
      { id: 't601', title: 'Data pipeline & schema setup', phase: 'Week 1', status: 'completed', minutes: 45 },
    ],
    documents: [
      { id: 'd601', name: 'Data Protection & GDPR Policy', status: 'signed', category: 'Compliance' },
    ],
    notes: [],
    meetings: [],
    timeline: [
      { id: 'tl601', title: 'Passed 80% completion milestone', date: '3 days ago', type: 'milestone' },
    ],
  },
];
