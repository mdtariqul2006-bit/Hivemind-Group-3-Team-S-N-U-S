import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

/**
 * Client side JWT helper for the admin console demo.
 *
 * These are genuine HS256 tokens: really signed, really verified, with a real
 * two hour expiry that the app enforces. What they are not is a security
 * boundary. There is no backend in this project, so the signing secret has to
 * ship inside the browser bundle (anything prefixed VITE_ is inlined at build
 * time, and the fallback below is hardcoded). Anyone can read it from the
 * built JavaScript and mint their own admin token.
 *
 * That trade is deliberate for a coursework prototype whose goal is to show
 * the full JWT flow end to end: issue, store, verify, expire, and gate a
 * route. Do not treat this as protecting anything real. A production version
 * moves signing behind a server that keeps the secret private.
 */

function getSecretKey(): Uint8Array {
  const secretEnv = import.meta.env.VITE_JWT_SECRET;
  if (!secretEnv && import.meta.env.PROD) {
    throw new Error('VITE_JWT_SECRET environment variable is missing in production environment');
  }
  return new TextEncoder().encode(secretEnv ?? 'hivemind-academy-production-secure-key-2026');
}

const ISSUER = 'hivemind-academy';
const AUDIENCE = 'hivemind-admin-console';

export interface AdminClaims extends JWTPayload {
  role: 'admin';
  name: string;
}

/**
 * Generates a signed HS256 JWT for authenticated administrators with configurable 2-hour lifetime.
 */
export async function signAdminToken(email: string, name: string): Promise<string> {
  const secret = getSecretKey();
  return new SignJWT({ role: 'admin', name })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(email)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secret);
}

/**
 * Validates token signature, issuer, audience, role claims, and temporal validity.
 * Returns decoded AdminClaims payload or null if invalid or expired.
 */
export async function verifyAdminToken(token: string): Promise<AdminClaims | null> {
  try {
    const secret = getSecretKey();
    const { payload } = await jwtVerify(token, secret, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (payload.role !== 'admin' || typeof payload.name !== 'string') return null;
    return payload as AdminClaims;
  } catch {
    return null;
  }
}
