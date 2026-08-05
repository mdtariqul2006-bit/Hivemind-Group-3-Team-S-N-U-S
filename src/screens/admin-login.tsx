import { useState, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/state/auth-context';
import { useOnboarding } from '@/state/onboarding-context';
import { Button } from '@/components/ui/button';
import { LogoMark } from '@/components/ui/logo';
import { HexFrame } from '@/components/ui/hex-frame';
import { HoneycombBackdrop } from '@/components/ui/honeycomb-backdrop';
import { DEMO_ADMIN } from '@/lib/auth/credentials';
import { EASE_OUT } from '@/lib/motion';

/** Branded sign in screen that gates the admin console. */
export function AdminLogin() {
  const reduce = useReducedMotion();
  const { login } = useAuth();
  const { dispatch } = useOnboarding();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      // A short pause so the pending state is visible, this stands in for a
      // network round trip that a real login would make.
      await new Promise((r) => setTimeout(r, 450));
      const result = await login(email, password);
      if (!result.ok) setError(result.error);
    } catch (err) {
      console.error('Admin login failed:', err);
      setError('Something went wrong signing in. Please try again.');
    } finally {
      // Always clears. Previously a throw here left the button disabled on
      // "Verifying" with no message and no way to retry short of a reload.
      setBusy(false);
    }
  }

  function fillDemo() {
    setEmail(DEMO_ADMIN.email);
    setPassword(DEMO_ADMIN.password);
    setError(null);
  }

  return (
    <div className="relative grid min-h-[100dvh] place-items-center px-4 py-10">
      {/* Comb fragments and a bee, the brand motif carried into the sign in. */}
      <HoneycombBackdrop />

      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="relative w-full max-w-[420px]"
      >
        <button
          onClick={() => dispatch({ type: 'go', view: 'landing' })}
          className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to site
        </button>

        <div className="rounded-3xl border border-border bg-surface p-7 shadow-[var(--shadow-lift)] sm:p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <LogoMark size={44} />
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink">Admin sign in</h1>
            <p className="mt-1.5 text-sm text-muted">
              Secure access to the HiveMind onboarding console.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
            <div className="grid gap-1.5">
              <label htmlFor="admin-email" className="text-sm font-medium text-ink">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@hivemindacademy.com"
                  required
                  className="h-12 w-full rounded-2xl border border-border bg-canvas pl-10 pr-4 text-sm text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-honey focus-visible:outline-offset-2"
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="admin-password" className="text-sm font-medium text-ink">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="h-12 w-full rounded-2xl border border-border bg-canvas pl-10 pr-11 text-sm text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-honey focus-visible:outline-offset-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-sunk hover:text-ink"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                role="alert"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-pink-wash px-3.5 py-2.5 text-sm text-ink"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={busy}
              className="mt-1 w-full"
              iconLeft={busy ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
            >
              {busy ? 'Verifying' : 'Sign in'}
            </Button>
          </form>

          {/* Demo credentials, this prototype has no user management yet. */}
          <div className="mt-6 rounded-2xl border border-border bg-sunk p-4">
            <div className="flex items-start gap-2.5">
              <HexFrame size={30} accent="honey">
                <ShieldCheck className="h-3.5 w-3.5 text-charcoal" />
              </HexFrame>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-ink">Demo credentials</p>
                <p className="mt-0.5 break-all font-mono text-[11px] leading-relaxed text-muted">
                  {DEMO_ADMIN.email}
                  <br />
                  {DEMO_ADMIN.password}
                </p>
                <button
                  type="button"
                  onClick={fillDemo}
                  className="mt-2 text-xs font-semibold text-honey-deep underline underline-offset-2"
                >
                  Fill automatically
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-muted">
          Sessions are signed as JSON web tokens and expire after two hours.
        </p>
      </motion.div>
    </div>
  );
}
