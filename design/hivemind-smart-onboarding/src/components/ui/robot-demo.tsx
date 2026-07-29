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
      <div className="relative h-[480px] w-full bg-sunk/40">
        <InteractiveRobotSpline
          scene={ROBOT_SCENE_URL}
          className="w-full h-full" 
        />
      </div>
    </div> 
  );
}
