import { ArrowRight } from 'lucide-react';
import type { AssistantMessage as AssistantMessageType } from '@/state/assistant-context';
import { useOnboarding } from '@/state/onboarding-context';
import { cn } from '@/lib/cn';

/**
 * One message bubble. Assistant messages always carry a "Because ..." line,
 * the same visual treatment task-detail.tsx already uses for its
 * learning-style tip (bg-honey-wash / text-honey-deep), reused rather than
 * reinvented, see docs/onboarding-assistant-spec.md section 2.
 */
export function AssistantMessage({ message }: { message: AssistantMessageType }) {
  const { dispatch } = useOnboarding();
  const isUser = message.from === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
          isUser ? 'bg-sunk text-ink' : 'border border-border bg-surface text-ink',
        )}
      >
        <p>{message.text}</p>

        {message.because && (
          <div className="mt-2 rounded-xl bg-honey-wash px-3 py-2">
            <p className="text-xs text-honey-deep">
              <span className="font-semibold">Because: </span>
              {message.because}
            </p>
          </div>
        )}

        {message.linkView && (
          <button
            onClick={() => dispatch({ type: 'go', view: message.linkView! })}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-honey-deep hover:underline"
          >
            {message.linkLabel ?? 'Take me there'}
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}
