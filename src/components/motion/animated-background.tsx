import { useReducedMotion } from 'framer-motion';

/**
 * The "always alive" layer. Two honey/pink blobs drifting on 30 to 40s loops plus a
 * whisper-quiet honeycomb field. Everything here is GPU-only, the blobs animate
 * transform, and the honeycomb is a static SVG pattern that never touches the main
 * thread. Under reduced motion the drift stops and only the static wash remains.
 */
export function AnimatedBackground() {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Honeycomb field, faint, static, brand motif. */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.5]">
        <defs>
          <pattern
            id="hm-honeycomb"
            width="56"
            height="96"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1.4)"
          >
            <path
              d="M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z M28 64 L56 80 L56 112 M28 64 L0 80 L0 112"
              fill="none"
              stroke="var(--hm-sage)"
              strokeOpacity="0.14"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hm-honeycomb)" />
      </svg>

      {/* Drifting warmth. */}
      <div
        className="absolute -top-40 -left-32 h-[38rem] w-[38rem] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, var(--hm-honey) 0%, transparent 68%)',
          opacity: 0.16,
          animation: reduce ? 'none' : 'hm-drift 34s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[34rem] w-[34rem] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, var(--hm-pink) 0%, transparent 68%)',
          opacity: 0.16,
          animation: reduce ? 'none' : 'hm-drift-alt 42s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute bottom-[-12rem] left-1/3 h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, var(--hm-sage) 0%, transparent 70%)',
          opacity: 0.14,
          animation: reduce ? 'none' : 'hm-drift 38s ease-in-out infinite reverse',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
