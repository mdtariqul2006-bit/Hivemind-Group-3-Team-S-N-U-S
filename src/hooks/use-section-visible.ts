import { useEffect, useRef, type RefObject } from 'react';

/**
 * Fires a callback the moment a section leaves the viewport after having been
 * visible, "scrolled past" rather than a raw scroll-position number, so it
 * survives layout and content changes. Fires at most once per mount.
 */
export function useSectionVisible<T extends HTMLElement>(onScrolledPast: () => void): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const hasBeenVisible = useRef(false);
  const hasFired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          hasBeenVisible.current = true;
          return;
        }
        if (hasBeenVisible.current && !hasFired.current) {
          hasFired.current = true;
          onScrolledPast();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
    // onScrolledPast is expected to be a stable callback from the caller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
