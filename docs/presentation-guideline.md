# Final presentation guideline

A brief for building the Week 4 deck in Claude (or any AI design tool). This is not the deck
itself, it is the content plan and brand reference to hand over so the generated slides are
accurate to this project rather than generic.

Owned by the Project Lead (Kowshick Ahmed Abir), built from the actual repo content as of
2026-08-04.

---

## 0. Read this first: three gaps to close before building slides

The deck's structure is fixed by the module handbook (see section 1), but three of the docs it
draws on are still empty placeholders in this repo:

| File | Status | Blocks |
|---|---|---|
| [`docs/hypotheses.md`](hypotheses.md) | Not filled in, waiting on Week 1 synthesis | Slide 3 (Concept) needs the hypotheses to justify *why* the prototype is built the way it is |
| [`docs/success-metrics.md`](success-metrics.md) | Not filled in | Slide 5 (Results) needs metrics to report against |
| [`docs/research-plan.md`](research-plan.md) | Interviewer/participant table empty | Slide 1 (Problem) is stronger with real interview counts |
| [`testing/tasks.md`](../testing/tasks.md), [`testing/test-script.md`](../testing/test-script.md) | Not filled in | Slide 4 (What you tested) needs the actual tasks run |
| [`delivery/validation-report.md`](../delivery/validation-report.md) | Not filled in | Slide 5 (Results) needs findings and recommendations |

If the usability sessions (3 to 5 participants, per the handbook) have not happened yet, do
that first, or the "results and recommendations" slide has nothing real to show. Everything
else below assumes those docs get filled in before the deck is built.

## 1. Required structure (from the module handbook, non-negotiable)

The brief asks for a **10-minute deck** covering exactly five things, in this order:

1. Problem and Christoph
2. Your concept
3. Key prototype screens
4. What you tested
5. Results and recommendations

Plus: a link to the Figma prototype, and optionally a short live demo of the React slice.
Budget roughly 2 minutes per section, a little less for problem framing, a little more for the
demo and results.

## 2. Slide-by-slide content plan

### Slide 1 to 2: Problem and Christoph (~2 min)

- Christoph is the persona used across the whole cohort, all groups work from the same pain
  point table. This group's focus area is **Smart Onboarding**.
- State the specific pain points this prototype answers, pulled straight from the brief: *"a
  first-time user experience that feels impersonal, unclear next steps, no guided path."*
- Ground it in real interview evidence once `docs/research-plan.md` and the transcripts are
  synthesised: how many professionals were interviewed, what they actually said. Do not
  present Christoph's pain points as the only evidence, real interviews are the differentiator.
- One current-state visual: the Current journey lane from Figma (today's onboarding
  experience, before HiveMind) works well here.

### Slide 3: Your concept (~2 min)

- One sentence: *"A guided, role-specific onboarding prototype that replaces a document dump
  with a Day 1 / Week 1 / Month 1 roadmap, visible progress, and always-on-tap support."*
- List the concept in terms of what it actually contains, not aspirational features:
  - Guided roadmap split into Day 1, Week 1, Month 1
  - Role-specific content (designer, engineer, marketer paths)
  - Micro-learning cards instead of long handbooks
  - A visible progress tracker (the `ProgressHive` component)
  - People and support screens, buddy/manager/channel one tap away
  - An interactive 3D onboarding guide
- State the hypothesis it is testing (from `docs/hypotheses.md` once written), in the format
  *"We believe that [solution] will help Christoph [benefit] because [reason from research]."*
  This is the one line that ties research to design, do not skip it.

### Slide 4 to 6: Key prototype screens (~2.5 min)

Walk through screens in the order a new starter would actually see them, using
`src/screens/` as the source of truth for what exists:

1. **Landing** (`landing.tsx`) — the entry point, brand story, and the "Start my first day" /
   "Sign In" / "Login" paths.
2. **Personalise** (`personalise.tsx`) — where role and start date are set, this is what makes
   the roadmap role-specific rather than generic.
3. **Dashboard** (`dashboard.tsx`) — the Day 1 / Week 1 / Month 1 roadmap and the progress
   tracker, the core of the concept.
4. **People** (`people.tsx`) and **Documents** (`documents.tsx`) — the support and
   knowledge-hub side.
5. Optional, time permitting: **Admin console** (`admin-dashboard.tsx`) — starter roster,
   activity feed, completion charts. Useful if the audience cares about the HR/manager side,
   cut it first if short on time, it is secondary to the new-starter experience being tested.

Use real screenshots or a live click-through, not mockup placeholders, the working prototype
is the strongest evidence the group has.

### Slide 7: What you tested (~1.5 min)

- State the method plainly: moderated usability sessions, participants thinking aloud,
  3 to 4 tasks per the handbook's script format.
- Name the tasks from `testing/tasks.md` once written (e.g. "find out what to do on Day 1",
  "find your buddy's contact", "check your progress").
- State who ran it and how many participants, from the weekly log and test script.
- Be honest about the sample size, 3 to 5 participants is a screening study, not statistical
  proof, phrase findings as directional, not conclusive.

### Slide 8 to 9: Results and recommendations (~2 min)

- Group findings into 2 to 4 themes (e.g. "navigation was clear", "AI trust needs an
  explanation", "progress tracker was the most praised element"), the same structure the
  handbook asks for in the validation report.
- For each theme: what happened, why it matters, what is recommended. Pull this directly
  from `delivery/validation-report.md`.
- Close on the metrics from `docs/success-metrics.md` where you have real data (e.g. task
  completion, confidence rating before/after), not just the example list from the handbook.
- End with a short "what we'd do next" line, this is what makes the closing slide feel like a
  recommendation rather than just a summary.

### Closing slide

- Link to the Figma prototype.
- Link to the GitHub repo.
- If doing a live demo, this is the cue slide, do not bury the demo mid-deck where it breaks
  pacing, put it right after "key prototype screens" or right before "results."

## 3. Brand and visual reference, so the deck matches the product

Pull these directly so the deck does not look like a generic AI template next to the actual
prototype:

**Colour tokens** (from `hivemind_research.md`, already implemented in `src/styles/index.css`):

| Token | Hex | Use |
|---|---|---|
| Charcoal | `#383C42` | primary dark surface / text weight |
| Honey | `#FFC370` | primary accent, the bee motif |
| Pink | `#F4B8BD` | highlight, celebration states |
| Sage | `#BAC9C5` | calm secondary, section bands |
| Canvas | `#0B0D10` dark / `#FBFAF7` light | background |

**Typography:** Inter (Inter Variable), the same font the prototype uses throughout.

**Motif:** the hexagon (honeycomb), used as the logo mark and as a recurring section divider
or bullet shape. A subtle hex pattern on a title slide reads as "this team" rather than
generic.

**Tone:** the product copy avoids em dashes and salesy language on principle (see the
project's own writing-style rule in `docs/decisions.md` / the repo's writing conventions).
Keep slide copy in the same plain, concrete register: short sentences, real numbers over
adjectives, "we tested this and found X" over "our innovative solution."

## 4. Presenting as a team of six

The handbook expects clear ownership. A natural split for a 10-minute slot:

| Section | Natural owner |
|---|---|
| Problem and Christoph | UX Research Lead (Asan Limbu) |
| Concept | Project Lead (Kowshick Ahmed Abir) |
| Prototype screens / demo | UI/Prototype Designer (Dip Mondal) and UX/IA Designer (Tariqul Islam) |
| What you tested | UX Research Lead (Asan Limbu) |
| Results and recommendations | Documentation Lead (Bushra Rimi), with technical caveats from Anita Rahman if relevant |

Adjust to whoever actually ran each piece of work, the point is that every speaker is talking
about something they personally did, not reading a slide someone else wrote.

## 5. What to hand to the AI design tool

When building the deck, give it:
1. This file.
2. The filled-in versions of `docs/hypotheses.md`, `docs/success-metrics.md`,
   `delivery/validation-report.md`, and `testing/tasks.md`.
3. Screenshots of the five to six screens listed in section 2.
4. The colour table and "Inter font, hexagon motif" note from section 3.

That is enough for it to produce a deck that reflects this project specifically, rather than a
generic UX case study template.
