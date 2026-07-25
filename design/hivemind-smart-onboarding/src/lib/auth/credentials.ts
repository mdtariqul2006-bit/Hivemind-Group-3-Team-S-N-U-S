/**
 * Demo admin credentials.
 *
 * These are intentionally public and shown on the login screen so a marker or a
 * teammate can sign in straight away. Never store real credentials in the client
 * like this; a production app checks the password against a server.
 */
export interface AdminAccount {
  email: string;
  password: string;
  name: string;
}

export const DEMO_ADMIN: AdminAccount = {
  email: 'admin@hivemindacademy.com',
  password: 'HiveMind2025',
  name: 'Alex Morgan',
};

/** Returns the matching account, or null when email or password is wrong. */
export function matchAdmin(email: string, password: string): AdminAccount | null {
  const clean = email.trim().toLowerCase();
  if (clean === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
    return DEMO_ADMIN;
  }
  return null;
}
