import type { LearningStyle, Phase, Role } from '@/types';

export const COMPANY = 'Northwind';
export const NEW_HIRE = 'Alex';

export const ROLES: Role[] = [
  {
    id: 'designer',
    label: 'Designer',
    blurb: 'Product & brand design',
    team: 'the Design guild',
    preview: 'Figma, the design system, and your first critique',
  },
  {
    id: 'engineer',
    label: 'Engineer',
    blurb: 'Platform & product engineering',
    team: 'Platform',
    preview: 'The repo, local setup, and your first merged pull request',
  },
  {
    id: 'marketer',
    label: 'Marketer',
    blurb: 'Growth & lifecycle marketing',
    team: 'Growth',
    preview: 'The brand voice, the calendar, and your first campaign brief',
  },
];

export const LEARNING_STYLES: {
  id: LearningStyle;
  label: string;
  blurb: string;
}[] = [
  {
    id: 'video',
    label: 'Show me',
    blurb: 'Short walkthroughs and screen recordings before I try it myself.',
  },
  {
    id: 'reading',
    label: 'Let me read',
    blurb: 'Written docs I can skim at my own pace and come back to.',
  },
  {
    id: 'hands-on',
    label: 'Let me try',
    blurb: 'Drop me into a real, low-stakes task and I will learn by doing.',
  },
];

export const PHASES: Phase[] = [
  {
    id: 'day-1',
    label: 'Day 1',
    offsetDays: 0,
    celebration: {
      title: 'Day 1 done. You showed up and it shows.',
      body: 'Laptop working, faces to names, and you know where the coffee is. That is genuinely the whole job today.',
    },
  },
  {
    id: 'week-1',
    label: 'Week 1',
    offsetDays: 4,
    celebration: {
      title: 'One week in. You are finding your feet.',
      body: 'You have shipped something small, sat in the meetings that matter, and worked out who to ask. Week two gets easier.',
    },
  },
  {
    id: 'month-1',
    label: 'Month 1',
    offsetDays: 29,
    celebration: {
      title: 'A month at Northwind. You belong here.',
      body: 'You are not the new person any more. You are the one who knows how this bit works. Go and tell someone else.',
    },
  },
];

export const PHASE_BY_ID = Object.fromEntries(PHASES.map((p) => [p.id, p])) as Record<
  Phase['id'],
  Phase
>;
