import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { Task } from '@/types';
import { GlowCard } from '@/components/motion/glow-card';
import { HexFrame } from '@/components/ui/hex-frame';
import { Badge } from '@/components/ui/badge';
import { taskIcon } from '@/lib/task-icons';
import { formatMinutes } from '@/lib/format';
import { cn } from '@/lib/cn';

/**
 * A dashboard task card. Its outer wrapper carries the shared `layoutId` so that,
 * when tapped, the card expands into the task detail view rather than hard-cutting.
 */
export function TaskCard({
  task,
  done,
  onOpen,
  className,
}: {
  task: Task;
  done: boolean;
  onOpen: () => void;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const Icon = taskIcon(task.icon);

  return (
    <motion.div
      layoutId={reduce ? undefined : `task-${task.id}`}
      className={cn('h-full', className)}
    >
      <GlowCard className="h-full">
        <button
          onClick={onOpen}
          className="flex h-full w-full flex-col p-5 text-left"
          aria-label={`Open task: ${task.title}`}
        >
          <div className="flex items-start justify-between gap-3">
            <HexFrame accent={done ? 'honey' : 'sage'} size={46}>
              {done ? (
                <Check className="h-5 w-5 text-charcoal" strokeWidth={3} />
              ) : (
                <Icon className="h-5 w-5 text-charcoal" strokeWidth={1.9} />
              )}
            </HexFrame>
            {done ? (
              <Badge tone="honey">Done</Badge>
            ) : (
              <Badge tone="muted">{formatMinutes(task.minutes)}</Badge>
            )}
          </div>
          <h3 className="mt-4 text-base font-semibold text-ink">{task.title}</h3>
          <p className="mt-1.5 line-clamp-3 text-sm text-muted">{task.summary}</p>
          <span className="mt-auto pt-4 text-sm font-medium text-honey-deep">
            {done ? 'Review step' : 'Open step →'}
          </span>
        </button>
      </GlowCard>
    </motion.div>
  );
}
