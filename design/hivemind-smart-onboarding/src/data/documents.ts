import type { RoleId } from '@/types';

export interface KeyDocument {
  id: string;
  title: string;
  description: string;
  category: 'policy' | 'how-to' | 'reference' | 'template';
  roles: RoleId[] | 'all';
  updated: string;
  minutes: number;
}

/**
 * The "key documents, one place" feature. Every new starter said in research that
 * finding the right document was the most annoying part of the first month, so
 * this is a small, curated, searchable library rather than a link to a wiki root.
 */
export const DOCUMENTS: KeyDocument[] = [
  {
    id: 'doc-ways-of-working',
    title: 'Ways of Working',
    description: 'Which meetings are fixed, which are optional, and the Wednesday focus-time rule.',
    category: 'policy',
    roles: 'all',
    updated: 'Updated this quarter',
    minutes: 6,
  },
  {
    id: 'doc-expenses',
    title: 'Expenses and reimbursement',
    description: 'What counts, the approval threshold, and how fast you get paid back.',
    category: 'policy',
    roles: 'all',
    updated: 'Updated 2 months ago',
    minutes: 3,
  },
  {
    id: 'doc-leave',
    title: 'Holiday and leave policy',
    description: 'Booking process, carryover rules, and who to tell if you are unwell.',
    category: 'policy',
    roles: 'all',
    updated: 'Updated 4 months ago',
    minutes: 4,
  },
  {
    id: 'doc-design-system',
    title: 'Northwind Core design system',
    description: 'The component library, tokens, and when it is fine to detach.',
    category: 'reference',
    roles: ['designer'],
    updated: 'Published 3 days ago',
    minutes: 8,
  },
  {
    id: 'doc-contributing',
    title: 'Contributing guide',
    description: 'Branch naming, CI gates, review turnaround, and the deploy pipeline.',
    category: 'how-to',
    roles: ['engineer'],
    updated: 'Verified last Tuesday',
    minutes: 5,
  },
  {
    id: 'doc-voice-guide',
    title: 'Brand voice guide',
    description: 'How Northwind sounds, with real before and after examples.',
    category: 'reference',
    roles: ['marketer'],
    updated: 'Rewritten in January',
    minutes: 4,
  },
  {
    id: 'doc-brief-template',
    title: 'One-page campaign brief',
    description: 'The template Growth actually uses. Audience, insight, one number, channels.',
    category: 'template',
    roles: ['marketer'],
    updated: 'Updated last quarter',
    minutes: 2,
  },
  {
    id: 'doc-oncall',
    title: 'On-call handbook',
    description: 'What shadowing looks like, escalation paths, and how postmortems work here.',
    category: 'reference',
    roles: ['engineer'],
    updated: 'Updated 6 weeks ago',
    minutes: 10,
  },
  {
    id: 'doc-org-chart',
    title: 'Org chart and team directory',
    description: 'Who is on which team, and the "what to ask me about" line on every profile.',
    category: 'reference',
    roles: 'all',
    updated: 'Live, always current',
    minutes: 2,
  },
];

export function documentsForRole(role: RoleId | null): KeyDocument[] {
  return DOCUMENTS.filter((d) => d.roles === 'all' || (role && d.roles.includes(role)));
}
