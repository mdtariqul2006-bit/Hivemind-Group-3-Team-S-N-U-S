# HiveMind Academy Website Research & Audit Report

This document summarizes an analysis of the official [HiveMind Academy](https://www.hivemindacademy.com/) website. It covers the brand identity, content architecture, service offerings, visual assets, and the UI contrast work carried into the Smart Onboarding prototype.

---

## 1. Executive Summary & Brand Positioning

HiveMind Academy provides **AI-powered onboarding and knowledge systems** tailored to growing organizations. Their core mission is converting fragmented documentation and ad-hoc onboarding into a structured, repeatable system.

### Core Value Propositions
* **Role Specific Personalisation**: Journeys mapped directly to real roles, tools, and workflows.
* **AI Powered Intelligence**: Surface documentation, guidance, and next steps at the exact right moment through an embedded AI work buddy.
* **Embedded in Real Work**: Checklists and learning modules map to live organizational tasks so knowledge is applied immediately.
* **Seamless Workflow Integration**: Plugs into existing team rhythms to reduce context-switching and platform fatigue.

---

## 2. Brand Identity & Visual Design System

### Color Palette
* **Primary Charcoal (`--hm-charcoal`)**: `#383C42` (Primary dark surface, text weight)
* **Honey Yellow (`--hm-honey`)**: `#FFC370` (Primary brand accent, bee motif)
* **Soft Pink (`--hm-pink`)**: `#F4B8BD` (Highlight, celebration states)
* **Sage Green (`--hm-sage`)**: `#BAC9C5` (Calm secondary, section bands)
* **Deep Canvas (`--hm-canvas`)**: Dark mode `#0B0D10` / Light mode `#FBFAF7`

### Typography & Iconography
* **Font Family**: Inter Variable / Inter (`ui-sans-serif, system-ui, -apple-system`)
* **Hexagonal Motif**: Hexagon frames (`M50 4 91 27v46L50 96 9 73V27z`) reflecting the "Hive" concept.
* **Vector Gradients**: Ambient glowing circles and wave paths framing hero sections.

---

## 3. Architecture & Service Framework

### The 3-Step Methodology
1. **Consultation & Discovery**: Mapping stakeholder workflows, surfacing knowledge silos, and identifying onboarding friction points.
2. **Bespoke Course Creation**: Co-designing role-specific journeys, centralized single-source-of-truth docs, and interactive training.
3. **Implementation & Support**: Piloting, measuring time-to-productivity, and embedding sustainable habits.

### Working Principles ("How We Work")
1. **Listen First**: In-depth interviews and workshops before touching templates.
2. **Design for Reality**: Practical, high-impact interventions tailored to team capacity.
3. **Embed and Iterate**: Manageable pilots with continuous refinement.

---

## 4. Assets & Media Inventory Downloaded

All official SVG logos and high-res imagery were downloaded directly from the live site into `public/`:
* `public/favicon.ico`
* `public/ico-logo.svg`
* `public/images/logo/logo-text-right.svg`
* `public/images/hivemind/structure-learning.jpg`
* `public/images/hivemind/usp-1.jpg`
* `public/images/hivemind/usp-2.png`
* `public/images/hivemind/usp-3.png`
* `public/images/hivemind/consult.jpg`
* `public/images/hivemind/discuss.jpg`
* `public/images/hivemind/delivery.jpg`

---

## 5. UI & Contrast Improvements (2026 Modern Standard)

### Identified Problem on Original & Early Landing Pages
* Fast moving animated background shaders caused text legibility issues when light/bright gradient mesh blobs passed directly behind dark or medium text.

### Solutions Implemented in Prototype
1. **Glassmorphic Backing Panels**: Wrapped hero copy, subheadings, and badges in high-contrast frosted glass panels (`bg-surface/75 backdrop-blur-xl border border-border/80`).
2. **Legibility Dropshadows & Contrast Pills**: Applied drop shadows (`drop-shadow-md`) and dark contrast pill badges (`bg-surface/20 border border-border/80`), targeting WCAG AA contrast or better regardless of animation state.
3. **Optimized Shader Speed & Opacity**: Dialed mesh gradient opacity to a subtle background layer (`opacity-25`) so text contrast remains crisp and static.
4. **Custom 3D Interactive Card**: Added 3D tilt perspective previews with real time glare highlights, giving product cards a glossy, tactile feel on hover.
