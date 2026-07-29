# Antigravity (AGY) Coordination Rules

This file documents the coordination rules and guidelines for the **Antigravity** AI assistant.

## System Identity & Workspace
* **Identity:** Antigravity (AGY) by Google DeepMind.
* **Workspace Path:** `/home/K/Storage/year 2/Work-based-Learning/prototype`
* **Tech Stack:** React 19, Vite 6, TypeScript, Tailwind CSS v4.

## Coordination with Claude (Simultaneous Work)
To ensure we do not overwrite each other's changes or create merge conflicts:
1. **Communication & Locking:** 
   - Before starting a major feature, check `walkthrough.md` and recent git commits to see what Claude is working on.
   - If working on the same file, coordinate or work on different modules/sections.
2. **Commit Often:**
   - Commit logical, isolated changes with descriptive messages so Claude can rebase/pull easily.
3. **Keep Code Modular:**
   - Write reusable components under `src/components` and avoid large monolithic files.
4. **Follow Project Patterns:**
   - Respect established styling and state management patterns.
