import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export interface Toast {
  id: number;
  message: string;
  tone: 'honey' | 'sage';
}

interface ToastContextValue {
  toasts: Toast[];
  push: (message: string, tone?: Toast['tone']) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * A small, warm toast queue for one-off confirmations, saying hi to your buddy,
 * bookmarking a document, submitting settling-in feedback. Auto-dismisses after
 * four seconds; also dismissible by hand. Kept separate from OnboardingProvider
 * because toasts are ephemeral UI state, not onboarding progress.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (message: string, tone: Toast['tone'] = 'honey') => {
      const id = ++counter.current;
      setToasts((t) => [...t, { id, message, tone }]);
      window.setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toasts, push, dismiss }}>{children}</ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
