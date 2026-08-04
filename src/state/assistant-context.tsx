import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { View } from '@/types';
import { useOnboarding } from '@/state/onboarding-context';
import { buildKnowledgeBase, FALLBACK_ENTRY } from '@/lib/assistant/knowledge-base';
import { matchQuestion } from '@/lib/assistant/match';

const ENTRANCE_KEY = 'hm-assistant-entered';

/** Guarded sessionStorage read/write, same defensive shape as lib/storage.ts's
 * localStorage helpers: private mode and blocked storage can throw on plain
 * property access, this should degrade to "play the entrance every time"
 * rather than take the assistant down. */
function hasEnteredThisSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(ENTRANCE_KEY) === '1';
  } catch {
    return false;
  }
}

function markEnteredThisSession(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(ENTRANCE_KEY, '1');
  } catch {
    // Nothing to recover, the entrance just replays next time, which is fine.
  }
}

export interface AssistantMessage {
  id: number;
  from: 'user' | 'assistant';
  text: string;
  because?: string;
  linkView?: View;
  linkLabel?: string;
}

interface AssistantContextValue {
  /** Whether the docked bubble should render at all yet. */
  hasEntered: boolean;
  isOpen: boolean;
  messages: AssistantMessage[];
  open: () => void;
  close: () => void;
  toggle: () => void;
  /** Called once, when the landing page's robot section scrolls out of view. */
  playEntrance: () => void;
  ask: (question: string) => void;
}

const AssistantContext = createContext<AssistantContextValue | null>(null);

const GREETING: AssistantMessage = {
  id: 0,
  from: 'assistant',
  text: "Hi, I'm the onboarding assistant. Ask me things like \"what should I do today\" or \"who is my buddy\".",
  because: 'I only answer a small set of real onboarding questions, on purpose, ask People directly for anything wider.',
};

export function AssistantProvider({ children }: { children: ReactNode }) {
  const { state } = useOnboarding();
  const [hasEntered, setHasEntered] = useState(hasEnteredThisSession);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([GREETING]);
  const counter = useRef(1);

  const playEntrance = useCallback(() => {
    setHasEntered((already) => {
      if (already) return already;
      markEnteredThisSession();
      return true;
    });
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const ask = useCallback(
    (question: string) => {
      const trimmed = question.trim();
      if (!trimmed) return;

      const knowledgeBase = buildKnowledgeBase(state);
      const match = matchQuestion(trimmed, knowledgeBase) ?? FALLBACK_ENTRY;

      const userMessage: AssistantMessage = {
        id: ++counter.current,
        from: 'user',
        text: trimmed,
      };
      const assistantMessage: AssistantMessage = {
        id: ++counter.current,
        from: 'assistant',
        text: match.answer,
        because: match.because,
        linkView: match.linkView,
        linkLabel: match.linkLabel,
      };
      setMessages((m) => [...m, userMessage, assistantMessage]);
    },
    [state],
  );

  const value = useMemo<AssistantContextValue>(
    () => ({ hasEntered, isOpen, messages, open, close, toggle, playEntrance, ask }),
    [hasEntered, isOpen, messages, open, close, toggle, playEntrance, ask],
  );

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}

export function useAssistant(): AssistantContextValue {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error('useAssistant must be used inside AssistantProvider');
  return ctx;
}
