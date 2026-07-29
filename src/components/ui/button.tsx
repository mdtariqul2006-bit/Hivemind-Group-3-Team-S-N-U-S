import { forwardRef, type ReactNode } from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { springPop } from '@/lib/motion';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

// Extend motion's own button props so the animation event handlers line up and
// there is no React-DOM vs Framer conflict on onAnimationStart / onDrag*.
interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium ' +
  'transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-honey ' +
  'focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap';

const variants: Record<Variant, string> = {
  // Charcoal text on the honey→pink gradient, the AA-safe pairing from the brief.
  primary:
    'gradient-hm text-charcoal shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)]',
  secondary: 'bg-surface text-ink border border-border hover:bg-sunk',
  ghost: 'text-ink hover:bg-sunk',
};

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-14 px-8 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, children, iconLeft, iconRight, ...rest },
  ref,
) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={springPop}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </motion.button>
  );
});
