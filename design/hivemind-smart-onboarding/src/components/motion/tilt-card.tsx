import { useState, useRef, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export function TiltCard({ children, className = '' }: TiltCardProps) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12;
    const rY = ((x - centerX) / centerX) * 12;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-3xl border border-border/80 bg-surface/80 backdrop-blur-xl shadow-2xl transition-shadow hover:shadow-[0_20px_50px_rgba(255,195,112,0.15)] ${className}`}
    >
      {/* Glare spotlight layer */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
