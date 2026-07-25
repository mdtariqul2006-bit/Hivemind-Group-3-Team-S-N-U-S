import { motion, useReducedMotion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { springPop } from '@/lib/motion';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const reduce = useReducedMotion();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-ink transition-colors hover:bg-sunk"
      whileTap={reduce ? undefined : { scale: 0.92 }}
      transition={springPop}
    >
      <motion.span
        key={theme}
        initial={reduce ? false : { rotate: -40, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </motion.span>
    </motion.button>
  );
}
