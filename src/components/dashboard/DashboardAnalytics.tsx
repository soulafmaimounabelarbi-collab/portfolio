import { useState, useEffect } from 'react';
import { TrendingUp, Eye, Calendar, Clock } from 'lucide-react';
import { loadAnalytics, type AnalyticsData, type DailyVisit } from '../../hooks/usePortfolioStore';
import { PanelHeader, DashCard } from './DashUI';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatShortDate(ymd: string) {
  const [year, month, day] = ymd.split('-');
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

function StatCard({ icon, label, value, sub, accent }: StatCardProps) {
  return (
    <DashCard className={`flex items-start gap-4 ${accent ? 'border-rose/30 bg-rose/[0.025]' : ''}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent ? 'bg-petal' : 'bg-blush'}`}>
        <span className={accent ? 'text-roseDeep' : 'text-ash'}>{icon}</span>
      </div>
      <div>
        <p className="text-xs font-mono text-ash uppercase tracking-widest mb-1">{label}</p>
        <p className="font-display text-3xl text-charcoal">{value}</p>
        {sub && <p className="text-xs text-ash mt-1">{sub}</p>}
      </div>
    </DashCard>
  );
}

function MiniBarChart({ visits }: { visits: DailyVisit[] }) {
  if (!visits || visits.length === 0) return null;

  const maxCount = Math.max(...visits.map((v) => v.count ?? 0), 1);
  // Show last 14 days
  const recent = [...visits]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);

  return (
    <DashCard>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-lg text-charcoal">Daily Visits</h3>
        <span className="text-xs text-ash font-mono">Last 14 days</span>
      </div>

      {/*
        Important: ensure the chart row has an explicit height.
        If this collapses to 0px, bars will be invisible.
      */}
      <div className="flex items-end gap-1 h-32 min-h-[128px] w-full">
        {recent.map((v) => {
          const count = v.count ?? 0;
          const pct = (count / maxCount) * 100;

          return (
            <div
              key={v.date}
              className="flex-1 flex flex-col items-center gap-1 group relative"
            >
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center pointer-events-none z-10">
                <div className="bg-charcoal text-white text-2xs rounded-lg px-2 py-1 whitespace-nowrap">
                  {count} visit{count !== 1 ? 's' : ''}
                  <br />
                  <span className="text-mist">{formatShortDate(v.date)}</span>
                </div>
                <div className="w-1.5 h-1.5 bg-charcoal rotate-45 -mt-1" />
              </div>

              {/* Bar */}
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-roseDeep to-rose transition-all duration-300"
                // Use absolute pixel height (less likely to collapse)
                style={{ height: `${Math.max((pct / 100) * 128, 6)}px` }}
              />

              {/* Label */}
              <span className="text-2xs text-ash rotate-0 whitespace-nowrap">
                {formatShortDate(v.date).split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </DashCard>
  );
}


function VisitTable({ visits }: { visits: DailyVisit[] }) {
  if (visits.length === 0) return null;

  const sorted = [...visits].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <DashCard>
      <h3 className="font-display text-lg text-charcoal mb-4">Visit History</h3>
      <div className="overflow-hidden rounded-xl border border-petal">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-blush border-b border-petal">
              <th className="text-left px-4 py-2.5 text-xs font-mono text-rose uppercase tracking-widest">Date</th>
              <th className="text-right px-4 py-2.5 text-xs font-mono text-rose uppercase tracking-widest">Visits</th>
              <th className="text-right px-4 py-2.5 text-xs font-mono text-rose uppercase tracking-widest">Share</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((v, i) => {
              const total = visits.reduce((s, x) => s + x.count, 0);
              const pct = total > 0 ? ((v.count / total) * 100).toFixed(1) : '0';
              return (
                <tr key={v.date} className={`border-b border-petal last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-blush/50'}`}>
                  <td className="px-4 py-2.5 text-charcoal font-medium">{formatShortDate(v.date)}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="inline-flex items-center justify-end gap-1">
                      <span className="font-mono text-roseDeep font-semibold">{v.count}</span>
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-petal rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-ash text-xs w-10 text-right">{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashCard>
  );
}

export function DashboardAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVisits: 0,
    dailyVisits: [],
    lastVisit: '',
  });

  useEffect(() => {
    setAnalytics(loadAnalytics());
  }, []);

  const refresh = () => setAnalytics(loadAnalytics());

  const today = new Date().toISOString().split('T')[0];
  const todayVisits = analytics.dailyVisits.find((d) => d.date === today)?.count ?? 0;
  const weekVisits = analytics.dailyVisits
    .filter((d) => {
      const dDate = new Date(d.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return dDate >= weekAgo;
    })
    .reduce((s, d) => s + d.count, 0);

  return (
    <div>
      <PanelHeader
        title="Analytics"
        description="Portfolio visit statistics tracked in your browser's local storage."
        action={
          <button
            onClick={refresh}
            className="text-xs text-rose hover:text-roseDeep font-mono transition-colors"
          >
            ↻ Refresh
          </button>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard
          icon={<Eye className="w-5 h-5" />}
          label="Total Visits"
          value={analytics.totalVisits.toLocaleString()}
          sub="All time"
          accent
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="This Week"
          value={weekVisits}
          sub="Last 7 days"
        />
        <StatCard
          icon={<Calendar className="w-5 h-5" />}
          label="Today"
          value={todayVisits}
          sub={new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long' })}
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Last Visit"
          value={analytics.lastVisit ? formatDate(analytics.lastVisit).split(',')[0] : '—'}
          sub={analytics.lastVisit ? formatDate(analytics.lastVisit) : 'No visits recorded yet'}
        />
      </div>

      {analytics.totalVisits === 0 ? (
        <DashCard className="text-center py-12">
          <Eye className="w-10 h-10 text-mist mx-auto mb-3" />
          <p className="text-ash text-sm">No visits recorded yet.</p>
          <p className="text-ash text-xs mt-1">
            Visit{' '}
            <a href="/" target="_blank" className="text-rose hover:text-roseDeep underline">
              your portfolio
            </a>{' '}
            to record the first visit.
          </p>
        </DashCard>
      ) : (
        <div className="space-y-6">
          <MiniBarChart visits={analytics.dailyVisits} />
          <VisitTable visits={analytics.dailyVisits} />
        </div>
      )}

      <p className="text-2xs text-ash mt-4 text-center">
        ⚠️ Analytics are stored locally in this browser. Visits from other browsers or devices are not counted.
      </p>
    </div>
  );
}
