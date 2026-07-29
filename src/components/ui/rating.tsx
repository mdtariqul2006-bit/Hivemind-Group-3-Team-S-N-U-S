import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Star } from 'lucide-react';
import { springPop } from '@/lib/motion';
import { cn } from '@/lib/cn';

/**
 * A small honey star rating, used on the milestone "settling-in" summary so the
 * new hire can register how the phase felt. Keyboard operable via the radio group.
 */
export function Rating({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div role="radiogroup" aria-label={label} className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const on = star <= active;
        return (
          <motion.button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} out of 5`}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onFocus={() => setHover(star)}
            onBlur={() => setHover(0)}
            onClick={() => onChange(star)}
            whileTap={reduce ? undefined : { scale: 0.85 }}
            transition={springPop}
            className="rounded-full p-1"
          >
            <Star
              className={cn('h-7 w-7 transition-colors', on ? 'text-honey' : 'text-border')}
              fill={on ? 'var(--hm-honey)' : 'transparent'}
              strokeWidth={1.75}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
