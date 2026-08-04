import type { Kpi, SeriesPoint, Segment, ActivityEntry, StarterRow } from '@/data/admin-metrics';
import { STARTERS } from '@/data/admin-metrics';
import { tasksForRole } from '@/data/tasks';
import { loadPersistedState } from '@/lib/storage';
import { initialState } from '@/state/onboarding-context';

/**
 * Dynamic Admin Metrics Engine.
 * Computes live metrics and roster data from active user persistence state.
 */

export function getCalculatedMetrics(): {
  kpis: Kpi[];
  completionTrend: SeriesPoint[];
  roleSplit: Segment[];
  recentActivity: ActivityEntry[];
  starters: StarterRow[];
} {
  // Load current user's live onboarding state
  const currentUserState = loadPersistedState(initialState);
  
  // Compute user progress against the actual task count for the selected role
  let userProgress = 0;
  if (currentUserState.role) {
    const allTasks = tasksForRole(currentUserState.role);
    const completedCount = allTasks.filter((t) => currentUserState.completedTaskIds.includes(t.id)).length;
    userProgress = Math.min(100, Math.round((completedCount / allTasks.length) * 100));
  }

  // Derive dynamic starters roster incorporating live active user
  const dynamicStarters: StarterRow[] = STARTERS.map((starter) => {
    if (starter.id === 's1' && currentUserState.role) {
      return {
        ...starter,
        progress: userProgress,
        phase: userProgress >= 100 ? 'Complete' : userProgress >= 66 ? 'Month 1' : userProgress >= 33 ? 'Week 1' : 'Day 1',
        status: userProgress >= 75 ? 'ahead' : userProgress >= 30 ? 'on-track' : 'at-risk',
      };
    }
    return starter;
  });

  // Calculate live average completion percentage
  const totalProgress = dynamicStarters.reduce((acc, curr) => acc + curr.progress, 0);
  const avgCompletion = Math.round(totalProgress / dynamicStarters.length);

  // Calculate active starters count
  const activeStartersCount = dynamicStarters.filter((s) => s.phase !== 'Complete').length;

  const kpis: Kpi[] = [
    {
      id: 'starters',
      label: 'Active starters',
      value: activeStartersCount,
      delta: 12.4,
      spark: [88, 92, 90, 101, 110, 118, 121, activeStartersCount],
      accent: 'honey',
      icon: 'users',
    },
    {
      id: 'completion',
      label: 'Onboarding completion',
      value: avgCompletion,
      suffix: '%',
      delta: 5.1,
      spark: [71, 73, 76, 78, 80, 82, 84, avgCompletion],
      accent: 'sage',
      icon: 'award',
    },
    {
      id: 'time',
      label: 'Avg time to productive',
      value: Math.max(10, 18 - Math.round(avgCompletion / 10)),
      suffix: 'd',
      delta: -8.3,
      spark: [21, 20, 19, 18, 17, 16, 15, Math.max(10, 18 - Math.round(avgCompletion / 10))],
      accent: 'pink',
      icon: 'clock',
    },
    {
      id: 'engagement',
      label: 'Weekly engagement',
      value: Math.min(99, Math.max(80, avgCompletion + 8)),
      suffix: '%',
      delta: 3.7,
      spark: [80, 83, 85, 88, 90, 91, 93, Math.min(99, Math.max(80, avgCompletion + 8))],
      accent: 'honey',
      icon: 'trend',
    },
  ];

  const completionTrend: SeriesPoint[] = [
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
    { label: 'W12', value: avgCompletion },
  ];

  const roleSplit: Segment[] = [
    { label: 'Engineering', value: 54, color: 'var(--hm-honey)' },
    { label: 'Design', value: 36, color: 'var(--hm-pink)' },
    { label: 'Marketing', value: 38, color: 'var(--hm-sage)' },
  ];

  const recentActivity: ActivityEntry[] = [
    ...(currentUserState.completedTaskIds.length > 0
      ? [
          {
            id: 'live-user',
            who: 'You (Active User)',
            initials: 'AU',
            accent: 'honey' as const,
            action: 'completed',
            target: `${currentUserState.completedTaskIds.length} onboarding tasks`,
            time: 'Just now',
          },
        ]
      : []),
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
  ];

  return {
    kpis,
    completionTrend,
    roleSplit,
    recentActivity,
    starters: dynamicStarters,
  };
}
