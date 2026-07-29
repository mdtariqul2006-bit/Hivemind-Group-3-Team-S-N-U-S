/** Human date like "Monday 13 July". */
export function formatStartDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

/** "15 min" / "1 hr 30 min" from a minute count. */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

/** A warm status line keyed to how far through onboarding the user is. */
export function settledLine(pct: number, name: string): string {
  if (pct === 0) return `Fresh start, ${name}. One small step is all today asks of you.`;
  if (pct < 25) return `You're finding your feet, ${name}, that's exactly right for now.`;
  if (pct < 50) return `You're ${pct}% settled in, nice pace, ${name}.`;
  if (pct < 75) return `Over halfway, ${name}. Northwind is starting to feel like yours.`;
  if (pct < 100) return `Almost there, ${name}, ${pct}% and the last steps are the good ones.`;
  return `All caught up, ${name}. You're not the new person any more.`;
}
