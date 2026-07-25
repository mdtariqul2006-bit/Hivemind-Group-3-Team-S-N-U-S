import { type RefObject, useEffect, useState } from 'react';

interface Dimensions {
  width: number;
  height: number;
}

/**
 * Tracks an element's rendered size, re-measuring 250ms after a resize settles.
 * Used to size the animated-gradient blobs to their container.
 */
export const useDimensions = (ref: RefObject<HTMLElement | SVGElement | null>): Dimensions => {
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const measure = (): void => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    const onResize = (): void => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(measure, 250);
    };

    measure();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(timeoutId);
    };
  }, [ref]);

  return dimensions;
};
