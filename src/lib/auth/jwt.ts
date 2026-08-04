import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

/**
  * Prototype-only JWT authentication helper.
  * Requires VITE_JWT_SECRET to be set. Does not ship a fallback key.
  */

function getSecretKey(): Uint8Array {
  const secretEnv = import.meta.env.VITE_JWT_SECRET;
  if (!secretEnv) {
    throw new Error('VITE_JWT_SECRET is required for admin JWT signing');
  }
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
