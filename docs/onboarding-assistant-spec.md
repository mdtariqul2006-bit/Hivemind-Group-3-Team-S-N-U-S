# Onboarding assistant: feature spec

Written so any team member or any Claude session picking this up has the full
context without re-deriving it. It is meant to stay current, not to be a
one-time proposal, keep it updated as decisions change.

Status: **section 9's "next sprint" scope is built** (`src/components/assistant/`,
`src/lib/assistant/`, `src/state/assistant-context.tsx`). The knowledge base
currently has structural entries only (section 6.1 and 6.2), section 6.3, mining
real usability session notes for content, is still open. See the code itself for
what actually shipped, this file is the design record, not living documentation
of the current knowledge base entries.

---

## 1. What this is, in one paragraph

A small assistant that appears on scroll, docks in the bottom right corner, and
answers basic questions about using HiveMind (what to do today, who to ask, where
a document is, how the progress tracker works). It is not a general purpose AI
chatbot. It is a local, deterministic, purpose-built answer engine over a small
curated set of real questions, with every answer showing why that answer was
given. No external API, no network call, no cost, nothing leaves the browser.

## 2. Why it is built this way, not as an LLM chatbot

This is the actual concept under test, state it explicitly wherever this feature
is discussed or presented: **use only as much AI as the job needs, not the
maximum available.** A wired-up LLM would be the easy default and would also be
the wrong answer for this brief, for three concrete reasons already on record in
this repo, not invented for this spec:

1. **The brief's own pain point.** The module handbook lists a separate focus
   area, "Trustworthy AI Assistant," with the pain points "users don't trust AI
   suggestions, unclear where answers come from, no transparency in reasoning."
   This team's focus area is Smart Onboarding, not that one, but a black box
   LLM bolted onto the onboarding flow would walk straight into the same
   distrust problem. A small, inspectable, local engine sidesteps it entirely,
   because there is nothing hidden to distrust.

2. **The product already says this, out loud, on the landing page.** See
   `src/library/index.ts`, the Trust & AI insight card:

   > "Why 'Because' Is the Most Important Word an AI Assistant Can Say... People
   > ignore recommendations they do not understand. Showing the reasoning behind
   > every suggestion, not just the suggestion itself, is what makes an AI
   > assistant worth trusting."

   Building an assistant that cannot show its reasoning (an LLM's actual
   reasoning is not inspectable, only its output is) would directly contradict
   research already published in the product. Building one that always shows a
   because line proves the team believes its own research.

3. **The product already has the pattern, once.** `src/screens/task-detail.tsx`
   already renders a reasoning line for the learning-style tip: *"Because you
   like to [learning style]: [tip]."* The assistant extends an established
   pattern, it does not invent a new one.

When describing this feature in the presentation or the validation report, this
is the line to use: the assistant is a demonstration of AI restraint, not AI
capability, built to serve exactly this product's questions and nothing wider.

## 3. What it does and does not do

**Does:**
- Answers a small, curated set of real "what do I do / where is X / who do I
  ask" questions, matched by keyword against a local knowledge base.
- Every answer includes a one line "because" reason and, where relevant, a link
  to the actual screen the answer came from (Dashboard, People, Documents).
- Says plainly when it does not have an answer, and points to the People screen
  (a real buddy or manager) instead of guessing. Never invents an answer.
- Appears once per session with a short entrance flourish, then stays docked.
- Fully respects `prefers-reduced-motion`, matching every other motion
  component in this codebase.

**Does not:**
- Call any external API or LLM. No `fetch`, no API key, no network dependency.
- Use embeddings, fuzzy ML matching, or any dependency beyond what is already
  in `package.json`. Matching is plain keyword/synonym overlap.
- Persist chat history beyond the current session (no backend, matches how
  member accounts already work, client side only).
- Try to cover every possible question. The knowledge base is intentionally
  small. Growing it is a content task for later sprints, not a reason to widen
  the architecture now.

## 4. Where the entrance is triggered

Landing page structure today (`src/screens/landing.tsx`):

```
ShaderShowcase (hero)
HiveSection (Whobee's honeycomb)   <- entrance trigger
Core Promises section
...
```

Whobee leaves the hive once, the first time `HiveSection` scrolls out of the
viewport (IntersectionObserver on that section, not a raw scroll-position
number, so it survives layout changes). Inside the section, scroll progress
drives him up out of the centre comb cell and off toward the top right, and the
docked launcher then arrives in the corner on the same arc. The two halves are
deliberately one move: the corner bee has to read as the bee that just left the
comb, not a second one appearing from nowhere.

After that first play he stays docked in the corner on every screen for the rest
of the session, and does not replay the entrance on navigation. "Has the intro
played" lives in `sessionStorage`, not `localStorage`, so it replays once per
visit, honestly reflecting that coming back tomorrow is a new session, rather
than spamming it on every route change today.

Not shown on the admin console (`state.view === 'admin'`), that surface ships
its own chrome and audience (HR/admin, not a new starter), matching how
`TopBar` is already excluded there in `src/app.tsx`.

## 5. Component and file plan

```
src/components/assistant/
  whobee.tsx               The mascot itself, an animated vector bee. Same
                            creature the honeycomb canvas already draws in the
                            background (amber body, dark banding, pale
                            oscillating wings), plus a face. Every colour is a
                            brand custom property, so both themes are handled
                            and nothing is baked in.
  hive-section.tsx         The honeycomb Whobee comes out of, on the landing
                            page. Scroll progress through it drives him up out
                            of the centre cell and away toward the corner.
  assistant-launcher.tsx   Docked Whobee (collapsed state) + the one-time
                            arrival, which continues the arc he left the hive
                            on. Hex burst behind him on arrival, matching the
                            brand's hexagon motif at logo scale.
  assistant-panel.tsx      Expanded chat panel: message list, input, close.
  assistant-message.tsx    One message bubble. Assistant messages render an
                            answer line plus a smaller "Because ..." line,
                            reusing the visual treatment already established
                            in task-detail.tsx's styleCopy block
                            (bg-honey-wash, text-honey-deep).

src/state/assistant-context.tsx
  Open/closed state, message history (in memory, cleared on reload), whether
  the entrance has played (sessionStorage). Modeled after
  state/toast-context.tsx for shape, not merged into it, this is a distinct
  concern.

src/lib/assistant/
  knowledge-base.ts   The curated Q&A entries (see section 6).
  match.ts            matchQuestion(input: string): KnowledgeEntry | null.
                        Plain keyword/synonym scoring, no dependency, unit
                        testable in isolation.

src/hooks/use-section-visible.ts
  Small IntersectionObserver hook for the HiveSection trigger. Generic
  enough to reuse if another scroll-triggered moment comes up later.
```

The mascot is deliberately vector rather than a 3D model or a hosted scene.
Whobee started as a generic Spline robot loaded from Spline's CDN, which cost
a 4.5MB runtime chunk, a network dependency, an off brand purple palette, and a
third party attribution badge the team had begun covering up. An inline SVG in
brand colours removes all four at once, and the "only as much as the job needs"
argument in section 2 applies as much to the mascot as to the answer engine.

Mount point: `src/app.tsx`, one line, right before `<ToastStack />`:

```tsx
{state.view !== 'admin' && <AssistantLauncher />}
```

## 6. The knowledge base: what goes in it, and where content comes from

Roughly 12 to 20 entries to start, each shaped like:

```ts
interface KnowledgeEntry {
  id: string;
  triggers: string[];       // keywords/phrases that match this entry
  answer: string;
  because: string;          // the one-line reason, always present
  linkView?: View;          // optional: "Take me there" -> dispatch({ type: 'go', view: ... })
}
```

Two sources for entries, deliberately kept separate:

1. **Static, structural questions**, answerable from the app's own shape, not
   from user data: "what is HiveMind", "how do I mark a task done", "where are
   documents", "how do I find my buddy". Write these by hand, short and
   concrete, they do not change often.

2. **Derived from real data already in the repo**, not duplicated as free
   text: a question like "who is my buddy" should read
   `NEW_HIRE`/`people.ts` at answer time and interpolate the real name, the
   same way `task-detail.tsx` already interpolates `styleCopy` dynamically.
   Never hardcode a name or task title into `knowledge-base.ts` that already
   exists in `src/data/`, that is exactly the kind of duplication this repo's
   last two audits removed elsewhere, do not reintroduce it here.

3. **Grounded in real confusion, once it exists.** `testing/participant-notes/`
   is about to fill up with real usability session notes. Once that happens,
   mine it for actual questions participants got stuck on and add those
   verbatim as new entries. This is the strongest possible source, real
   evidence of real confusion, use it before inventing hypothetical questions.
   Note the loop this creates: the validation work happening this week
   directly seeds this feature's content next sprint, worth saying explicitly
   in the presentation.

## 7. Matching approach (kept deliberately simple)

```ts
function matchQuestion(input: string): KnowledgeEntry | null {
  const normalized = input.toLowerCase().trim();
  // score = number of trigger keywords present in the input
  // return the highest scoring entry above a minimum threshold, or null
}
```

No stemming library, no Levenshtein distance, no embeddings. A small synonym
map (`{ "docs": "documents", "manager": "buddy" }`) covers the realistic gap
between what people type and how entries are worded. If this genuinely proves
too limited once real testing data comes in, that is a decision to revisit
explicitly and document, not to silently upgrade the dependency footprint.

## 8. Accessibility and motion

Follow the conventions already established across this codebase, do not
invent new ones:

- Every animated state checks `useReducedMotion()` and falls back to a plain
  fade, same as `Reveal`, `GlowingEffect`, and the shader hero already do.
- The panel traps focus while open and returns focus to the launcher bubble on
  close.
- New assistant messages are announced via an `aria-live="polite"` region.
- The launcher bubble has a clear accessible name ("Open onboarding
  assistant"), not just an icon.

## 9. Suggested phasing

**Next sprint (the one this spec is for):**
- `assistant-context.tsx`, `assistant-launcher.tsx` with the entrance
  animation, `assistant-panel.tsx` shell, `match.ts`, and 8 to 10 hand
  written knowledge base entries covering the structural questions from
  section 6.1. Wire the mount point in `app.tsx`.
- Verify: typecheck and build clean, reduced-motion fallback checked, keyboard
  only walkthrough (tab to launcher, open, tab through panel, escape closes).

**Once Week 4 sessions are written up:**
- Mine `testing/participant-notes/` for real confusion points, add those as
  new knowledge base entries. This is a content change, not an architecture
  change, should not require touching the components.

**Explicitly out of scope, do not build unless separately agreed:**
- Any real AI/LLM backend.
- Multi turn conversation memory or follow up question handling beyond a
  single question per message.
- Voice input, file upload, or any input modality beyond text.

## 10. Note for whichever Claude session picks this up

Multiple sessions will touch this project over time. Before writing code
against this spec: re-run a duplicate/orphan file check the same way past
audits in this repo have (`git ls-files | while read f; do echo "$(git
hash-object "$f") $f"; done | sort | uniq -d...` pattern, see recent commit
history for the exact form), confirm `npx tsc -b` and `npm run build` are
clean on the branch you start from, and check `git log --oneline -20` plus
`git branch -r` for any side branch already touching `src/components/assistant/`
or `src/lib/assistant/` before assuming a clean slate, another session or a
teammate may already be mid-flight on this exact feature.
