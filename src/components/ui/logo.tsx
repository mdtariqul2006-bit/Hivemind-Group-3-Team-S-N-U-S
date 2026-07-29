import { cn } from '@/lib/cn';
import { ASSETS } from '@/library';

/**
 * The real HiveMind Academy lockup (public/library/images/logo-text-right.svg):
 * the hex-maze mark and "HiveMind" wordmark baked into one vector graphic at
 * the brand's own sage (#BAC9C5). Not a hand-drawn stand-in.
 *
 * Note: public/library/images/ico-logo.svg looks like a logo by name but is a
 * mis-scraped generic icon-file placeholder graphic, not a HiveMind asset.
 * Do not wire it in without opening it and checking first.
 */
export function Wordmark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <img
      src={ASSETS.logo}
      alt="HiveMind"
      className={cn('block w-auto object-contain', className)}
      style={{ height: size }}
    />
  );
}
