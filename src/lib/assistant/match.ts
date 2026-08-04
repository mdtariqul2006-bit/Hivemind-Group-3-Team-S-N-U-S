import type { KnowledgeEntry } from '@/lib/assistant/knowledge-base';

/**
 * Small synonym map, closing the realistic gap between how a question is
 * typed and how a trigger is worded. Deliberately not a stemming library or
 * fuzzy match, see docs/onboarding-assistant-spec.md section 7 for why.
 */
const SYNONYMS: Record<string, string> = {
  'log in': 'login',
  'sign in': 'login',
  vacation: 'holiday',
  pto: 'holiday',
  todo: 'task',
  'to do': 'task',
  '%': 'percentage',
  docs: 'documents',
};

function normalize(input: string): string {
  let text = input.toLowerCase().trim();
  for (const [from, to] of Object.entries(SYNONYMS)) {
    text = text.split(from).join(to);
  }
  return text;
}

/**
 * Plain keyword/substring scoring: each matched trigger phrase adds its own
 * word count to the score, so a more specific multi-word trigger outranks a
 * shorter, more generic one on the same question. No ranking model, the
 * entire function is readable in one pass on purpose.
 */
export function matchQuestion(input: string, entries: KnowledgeEntry[]): KnowledgeEntry | null {
  const normalized = normalize(input);
  if (!normalized) return null;

  let best: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of entries) {
    let score = 0;
    for (const trigger of entry.triggers) {
      if (normalized.includes(trigger)) score += trigger.split(' ').length;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return bestScore > 0 ? best : null;
}
