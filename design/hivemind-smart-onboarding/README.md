# HiveMind: Smart Onboarding Prototype

Welcome to the guided sprint prototype for HiveMind. This project demonstrates a guided, personalized first 30 days experience for new hires at Northwind.

## Product Thesis

New employees often experience an impersonal, document heavy onboarding process. Information is scattered, and there is little guidance on what to do first. 

HiveMind solves this with:
1. **A Guided Roadmap**: Tasks organized by Day 1, Week 1, and Month 1.
2. **Role Specific Content**: Custom paths tailored for Designers, Engineers, and Marketers.
3. **Micro learning Cards**: Small, digestible cards instead of long handbooks.
4. **Visually Clear Progress**: The ProgressHive component tracks progress cell by cell.
5. **Support Channels**: Manager and buddy details are always accessible.

## Technical Architecture and Setup

This project uses React, TypeScript, and Tailwind CSS. It is structured to replicate modern standards like shadcn.

### Shadcn and Directory Structure

We use a standard component structure where reusable primitives reside in `src/components/ui/` (such as the Button, Badge, Skeleton, and Shader elements), and page screens reside in `src/screens/`.

**Why the `/components/ui` folder is important:**
- It separates layout components from design system primitives.
- It enables shadcn CLI to easily add, update, and manage component code without conflicting with custom application logic.
- It ensures a clean, predictable file hierarchy that external teams can immediately navigate.

### Setup Instructions from Scratch

If you are initializing a new project to support this architecture:

1. **Initialize TypeScript and Vite**:
   ```bash
   npm create vite@latest my-app -- --template react-ts
   cd my-app
   ```

2. **Install Tailwind CSS**:
   Follow Tailwind guidelines for Vite integration. For Tailwind v4:
   ```bash
   npm install tailwindcss @tailwindcss/vite
   ```
   Add the Tailwind plugin to `vite.config.ts`.

3. **Initialize Shadcn CLI**:
   Run the CLI init command to set up component paths:
   ```bash
   npx shadcn@latest init
   ```
   During setup, choose the `/components/ui` path for component primitives and configure your import aliases (such as `@/*`).

4. **Install Shader and Motion Dependencies**:
   Install Framer Motion and Paper Design Shaders:
   ```bash
   npm install framer-motion @paper-design/shaders-react --legacy-peer-deps
   ```

## Motion and Interaction Design

Our animations are crafted to feel premium, responsive, and natural.

1. **Shader Showcases**: The welcome screen uses a high performance WebGL `MeshGradient` and `PulsingBorder` to create an ambient, organic field.
2. **Conic Border Glows**: Cards use the `GlowingEffect` to draw a subtle conic border gradient that tracks the user's cursor.
3. **Drifting Gradients**: Behind content sections, slow moving color circles add depth.
4. **Vector Path Waves**: The background features floating mathematical waves that animate slowly over time.
5. **Reduced Motion**: We respect user preferences for reduced motion. All complex animations are disabled if `prefers-reduced-motion` is active.
