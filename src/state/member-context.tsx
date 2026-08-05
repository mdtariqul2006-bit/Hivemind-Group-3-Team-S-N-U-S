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
  /** Display name, optional: an account is usable before one is set. */
  name?: string;
  /** Square avatar as a data URL, already shrunk by lib/avatar-image.ts. */
  avatarUrl?: string;
}

/** The fields a member can change about themselves. */
export type ProfilePatch = Partial<Pick<MemberUser, 'name' | 'avatarUrl'>>;

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
    const { email, name, avatarUrl } = parsed as Record<string, unknown>;
    if (typeof email !== 'string' || !email) return null;
    // name and avatarUrl are validated separately rather than spread in: a
    // stale or hand edited record with the wrong types would otherwise reach
    // the <img> src and the initials fallback as non-strings.
    return {
      email,
      ...(typeof name === 'string' && name ? { name } : {}),
      ...(typeof avatarUrl === 'string' && avatarUrl.startsWith('data:image/')
        ? { avatarUrl }
        : {}),
    };
  } catch {
    return null;
  }
}

/**
 * First name for greetings. Falls back to the email's local part, so a member
 * who never set a display name is still greeted as somebody rather than as the
 * demo persona.
 */
export function firstNameFor(user: MemberUser): string {
  const source = user.name?.trim() || user.email.split('@')[0] || '';
  const first = source.split(/[\s._-]+/).filter(Boolean)[0] ?? '';
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : '';
}

/** Initials for the avatar fallback, from the display name or the email. */
export function initialsFor(user: MemberUser): string {
  const source = user.name?.trim() || user.email.split('@')[0] || '';
  const words = source.split(/[\s._-]+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase();
  return (words[0]![0]! + words[1]![0]!).toUpperCase();
}

interface MemberContextValue {
  user: MemberUser | null;
  signIn: (email: string, password: string) => AuthResult;
  signUp: (email: string, password: string) => AuthResult;
  signOut: () => void;
  updateProfile: (patch: ProfilePatch) => AuthResult;
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

  /**
   * Writes before it commits to state, rather than the other way round.
   *
   * An avatar is by far the largest thing this app stores, so a write here can
   * genuinely fail on a full quota. The persistence effect below cannot report
   * that, it would just drop the image and leave the UI claiming it saved. So
   * the write is attempted first and state only moves if it succeeded, which
   * means what is on screen always matches what survives a refresh.
   */
  function updateProfile(patch: ProfilePatch): AuthResult {
    if (!user) return { ok: false, error: 'You need to be signed in to do that.' };

    const next: MemberUser = { ...user };
    if ('name' in patch) {
      const trimmed = patch.name?.trim();
      if (trimmed) next.name = trimmed;
      else delete next.name;
    }
    if ('avatarUrl' in patch) {
      if (patch.avatarUrl) next.avatarUrl = patch.avatarUrl;
      else delete next.avatarUrl;
    }

    if (!safeSetItem(USER_KEY, JSON.stringify(next))) {
      return {
        ok: false,
        error: 'Could not save that. Your browser storage may be full, try a smaller image.',
      };
    }
    setUser(next);
    return { ok: true };
  }

  return (
    <MemberContext.Provider value={{ user, signIn, signUp, signOut, updateProfile }}>
      {children}
    </MemberContext.Provider>
  );
}

export function useMember(): MemberContextValue {
  const ctx = useContext(MemberContext);
  if (!ctx) throw new Error('useMember must be used inside MemberProvider');
  return ctx;
}
