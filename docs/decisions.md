# Decisions log

Record important choices here as the sprint goes on. Use this format:

## Decision: [what was decided]

Date:

What was decided, why it was decided, what evidence informed it, and what alternatives were considered.

Maintained by the Documentation Lead (Bushra Rimi), anyone on the team can add an entry.

## Decision: merge the admin JWT dashboard branch as the canonical admin auth

Date: 2026-07-29

Two branches had built overlapping features: a general member Sign In / Sign Up flow, and a
teammate's `feat/admin-jwt-dashboard` branch with a real signed JWT admin login and a full
admin console (charts, starter roster, activity feed). The admin branch was more complete and
further along, so it was kept as the canonical admin auth system, the member flow was kept as
a separate, differently named context (`state/member-context.tsx`) rather than merged into one,
since they serve different audiences (a new starter's own account versus HR/admin access).
The Admin Panel button was changed to a plain "Login" entry point that is always visible, the
admin console itself decides whether to show the login form or the dashboard, rather than
hiding the button based on auth state (which would have made it impossible to ever log in).

## Decision: restore stock photography instead of the icon-only redesign

Date: 2026-07-29

The Pillars, Process, Principles, Mission, and Insights sections briefly used icon panels
instead of photos to fix an inconsistency with the shader/hex-icon hero. That was reverted on
request, the original photography is back. The improved, on-topic Insights copy (grounded in
the actual Christoph pain points rather than unrelated corporate-training blog posts) was kept.
