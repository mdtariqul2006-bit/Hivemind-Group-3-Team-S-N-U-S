import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type AuthRole = 'member' | 'admin';

export interface AuthUser {
  email: string;
  role: AuthRole;
}

interface StoredAccount {
  email: string;
  password: string;
  role: AuthRole;
}

type AuthResult = { ok: true } | { ok: false; error: string };

const USER_KEY = 'hm-auth-user';
const ACCOUNTS_KEY = 'hm-auth-accounts';

/** Seeded so the Admin Panel is reachable in this prototype without a real backend. */
const DEMO_ADMIN: StoredAccount = {
  email: 'admin@hivemind.dev',
  password: 'hivemind-admin',
  role: 'admin',
};

function loadAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as StoredAccount[]) : [];
  } catch {
    return [];
  }
}

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

interface AuthContextValue {
  user: AuthUser | null;
  signIn: (email: string, password: string) => AuthResult;
  signUp: (email: string, password: string) => AuthResult;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Mock, client-only auth for the prototype. There is no backend in this repo,
 * so accounts live in localStorage in plain text. That is fine for a design
 * sprint demo and not fine for production, swap this for real auth before
 * this ships anywhere real users sign up.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadUser());

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  function signIn(email: string, password: string): AuthResult {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !password) {
      return { ok: false, error: 'Enter your email and password.' };
    }
    if (normalized === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      setUser({ email: DEMO_ADMIN.email, role: 'admin' });
      return { ok: true };
    }
    const account = loadAccounts().find((a) => a.email === normalized);
    if (!account || account.password !== password) {
      return { ok: false, error: 'Incorrect email or password.' };
    }
    setUser({ email: account.email, role: account.role });
    return { ok: true };
  }

  function signUp(email: string, password: string): AuthResult {
    const normalized = email.trim().toLowerCase();
    if (!normalized || password.length < 6) {
      return { ok: false, error: 'Enter an email and a password of at least 6 characters.' };
    }
    if (normalized === DEMO_ADMIN.email) {
      return { ok: false, error: 'That email is reserved.' };
    }
    const accounts = loadAccounts();
    if (accounts.some((a) => a.email === normalized)) {
      return { ok: false, error: 'An account with that email already exists. Try signing in.' };
    }
    const account: StoredAccount = { email: normalized, password, role: 'member' };
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]));
    setUser({ email: account.email, role: account.role });
    return { ok: true };
  }

  function signOut() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
