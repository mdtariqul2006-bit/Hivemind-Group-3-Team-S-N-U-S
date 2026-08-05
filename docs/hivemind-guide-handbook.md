# HiveMind guide handbook

Your prep guide for the Week 4 presentation. Written for Anita Rahman
(Technical/Feasibility Lead), but useful to anyone on the team.

Everything here is checked against the actual repo, not invented. Where
something is missing or not done yet, this guide says so plainly instead of
pretending otherwise.

**Different from [`presentation-guideline.md`](presentation-guideline.md)**: that
file is the Project Lead's plan for what goes *on the slides*. This one is for
what goes *in your head* before you stand up.

---

## Contents

1. [The 60 second version](#1-the-60-second-version)
2. [The story in five beats](#2-the-story-in-five-beats)
3. [Run the app in one command](#3-run-the-app-in-one-command)
4. [Demo script, click by click](#4-demo-script-click-by-click)
5. [Your part: the technical and feasibility angle](#5-your-part-the-technical-and-feasibility-angle)
6. [Real evidence you can quote](#6-real-evidence-you-can-quote)
7. [Questions you will probably get](#7-questions-you-will-probably-get)
8. [Known gaps, say these before you are asked](#8-known-gaps-say-these-before-you-are-asked)
9. [Glossary](#9-glossary)
10. [Night before checklist](#10-night-before-checklist)

---

## 1. The 60 second version

If you only remember one paragraph, remember this one.

> New hires get handed a pile of documents and no idea what to do first.
> We built a guided first 30 days instead: pick your role, get a roadmap split
> into Day 1, Week 1 and Month 1, see your progress, and always have a person
> one tap away. We interviewed six working professionals to check the problem
> was real before we designed anything. The prototype is a working React app,
> not a clickable mockup.

**Client:** HiveMind Academy, a real EdTech startup.
**Fictional company inside the prototype:** Northwind. It exists so the demo has
a concrete workplace instead of generic filler.
**Persona:** Christoph, the new starter, shared across the whole cohort.
**Our focus area:** Smart Onboarding (one of three the brief offered).

---

## 2. The story in five beats

The module handbook fixes the deck structure. Learn the *story*, not the slides.

| Beat | The one line | Where the evidence lives |
|---|---|---|
| 1. Problem | Starting a job means scattered info and no clear first step | `research/transcripts/` (6 interviews) |
| 2. Concept | A guided, role specific first 30 days | `src/screens/personalise.tsx`, `dashboard.tsx` |
| 3. Prototype | A working React app, five core screens | `src/screens/` |
| 4. Testing | Moderated usability sessions, think aloud | `testing/test-script.md` |
| 5. Results | Themes, then recommendations | `delivery/validation-report.md` |

Beats 4 and 5 are the ones with gaps. See [section 8](#8-known-gaps-say-these-before-you-are-asked).

---

## 3. Run the app in one command

```bash
npm run dev
```

Vite prints the address. If it is a fresh clone, do this first:

```bash
npm install
cp .env.example .env.local
```

**The `.env.local` step matters.** `VITE_JWT_SECRET` signs the admin console's
login token. Any value works locally. Without it the member sign in still works
but **Admin Login throws**, which is exactly the kind of thing that goes wrong
live. Check it before you present.

There is also a shortcut that does all of the above and opens a clean browser
window with no tabs or address bar, which looks much better on a projector:

```bash
scripts/whobee
```

**Demo login details** (they are printed on the login screen too, so you do not
have to memorise them):

| What | Value |
|---|---|
| Admin email | `admin@hivemindacademy.com` |
| Admin password | `HiveMind2025` |
| Member account | Sign up with any email, it is stored locally |

---

## 4. Demo script, click by click

Follow the order a real new starter would. Roughly 2 to 3 minutes.

**Before you start:** open a private/incognito window, or clear site data. The app
remembers your progress in `localStorage`, so a stale session means you start the
demo half finished. This is the single most common way this demo goes wrong.

1. **Landing page.** Let the honeycomb background and hero settle for a beat.
   Say what the product is in one sentence. Do not read the page aloud.
2. **Sign up.** Click *Sign In*, switch to the *Sign up* tab, use any email.
   Point out that picking your team is part of signing up, not a separate chore.
3. **Personalise.** Choose **Designer** (the fullest content path). Set a start
   date, pick a learning style. Say: *"This is the step that makes the roadmap
   role specific rather than generic."*
4. **Dashboard.** This is the core of the concept. Point at:
   - the progress ring, and the *Designer path / 0 of 9 steps* badges
   - *Your next step*, one clear action, not a list of forty
   - the Day 1 / Week 1 / Month 1 sections underneath
   - the people rail on the right, help is never buried
5. **Open a task, complete it.** Shows micro-learning cards and the *why this
   task* explanation. Completing enough of a phase triggers a milestone
   celebration, which is a nice moment if the timing works.
6. **People and Documents.** Quick. Buddy and manager one tap away, and the
   document library with search and filters.
7. **Admin console** (optional, cut first if short on time). Landing page →
   *Login* → admin credentials. Shows the HR side: starter roster, completion
   charts, activity feed.

**If something breaks:** say what it was meant to do and move on. Do not debug
live. You will lose more time and more of the room than the bug costs you.

---

## 5. Your part: the technical and feasibility angle

You are Technical/Feasibility Lead. Your job in the room is to answer *"could
this actually be built?"* Three things are genuinely yours.

### a) It is a real app, not a mockup

React 19, TypeScript, Vite 6, Tailwind v4. State lives in React context,
progress persists to `localStorage`, and `npm run typecheck` and `npm run build`
both pass clean. That is a fair claim, so make it.

### b) The assistant deliberately is not an LLM

This is your strongest technical talking point, and it is genuinely
counterintuitive, so it lands well.

The bottom right assistant is a **local, deterministic answer engine** over a
small curated set of questions. No API, no network call, no cost, nothing leaves
the browser. Every answer shows why it gave that answer.

**Why that is a feature, not a shortcut** (all three are on record in
`docs/onboarding-assistant-spec.md`, not invented for the presentation):

1. The brief's own separate focus area, *Trustworthy AI Assistant*, lists the
   pain point "no transparency in reasoning." A black box LLM bolted onto
   onboarding walks straight into that problem.
2. Our own landing page argues that showing reasoning is what makes AI
   trustworthy. An LLM cannot show its real reasoning, only its output.
3. Our own interview evidence backs it up. P01 on AI at work:
   *"It's useful for spotting patterns, but I don't fully trust it without
   checking the numbers myself."*

The line to say: **use only as much AI as the job needs, not the maximum
available.**

### c) Honest limits

Know these cold. Being straight about them reads as competence, not weakness.

| Thing | The honest position |
|---|---|
| Admin JWT | A real signed HS256 token with a real expiry, but signed **in the browser**, so the secret ships with the app. Fine to demo the full login/verify/expire flow. A production build moves signing to a server. |
| Member accounts | Mock, `localStorage`, plain text passwords. No backend exists. |
| Data | Static fixtures in `src/data/`. No database. |
| Admin metrics | Calculated from those fixtures, not live analytics. |

If someone asks whether this is production ready: **no, and it is not meant to
be.** It is a discovery sprint prototype built to test whether the concept works
for users. Say that plainly.

---

## 6. Real evidence you can quote

Six interviews with working professionals, in `research/transcripts/`. Not
students, which is what the brief asked for. **You ran P01 yourself**, a managing
director of a 150 person garment manufacturer in Dhaka, so you can speak to it
first hand.

These quotes map straight onto what the prototype does:

> **On not knowing what to do next:** *"No, not clearly. I had to ask around
> constantly to figure out what needed my attention each day."*
> → this is the *Your next step* panel on the dashboard.

> **On generic onboarding:** *"If it's specific to my actual role and
> department, not just general company policy."*
> → this is the role picker and the role specific roadmap.

> **On not knowing who to ask:** *"There was no clear directory of 'ask this
> person for this issue.'"*
> → this is the people rail and the People screen.

> **On scattered information:** *"I couldn't quickly locate an updated
> compliance certificate. It was saved on someone's personal laptop instead of
> a shared drive, and it delayed the audit meeting by almost 2 hours."*
> → this is the Documents library.

> **On what would have helped on day one:** *"A simple guide showing who does
> what, and a clear list of priorities for the first week."*
> → this is essentially the whole product, in the participant's own words.

**Why this matters:** it lets you say *"we did not just take the persona's word
for it, we checked."* That is the difference between a design exercise and
product discovery, and it is the thing most likely to earn marks.

---

## 7. Questions you will probably get

**"Why not just use ChatGPT for the assistant?"**
See [5b](#b-the-assistant-deliberately-is-not-an-llm). Lead with the trust
argument and the fact that our own research participant said he does not trust AI
he cannot check.

**"How is this different from a checklist?"**
Three things: it is role specific, so a designer and an engineer get genuinely
different first weeks; it shows one next step rather than forty; and it explains
*why* each task is there, which a checklist never does.

**"Did you test with real users?"**
Six interviews at the discovery stage, yes. Usability testing on the prototype:
be honest about where that stands, see [section 8](#8-known-gaps-say-these-before-you-are-asked).

**"Could HiveMind actually build this?"**
Yes, and the front end largely exists. What is missing is a backend: real auth,
a database, and server side token signing. The UI, the flows and the content
model are all real and portable.

**"How long did it take?"**
Four week sprint, six people, roles split across research, IA, UI, docs,
technical feasibility and project lead.

**"What would you do next?"**
Grow the assistant's knowledge base from real usability session notes (this is
already flagged as open work in the spec), and run a second round of testing on
whatever the first round changes.

---

## 8. Known gaps, say these before you are asked

Being first to name a gap is much stronger than being caught on it.

| Gap | Status | What to say |
|---|---|---|
| Usability testing | Script and templates are ready in `testing/`, sessions not yet run at the time of writing | *"We prepared a full moderated script and note templates. Anything we report from it is directional, not statistical, at this sample size."* |
| `docs/hypotheses.md` | Placeholder | Owned by the UX Research Lead, pending Week 1 synthesis |
| `docs/success-metrics.md` | Placeholder, example metrics only | Same owner |
| `delivery/validation-report.md` | Structured but not filled | Fills in from participant notes once sessions run |

**Check these before you present.** They may have been completed since this was
written. If they have, use the real numbers and delete this caveat from your
talk. If they have not, say so in one sentence and move on. Do not invent
findings, and do not present example metrics from the handbook as if they were
results you measured.

---

## 9. Glossary

Useful if a term comes up and you want to be certain.

| Term | What it means here |
|---|---|
| **Christoph** | The new starter persona, shared across the whole cohort |
| **Northwind** | The fictional company inside the prototype |
| **Smart Onboarding** | Our chosen focus area of the three in the brief |
| **Whobee** | The bee mascot / assistant character, and the dev shortcut script |
| **ProgressHive** | The honeycomb progress ring on the dashboard |
| **FTUE** | First Time User Experience, the first run through of a product |
| **Micro-learning card** | A short digestible card instead of a long handbook page |
| **JWT** | JSON Web Token, the signed token gating the admin console |
| **Fixture** | Hardcoded sample data standing in for a database |
| **localStorage** | Browser storage, how progress survives a refresh |
| **Pre-totype** | Testing the problem before building the solution |

---

## 10. Night before checklist

- [ ] `git pull`, then `npm install`
- [ ] `.env.local` exists (copy from `.env.example`)
- [ ] `npm run dev` starts clean, no red errors in the terminal
- [ ] Walk the full demo once, start to finish, timed
- [ ] Clear site data / use a private window so you start fresh
- [ ] Admin login works with the demo credentials
- [ ] Screenshots saved as backup in case live demo fails
- [ ] Check whether the gaps in [section 8](#8-known-gaps-say-these-before-you-are-asked) have been filled since
- [ ] Know your three technical talking points from [section 5](#5-your-part-the-technical-and-feasibility-angle) without notes
- [ ] Laptop charged, display adapter, screen mirroring tested

Good luck. You know this project better than the room does.
