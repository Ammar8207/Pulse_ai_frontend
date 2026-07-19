import { memo, useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import apiClient from '../api/axios';

const highRiskCustomers = [
  { customerId: 'C-1042', churnProbability: 0.91, riskLevel: 'High', monthlyCharges: 118.4 },
  { customerId: 'C-2088', churnProbability: 0.87, riskLevel: 'High', monthlyCharges: 99.9 },
  { customerId: 'C-3115', churnProbability: 0.83, riskLevel: 'High', monthlyCharges: 104.3 },
  { customerId: 'C-4229', churnProbability: 0.79, riskLevel: 'High', monthlyCharges: 87.6 },
  { customerId: 'C-5341', churnProbability: 0.76, riskLevel: 'High', monthlyCharges: 112.2 },
];

const riskSegments = [
  { name: 'Very High', value: 6, color: '#b91c1c' },
  { name: 'High', value: 12, color: '#ef4444' },
  { name: 'Medium', value: 31, color: '#f59e0b' },
  { name: 'Low', value: 51, color: '#22c55e' },
];

function normalizeFeatureImportance(payload) {
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.features)
      ? payload.features
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

  if (!items.length) {
    return [
      { feature: 'Contract Type', importance: 0.32 },
      { feature: 'Monthly Charges', importance: 0.28 },
      { feature: 'Tenure', importance: 0.21 },
      { feature: 'Tech Support', importance: 0.19 },
    ];
  }

  return items.map((item, index) => {
    if (typeof item === 'number') {
      return { feature: `Feature ${index + 1}`, importance: item };
    }

    return {
      feature: item.feature ?? item.name ?? item.label ?? `Feature ${index + 1}`,
      importance: Number(item.importance ?? item.score ?? item.value ?? item.weight ?? 0),
    };
  });
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="app-card p-5 animate-pulse">
          <div className="mb-4 h-4 w-48 rounded-full bg-white/10" />
          <div className="h-[360px] rounded-3xl bg-gradient-to-br from-white/5 via-white/10 to-white/5" />
        </div>
      ))}
    </div>
  );
}

// Stable style objects at module scope
const AXIS_TICK_X = { fill: '#64748b', fontSize: 11, fontFamily: 'var(--font-ui)' };
const AXIS_TICK_Y = { fill: '#cbd5e1', fontSize: 11, fontFamily: 'var(--font-ui)' };
const TOOLTIP_STYLE = {
  background: '#070c17',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '12px',
  fontFamily: 'var(--font-ui)',
};
const TOOLTIP_LABEL = { color: '#cbd5e1', fontWeight: 600 };
const BAR_MARGIN = { top: 8, right: 8, left: 0, bottom: 8 };

const FeatureImportanceCard = memo(function FeatureImportanceCard({ data }) {
  return (
    <section className="app-panel p-6">
      <div className="mb-4">
        <p className="type-label">Drivers</p>
        <h3 className="mt-1 text-xl font-semibold text-white">Key Retention Risk Indicators</h3>
      </div>

      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={BAR_MARGIN}>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3 3" />
            <XAxis type="number" tick={AXIS_TICK_X} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="feature"
              tick={AXIS_TICK_Y}
              axisLine={false}
              tickLine={false}
              width={120}
            />
            <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={TOOLTIP_LABEL} />
            <Bar dataKey="importance" radius={[0, 4, 4, 0]} fill="#3b82f6" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
});

const RiskSegmentationCard = memo(function RiskSegmentationCard() {
  return (
    <section className="app-panel p-6">
      <div className="mb-4">
        <p className="type-label">Demographics</p>
        <h3 className="mt-1 text-xl font-semibold text-white">Contract Risk Distribution</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_160px] md:items-center">
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Pie
                data={riskSegments}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={105}
                paddingAngle={3}
                isAnimationActive={false}
              >
                {riskSegments.map((segment) => (
                  <Cell key={segment.name} fill={segment.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-4">
          {riskSegments.map((segment) => (
            <div key={segment.name} className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                <span className="text-sm text-white">{segment.name}</span>
              </div>
              <span className="type-value text-sm text-slate-400">{segment.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default function RiskAnalysis() {
  const [featureImportance, setFeatureImportance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function fetchFeatureImportance() {
      setLoading(true);
      setError('');

      try {
        const response = await apiClient.get('/feature-importance');
        if (active) {
          setFeatureImportance(normalizeFeatureImportance(response.data));
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError?.response?.data?.message || requestError?.message || 'Unable to load feature importance.',
          );
          setFeatureImportance(normalizeFeatureImportance());
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchFeatureImportance();

    return () => {
      active = false;
    };
  }, []);

  const sortedHighRiskCustomers = useMemo(
    () => [...highRiskCustomers].sort((left, right) => right.churnProbability - left.churnProbability),
    [],
  );

  return (
    <section className="grid gap-6">
      <div className="app-panel p-6 sm:p-8">
        <p className="type-label text-cyan-300">Risk Vectors</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Customer Churn Exposure</h2>
        <p className="mt-3 max-w-2xl text-sm font-light leading-6 text-slate-300 sm:text-base">
          Real-time risk scoring, feature driver analysis, and segment breakdown for accounts exhibiting elevated churn warning signals.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="app-panel p-6">
          <div className="mb-4">
            <p className="type-label">Exposure Table</p>
            <h3 className="mt-1 text-xl font-semibold text-white">Critical Retention Risk Candidates</h3>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10 text-left">
                <thead className="bg-white/[0.05] text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  <tr>
                    <th className="px-4 py-4 font-semibold">Account Ref</th>
                    <th className="px-4 py-4 font-semibold">Churn Exposure</th>
                    <th className="px-4 py-4 font-semibold">Risk Band</th>
                    <th className="px-4 py-4 font-semibold">MRR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-slate-950/30 text-sm">
                  {sortedHighRiskCustomers.map((customer) => (
                    <tr key={customer.customerId}>
                      <td className="px-4 py-4 font-semibold text-white">{customer.customerId}</td>
                      <td className="type-value px-4 py-4 text-slate-200 font-medium">{(customer.churnProbability * 100).toFixed(1)}%</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-rose-300">
                          {customer.riskLevel}
                        </span>
                      </td>
                      <td className="type-value px-4 py-4 text-slate-200 font-medium">${customer.monthlyCharges.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {loading ? <LoadingSkeleton /> : <FeatureImportanceCard data={featureImportance} />}
      </div>

      {error ? (
        <div className="rounded-[1.6rem] border border-rose-400/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <RiskSegmentationCard />
    </section>
  );
}