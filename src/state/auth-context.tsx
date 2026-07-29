import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { signAdminToken, verifyAdminToken, type AdminClaims } from '@/lib/auth/jwt';
import { matchAdmin } from '@/lib/auth/credentials';

const STORAGE_KEY = 'hm-admin-token';

export interface AdminUser {
  email: string;
  name: string;
}

type LoginResult = { ok: true } | { ok: false; error: string };

interface AuthValue {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  /** True once the stored token check has finished, so the UI avoids a flash. */
  ready: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

function toUser(claims: AdminClaims): AdminUser {
  return { email: String(claims.sub ?? ''), name: claims.name };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(false);

  // Restore a stored session on first load, dropping the token if it expired.
  useEffect(() => {
    let active = true;
    const token = localStorage.getItem(STORAGE_KEY);
    if (!token) {
      setReady(true);
      return;
    }
    verifyAdminToken(token).then((claims) => {
      if (!active) return;
      if (claims) setAdmin(toUser(claims));
      else localStorage.removeItem(STORAGE_KEY);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    const account = matchAdmin(email, password);
    if (!account) {
      return { ok: false, error: 'Those details do not match an admin account.' };
    }
    const token = await signAdminToken(account.email, account.name);
    localStorage.setItem(STORAGE_KEY, token);
    setAdmin({ email: account.email, name: account.name });
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAdmin(null);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({ admin, isAuthenticated: admin !== null, ready, login, logout }),
    [admin, ready, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
