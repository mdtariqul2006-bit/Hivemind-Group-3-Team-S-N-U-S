import {
  CalendarClock,
  Circle,
  Compass,
  Eye,
  GitPullRequest,
  HeartHandshake,
  LayoutDashboard,
  Megaphone,
  MessageCircle,
  Palette,
  PenTool,
  Rocket,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
  type LucideIcon,
} from 'lucide-react';

/**
 * Explicit icon registry, keyed by the kebab-case names used in task data.
 *
 * This exists instead of `import * as Icons from 'lucide-react'` on purpose, the
 * namespace import pulls the entire icon set (~1MB) into the bundle. Naming the
 * handful we actually use keeps tree-shaking working and the main chunk small.
 */
const REGISTRY: Record<string, LucideIcon> = {
  'heart-handshake': HeartHandshake,
  compass: Compass,
  'calendar-clock': CalendarClock,
  users: Users,
  'message-circle': MessageCircle,
  sparkles: Sparkles,
  palette: Palette,
  eye: Eye,
  'layout-dashboard': LayoutDashboard,
  terminal: Terminal,
  'git-pull-request': GitPullRequest,
  'shield-check': ShieldCheck,
  megaphone: Megaphone,
  'pen-tool': PenTool,
  rocket: Rocket,
};

export function taskIcon(name: string): LucideIcon {
  return REGISTRY[name] ?? Circle;
}
