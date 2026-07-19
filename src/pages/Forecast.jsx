import { memo, useEffect, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import apiClient from '../api/axios';

const defaultSeries = [
  { label: 'Jan', value: 0 },
  { label: 'Feb', value: 0 },
  { label: 'Mar', value: 0 },
  { label: 'Apr', value: 0 },
  { label: 'May', value: 0 },
  { label: 'Jun', value: 0 },
];

const chartConfigs = [
  { key: 'revenueForecast', title: 'Projected MRR Expansion', color: '#3b82f6' },
  { key: 'customerGrowth', title: 'Net New Account Velocity', color: '#10b981' },
  { key: 'activeCustomersTrend', title: 'Active Contracts Run Rate', color: '#f59e0b' },
  { key: 'churnTrend', title: 'Forecasted Churn Rate', color: '#ef4444' },
];

function normalizeSeries(series) {
  if (!Array.isArray(series)) {
    return defaultSeries;
  }

  return series.map((point, index) => {
    if (typeof point === 'number') {
      return { label: defaultSeries[index]?.label || `P${index + 1}`, value: point };
    }

    if (point && typeof point === 'object') {
      return {
        // Backend returns 'date' (ISO string) — format to short month label
        label:
          point.date
            ? new Date(point.date).toLocaleDateString('en-US', { month: 'short' })
            : (point.label ?? point.month ?? point.name ?? defaultSeries[index]?.label ?? `P${index + 1}`),
        // Backend returns 'predicted_value'
        value: Number(
          point.predicted_value ?? point.value ?? point.y ?? point.count ?? point.amount ?? 0,
        ),
      };
    }

    return { label: defaultSeries[index]?.label || `P${index + 1}`, value: 0 };
  });
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="app-card p-5 animate-pulse">
          <div className="mb-5 h-4 w-40 animate-pulse rounded-full bg-white/10" />
          <div className="h-72 animate-pulse rounded-3xl bg-gradient-to-br from-white/5 via-white/10 to-white/5" />
        </div>
      ))}
    </div>
  );
}

// Stable style objects defined once at module scope — avoids new allocations per render
const AXIS_TICK = { fill: '#64748b', fontSize: 11, fontFamily: 'var(--font-ui)' };
const TOOLTIP_CONTENT_STYLE = {
  background: '#070c17',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '12px',
  fontFamily: 'var(--font-ui)',
};
const TOOLTIP_LABEL_STYLE = { color: '#94a3b8', fontWeight: 600 };
const DOT_STYLE = { r: 2.5, strokeWidth: 1.5, fill: '#070c17' };
const ACTIVE_DOT_STYLE = { r: 5, strokeWidth: 0 };
const CHART_MARGIN = { top: 8, right: 8, left: 0, bottom: 0 };

// Memoized — only re-renders when data/color/title props change
const ForecastChartCard = memo(function ForecastChartCard({ title, data, color }) {
  return (
    <section className="app-panel p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="type-label">PROJECTION</p>
          <h3 className="mt-1 text-xl font-semibold text-white">{title}</h3>
        </div>
        <div className="h-3 w-16 rounded-full opacity-80" style={{ backgroundColor: color }} />
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={CHART_MARGIN}>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={36} />
            <Tooltip contentStyle={TOOLTIP_CONTENT_STYLE} labelStyle={TOOLTIP_LABEL_STYLE} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2.5}
              dot={DOT_STYLE}
              activeDot={ACTIVE_DOT_STYLE}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
});

export default function Forecast() {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function fetchForecast() {
      setLoading(true);
      setError('');

      try {
        const response = await apiClient.get('/forecast');
        const data = response.data ?? {};
        console.log('[Forecast] raw API response:', JSON.stringify(data, null, 2));

        if (active) {
          setForecastData({
            // Backend keys: revenue_forecast, customer_growth_forecast, active_customers_forecast, churn_trend_forecast
            revenueForecast: normalizeSeries(
              data.revenue_forecast ?? data.revenueForecast ?? data.revenue ?? data[0],
            ),
            customerGrowth: normalizeSeries(
              data.customer_growth_forecast ?? data.customerGrowth ?? data.customer_growth ?? data.growth ?? data[1],
            ),
            activeCustomersTrend: normalizeSeries(
              data.active_customers_forecast ?? data.activeCustomersTrend ?? data.active_customers_trend ?? data.activeCustomers ?? data[2],
            ),
            churnTrend: normalizeSeries(
              data.churn_trend_forecast ?? data.churnTrend ?? data.churn_trend ?? data.churn ?? data[3],
            ),
          });
        }
      } catch (requestError) {
        if (active) {
          setError(requestError?.response?.data?.message || requestError?.message || 'Unable to load forecast data.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchForecast();

    return () => {
      active = false;
    };
  }, []);

  const cards = useMemo(
    () =>
      chartConfigs.map((config) => ({
        ...config,
        data: forecastData?.[config.key] ?? defaultSeries,
      })),
    [forecastData],
  );

  return (
    <section className="grid gap-6">
      <div className="app-panel p-6 sm:p-8">
        <p className="type-label text-cyan-300">Projections & Trends</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Predictive Cohort Projections</h2>
        <p className="mt-3 max-w-2xl text-sm font-light leading-6 text-slate-300 sm:text-base">
          Modeling 12-month projections for monthly recurring revenue, customer expansion rate, cumulative active user counts, and churn risk curves.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {cards.map((card) => (
            <ForecastChartCard key={card.key} title={card.title} data={card.data} color={card.color} />
          ))}
        </div>
      )}
    </section>
  );
}
