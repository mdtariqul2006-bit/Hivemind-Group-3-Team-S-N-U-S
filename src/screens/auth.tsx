import { useState, type FormEvent } from 'react';
import { useMember } from '@/state/member-context';
import { useOnboarding } from '@/state/onboarding-context';
import { Button } from '@/components/ui/button';
import { GlowCard } from '@/components/motion/glow-card';
import { Wordmark } from '@/components/ui/logo';
import { cn } from '@/lib/cn';

type Tab = 'sign-in' | 'sign-up';

export function Auth() {
  const { signIn, signUp } = useMember();
  const { dispatch } = useOnboarding();
  const [tab, setTab] = useState<Tab>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function switchTab(next: Tab) {
    setTab(next);
    setError(null);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = tab === 'sign-in' ? signIn(email, password) : signUp(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    dispatch({ type: 'go', view: 'dashboard' });
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col justify-center px-5 py-12">
      <button
        onClick={() => dispatch({ type: 'go', view: 'landing' })}
        className="mx-auto mb-10"
        aria-label="HiveMind home"
      >
        <Wordmark size={40} />
      </button>

      <GlowCard className="p-8">
        <div className="mb-6 flex rounded-full bg-sunk p-1">
          {(['sign-in', 'sign-up'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => switchTab(t)}
              className={cn(
                'flex-1 rounded-full py-2 text-sm font-semibold transition-colors',
                tab === t ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink',
              )}
            >
              {t === 'sign-in' ? 'Sign in' : 'Sign up'}
            </button>
          ))}
        </div>

        <h1 className="text-xl font-bold text-ink">
          {tab === 'sign-in' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {tab === 'sign-in'
            ? 'Sign in to pick up your first 30 days where you left off.'
            : 'Set up an account to start your personalised onboarding.'}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-honey"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Password</span>
            <input
              type="password"
              autoComplete={tab === 'sign-in' ? 'current-password' : 'new-password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-honey"
            />
          </label>

          {error && (
            <p className="text-sm font-medium text-rose-600 dark:text-rose-400" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full">
            {tab === 'sign-in' ? 'Sign in' : 'Create account'}
          </Button>
        </form>
      </GlowCard>
    </div>
  );
}
