import { useState } from 'react';
import { Monitor, Moon, RotateCcw, Sun } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useMember } from '@/state/member-context';
import { useOnboarding } from '@/state/onboarding-context';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/state/toast-context';
import { cn } from '@/lib/cn';

const TITLE_ID = 'settings-modal-title';

/**
 * Account and app settings: appearance, and starting the onboarding plan over.
 *
 * The reset is the one destructive action here, so it asks for a second press
 * rather than a confirm() dialog, keeping the interaction inside the app's own
 * styling and staying keyboard friendly.
 */
export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useMember();
  const { dispatch } = useOnboarding();
  const { theme, setTheme } = useTheme();
  const { push } = useToast();
  const [confirmingReset, setConfirmingReset] = useState(false);

  if (!user) return null;

  function handleClose() {
    // Never leave the confirm armed for the next time it opens.
    setConfirmingReset(false);
    onClose();
  }

  function handleReset() {
    if (!confirmingReset) {
      setConfirmingReset(true);
      return;
    }
    dispatch({ type: 'reset' });
    push('Onboarding progress cleared', 'sage');
    handleClose();
  }

  const themes = [
    { id: 'light' as const, label: 'Light', icon: Sun },
    { id: 'dark' as const, label: 'Dark', icon: Moon },
  ];

  return (
    <Modal open={open} onClose={handleClose} labelledBy={TITLE_ID}>
      <div className="p-6 sm:p-7">
        <h2 id={TITLE_ID} className="text-xl font-bold text-ink">
          Settings
        </h2>
        <p className="mt-1 text-sm text-muted">Appearance and your onboarding plan.</p>

        <section className="mt-6">
          <h3 className="text-sm font-semibold text-ink">Appearance</h3>
          <div
            role="radiogroup"
            aria-label="Theme"
            className="mt-2.5 inline-flex gap-1.5 rounded-2xl border border-border bg-sunk/50 p-1.5"
          >
            {themes.map((t) => (
              <button
                key={t.id}
                role="radio"
                aria-checked={theme === t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors',
                  theme === t.id
                    ? 'bg-surface text-ink shadow-[var(--shadow-soft)]'
                    : 'text-muted hover:text-ink',
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
            <Monitor className="h-3.5 w-3.5" />
            Motion follows your system's reduced motion setting automatically.
          </p>
        </section>

        <section className="mt-7 border-t border-border/70 pt-6">
          <h3 className="text-sm font-semibold text-ink">Onboarding plan</h3>
          <p className="mt-1 text-sm text-muted">
            Clears your role, start date, and everything you have ticked off, then takes
            you back to the start. Your account and profile are kept.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <Button
              variant={confirmingReset ? 'primary' : 'secondary'}
              onClick={handleReset}
              iconLeft={<RotateCcw className="h-4 w-4" />}
            >
              {confirmingReset ? 'Yes, clear my progress' : 'Start over'}
            </Button>
            {confirmingReset && (
              <button
                onClick={() => setConfirmingReset(false)}
                className="text-sm font-medium text-muted hover:text-ink"
              >
                Cancel
              </button>
            )}
          </div>
        </section>

        <section className="mt-7 border-t border-border/70 pt-6">
          <h3 className="text-sm font-semibold text-ink">Account</h3>
          <p className="mt-1 text-sm text-muted">
            Signed in as <span className="font-medium text-ink">{user.email}</span>
          </p>
          <p className="mt-2 text-xs text-muted">
            This prototype keeps accounts in your browser only, there is no server. Clearing
            your browser data signs you out and removes the account.
          </p>
        </section>

        <div className="mt-7 flex justify-end">
          <Button variant="secondary" onClick={handleClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
