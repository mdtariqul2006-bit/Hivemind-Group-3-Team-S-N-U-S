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

/** The source lockup's aspect ratio (viewBox 0 0 1125 449.999984), for cropping just the mark. */
const LOCKUP_RATIO = 1125 / 450;

/**
 * Fraction of the lockup's full rendered width occupied by the hex mark
 * before "HiveMind" begins. Read from the source SVG itself: the first glyph
 * group sits at translate(321.13, ...) inside a 1125-wide viewBox, so the icon
 * is safe up to roughly x=300 (a small margin short of the glyph origin).
 */
const ICON_WIDTH_RATIO = (300 / 1125) * LOCKUP_RATIO;

/**
 * Icon-only crop of the same lockup image, for tight spots (sidebar rail,
 * centred login header) that cannot fit the full "HiveMind" wordmark. Clips
 * the wide image down to its leading edge, where the hex mark sits, without
 * letting the "H" of the wordmark bleed into view.
 */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cn('relative inline-block shrink-0 overflow-hidden', className)}
      style={{ width: size * ICON_WIDTH_RATIO, height: size }}
      role="img"
      aria-label="HiveMind"
    >
      <img
        src={ASSETS.logo}
        alt=""
        aria-hidden
        className="absolute left-0 top-0 max-w-none object-cover object-left"
        style={{ height: size, width: size * LOCKUP_RATIO }}
      />
    </span>
  );
}
