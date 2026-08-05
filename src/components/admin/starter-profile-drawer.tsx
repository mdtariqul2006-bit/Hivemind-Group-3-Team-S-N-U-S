import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserCheck,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  Briefcase,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { StarterRow } from '@/data/admin-metrics';
import { cn } from '@/lib/cn';
import { EASE_OUT } from '@/lib/motion';

interface StarterProfileDrawerProps {
  starter: StarterRow | null;
  onClose: () => void;
}

type TabType = 'overview' | 'tasks' | 'documents' | 'timeline';

const STATUS_TONE: Record<StarterRow['status'], { tone: 'honey' | 'pink' | 'sage'; label: string }> = {
  ahead: { tone: 'sage', label: 'Ahead' },
  'on-track': { tone: 'honey', label: 'On track' },
  'at-risk': { tone: 'pink', label: 'At risk' },
};

export function StarterProfileDrawer({ starter, onClose }: StarterProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (starter) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [starter, onClose]);

  if (!starter) return null;

  const status = STATUS_TONE[starter.status];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-ink/40 backdrop-blur-xs"
          aria-hidden
        />

        {/* Slide-over Drawer Panel */}
        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="w-screen max-w-xl border-l border-border bg-surface text-ink shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={`${starter.name} HR Profile`}
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="relative border-b border-border bg-canvas p-6">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:bg-sunk hover:text-ink focus-visible:outline-2 focus-visible:outline-honey"
                  aria-label="Close profile drawer"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Avatar initials={starter.initials} accent={starter.accent} size={64} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold tracking-tight text-ink">{starter.name}</h2>
                      <Badge tone={status.tone}>{status.label}</Badge>
                    </div>
                    <p className="text-sm font-medium text-muted">{starter.role}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-honey-deep" />
                        {starter.team}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-honey-deep" />
                        {starter.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-honey-deep" />
                        Started {starter.startDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress summary bar */}
                <div className="mt-5 rounded-2xl border border-border/80 bg-surface p-3.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-muted">Onboarding Progress</span>
                    <span className="numeral font-bold text-ink">
                      {starter.completedTasksCount}/{starter.totalTasks} Tasks Completed ({starter.progress}%)
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-sunk">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        starter.status === 'ahead' ? 'bg-sage' : starter.status === 'at-risk' ? 'bg-pink' : 'gradient-hm',
                      )}
                      style={{ width: `${starter.progress}%` }}
                    />
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="mt-6 flex border-b border-border/60">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={cn(
                      'border-b-2 px-4 py-2 text-sm font-medium transition-colors',
                      activeTab === 'overview'
                        ? 'border-honey text-honey-deep font-semibold'
                        : 'border-transparent text-muted hover:text-ink',
                    )}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={cn(
                      'border-b-2 px-4 py-2 text-sm font-medium transition-colors',
                      activeTab === 'tasks'
                        ? 'border-honey text-honey-deep font-semibold'
                        : 'border-transparent text-muted hover:text-ink',
                    )}
                  >
                    Assigned Tasks ({starter.assignedTasks.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className={cn(
                      'border-b-2 px-4 py-2 text-sm font-medium transition-colors',
                      activeTab === 'documents'
                        ? 'border-honey text-honey-deep font-semibold'
                        : 'border-transparent text-muted hover:text-ink',
                    )}
                  >
                    Documents ({starter.documents.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className={cn(
                      'border-b-2 px-4 py-2 text-sm font-medium transition-colors',
                      activeTab === 'timeline'
                        ? 'border-honey text-honey-deep font-semibold'
                        : 'border-transparent text-muted hover:text-ink',
                    )}
                  >
                    Activity
                  </button>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Contact & Support Grid */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Employee HR Details</h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-border bg-canvas p-3">
                          <div className="flex items-center gap-2 text-xs text-muted">
                            <Mail className="h-3.5 w-3.5 text-honey-deep" /> Email
                          </div>
                          <div className="mt-1 text-sm font-medium text-ink select-all">{starter.email}</div>
                        </div>
                        <div className="rounded-xl border border-border bg-canvas p-3">
                          <div className="flex items-center gap-2 text-xs text-muted">
                            <Phone className="h-3.5 w-3.5 text-honey-deep" /> Phone
                          </div>
                          <div className="mt-1 text-sm font-medium text-ink select-all">{starter.phone}</div>
                        </div>
                        <div className="rounded-xl border border-border bg-canvas p-3">
                          <div className="flex items-center gap-2 text-xs text-muted">
                            <Briefcase className="h-3.5 w-3.5 text-honey-deep" /> Manager
                          </div>
                          <div className="mt-1 text-sm font-semibold text-ink">{starter.manager}</div>
                        </div>
                        <div className="rounded-xl border border-border bg-canvas p-3">
                          <div className="flex items-center gap-2 text-xs text-muted">
                            <UserCheck className="h-3.5 w-3.5 text-honey-deep" /> Buddy
                          </div>
                          <div className="mt-1 text-sm font-semibold text-ink">{starter.buddy}</div>
                        </div>
                      </div>
                    </div>

                    {/* Upcoming Meetings */}
                    {starter.meetings.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Scheduled 1:1 Meetings</h3>
                        <div className="space-y-2">
                          {starter.meetings.map((m) => (
                            <div key={m.id} className="flex items-center justify-between rounded-xl border border-border bg-canvas p-3">
                              <div>
                                <div className="text-sm font-semibold text-ink">{m.title}</div>
                                <div className="text-xs text-muted">With {m.with} • {m.date} at {m.time}</div>
                              </div>
                              <Badge tone={m.status === 'completed' ? 'sage' : 'honey'}>{m.status}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Manager Notes */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Manager & HR Notes</h3>
                      {starter.notes.length > 0 ? (
                        <div className="space-y-3">
                          {starter.notes.map((n) => (
                            <div key={n.id} className="rounded-xl border border-border/80 bg-sunk/40 p-3.5">
                              <div className="flex items-center justify-between text-xs text-muted mb-1">
                                <span className="font-semibold text-ink">{n.author}</span>
                                <span>{n.date}</span>
                              </div>
                              <p className="text-sm text-ink/90">{n.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted">No manager notes recorded yet.</p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'tasks' && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Roadmap Checklist Tasks</h3>
                    <div className="space-y-2.5">
                      {starter.assignedTasks.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between rounded-xl border border-border bg-canvas p-3.5"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                                t.status === 'completed'
                                  ? 'bg-sage-wash text-sage'
                                  : t.status === 'in-progress'
                                  ? 'bg-honey-wash text-honey-deep'
                                  : 'bg-sunk text-muted',
                              )}
                            >
                              {t.status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-3.5 w-3.5" />}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-ink">{t.title}</div>
                              <div className="text-xs text-muted">{t.phase} • {t.minutes} mins</div>
                            </div>
                          </div>
                          <Badge tone={t.status === 'completed' ? 'sage' : t.status === 'in-progress' ? 'honey' : 'pink'}>
                            {t.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Required HR & Team Documents</h3>
                    <div className="space-y-2.5">
                      {starter.documents.map((d) => (
                        <div key={d.id} className="flex items-center justify-between rounded-xl border border-border bg-canvas p-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-honey-wash text-honey-deep">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-ink">{d.name}</div>
                              <div className="text-xs text-muted">{d.category}</div>
                            </div>
                          </div>
                          <Badge tone={d.status === 'signed' ? 'sage' : 'pink'}>{d.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Onboarding Event Log</h3>
                    <div className="relative border-l-2 border-border/80 pl-4 space-y-4 ml-2">
                      {starter.timeline.map((item) => (
                        <div key={item.id} className="relative">
                          <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-honey" />
                          <div className="text-xs font-semibold text-muted">{item.date}</div>
                          <div className="text-sm font-medium text-ink mt-0.5">{item.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="border-t border-border bg-canvas p-4 flex items-center justify-end gap-3">
                <Button variant="secondary" size="md" onClick={onClose}>
                  Close
                </Button>
                <a
                  href={`mailto:${starter.email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-surface transition-opacity hover:opacity-90"
                >
                  <Mail className="h-3.5 w-3.5" /> Email {starter.name.split(' ')[0]}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
