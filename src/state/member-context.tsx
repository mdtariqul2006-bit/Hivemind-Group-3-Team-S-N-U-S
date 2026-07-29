import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

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

function loadAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as StoredAccount[]) : [];
  } catch {
    return [];
  }
}

function loadUser(): MemberUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as MemberUser) : null;
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
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
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
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]));
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
