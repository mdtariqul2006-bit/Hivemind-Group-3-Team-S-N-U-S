import type { OnboardingState, View } from '@/types';
import { PEOPLE } from '@/data/people';
import { DOCUMENTS } from '@/data/documents';
import { tasksForRole } from '@/data/tasks';
import { COMPANY } from '@/data/roles';

export interface KnowledgeEntry {
  id: string;
  /** Phrases matched against, lowercase, checked as substrings of the question. */
  triggers: string[];
  answer: string;
  /** Always present. The whole point of this assistant is that it never skips this. */
  because: string;
  linkView?: View;
  linkLabel?: string;
}

const person = (relationship: 'buddy' | 'manager' | 'channel') =>
  PEOPLE.find((p) => p.relationship === relationship);

/**
 * Static, structural entries: answerable from the app's own shape, not from
 * user data. Hand written, do not duplicate content that already lives in
 * src/data, see the dynamic entries below for anything person- or task-shaped.
 */
const STATIC_ENTRIES: KnowledgeEntry[] = [
  {
    id: 'what-is-this',
    triggers: ['what is this', 'what is hivemind', `what is ${COMPANY.toLowerCase()}`, 'what does this do', 'purpose of this'],
    answer: `This is a guided onboarding tool for new starters at ${COMPANY}: a Day 1, Week 1, Month 1 roadmap, role specific content, and always-visible progress instead of a document dump on your first morning.`,
    because: 'Research for this project found new hires disengage fastest when the first weeks feel scattered and impersonal, this exists to fix that specific problem, not to be a general assistant.',
  },
  {
    id: 'mark-task-done',
    triggers: ['mark task', 'complete task', 'finish task', 'mark done', 'checklist', 'tick off'],
    answer: 'Open any task card from your dashboard, work through its checklist, then use "Mark complete" at the bottom.',
    because: 'That button is the only thing that moves your progress tracker, so it is worth knowing where it lives.',
    linkView: 'dashboard',
    linkLabel: 'Go to your dashboard',
  },
  {
    id: 'progress-tracker',
    triggers: ['progress', 'how much done', 'percentage', 'how far along', 'progresshive'],
    answer: 'Your dashboard shows a live progress ring, it fills in as you complete tasks across Day 1, Week 1, and Month 1.',
    because: 'Feeling your progress, not just being told about it, was one of the three promises this product is built around.',
    linkView: 'dashboard',
    linkLabel: 'Go to your dashboard',
  },
  {
    id: 'sign-up',
    triggers: ['sign up', 'create account', 'get started', 'pick a role', 'choose role'],
    answer: 'Use "Start my first day" on the landing page, it walks you through picking your role, a start date, and how you like to learn, then builds your roadmap from that.',
    because: 'Role and learning style are what make the roadmap yours rather than a generic checklist, so they are asked up front, once.',
    linkView: 'personalise',
    linkLabel: 'Set yourself up',
  },
  {
    id: 'admin-login',
    triggers: ['admin', 'manager access', 'hr login', 'admin console'],
    answer: 'The admin console is separate from your own account, reachable from the "Login" button in the header, not the main navigation.',
    because: 'It is a different audience (HR/managers reviewing the whole cohort), kept deliberately out of the way of your own onboarding flow.',
  },
  {
    id: 'leave-policy',
    triggers: ['holiday', 'leave', 'vacation', 'time off', 'pto', 'sick'],
    answer: DOCUMENTS.find((d) => d.id === 'doc-leave')?.description ?? 'The holiday and leave policy is in your documents list.',
    because: 'Pulled straight from the same document you would find on the Documents screen, not rewritten here.',
    linkView: 'documents',
    linkLabel: 'Open documents',
  },
  {
    id: 'documents-general',
    triggers: ['document', 'documents', 'policy', 'find a doc', 'handbook', 'where are the docs'],
    answer: `Every key document is in one searchable place, filtered to what is relevant for your role. There are ${DOCUMENTS.length} in the library right now.`,
    because: 'New starters said finding the right document was the most annoying part of the first month, so this trades a wiki root for a small, curated list.',
    linkView: 'documents',
    linkLabel: 'Open documents',
  },
];

/**
 * Dynamic entries: computed from real onboarding state at answer time
 * (current role, completed tasks) instead of hardcoded, so an answer like
 * "who is my buddy" or "what should I do today" is never allowed to drift
 * out of sync with the data that already exists in src/data.
 */
function buildDynamicEntries(state: OnboardingState): KnowledgeEntry[] {
  const entries: KnowledgeEntry[] = [];
  const buddy = person('buddy');
  const manager = person('manager');
  const channel = person('channel');

  if (buddy) {
    entries.push({
      id: 'who-is-buddy',
      triggers: ['buddy', 'who do i ask', 'who to ask', 'need help', 'stuck'],
      answer: `${buddy.name} is your buddy (${buddy.role}). ${buddy.blurb}`,
      because: 'Pulled from the People screen, the same person you would find there, not a separate list.',
      linkView: 'people',
      linkLabel: 'Open people & support',
    });
  }

  if (manager) {
    entries.push({
      id: 'who-is-manager',
      triggers: ['manager', 'who do i report to', 'my manager', 'one to one', '1:1'],
      answer: `${manager.name} is your manager (${manager.role}). ${manager.blurb}`,
      because: 'Pulled live from the same People screen, not duplicated here.',
      linkView: 'people',
      linkLabel: 'Open people & support',
    });
  }

  if (channel) {
    entries.push({
      id: 'help-channel',
      triggers: ['channel', 'ask a question', 'chat', 'slack', 'public help'],
      answer: `${channel.name} is the no-wrong-questions channel, ${channel.blurb.toLowerCase()}`,
      because: 'The same channel listed on the People screen, kept as one source of truth.',
      linkView: 'people',
      linkLabel: 'Open people & support',
    });
  }

  if (state.role) {
    const tasks = tasksForRole(state.role);
    const next = tasks.find((t) => !state.completedTaskIds.includes(t.id));
    entries.push({
      id: 'todays-task',
      triggers: ['today', 'what do i do', 'what next', 'first task', 'what should i do'],
      answer: next
        ? `Next up: "${next.title}", about ${next.minutes} minutes. ${next.why}`
        : "You're through everything currently on your plan, nicely done.",
      because: next ? next.source : 'Every task here already has to show its own source, this just surfaces the next one.',
      linkView: 'dashboard',
      linkLabel: 'Go to your dashboard',
    });
  } else {
    entries.push({
      id: 'todays-task-no-role',
      triggers: ['today', 'what do i do', 'what next', 'first task', 'what should i do'],
      answer: "You haven't set up your roadmap yet, that takes about a minute and shapes everything else.",
      because: 'Tasks are generated from your role, there is nothing to show until that is chosen.',
      linkView: 'personalise',
      linkLabel: 'Set yourself up',
    });
  }

  return entries;
}

/** Fallback used when nothing scores above the match threshold. Never guesses. */
export const FALLBACK_ENTRY: KnowledgeEntry = {
  id: 'fallback',
  triggers: [],
  answer: "I don't have a good answer for that one, I only cover a small set of basic questions on purpose.",
  because: 'Guessing outside what I actually know would be worse than saying so, a real person will get this right.',
  linkView: 'people',
  linkLabel: 'Find someone to ask',
};

export function buildKnowledgeBase(state: OnboardingState): KnowledgeEntry[] {
  return [...STATIC_ENTRIES, ...buildDynamicEntries(state)];
}
