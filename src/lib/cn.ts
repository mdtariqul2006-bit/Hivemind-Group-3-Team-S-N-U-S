/** Tiny classnames joiner, no dependency, just the bit of clsx we actually use. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
