import { useEffect, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  FileText,
  ShieldCheck,
  LogOut,
  X,
} from 'lucide-react';
import { LogoMark } from '@/components/ui/logo';
import { useAuth } from '@/state/auth-context';
import { springSoft } from '@/lib/motion';
import { cn } from '@/lib/cn';

/** Matches the `lg` breakpoint, where the sidebar becomes an always-visible rail. */
function useIsDesktopRail(): boolean {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  );

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const onChange = () => setIsDesktop(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isDesktop;
}

export type AdminSection = 'overview' | 'starters' | 'analytics' | 'documents' | 'security';

export const NAV: Array<{ id: AdminSection; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'starters', label: 'Starters', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'security', label: 'Security', icon: ShieldCheck },
];

interface SidebarProps {
  active: AdminSection;
  onSelect: (section: AdminSection) => void;
  /** Mobile drawer state. On desktop the rail is always visible. */
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ active, onSelect, open, onClose }: SidebarProps) {
  const isDesktopRail = useIsDesktopRail();
  // Below `lg` the drawer is only a transform away from the viewport, not
  // actually removed, so its nav links and sign out button stay keyboard
  // focusable and screen-reader visible unless explicitly hidden here.
  const offscreen = !open && !isDesktopRail;

  return (
    <>
      {/* Mobile scrim */}
      <AnimatePresence>
        {open && (
          <motion.button
            aria-label="Close navigation"
            className="fixed inset-0 z-40 bg-scrim lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        aria-hidden={offscreen}
        inert={offscreen}
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[264px] border-r border-border bg-surface transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-5 py-5">
            <span className="flex items-center gap-2.5">
              <LogoMark size={30} />
              <span className="text-base font-semibold tracking-tight text-ink">HiveMind</span>
            </span>
            <button
              onClick={onClose}
              aria-label="Close navigation"
              className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-sunk lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <span className="mx-5 mb-2 text-[11px] uppercase tracking-wider text-muted">Console</span>

          <nav className="flex-1 px-3">
            <ul className="grid gap-1">
              {NAV.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === active;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onSelect(item.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors',
                        isActive ? 'text-charcoal' : 'text-muted hover:bg-sunk hover:text-ink',
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="admin-nav-active"
                          className="absolute inset-0 rounded-2xl gradient-hm"
                          transition={springSoft}
                        />
                      )}
                      <Icon className="relative z-10 h-4.5 w-4.5" />
                      <span className="relative z-10 font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <SidebarFooter />
        </div>
      </aside>
    </>
  );
}

function SidebarFooter() {
  const { admin, logout } = useAuth();
  const reduce = useReducedMotion();

  return (
    <div className="border-t border-border p-3">
      <div className="mb-2 flex items-center gap-3 rounded-2xl bg-sunk px-3 py-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full gradient-hm text-xs font-semibold text-charcoal">
          {admin?.name.split(' ').map((p) => p[0]).join('') ?? 'A'}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-ink">{admin?.name}</span>
          <span className="block truncate text-xs text-muted">Administrator</span>
        </span>
      </div>
      <motion.button
        onClick={logout}
        whileTap={reduce ? undefined : { scale: 0.97 }}
        className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-sunk hover:text-ink"
      >
        <LogOut className="h-4.5 w-4.5" />
        Sign out
      </motion.button>
    </div>
  );
}
