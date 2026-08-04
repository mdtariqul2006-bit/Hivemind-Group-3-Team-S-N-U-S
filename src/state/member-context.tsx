import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { safeGetItem, safeRemoveItem, safeSetItem } from '@/lib/storage';

export interface MemberUser {
  email: string;
}

interface StoredAccount {
  email: string;
  password: string;
}

type AuthResult = { ok: true } | { ok: false; error: string };

const USER_KEY = 'hm-member-user';
const ACCOUNTS_KEY = 'hm-member-accounts';

/**
 * Both loaders validate the parsed shape instead of casting it. A successful
 * JSON.parse says nothing about the contents, so stored data of the wrong
 * shape (an older schema, or hand edited storage) used to slip through the
 * cast and then blow up at the call site: `{}` parses fine, and the resulting
 * object has no .find, which crashed the app on the sign in click.
 */
function isStoredAccount(value: unknown): value is StoredAccount {
  if (typeof value !== 'object' || value === null) return false;
  const account = value as Record<string, unknown>;
  return typeof account.email === 'string' && typeof account.password === 'string';
}

function loadAccounts(): StoredAccount[] {
  try {
    const raw = safeGetItem(ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStoredAccount);
  } catch {
    return [];
  }
}

function loadUser(): MemberUser | null {
  try {
    const raw = safeGetItem(USER_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const { email } = parsed as Record<string, unknown>;
    return typeof email === 'string' && email ? { email } : null;
  } catch {
    return null;
  }
}

interface MemberContextValue {
  user: MemberUser | null;
  signIn: (email: string, password: string) => AuthResult;
  signUp: (email: string, password: string) => AuthResult;
  signOut: () => void;
}

const MemberContext = createContext<MemberContextValue | null>(null);

/**
 * Mock, client only account system for new starters, separate from the admin
 * console's JWT login in state/auth-context.tsx. There is no backend in this
 * repo, so accounts live in localStorage in plain text. That is fine for a
 * design sprint demo and not fine for production.
 */
export function MemberProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MemberUser | null>(() => loadUser());

  useEffect(() => {
    // Guarded: an unhandled throw in an effect unmounts the React tree, so a
    // full quota or blocked storage used to crash the app immediately after a
    // successful signup.
    if (user) safeSetItem(USER_KEY, JSON.stringify(user));
    else safeRemoveItem(USER_KEY);
  }, [user]);

  function signIn(email: string, password: string): AuthResult {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !password) {
      return { ok: false, error: 'Enter your email and password.' };
    }
    const account = loadAccounts().find((a) => a.email === normalized);
    if (!account || account.password !== password) {
      return { ok: false, error: 'Incorrect email or password.' };
    }
    setUser({ email: account.email });
    return { ok: true };
  }

  function signUp(email: string, password: string): AuthResult {
    const normalized = email.trim().toLowerCase();
    if (!normalized || password.length < 6) {
      return { ok: false, error: 'Enter an email and a password of at least 6 characters.' };
    }
    const accounts = loadAccounts();
    if (accounts.some((a) => a.email === normalized)) {
      return { ok: false, error: 'An account with that email already exists. Try signing in.' };
    }
    const account: StoredAccount = { email: normalized, password };
    if (!safeSetItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]))) {
      // Without a durable account record the user could sign in now and be
      // unable to sign in again later, which is more confusing than failing here.
      return {
        ok: false,
        error: 'Could not save your account. Check your browser storage settings and try again.',
      };
    }
    setUser({ email: account.email });
    return { ok: true };
  }

  function signOut() {
    setUser(null);
  }

  return (
    <MemberContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </MemberContext.Provider>
  );
}

export function useMember(): MemberContextValue {
  const ctx = useContext(MemberContext);
  if (!ctx) throw new Error('useMember must be used inside MemberProvider');
  return ctx;
}
