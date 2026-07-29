# HiveMind Smart Onboarding: project instructions

## Punctuation rule (non-negotiable)

**Never use an em dash (—), an en dash (–), a double hyphen (--), or a single
hyphen (-) as sentence punctuation**, in code comments, UI copy, commit
messages, or documentation. Use a period, comma, colon, or parentheses instead.

This does **not** apply to hyphens inside compound words, kebab-case
identifiers, file names, CSS classes, or numeric literals (e.g. `role-specific`,
`task-card.tsx`, `bg-honey-wash`, `h-1.5` are all fine).

Before finishing any edit, check the diff for em/en dashes and hyphen-as-pause
usage and rewrite the sentence rather than leaving it.

## Writing style (non-negotiable)

Everything written for this project should read as if a member of the team wrote
it: plain, specific, and human. This applies to UI copy, code comments, commit
messages, documentation, and report text.

Avoid the patterns that make writing read as machine generated:

* No em dashes, en dashes, or hyphens used as a pause. See the rule above.
* No throat clearing openers such as "In today's fast paced world", "It is
  important to note that", or "Let's dive in".
* No inflated closers such as "In conclusion", "Overall", or a summary paragraph
  that repeats what was just said.
* No marketing filler: "seamless", "robust", "cutting edge", "leverage",
  "elevate", "unlock", "game changing", "delve", "tapestry", "testament".
* No "It's not just X, it's Y" or "This isn't just X. It's Y" constructions.
* No rule of three padding where two items would do, and no triads added purely
  for rhythm.
* No emoji in code, comments, or commit messages. UI copy may use one only when
  the design calls for it.
* No bold scattered across a paragraph for emphasis. Bold is for labels.
* Vary sentence length. Uniform medium length sentences are a giveaway.
* Write claims you can support. Do not invent statistics, sources, or results.

Prefer the concrete over the abstract. "The token expires after two hours" beats
"Sessions are managed securely with industry standard practices".

Before finishing any edit, reread the new prose once and cut anything that
sounds like filler rather than information.

## Design and stack

See [`PROTOTYPE_BUILD_PROMPT.md`](../PROTOTYPE_BUILD_PROMPT.md) for the full
brief: HiveMind's brand tokens, the motion system rules (respect
`prefers-reduced-motion`, ease not bounce for large moves, animate only
`transform`/`opacity`), and the screen flow. Component structure follows
`Naming-Conventions.md` from the client's design pack: PascalCase component
files, camelCase hooks/utils, kebab-case folders.

`npm run typecheck` and `npm run build` should stay clean before any commit.
