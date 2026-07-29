'use client';

import { InteractiveRobotSpline } from '@/components/blocks/interactive-3d-robot';

export function Section() { 
  const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

  return (
    <div className="relative w-full h-[650px] overflow-hidden rounded-3xl border border-border/80 bg-surface/60 backdrop-blur-2xl shadow-2xl my-12">
      <InteractiveRobotSpline
        scene={ROBOT_SCENE_URL}
        className="absolute inset-0 z-0 w-full h-full" 
      />

      <div className="
        absolute inset-0 z-10
        pt-12 md:pt-20 lg:pt-24
        px-4 md:px-8            
        pointer-events-none     
      ">
        <div className="
          text-center             
          text-ink              
          drop-shadow-lg          
          w-full max-w-2xl        
          mx-auto                 
        ">
          <span className="inline-flex items-center gap-2 rounded-full border border-honey/40 bg-honey-wash/90 px-4 py-1 text-xs font-bold uppercase tracking-wider text-honey-deep mb-4 backdrop-blur-md">
            🤖 AI Work Buddy
          </span>
          <h2 className="
            text-2xl md:text-3xl lg:text-4xl xl:text-5xl 
            font-black tracking-tight text-ink drop-shadow-md
          ">
            Meet Whobee, your interactive 3D AI Onboarding Guide
          </h2>
          <p className="mt-3 text-sm sm:text-base font-medium text-muted drop-shadow-sm max-w-xl mx-auto">
            Interact with Whobee to ask context-specific questions, find documentation, or request an instant introduction to your team buddy.
          </p>
        </div>
      </div>
    </div> 
  );
}
