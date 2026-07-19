import { useEffect, useMemo, useState } from 'react';
import {
  BellRing,
  CheckCircle2,
  Lightbulb,
  Megaphone,
  RefreshCw,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  UserRoundCheck,
} from 'lucide-react';
import apiClient from '../api/axios';
import KPICard from '../components/KPICard';
import KPICardSkeleton from '../components/KPICardSkeleton';

const defaultSummary = {
  metrics: [
    { title: 'MRR Exposure', value: '$0', change: 0, icon: TrendingUp },
    { title: 'Active Accounts', value: '0', change: 0, icon: UserRoundCheck },
    { title: 'Account Churn Rate', value: '0%', change: 0, icon: TrendingDown },
  ],
  recommendations: [
    {
      title: 'Targeted Renewal Incentives',
      description: 'Prioritize high-value contracts exhibiting churn signals for localized contract renegotiations.',
      icon: ShieldAlert,
    },
    {
      title: 'Product Adoption Playbooks',
      description: 'Deploy customized setup checklists to reduce time-to-value for newly activated customer cohorts.',
      icon: CheckCircle2,
    },
    {
      title: 'Dormant Account Re-engagement',
      description: 'Trigger automated lifecycle communications targeting underutilized seats prior to subscription end dates.',
      icon: Megaphone,
    },
  ],
  actions: [
    'Audit high-risk cohort matrices on weekly business reviews (WBR).',
    'Deploy automated outreach sequences for accounts tracking below telemetry benchmarks.',
    'Benchmark contract retention uplift curves following onboarding adjustments.',
  ],
};

function normalizeMetric(metric, index) {
  if (!metric || typeof metric !== 'object') {
    return defaultSummary.metrics[index] ?? defaultSummary.metrics[0];
  }

  return {
    title: metric.title ?? metric.label ?? metric.name ?? `Metric ${index + 1}`,
    value: metric.value ?? metric.amount ?? metric.displayValue ?? '0',
    change: Number(metric.change ?? metric.delta ?? metric.percentChange ?? 0),
    icon: metric.icon ?? defaultSummary.metrics[index]?.icon ?? TrendingUp,
  };
}

function normalizeRecommendation(recommendation, index) {
  if (!recommendation || typeof recommendation !== 'object') {
    return defaultSummary.recommendations[index] ?? defaultSummary.recommendations[0];
  }

  return {
    title: recommendation.title ?? recommendation.label ?? recommendation.name ?? `Recommendation ${index + 1}`,
    description:
      recommendation.description ?? recommendation.detail ?? recommendation.text ?? 'Suggested retention improvement.',
    icon: recommendation.icon ?? defaultSummary.recommendations[index]?.icon ?? Lightbulb,
  };
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6">
      <KPICardSkeleton />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="h-80 animate-pulse rounded-[1.8rem] border border-white/10 bg-white/[0.04]" />
        <div className="h-80 animate-pulse rounded-[1.8rem] border border-white/10 bg-white/[0.04]" />
      </div>
    </div>
  );
}

function RecommendationCard({ title, description, icon: Icon }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-slate-300">
        <Icon size={16} aria-hidden="true" />
      </div>
      <div>
        <h4 className="text-[14px] font-bold text-white tracking-tight">{title}</h4>
        <p className="mt-1.5 text-[12.5px] font-normal leading-relaxed text-slate-400">{description}</p>
      </div>
    </div>
  );
}

export default function BusinessInsights() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function fetchSummary() {
      setLoading(true);
      setError('');

      try {
        const response = await apiClient.get('/dashboard-summary');
        if (active) {
          setSummary(response.data ?? {});
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError?.response?.data?.message || requestError?.message || 'Unable to load dashboard summary.',
          );
          setSummary({});
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchSummary();

    return () => {
      active = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const source = Array.isArray(summary?.metrics)
      ? summary.metrics
      : Array.isArray(summary?.kpis)
        ? summary.kpis
        : [];

    return (source.length ? source : defaultSummary.metrics).slice(0, 3).map(normalizeMetric);
  }, [summary]);

  const recommendations = useMemo(() => {
    const source = Array.isArray(summary?.recommendations)
      ? summary.recommendations
      : Array.isArray(summary?.retentionRecommendations)
        ? summary.retentionRecommendations
        : [];

    return (source.length ? source : defaultSummary.recommendations).slice(0, 3).map(normalizeRecommendation);
  }, [summary]);

  const actions = useMemo(() => {
    const source = Array.isArray(summary?.actions)
      ? summary.actions
      : Array.isArray(summary?.actionItems)
        ? summary.actionItems
        : defaultSummary.actions;

    return source.map((item, index) =>
      typeof item === 'string'
        ? item
        : item?.label ?? item?.title ?? item?.text ?? `Action item ${index + 1}`,
    );
  }, [summary]);

  return (
    <section className="grid gap-6">
      <div className="app-panel p-6 sm:p-8">
        <div className="max-w-3xl">
          <p className="type-label text-cyan-300">Executive Briefing</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Strategic Retention & Account Health Playbook</h2>
          <p className="mt-3 max-w-2xl text-sm font-light leading-6 text-slate-300 sm:text-base">
            Synthesized account health scorecards, automated retention playbooks, and prioritized workflows extracted from historical operational data.
          </p>
        </div>

        {/* Unified Metrics Row */}
        {!loading && !error && (
          <div className="mt-8 border-t border-white/[0.06] pt-6 grid gap-6 sm:grid-cols-3">
            {metrics.map((metric, index) => (
              <div key={metric.title} className={["flex items-center justify-between gap-4", index > 0 ? "sm:border-l sm:border-white/[0.06] sm:pl-6" : ""].join(" ")}>
                <div>
                  <p className="type-label text-slate-500">{metric.title}</p>
                  <h3 className="mt-1 text-2xl font-bold tracking-tight text-white">{metric.value}</h3>
                </div>
                <span className={["inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold border", 
                  metric.change >= 0 
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" 
                    : "border-rose-500/20 bg-rose-500/10 text-rose-400"
                ].join(" ")}>
                  {metric.change >= 0 ? '+' : ''}{metric.change}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="app-panel p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-slate-300">
                <RefreshCw size={18} aria-hidden="true" />
              </div>
              <div>
                <p className="type-label">Playbooks</p>
                <h3 className="text-xl font-semibold text-white">Targeted Mitigation Playbooks</h3>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {recommendations.map((recommendation, index) => (
                <RecommendationCard key={`${recommendation.title}-${index}`} {...recommendation} />
              ))}
            </div>
          </section>

          <section className="app-panel p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-slate-300">
                <BellRing size={18} aria-hidden="true" />
              </div>
              <div>
                <p className="type-label">Prioritized Workflows</p>
                <h3 className="text-xl font-semibold text-white">Next Best Actions</h3>
              </div>
            </div>

            <ul className="flex flex-col divide-y divide-white/[0.06]">
              {actions.map((action, index) => (
                <li key={`${action}-${index}`} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-[13px] font-normal leading-relaxed text-slate-300">{action}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </section>
  );
}