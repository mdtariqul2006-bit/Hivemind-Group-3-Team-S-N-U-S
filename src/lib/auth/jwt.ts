import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

/**
 * Frontend only JWT helper.
 *
 * Honest note on security: this signs and verifies genuine HS256 JWTs, so every
 * token carries a real header.payload.signature and a real expiry that the app
 * checks on each load. The catch is that the signing secret has to ship inside
 * the browser bundle, so a determined user could read it and mint their own
 * token. That trade is fine for a coursework demo whose goal is to show the full
 * JWT flow: issue, store, verify, expire, and gate a protected route. A real
 * deployment would move signing behind a server that keeps the secret private.
 */

const SECRET = new TextEncoder().encode(
  import.meta.env.VITE_JWT_SECRET ?? 'hivemind-academy-demo-secret-key-2025',
);

const ISSUER = 'hivemind-academy';
const AUDIENCE = 'hivemind-admin-console';

export interface AdminClaims extends JWTPayload {
  role: 'admin';
  name: string;
}

/** Signs a short lived admin token (2 hour expiry). */
export async function signAdminToken(email: string, name: string): Promise<string> {
  return new SignJWT({ role: 'admin', name })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(email)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(SECRET);
}

/** Verifies signature, issuer, audience, and expiry. Returns null on any failure. */
export async function verifyAdminToken(token: string): Promise<AdminClaims | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (payload.role !== 'admin' || typeof payload.name !== 'string') return null;
    return payload as AdminClaims;
  } catch {
    return null;
  }
}
