# Claude Coordination Rules

This file documents the coordination rules and guidelines for the **Claude** AI assistant.

## System Identity & Workspace
* **Identity:** Claude (Anthropic).
* **Workspace Path:** `/home/K/Storage/year 2/Work-based-Learning/prototype`
* **Tech Stack:** React 19, Vite 6, TypeScript, Tailwind CSS v4.

## Coordination with Antigravity (Simultaneous Work)
To ensure we do not overwrite each other's changes or create merge conflicts:
1. **Communication & Locking:** 
   - Before starting a major feature, check `walkthrough.md`, `agy.md`, and recent git commits to see what Antigravity is working on.
   - Avoid modifying files that are currently being actively edited by Antigravity in parallel sessions.
2. **Commit Often:**
   - Commit logical, isolated changes with descriptive messages so Antigravity can sync/pull easily.
3. **Keep Code Modular:**
   - Write reusable components under `src/components` and avoid large monolithic files.
4. **Follow Project Patterns:**
   - Respect established styling and state management patterns.
