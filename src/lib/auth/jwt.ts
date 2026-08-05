import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

/**
 * Client side JWT helper for the admin console demo.
 *
 * These are genuine HS256 tokens: really signed, really verified, with a real
 * two hour expiry that the app enforces. What they are not is a security
 * boundary. There is no backend in this project, so the signing secret has to
 * ship inside the browser bundle (anything prefixed VITE_ is inlined at build
 * time). Anyone can read it from the built JavaScript and mint their own
 * admin token, regardless of what the secret's value is.
 *
 * That trade is deliberate for a coursework prototype whose goal is to show
 * the full JWT flow end to end: issue, store, verify, expire, and gate a
 * route. Do not treat this as protecting anything real. A production version
 * moves signing behind a server that keeps the secret private.
 *
 * VITE_JWT_SECRET overrides the fallback below (see .env.example), which is
 * worth setting so a deployed build is not signing with a value that is
 * published in this repository. The fallback exists so a fresh clone can sign
 * in to the admin console without setting anything up first, and it costs
 * nothing extra in security terms: whatever the secret is, it is inlined into
 * the browser bundle at build time and readable by anyone. The boundary this
 * does not cross is the same either way, see above.
 */

function getSecretKey(): Uint8Array {
  const secretEnv = import.meta.env.VITE_JWT_SECRET || 'hivemind-demo-jwt-signing-secret-2026-secure-key';
  return new TextEncoder().encode(secretEnv);
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
