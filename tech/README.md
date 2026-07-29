# Tech

The optional React and shadcn/ui prototype stretch goal was built. It lives in `src/` at the
repo root, not in this folder, run instructions are in the root [README.md](../README.md).

What it covers beyond the wireframes:

- The onboarding flow itself (personalise, dashboard, people, documents), styled to the
  brand palette in `src/styles/index.css`.
- A member Sign In / Sign Up flow (`src/screens/auth.tsx`) for a new starter's own account.
- A separate JWT-gated Admin Login (`src/screens/admin-login.tsx`) that opens a full admin
  console (`src/screens/admin-dashboard.tsx`): charts, a starter roster, and an activity feed
  under `src/components/admin/`. Reached only through the landing page's "Login" button, there
  is no visible admin tab in the main navigation.

Owned by the Technical/Feasibility Lead (Anita Rahman).
