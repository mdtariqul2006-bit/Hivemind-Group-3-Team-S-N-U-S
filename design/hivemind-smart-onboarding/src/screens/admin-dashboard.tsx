import { useState } from 'react';
import { 
  Users, TrendingUp, Clock, Award, ShieldCheck, Search, 
  UserCheck, CheckCircle2, Download, 
  BarChart3, ArrowUpRight
} from 'lucide-react';
import { useOnboarding } from '@/state/onboarding-context';
import { Button } from '@/components/ui/button';
import { GlowCard } from '@/components/motion/glow-card';
import { PEOPLE } from '@/data/people';

export function AdminDashboard() {
  const { dispatch } = useOnboarding();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'starters' | 'analytics' | 'settings'>('overview');

  const filteredPeople = PEOPLE.filter((p) => {
    return p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.role.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-ink">
      {/* Demo Admin Header Banner */}
      <div className="mb-8 rounded-3xl border border-honey/40 bg-surface/90 backdrop-blur-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 h-40 w-40 rounded-full bg-honey/20 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-6 z-10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-honey to-pink text-charcoal shadow-lg font-black text-xl">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/40">
                  Demo Admin Active
                </span>
                <span className="text-xs text-muted font-mono">admin@hivemindacademy.com</span>
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-black text-ink">HiveMind Enterprise Admin Console</h1>
              <p className="text-xs sm:text-sm text-muted">Real-time team onboarding analytics, buddy matching, and productivity insights.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => dispatch({ type: 'go', view: 'dashboard' })}
              variant="secondary"
            >
              Switch to Starter View
            </Button>
            <Button
              onClick={() => alert('Demo analytics exported to PDF/CSV!')}
              iconRight={<Download className="h-4 w-4" />}
            >
              Export Report
            </Button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="mt-8 flex border-b border-border/60 gap-4 text-sm font-semibold">
          {[
            { id: 'overview', label: 'Overview & Insights', icon: BarChart3 },
            { id: 'starters', label: 'Starter Roster', icon: Users },
            { id: 'analytics', label: 'Bottleneck Analytics', icon: TrendingUp },
            { id: 'settings', label: 'System Security', icon: ShieldCheck },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 pb-3 transition-colors relative border-b-2 ${
                activeTab === tab.id
                  ? 'border-honey text-honey-deep font-bold'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <GlowCard className="p-6 border border-border/80 bg-surface/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">Total Onboarded</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-honey-wash text-honey-deep">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-black text-ink numeral">1,420</p>
              <p className="mt-1 flex items-center text-xs font-semibold text-emerald-400 gap-1">
                <ArrowUpRight className="h-3.5 w-3.5" /> +12.4% this month
              </p>
            </GlowCard>

            <GlowCard className="p-6 border border-border/80 bg-surface/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">Completion Rate</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-wash text-pink">
                  <Award className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-black text-ink numeral">94.2%</p>
              <p className="mt-1 flex items-center text-xs font-semibold text-emerald-400 gap-1">
                <ArrowUpRight className="h-3.5 w-3.5" /> Top 5% Industry Benchmark
              </p>
            </GlowCard>

            <GlowCard className="p-6 border border-border/80 bg-surface/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">Time to Productive</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-wash text-emerald-400">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-black text-ink numeral">11.4 Days</p>
              <p className="mt-1 text-xs text-muted">Reduced from 28.0 days prior</p>
            </GlowCard>

            <GlowCard className="p-6 border border-border/80 bg-surface/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">Buddy Match Rate</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-honey-wash text-honey-deep">
                  <UserCheck className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-black text-ink numeral">99.1%</p>
              <p className="mt-1 text-xs text-muted">1:1 Pairing within 2 hours</p>
            </GlowCard>
          </div>

          {/* Role Distribution & Milestones Grid */}
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8 rounded-3xl border border-border/80 bg-surface/90 p-6 shadow-xl">
              <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-honey" /> Onboarding Funnel Progress
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Day 1 Workspace & Tools Setup</span>
                    <span className="text-honey-deep numeral">99% (1,405 Completed)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-sunk overflow-hidden">
                    <div className="h-full w-[99%] bg-honey rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Week 1 Buddy Introduction & First PR/Campaign</span>
                    <span className="text-pink numeral">91% (1,292 Completed)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-sunk overflow-hidden">
                    <div className="h-full w-[91%] bg-pink rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Month 1 Milestone Graduation</span>
                    <span className="text-emerald-400 numeral">86% (1,221 Completed)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-sunk overflow-hidden">
                    <div className="h-full w-[86%] bg-emerald-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 rounded-3xl border border-border/80 bg-surface/90 p-6 shadow-xl">
              <h2 className="text-lg font-bold text-ink mb-4">Role Distribution</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-sunk/60 border border-border/40">
                  <span className="text-xs font-semibold text-ink">💻 Software Engineering</span>
                  <span className="text-xs font-bold text-honey-deep numeral">45%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-sunk/60 border border-border/40">
                  <span className="text-xs font-semibold text-ink">🎨 Product Design</span>
                  <span className="text-xs font-bold text-pink numeral">30%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-sunk/60 border border-border/40">
                  <span className="text-xs font-semibold text-ink">📈 Growth Marketing</span>
                  <span className="text-xs font-bold text-emerald-400 numeral">25%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Starter Roster Section */}
      {(activeTab === 'starters' || activeTab === 'overview') && (
        <div className="mt-8 rounded-3xl border border-border/80 bg-surface/90 p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-ink">Starter Roster & Buddy Assignments</h2>
              <p className="text-xs text-muted">Manage new starter progress, buddy pairings, and send instant nudges.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  type="text"
                  placeholder="Search starter or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-full border border-border bg-sunk pl-9 pr-4 py-1.5 text-xs text-ink focus:outline-none focus:border-honey"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border text-muted uppercase tracking-wider bg-sunk/40">
                <tr>
                  <th className="py-3 px-4">Starter</th>
                  <th className="py-3 px-4">Role & Team</th>
                  <th className="py-3 px-4">Relationship</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredPeople.map((person) => (
                  <tr key={person.id} className="hover:bg-sunk/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-ink flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-honey-wash text-honey-deep flex items-center justify-center font-extrabold text-xs">
                        {person.initials}
                      </div>
                      {person.name}
                    </td>
                    <td className="py-3.5 px-4 text-muted">{person.role}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                        person.relationship === 'buddy' ? 'bg-honey-wash text-honey-deep' : 'bg-pink-wash text-pink'
                      }`}>
                        {person.relationship}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Active & On Track
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="secondary"
                        onClick={() => alert(`Nudge sent to ${person.name}!`)}
                      >
                        Nudge
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
