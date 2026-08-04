import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { signAdminToken, verifyAdminToken, type AdminClaims } from '@/lib/auth/jwt';
import { matchAdmin } from '@/lib/auth/credentials';
import { safeGetItem, safeRemoveItem, safeSetItem } from '@/lib/storage';

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
  const expiryTimer = useRef<number | null>(null);

  const clearExpiryTimer = useCallback(() => {
    if (expiryTimer.current !== null) {
      window.clearTimeout(expiryTimer.current);
      expiryTimer.current = null;
    }
  }, []);

  /**
   * Sign the admin out the moment the token's own exp passes. Without this the
   * expiry is only ever checked on mount, so a tab left open stayed fully
   * authenticated indefinitely against a token that had already expired.
   */
  const scheduleExpiry = useCallback(
    (claims: AdminClaims) => {
      clearExpiryTimer();
      if (typeof claims.exp !== 'number') return;
      const msLeft = claims.exp * 1000 - Date.now();
      if (msLeft <= 0) return;
      expiryTimer.current = window.setTimeout(() => {
        safeRemoveItem(STORAGE_KEY);
        setAdmin(null);
      }, msLeft);
    },
    [clearExpiryTimer],
  );

  // Restore a stored session on first load, dropping the token if it expired.
  useEffect(() => {
    let active = true;
    const token = safeGetItem(STORAGE_KEY);
    if (!token) {
      setReady(true);
      return;
    }
    verifyAdminToken(token).then(
      (claims) => {
        if (!active) return;
        if (claims) {
          setAdmin(toUser(claims));
          scheduleExpiry(claims);
        } else {
          safeRemoveItem(STORAGE_KEY);
        }
        setReady(true);
      },
      // verifyAdminToken swallows its own errors, but never let a rejection
      // strand `ready` at false: that renders an empty frame with no login
      // form and no way back.
      () => {
        if (active) setReady(true);
      },
    );
    return () => {
      active = false;
    };
  }, [scheduleExpiry]);

  useEffect(() => clearExpiryTimer, [clearExpiryTimer]);

  const login = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      const account = matchAdmin(email, password);
      if (!account) {
        return { ok: false, error: 'Those details do not match an admin account.' };
      }
      try {
        const token = await signAdminToken(account.email, account.name);
        safeSetItem(STORAGE_KEY, token);
        const claims = await verifyAdminToken(token);
        if (claims) scheduleExpiry(claims);
        setAdmin({ email: account.email, name: account.name });
        return { ok: true };
      } catch (err) {
        // Signing throws in a production build with no VITE_JWT_SECRET.
        // Report it rather than leaving the caller awaiting forever.
        console.error('Admin token signing failed:', err);
        return { ok: false, error: 'Could not start a session. Please try again.' };
      }
    },
    [scheduleExpiry],
  );

  const logout = useCallback(() => {
    clearExpiryTimer();
    safeRemoveItem(STORAGE_KEY);
    setAdmin(null);
  }, [clearExpiryTimer]);

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
