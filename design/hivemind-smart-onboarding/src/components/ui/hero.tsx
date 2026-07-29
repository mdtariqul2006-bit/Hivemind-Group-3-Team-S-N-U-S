"use client"
import { useEffect, useRef, useState } from "react"
import { MeshGradient, PulsingBorder } from "@paper-design/shaders-react"
import { motion, useReducedMotion } from "framer-motion"
import { useTheme } from "@/hooks/use-theme"
import { ArrowRight } from "lucide-react"

interface ShaderShowcaseProps {
  onStartClick?: () => void
  onDashboardClick?: () => void
}

export default function ShaderShowcase({ onStartClick, onDashboardClick }: ShaderShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [, setIsActive] = useState(false)
  const { theme } = useTheme()
  const reduce = useReducedMotion()

  useEffect(() => {
    const handleMouseEnter = () => setIsActive(true)
    const handleMouseLeave = () => setIsActive(false)

    const container = containerRef.current
    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter)
      container.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  // HiveMind brand color palette adjusted for light/dark themes
  const meshColors = theme === "dark"
    ? ["#22252A", "#2C3037", "#383C42", "#FFC370", "#F4B8BD"]
    : ["#FBFAF7", "#ECE9E3", "#BAC9C5", "#FFC370", "#F4B8BD"]

  const borderColors = ["#FFC370", "#F4B8BD", "#BAC9C5", "#383C42", "#FFFFFF"]

  return (
    <div ref={containerRef} className="relative min-h-[90vh] overflow-hidden rounded-[2rem] border border-border bg-canvas/30 shadow-[var(--shadow-soft)]">
      {/* SVG Filters for glowing, gooey, and glass effects */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
              result="tint"
            />
          </filter>
          <filter id="gooey-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
          <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--hm-honey)" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="var(--hm-pink)" />
          </linearGradient>
          <filter id="text-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Mesh gradients from paper-design shaders */}
      {!reduce && (
        <>
          <MeshGradient
            className="absolute inset-0 w-full h-full"
            colors={meshColors}
            speed={0.25}
          />
          <MeshGradient
            className="absolute inset-0 w-full h-full opacity-30"
            colors={["#ffffff", "#FFC370", "#F4B8BD", "#BAC9C5"]}
            speed={0.15}
          />
        </>
      )}

      {/* Hero Content Overlay */}
      <div className="relative z-10 flex flex-col justify-between min-h-[90vh] p-8 md:p-12 lg:p-16">
        <header className="flex items-center justify-between w-full">
          <motion.div
            className="flex items-center group cursor-pointer gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.svg
              fill="none"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="size-11 text-ink group-hover:drop-shadow-lg transition-all duration-300"
              style={{
                filter: "url(#logo-glow)",
              }}
              whileHover={{
                rotate: [0, -4, 4, 0],
                transition: {
                  rotate: { duration: 0.6, ease: "easeInOut" },
                },
              }}
            >
              <path
                d="M50 4 91 27v46L50 96 9 73V27z"
                stroke="url(#logo-gradient)"
                strokeWidth="6"
              />
              <path
                d="M50 26 68 36v20L50 66 32 56V36z"
                stroke="var(--hm-honey)"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              <circle cx="50" cy="48" r="6" fill="var(--hm-honey)" />
            </motion.svg>
            <span className="text-xl font-bold tracking-tight text-ink">HiveMind</span>
          </motion.div>

          {/* Interactive gooey button */}
          <div id="gooey-btn" className="relative flex items-center group" style={{ filter: "url(#gooey-filter)" }}>
            <button
              onClick={onDashboardClick}
              className="absolute right-0 px-3 py-2 rounded-full bg-charcoal text-white font-normal text-xs transition-all duration-300 hover:bg-charcoal/90 cursor-pointer h-9 flex items-center justify-center -translate-x-10 group-hover:-translate-x-20 z-0"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onDashboardClick}
              className="px-6 py-2 rounded-full bg-charcoal text-white font-medium text-xs transition-all duration-300 hover:bg-charcoal/90 cursor-pointer h-9 flex items-center z-10"
            >
              Go to Dashboard
            </button>
          </div>
        </header>

        <main className="max-w-2xl mt-12 md:mt-24 lg:mt-32">
          <div className="text-left">
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-surface/10 backdrop-blur-md mb-6 relative border border-border"
              style={{
                filter: "url(#glass-effect)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-honey/30 to-transparent rounded-full" />
              <span className="text-ink font-medium relative z-10 tracking-wide text-xs">
                ✨ HiveMind × Ravensbourne Smart Onboarding
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-ink mb-6 leading-none tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.span
                className="block font-light text-ink/90 text-3xl md:text-4xl lg:text-5xl mb-2 tracking-wider"
                style={{
                  background: "linear-gradient(135deg, var(--hm-ink) 0%, var(--hm-honey) 30%, var(--hm-pink) 70%, var(--hm-ink) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "url(#text-glow)",
                }}
                animate={reduce ? {} : {
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={reduce ? {} : {
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                Welcome to the Hive
              </motion.span>
              <span className="block font-black text-ink drop-shadow-md">Smart Onboarding</span>
              <span className="block font-light text-muted italic text-3xl md:text-4xl mt-1">First 30 days made calm.</span>
            </motion.h1>

            <motion.p
              className="text-base md:text-lg font-light text-muted mb-8 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              A guided first-30-days experience that turns the overwhelming, impersonal first week into a personal, visibly-progressing journey. Role-specific content, micro-learning, and support on tap.
            </motion.p>

            <motion.div
              className="flex items-center gap-4 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <motion.button
                onClick={onDashboardClick}
                className="px-8 py-3.5 rounded-full bg-transparent border-2 border-charcoal/30 text-ink font-semibold text-sm transition-all duration-300 hover:bg-charcoal/5 hover:border-charcoal cursor-pointer backdrop-blur-sm"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                View Dashboard
              </motion.button>
              <motion.button
                onClick={onStartClick}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-honey to-pink text-charcoal font-bold text-sm transition-all duration-300 hover:brightness-105 cursor-pointer shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Start my first day
              </motion.button>
            </motion.div>
          </div>
        </main>

        {/* Pulsing Border on Bottom Right */}
        <div className="absolute bottom-8 right-8 z-30 hidden md:block">
          <div className="relative w-20 h-20 flex items-center justify-center">
            {!reduce && (
              <PulsingBorder
                colors={borderColors}
                colorBack="#00000000"
                speed={1.2}
                roundness={1}
                thickness={0.08}
                softness={0.15}
                intensity={4}
                spots={4}
                spotSize={0.1}
                pulse={0.08}
                smoke={0.4}
                smokeSize={3}
                frame={800000}
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  transform: "scale(0.65)",
                }}
              />
            )}

            {/* Rotating text label "HiveMind • Smart Onboarding • Design Sprint" */}
            <motion.svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              animate={reduce ? {} : { rotate: 360 }}
              transition={reduce ? {} : {
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{ transform: "scale(1.5)" }}
            >
              <defs>
                <path id="circle" d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
              </defs>
              <text className="text-[7.5px] fill-ink/60 font-semibold tracking-wider uppercase">
                <textPath href="#circle" startOffset="0%">
                  HiveMind • Smart Onboarding • Design Sprint • Hello World •
                </textPath>
              </text>
            </motion.svg>
          </div>
        </div>
      </div>
    </div>
  )
}
