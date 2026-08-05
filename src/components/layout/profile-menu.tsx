import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LogOut, Settings, UserRound } from 'lucide-react';
import { useMember, initialsFor } from '@/state/member-context';
import { Avatar } from '@/components/ui/avatar';
import { EASE_OUT } from '@/lib/motion';
import { cn } from '@/lib/cn';

/**
 * The avatar menu in the top bar.
 *
 * The avatar used to be a bare span, so clicking it did nothing and signing out
 * lived in a separate button beside it. It is now the trigger for a real menu:
 * Profile, Settings, Sign out.
 *
 * Keyboard and pointer behaviour follows the menu button pattern: Escape
 * closes and returns focus to the trigger, arrow keys move through the items,
 * a click outside closes, and the trigger carries aria-haspopup with a live
 * aria-expanded.
 */
export function ProfileMenu({
  onOpenProfile,
  onOpenSettings,
  onSignOut,
}: {
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onSignOut: () => void;
}) {
  const { user } = useMember();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const items = itemsRef.current.filter(Boolean) as HTMLButtonElement[];
        if (items.length === 0) return;
        const current = items.indexOf(document.activeElement as HTMLButtonElement);
        const delta = e.key === 'ArrowDown' ? 1 : -1;
        // Wraps, so holding one arrow key cannot strand focus at an end.
        const nextIndex = current === -1 ? 0 : (current + delta + items.length) % items.length;
        items[nextIndex]?.focus();
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    // Focus the first item so the menu is usable straight from the keyboard.
    requestAnimationFrame(() => itemsRef.current[0]?.focus());
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!user) return null;

  const displayName = user.name?.trim() || user.email.split('@')[0];

  function choose(action: () => void) {
    setOpen(false);
    action();
  }

  const items = [
    { label: 'Profile', icon: UserRound, run: onOpenProfile },
    { label: 'Settings', icon: Settings, run: onOpenSettings },
    { label: 'Sign out', icon: LogOut, run: onSignOut, danger: true },
  ];

  return (
    <div className="relative" ref={rootRef}>
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`Account menu for ${displayName}`}
        className="grid place-items-center rounded-full transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--hm-honey)]"
      >
        <Avatar
          initials={initialsFor(user)}
          src={user.avatarUrl}
          accent="honey"
          size={38}
          presence="online"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            aria-label="Account"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: EASE_OUT }}
            className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-60 origin-top-right overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-[var(--shadow-lift)]"
          >
            <div className="flex items-center gap-3 border-b border-border/70 px-4 py-3">
              <Avatar
                initials={initialsFor(user)}
                src={user.avatarUrl}
                accent="honey"
                size={36}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{displayName}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
            </div>

            <div className="p-1.5">
              {items.map((item, i) => (
                <button
                  key={item.label}
                  ref={(el) => {
                    itemsRef.current[i] = el;
                  }}
                  role="menuitem"
                  onClick={() => choose(item.run)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors',
                    item.danger
                      ? 'text-muted hover:bg-pink-wash hover:text-ink'
                      : 'text-muted hover:bg-sunk hover:text-ink',
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
