import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * The ambient honeycomb field with a small flock of interactive bees, replacing
 * the old CSS gradient blobs. Runs on a single canvas, GPU cheap, and never
 * intercepts pointer events, so it can sit directly behind every screen without
 * risking a click, a text selection, or a tab stop.
 *
 * Non-negotiables baked in on purpose:
 * - `pointer-events: none` on the canvas element itself. Bee reactions read the
 *   cursor from a window-level `pointermove` listener instead, so the background
 *   can react to you without ever intercepting a click meant for the UI above it.
 * - Fixed, negative z-index, strictly behind `#main` and every card (see index.css
 *   stacking: canvas at -10, content at the default stacking context above it).
 * - Bees are small (12 to 20px), low opacity, and never drawn over the safe text
 *   columns tracked in `exclusionRef` (see `registerTextZone`), so body copy stays
 *   at full contrast no matter where a bee wanders.
 * - `prefers-reduced-motion` swaps the whole flock for a static, unlit honeycomb.
 */

interface Bee {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  wingPhase: number;
  size: number;
  seed: number;
}

const HEX_SIZE = 34; // centre-to-corner radius of one honeycomb cell
const BEE_COUNT_DESKTOP = 12;
const BEE_COUNT_MOBILE = 6;
const CURSOR_INFLUENCE_RADIUS = 160;

export function HoneycombCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctxEl = canvasEl.getContext('2d', { alpha: true });
    if (!ctxEl) return;
    // Re-bind to non-nullable locals: TS narrowing on `canvas`/`ctx` above does
    // not survive into the nested function declarations that close over them.
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = ctxEl;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let lastTime = performance.now();
    let pulsePhase = 0;

    const pointer = { x: -9999, y: -9999, active: false };
    const ripples: { x: number; y: number; born: number }[] = [];

    // Text-readability guard: some panels (the hero shell in particular) are
    // deliberately translucent, so being behind them in z-index is not enough,
    // a bright bee glow can still show straight through the glass. Instead we
    // track the on-screen rects of every text-bearing element and simply skip
    // rendering a bee while its centre falls inside one, so it never sits behind
    // (and therefore visually inside) a sentence. Recomputed on a light
    // interval rather than every frame, layout does not change that often.
    let exclusionRects: DOMRect[] = [];
    function recomputeExclusionZones() {
      const nodes = document.querySelectorAll(
        'h1, h2, h3, h4, p, span, label, button, a',
      );
      const rects: DOMRect[] = [];
      const pad = 6;
      nodes.forEach((node) => {
        const text = node.textContent?.trim();
        if (!text) return;
        const rect = node.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        rects.push(
          new DOMRect(rect.x - pad, rect.y - pad, rect.width + pad * 2, rect.height + pad * 2),
        );
      });
      exclusionRects = rects;
    }
    function insideExclusionZone(x: number, y: number) {
      for (const r of exclusionRects) {
        if (x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height) return true;
      }
      return false;
    }

    const isDark = () => document.documentElement.dataset.theme === 'dark';
    // Resolve CSS custom properties once per resize so we never call
    // getComputedStyle per frame.
    let honeyColor = '245, 158, 11';
    let strokeColor = 'rgba(245, 158, 11, 0.12)';

    function readTheme() {
      const styles = getComputedStyle(document.documentElement);
      const honey = styles.getPropertyValue('--hm-honey').trim() || '#ffc370';
      const rgb = hexToRgb(honey);
      honeyColor = rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '245, 158, 11';
      strokeColor = isDark()
        ? `rgba(${honeyColor}, 0.10)`
        : `rgba(${honeyColor}, 0.16)`;
    }

    function hexToRgb(hex: string) {
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return m ? { r: parseInt(m[1]!, 16), g: parseInt(m[2]!, 16), b: parseInt(m[3]!, 16) } : null;
    }

    const bees: Bee[] = [];

    function seedBees() {
      bees.length = 0;
      const count = window.innerWidth < 768 ? BEE_COUNT_MOBILE : BEE_COUNT_DESKTOP;
      for (let i = 0; i < count; i++) {
        bees.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          angle: Math.random() * Math.PI * 2,
          wingPhase: Math.random() * Math.PI * 2,
          size: 12 + Math.random() * 8,
          seed: Math.random() * 1000,
        });
      }
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readTheme();
      seedBees();
    }

    function drawHoneycomb(time: number) {
      const w = HEX_SIZE * Math.sqrt(3);
      const h = HEX_SIZE * 1.5;
      const cols = Math.ceil(width / w) + 2;
      const rows = Math.ceil(height / h) + 2;

      ctx.lineWidth = 1;
      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const x = col * w + (row % 2 !== 0 ? w / 2 : 0);
          const y = row * h;
          // A very slow ambient pulse sweeps across cells using their position as
          // phase offset, never a per-cell timer, so it stays cheap at any grid size.
          const pulse = reduce
            ? 0.5
            : 0.5 + 0.5 * Math.sin(time * 0.00025 + (x + y) * 0.01);
          ctx.strokeStyle = strokeColor.replace(/[\d.]+\)$/, `${(0.06 + pulse * 0.08).toFixed(3)})`);
          drawHexPath(ctx, x, y, HEX_SIZE);
          ctx.stroke();
        }
      }
    }

    function drawHexPath(c: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
      c.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 180) * (60 * i - 30);
        const px = cx + r * Math.cos(a);
        const py = cy + r * Math.sin(a);
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
    }

    function drawBee(c: CanvasRenderingContext2D, bee: Bee, time: number) {
      const flap = Math.sin(time * 0.03 + bee.wingPhase) * 0.9;
      c.save();
      c.translate(bee.x, bee.y);
      c.rotate(bee.angle);

      // Amber glow trail, subtle, never opaque enough to dent text contrast.
      const grad = c.createRadialGradient(0, 0, 0, 0, 0, bee.size * 1.8);
      grad.addColorStop(0, `rgba(${honeyColor}, 0.22)`);
      grad.addColorStop(1, `rgba(${honeyColor}, 0)`);
      c.fillStyle = grad;
      c.beginPath();
      c.arc(0, 0, bee.size * 1.8, 0, Math.PI * 2);
      c.fill();

      // Wings, two small ellipses that oscillate.
      c.fillStyle = isDark() ? 'rgba(255, 241, 214, 0.55)' : 'rgba(56, 60, 66, 0.28)';
      c.save();
      c.rotate(flap * 0.6);
      c.beginPath();
      c.ellipse(-bee.size * 0.15, -bee.size * 0.35, bee.size * 0.42, bee.size * 0.22, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();
      c.save();
      c.rotate(-flap * 0.6);
      c.beginPath();
      c.ellipse(bee.size * 0.15, -bee.size * 0.35, bee.size * 0.42, bee.size * 0.22, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();

      // Body, amber with dark banding.
      c.fillStyle = `rgba(${honeyColor}, 0.95)`;
      c.beginPath();
      c.ellipse(0, 0, bee.size * 0.5, bee.size * 0.32, 0, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = 'rgba(56, 42, 12, 0.55)';
      for (const off of [-0.18, 0.05, 0.28]) {
        c.beginPath();
        c.ellipse(bee.size * off, 0, bee.size * 0.06, bee.size * 0.3, 0, 0, Math.PI * 2);
        c.fill();
      }

      c.restore();
    }

    function step(time: number) {
      const dt = Math.min(time - lastTime, 48);
      lastTime = time;
      pulsePhase += dt;

      ctx.clearRect(0, 0, width, height);
      drawHoneycomb(time);

      if (!reduce) {
        for (const bee of bees) {
          // Gentle wander, a slow sine drift so movement never looks mechanical.
          const t = time * 0.0006 + bee.seed;
          bee.vx += Math.sin(t) * 0.006;
          bee.vy += Math.cos(t * 1.3) * 0.006;

          // Cursor influence: bees drift toward the pointer at range, and peel
          // away once it gets close, so they read as curious rather than clingy.
          if (pointer.active) {
            const dx = pointer.x - bee.x;
            const dy = pointer.y - bee.y;
            const dist = Math.hypot(dx, dy) || 1;
            if (dist < CURSOR_INFLUENCE_RADIUS) {
              const force = (1 - dist / CURSOR_INFLUENCE_RADIUS) * 0.03;
              if (dist < 46) {
                bee.vx -= (dx / dist) * force * 3;
                bee.vy -= (dy / dist) * force * 3;
              } else {
                bee.vx += (dx / dist) * force;
                bee.vy += (dy / dist) * force;
              }
            }
          }

          for (const ripple of ripples) {
            const age = time - ripple.born;
            if (age > 900) continue;
            const dx = bee.x - ripple.x;
            const dy = bee.y - ripple.y;
            const dist = Math.hypot(dx, dy) || 1;
            const front = (age / 900) * 260;
            if (Math.abs(dist - front) < 40) {
              bee.vx += (dx / dist) * 0.5;
              bee.vy += (dy / dist) * 0.5;
            }
          }

          const speed = Math.hypot(bee.vx, bee.vy);
          const maxSpeed = 0.9;
          if (speed > maxSpeed) {
            bee.vx = (bee.vx / speed) * maxSpeed;
            bee.vy = (bee.vy / speed) * maxSpeed;
          }

          bee.x += bee.vx * (dt * 0.06);
          bee.y += bee.vy * (dt * 0.06);
          bee.angle = Math.atan2(bee.vy, bee.vx);

          // Wrap around edges rather than bounce, keeps the flock always in view
          // without a jarring reversal at the viewport edge.
          const margin = 40;
          if (bee.x < -margin) bee.x = width + margin;
          if (bee.x > width + margin) bee.x = -margin;
          if (bee.y < -margin) bee.y = height + margin;
          if (bee.y > height + margin) bee.y = -margin;

          // Physics keep running even over a text zone, the bee just goes
          // invisible for those frames rather than freezing mid-flight.
          if (!insideExclusionZone(bee.x, bee.y)) {
            drawBee(ctx, bee, time);
          }
        }

        // Click ripple rendering, fades over ~900ms.
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i]!;
          const age = time - r.born;
          if (age > 900) {
            ripples.splice(i, 1);
            continue;
          }
          const radius = (age / 900) * 260;
          const alpha = 1 - age / 900;
          ctx.beginPath();
          ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${honeyColor}, ${(alpha * 0.35).toFixed(3)})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(step);
    }

    function onPointerMove(e: PointerEvent) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    }
    function onPointerLeave() {
      pointer.active = false;
    }
    function onClick(e: MouseEvent) {
      // Ignore clicks on real UI, only the empty canvas backdrop should ripple.
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el && el !== document.body && el.closest('button, a, input, [role="dialog"], [role="button"]')) {
        return;
      }
      ripples.push({ x: e.clientX, y: e.clientY, born: performance.now() });
    }
    function onThemeChange() {
      readTheme();
    }

    resize();
    recomputeExclusionZones();
    // Layout shifts constantly here (route changes, reveal animations, the
    // wizard steps), so a light poll keeps the exclusion zones honest without
    // needing every call site to remember to notify this component.
    const exclusionInterval = window.setInterval(recomputeExclusionZones, 400);
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', recomputeExclusionZones, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('click', onClick);
    const themeObserver = new MutationObserver(onThemeChange);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    // Content mounting/unmounting (route changes, cards revealing) shifts text
    // rects without firing resize or scroll, watch the DOM directly too.
    const layoutObserver = new MutationObserver(() => recomputeExclusionZones());
    layoutObserver.observe(document.body, { childList: true, subtree: true });

    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(exclusionInterval);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', recomputeExclusionZones);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('click', onClick);
      themeObserver.disconnect();
      layoutObserver.disconnect();
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
