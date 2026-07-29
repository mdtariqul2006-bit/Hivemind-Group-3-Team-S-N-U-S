# HiveMind: Smart Onboarding

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Status](https://img.shields.io/badge/status-in%20progress-yellow)

A guided, role specific onboarding prototype built for the HiveMind Academy Smart Onboarding brief. Built by Group 3, Team SNUS, Ravensbourne University London.

## About the project

New hires often meet an onboarding process that is impersonal and document heavy, with information scattered across systems and little guidance on what to do first. This prototype is our answer: a guided roadmap for the first thirty days, content shaped around the new hire's actual role, and a visible, always current sense of progress.

The prototype is built around Northwind, a fictional client used to ground the design in a concrete scenario, following the HiveMind Academy brief for a four week UX Product Discovery Sprint.

### What is in the prototype

* A guided roadmap split into Day 1, Week 1, and Month 1.
* Role specific content for designers, engineers, and marketers.
* Micro learning cards in place of long handbooks.
* A visible progress tracker, the ProgressHive component.
* People and support screens, so a buddy, manager, or channel is always one tap away.
* An interactive 3D onboarding guide and an admin console for reviewing onboarding metrics.
* A landing page carrying the client's own research: brand mission, working process, and published insights, alongside the onboarding flow itself.

## Team

Group 3, Team SNUS, in partnership with HiveMind Academy.

| Name | Role |
|---|---|
| Kowshick Ahmed Abir | Project Lead |
| Bushra Rimi | Documentation Lead |
| Asan Limbu | UX Research Lead |
| Anita Rahman | Technical/Feasibility Lead |
| Tariqul Islam | UX/IA Designer |
| Dip Mondal | UI/Prototype Designer |

## Tech stack

* React 19 with TypeScript
* Vite 6
* Tailwind CSS v4
* Framer Motion and GSAP for animation
* Spline for the interactive 3D onboarding guide

## Getting started

Requires Node.js 20 or later and npm.

```bash
git clone https://github.com/mdtariqul2006-bit/Hivemind-Group-3-Team-S-N-U-S.git
cd Hivemind-Group-3-Team-S-N-U-S
npm install
npm run dev
```

Vite prints the local address to open, usually `http://localhost:5173`.

| Script | What it does |
|---|---|
| `npm run dev` | Starts the local dev server with hot reload |
| `npm run typecheck` | Runs the TypeScript project build with no output, type errors only |
| `npm run build` | Runs the TypeScript build, then the production Vite build |
| `npm run preview` | Serves the last production build locally |

Both `npm run typecheck` and `npm run build` should pass with no errors before any commit. See [`claude.md`](claude.md) for the full set of conventions this project follows.

## Project structure

```
src/
  components/   Reusable UI primitives, layout, motion, and content blocks
  screens/      One file per screen: landing, personalise, dashboard, people, documents, admin
  state/        Onboarding and toast context
  data/         Static content: roles, tasks, people, documents
  library/      Client research content and downloaded brand assets
  lib/          Formatting and small utility helpers
  hooks/        Shared hooks: theme, scroll, debounced dimensions
  styles/       Design tokens and global CSS
```

The rest of the repository holds the coursework evidence pack. Each folder below has its own README explaining what goes there and who owns it.

| Folder | Contents |
|---|---|
| [`docs/`](docs) | Decisions log, hypotheses, research plan, and success metrics |
| [`research/`](research) | Interview transcripts, notes, and synthesis |
| [`design/`](design) | Journey maps, wireframes, and exported screens |
| [`delivery/`](delivery) | The Week 4 validation report |
| [`testing/`](testing) | Critical user tasks and the usability test script |
| [`tech/`](tech) | What the React and shadcn/ui prototype stretch goal covers, points back to `src/` |

## Design system and motion

Reusable primitives live in `src/components/ui/`, page screens live in `src/screens/`, and content blocks assembled from research live in `src/components/blocks/`. Keeping primitives separate from page logic means design system updates do not collide with feature work.

The interface leans on a small set of motion patterns rather than one off animation:

* A WebGL shader hero (`MeshGradient`, `PulsingBorder`) for the landing page.
* A conic border glow (`GlowingEffect`) that tracks the cursor on cards.
* Slow moving gradient blobs and floating vector paths behind content sections.
* A shared `Reveal` component that fades and rises content into view on scroll.

Every motion component checks `prefers-reduced-motion` and falls back to a plain fade with no translation when it is set.

### Stack reference

The setup below is not needed to run this repository. It is kept as a reference for how the stack was assembled, in case the team scaffolds a similar project again.

1. Scaffold Vite with the React and TypeScript template:
   ```bash
   npm create vite@latest my-app -- --template react-ts
   ```
2. Add Tailwind CSS v4:
   ```bash
   npm install tailwindcss @tailwindcss/vite
   ```
   Then add the Tailwind plugin to `vite.config.ts`.
3. Initialise shadcn/ui, choosing `src/components/ui` as the primitives path and `@/*` as the import alias:
   ```bash
   npx shadcn@latest init
   ```
4. Add the animation dependencies:
   ```bash
   npm install framer-motion @paper-design/shaders-react --legacy-peer-deps
   ```

## Authentication

There are two separate, unrelated sign in systems, do not confuse them:

- **Member Sign In / Sign Up** (`src/screens/auth.tsx`, `src/state/member-context.tsx`): a new
  starter's own account. Reachable from the "Sign In" button on the landing page header.
  Accounts are mock, client side only (localStorage, plain text), there is no backend.
- **Admin Login** (`src/screens/admin-login.tsx`, `src/state/auth-context.tsx`,
  `src/lib/auth/jwt.ts`): a real signed HS256 JWT, checked and stored client side, gating the
  full admin console (`src/screens/admin-dashboard.tsx`, `src/components/admin/`). Reachable
  from the "Login" button on the landing page header, there is no admin tab in the main
  navigation. Demo credentials are shown on the admin login screen itself.

## Course context

Built for the HiveMind x Ravensbourne Product Discovery Sprint, a four week UX module at Ravensbourne University London, in partnership with HiveMind Academy.
