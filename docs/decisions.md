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

## Decision: delete the duplicate `design/hivemind-smart-onboarding` app for good

Date: 2026-08-04

The repo carried a second, near identical copy of the whole application under `design/`.
It was deleted, reintroduced by a merge, and deleted again, three times in total
(`60b8ae5`, `de57a76`, `38ed8c6` by Kowsyke and Anita Rahman). The decision is that
`src/` is the only application, and the duplicate does not come back.

Evidence: teammates were editing both copies in parallel and the two had already drifted,
so a fix in one did not reach the other. This is the same "which version is the current
one" problem two of our own interview participants raised, so keeping it would have been
hard to defend in the presentation.

Alternative considered: keeping `design/` as a frozen snapshot of an earlier build. Rejected
because nothing referenced it and git history already preserves any earlier state.

## Decision: require `VITE_JWT_SECRET` everywhere, with no hardcoded fallback

Date: 2026-08-04

The admin JWT previously fell back to a secret literal in the source when the environment
variable was missing. Kowsyke removed the fallback in `622b0e7` and added `.env.example`
plus a README step, so the variable is now required in development and in a build.

Evidence: the fallback made a real failure invisible. A production build had dead code
elimination reduce the missing-secret branch to an unconditional throw, so admin login was
broken in every deployed build while it worked locally.

Consequence to state honestly in the presentation: this does not make the token secure. With
no backend, whatever value is used is compiled into the browser bundle and can be read from
it. The mechanism is real, the protection is not, and `src/lib/auth/jwt.ts` says so in its
own header comment.

Alternative considered: leaving the fallback for convenience. Rejected because it hid a
broken deployment behind a working dev environment.

## Decision: validate anything read back from browser storage, never trust it

Date: 2026-08-04

Persisted state is now validated against known values on load rather than spread in as parsed
(`fafdde2`). Applies to the stored role, learning style, view, member accounts, and the
member profile.

Evidence: an unrecognised stored role reached `ROLE_TASKS[role]`, which is `undefined` for an
unknown key, and spreading it threw `TypeError: ROLE_TASKS[role] is not iterable` during app
start up. Reproduced in the browser: the page rendered zero elements and could not be
recovered from the UI, because the same bad value was re-read on every reload. Malformed
account data caused a second crash on the sign in click for the same underlying reason.

Alternative considered: wrapping the app in an error boundary. Rejected as treating the
symptom, a boundary would have shown a friendlier crash while the stored value stayed broken
on every future load.

## Decision: put routing in the URL hash, not the path

Date: 2026-08-05

Asan Limbu added hash routing in `5ef5e9d`, so `#/dashboard` rather than `/dashboard`. Back,
forward, refresh, and deep links all work.

Evidence: a path based route returns 404 on refresh on any static host that cannot rewrite
unknown paths to `index.html`, and GitHub Pages, the most likely place this gets hosted for
assessment, is exactly that case.

Alternative considered: clean paths with host configuration. Deferred rather than rejected,
and only worth revisiting if the team commits to a host it can configure. Noted in
`docs/handover-notes.md`.

## Decision: build the onboarding assistant as a local answer engine, not an LLM chatbot

Date: 2026-08-05

Specified in `docs/onboarding-assistant-spec.md` and built by Kowsyke in `5caf40d`. The
assistant is deterministic, runs entirely in the browser, makes no network call, and shows a
"because" line with every answer explaining why that answer was given.

Evidence, all of it already in the repo rather than argued for the first time here:

1. The module brief lists a separate focus area, Trustworthy AI Assistant, whose pain points
   are that users do not trust AI suggestions, it is unclear where answers come from, and
   there is no transparency in reasoning. A black box chatbot bolted onto our onboarding flow
   would walk straight into those problems.
2. Our own landing page already publishes the claim that showing the reasoning is what makes
   an assistant trustworthy (the Trust and AI insight card in `src/library/index.ts`).
   Shipping something that cannot show its reasoning would contradict our own research.
3. Two interview participants independently said they distrust documentation or tools they
   cannot verify are current.

The line to use when presenting it: this is a demonstration of AI restraint, using only as
much AI as the job needs rather than the maximum available.

Alternative considered: wiring up a hosted LLM. Rejected on the reasoning above, and
separately because it would add an API key, a cost, and a network dependency to a prototype
that otherwise runs entirely offline.

## Decision: use branches and pull requests for shared files

Date: 2026-08-05

Work that touches `app.tsx`, `top-bar.tsx`, or the state contexts goes on a branch with a pull
request rather than straight to `main`.

Evidence: three people pushed to `main` inside the same hour. The header text collision was
fixed twice in parallel by two different people and one of the fixes had to be thrown away.
Separately, two people independently scaffolded the same Week 4 testing documents, and two
presentation prep handbooks were written by different people on the same day.

Alternative considered: carrying on pushing to `main` and pulling often. Rejected because we
had already tried it and it cost real time. Recorded in `docs/handover-notes.md` under
working as a group.
