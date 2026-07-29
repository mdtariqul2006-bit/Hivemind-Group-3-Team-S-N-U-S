# HiveMind Smart Onboarding Prototype

Smart Onboarding is a guided first 30 days experience built for new starters at HiveMind Academy. It converts traditional document heavy onboarding into an interactive, role-specific journey with real-time progress tracking, 1:1 buddy matching, and clear milestone management.

This prototype was developed for the Work Based Learning module (PLP22206) at Ravensbourne University London in partnership with HiveMind Academy.

## Key Features

* **Guided Phase Roadmap**: Step by step tasks split across Day 1, Week 1, and Month 1.
* **Role Personalisation**: Custom paths tailored for Software Engineers, Product Designers, and Growth Marketers.
* **Interactive Progress Hive**: Real-time progress visualizer tracking completed onboarding milestones.
* **Team and Support Access**: Direct contact details for designated buddies, managers, and support channels.
* **Interactive Document Hub**: Searchable repository of essential policies, handbook notes, and guides.
* **Accessible and Motion Aware**: Built-in support for reduced motion preferences and keyboard accessibility.

## Tech Stack

* **Framework**: React 19 + Vite 6
* **Language**: TypeScript
* **Styling**: Tailwind CSS v4
* **Animation & Shaders**: Framer Motion, GSAP, Lenis Smooth Scroll, WebGL Mesh Shaders
* **Icons**: Lucide React

## Project Structure

```text
src/
├── components/
│   ├── layout/       Top navigation bar, theme toggles, and shell elements
│   ├── motion/       Particle canvas, 3D tilt cards, background shaders
│   └── ui/           Reusable UI primitives (buttons, modals, progress hives)
├── data/             Role templates, task databases, team contacts, and docs
├── hooks/            Custom hooks for scroll, theme, and counter logic
├── lib/              Utility functions, motion constants, and class merge helpers
├── screens/          Primary app views (Landing, Personalise, Dashboard, People, Docs)
├── state/            Global onboarding state context and toast notification manager
├── styles/           Global CSS and Tailwind configuration
└── types/            TypeScript definitions for tasks, roles, and view states
```

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/mdtariqul2006-bit/Hivemind-Group-3-Team-S-N-U-S.git
   cd Hivemind-Group-3-Team-S-N-U-S
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Team Members (Group 3, Team SNUS)

* **Kowshick Ahmed Abir**: Project Lead
* **Tariqul Islam**: UX/IA Designer
* **Asan Limbu**: UX Research Lead
* **Dip Mondal**: UI/Prototype Designer
* **Bushra Rimi**: Documentation Lead
* **Anita Rahman**: Technical/Feasibility Lead
