import {
  BookOpen,
  BrainCircuit,
  Ear,
  Layers,
  PencilRuler,
  PenTool,
  Puzzle,
  RefreshCw,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react';

/**
 * Maps the icon keys stored in the research content library to their Lucide
 * component, so `src/library/index.ts` stays framework-agnostic data.
 */
export const RESEARCH_ICONS = {
  users: Users,
  sparkles: Sparkles,
  layers: Layers,
  puzzle: Puzzle,
  search: Search,
  penTool: PenTool,
  rocket: Rocket,
  ear: Ear,
  pencilRuler: PencilRuler,
  refreshCw: RefreshCw,
  bookOpen: BookOpen,
  brainCircuit: BrainCircuit,
  shieldCheck: ShieldCheck,
  target: Target,
} as const satisfies Record<string, LucideIcon>;

export type ResearchIconKey = keyof typeof RESEARCH_ICONS;
