# Implementation plan: HiveMind Smart Onboarding

Written 29 July 2026. Hand off notes for whoever picks this up next, on any
machine. Read this before changing routing, auth, or the admin console.

## What this project is

A static React 19 front end built with Vite 6 and Tailwind 4. Motion comes from
framer-motion, gsap, and lenis. Icons are lucide.

**There is no backend.** No server directory, no API, no database, no network
calls anywhere in `src/`. Every piece of data is a static file in `src/data/`,
and everything that persists is written to `localStorage`. Say so plainly if
anyone asks whether the backend is healthy, rather than implying one exists.

```bash
npm install
cp .env.example .env.local   # required, see below
npm run dev                  # http://localhost:5173, or the next free port
npm run typecheck
npm run build
```

**The `.env.local` step is not optional.** `VITE_JWT_SECRET` is now required
unconditionally, with no fallback key, so admin sign in fails without it in dev
as well as in a build. `.env.local` is gitignored, so every machine needs its
own copy. Any value works locally.

## Current state

Working:

- Landing, personalise wizard, dashboard, people, documents, task detail
- Member sign up and sign in, held in `member-context`
- Admin console behind a JWT gate, with five sections
- Hash routing, so back, forward, refresh, and deep links all work
- Light and dark themes, reduced motion respected throughout

## Open issues, highest value first

### 1. A missing secret fails silently

**Severity: medium.**

There was a worse version of this. A build used to throw on a missing
`VITE_JWT_SECRET`, which dead code elimination reduced to an unconditional
throw, so admin login was broken in every deployed build while dev worked fine.
Kowsyke fixed the cause in 622b0e7 by requiring the variable everywhere and
adding `.env.example` plus a README step.

What is still open is the failure mode. When the secret is missing, or signing
fails for any other reason, `admin-login.tsx` awaits a promise that rejects and
nothing catches it. The button sits on "Verifying" forever with no message. Wrap
the submit handler in a try and catch and show the error, so the next person who
forgets `.env.local` sees a reason instead of a hang.

### 2. The JWT is demonstration only

The signing secret and the admin credentials both ship inside the bundle:

```bash
grep -o "HiveMind2025" dist/assets/*.js   # finds it
```

This proves the full token flow (issue, store, verify, expire, gate a route),
which is what the module asks for, but it is not security. Anyone reading the
bundle can mint a token. Do not describe it as production ready. Moving signing
behind a server is the only real fix, and that means introducing the backend
this project does not have.

### 3. Count up numbers depend on a visible tab

`use-count-up.ts` seeds at 0 and animates with `requestAnimationFrame`. A
browser pauses rAF in a background tab, so admin KPIs read 0 until the tab is
focused. It self corrects on focus. Low severity, worth knowing when a demo is
opened in a background tab.

## Architecture notes to avoid breaking things

### Routing

`src/hooks/use-history-sync.ts` owns the URL. Two rules matter:

1. **The reducer is seeded from the URL**, in `onboarding-context.tsx`. Do not
   move this into a mount effect. Dispatching the route after mount makes the app
   render the landing page and then transition away from it, which
   `AnimatePresence mode="wait"` treats as a real exit. If that exit does not
   finish, the next screen never mounts and the page is blank.
2. **Routing is in the hash**, `#/dashboard`, not the path. This is deliberate.
   A path would 404 on refresh on any static host that cannot rewrite unknown
   paths to `index.html`, GitHub Pages being the obvious case. Only switch to
   clean paths if you commit to a host you can configure.

Route shape:

```
#/                        landing
#/sign-in                 member auth
#/personalise             wizard
#/dashboard               dashboard
#/dashboard/task/<id>     task detail overlay
#/people  #/documents     directories
#/admin                   console, defaults to overview
#/admin/<section>         overview, starters, analytics, documents, security
```

Adding a screen means: add to `View` in `src/types/index.ts`, add a segment in
`VIEW_SEGMENTS`, render it in `app.tsx`.

### Navigation state

`adminSection` lives in the onboarding reducer, not in component state, so the
console has real URLs and answers to back and forward. Keep it there.

Role dependent screens (dashboard, people, documents) fall back to landing when
no role is set. That rule lives in two places, `storage.ts` and the reducer
initialiser, and they must agree.

### The logo

Every HiveMind mark goes to the landing page: the hero, the site top bar, and
the admin sidebar. It used to send signed in members to their dashboard instead.
That was changed deliberately, because a logo that lands somewhere different
depending on who you are is unpredictable. Keep the three consistent.

## Testing notes

Verify in a real browser, not only by reading code. Two traps cost real time in
this project:

- **A hidden or background tab pauses `requestAnimationFrame`**, so
  framer-motion never advances, elements sit at `opacity: 0`, and
  `AnimatePresence mode="wait"` blocks the next screen from mounting. Screens
  look blank and clicks look broken when nothing is wrong. Check
  `document.visibilityState` before believing a rendering bug.
- **Two tabs open on the app** double every console message and make readings
  contradict each other. Close spares first.

Deterministic checks that avoid both: reload at a URL and assert what renders,
rather than clicking and waiting for a transition.

Before any commit:

```bash
npm run typecheck && npm run build
```

## House style

`claude.md` at the repo root is the authority and takes precedence over this
file. The short version: no em dash, en dash, or hyphen used as sentence
punctuation, in code comments, UI copy, commit messages, or docs. Hyphens inside
compound words and kebab-case identifiers are fine. Write plainly, skip filler
openers and marketing padding, and do not claim something works without having
run it.

## Suggested order of work

1. Surface login errors in the form instead of hanging, issue 1.
2. Agree as a team what the JWT is claiming to be, and write that down honestly
   in the report and in the Security section of the console. This is the part an
   assessor is most likely to probe.
3. Only then add features.

## A note on working as a group

Three people have been pushing to `main` within the same hour, and it has cost
real time. One example: the header text collision was fixed twice, by two people
in parallel, and one of the fixes had to be thrown away. Pull before starting,
say in the group chat which area you are taking, and prefer a branch and a pull
request for anything that touches shared files like `app.tsx`, `top-bar.tsx`, or
the state contexts.
