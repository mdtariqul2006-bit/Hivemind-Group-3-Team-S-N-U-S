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

## Design and stack

See [`PROTOTYPE_BUILD_PROMPT.md`](../PROTOTYPE_BUILD_PROMPT.md) for the full
brief: HiveMind's brand tokens, the motion system rules (respect
`prefers-reduced-motion`, ease not bounce for large moves, animate only
`transform`/`opacity`), and the screen flow. Component structure follows
`Naming-Conventions.md` from the client's design pack: PascalCase component
files, camelCase hooks/utils, kebab-case folders.

`npm run typecheck` and `npm run build` should stay clean before any commit.
