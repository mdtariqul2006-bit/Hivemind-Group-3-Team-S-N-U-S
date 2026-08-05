'use client';

import { InteractiveRobotSpline } from '@/components/blocks/interactive-3d-robot';

export function Section() { 
  const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-border/80 bg-surface/90 backdrop-blur-2xl shadow-2xl my-12">
      {/* Top Header Panel - Clean layout preventing text overlap on 3D canvas */}
      <div className="relative z-10 border-b border-border/60 bg-surface/80 p-6 sm:p-8 backdrop-blur-md text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-honey/40 bg-honey-wash/90 px-4 py-1 text-xs font-bold uppercase tracking-wider text-honey-deep mb-3">
          ✨ Interactive Guide
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
          Meet Whobee, your 3D Onboarding Guide
        </h2>
        <p className="mt-2 text-xs sm:text-sm font-medium text-muted max-w-xl mx-auto">
          Drag and interact with Whobee to explore your workspace tools, team buddy pairings, and your personalized 30-day journey.
        </p>
      </div>

      {/* 3D Interactive Canvas Container */}
      <div className="relative h-[480px] w-full bg-sunk/40" style={{ transform: 'translateZ(0)', contain: 'content' }}>
        <InteractiveRobotSpline
          scene={ROBOT_SCENE_URL}
          className="w-full h-full"
        />

        {/*
          Corner treatment replacing the Spline runtime's attribution badge.

          The badge is painted into the WebGL canvas itself rather than added to
          the DOM (verified: the scene container is `div > div > canvas` with no
          anchor or logo node anywhere in the document once the scene has loaded),
          so its text cannot be edited or hidden with a selector. The gradient
          below covers that corner and our own label sits on top. Both are
          `pointer-events-none` so the scene stays fully draggable underneath.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 h-28 w-72 rounded-br-3xl"
          style={{
            background:
              'radial-gradient(130% 130% at 100% 100%, var(--hm-surface-sunk) 45%, color-mix(in oklab, var(--hm-surface-sunk) 70%, transparent) 65%, transparent 85%)',
          }}
        />

        <div className="pointer-events-none absolute bottom-5 right-5 inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-surface/70 px-3 py-1 backdrop-blur-md">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-honey" />
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-honey-deep">
            Whobee
          </span>
        </div>
      </div>
    </div> 
  );
}
