import { useState } from 'react';
import { Loader2, ShieldAlert, Sparkles } from 'lucide-react';
import apiClient from '../api/axios';

// Countries from the backend's expected dataset (UK retail)
const countryOptions = [
  'United Kingdom',
  'Germany',
  'France',
  'Spain',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'Portugal',
  'Australia',
  'EIRE',
  'Other',
];

const initialFormState = {
  total_transactions: '',
  total_quantity: '',
  country: 'United Kingdom',
  total_spend: '',
  days_since_last_purchase: '',
  customer_lifetime_days: '',
};

function getRiskLevel(probability) {
  if (probability >= 0.7) return 'High';
  if (probability >= 0.4) return 'Medium';
  return 'Low';
}

function getRiskStyles(riskLevel) {
  switch (riskLevel) {
    case 'High':
      return 'bg-rose-500/15 text-rose-300 border-rose-400/30';
    case 'Medium':
      return 'bg-amber-500/15 text-amber-300 border-amber-400/30';
    default:
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30';
  }
}

function formatPercent(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return '0.0%';
  const normalizedValue = numericValue > 1 ? numericValue : numericValue * 100;
  return `${normalizedValue.toFixed(1)}%`;
}

export default function CustomerPrediction() {
  const [formData, setFormData] = useState(initialFormState);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        total_transactions: Number(formData.total_transactions),
        total_quantity: Number(formData.total_quantity),
        country: formData.country,
        total_spend: Number(formData.total_spend),
        days_since_last_purchase: Number(formData.days_since_last_purchase),
        customer_lifetime_days: Number(formData.customer_lifetime_days),
      };

      const response = await apiClient.post('/predict-churn', payload);
      const data = response.data ?? {};

      const churnProbability = Number(
        data.churn_probability ?? data.churnProbability ?? data.probability ?? data.prediction ?? 0,
      );
      const confidenceScore = Number(
        data.confidence_score ?? data.confidenceScore ?? data.confidence ?? 0,
      );
      const riskLevelValue = data.risk_level ?? data.riskLevel ?? getRiskLevel(churnProbability);
      const riskLevel =
        typeof riskLevelValue === 'string'
          ? riskLevelValue.charAt(0).toUpperCase() + riskLevelValue.slice(1).toLowerCase()
          : getRiskLevel(churnProbability);

      // Top SHAP factors from backend (optional)
      const topFactors = Array.isArray(data.top_factors) ? data.top_factors : [];
      const explanationSummary = data.explanation_summary ?? null;

      setResult({ churnProbability, riskLevel, confidenceScore, topFactors, explanationSummary });
    } catch (requestError) {
      setError(
        requestError?.response?.data?.detail?.[0]?.msg ||
        requestError?.response?.data?.message ||
        requestError?.message ||
        'Prediction request failed.',
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid gap-6">
      <div className="app-panel p-6 sm:p-8">
        <p className="type-label text-cyan-300">Predictive Modeling</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Account Risk Simulation</h2>
        <p className="mt-3 max-w-2xl text-sm font-light leading-6 text-slate-300 sm:text-base">
          Input customer purchase history below to run churn prediction. Evaluates transaction behavior to determine risk
          level, model confidence, and key contributing factors.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={handleSubmit} className="app-panel p-6 shadow-2xl">
          <div className="grid gap-4 sm:grid-cols-2">

            {/* Total Transactions */}
            <label className="grid gap-2">
              <span className="type-label normal-case tracking-[0.18em] text-slate-300">Total Transactions</span>
              <input
                type="number"
                name="total_transactions"
                value={formData.total_transactions}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 12"
                className="app-input focus:border-cyan-400/60 focus:ring-cyan-400/20"
                required
              />
            </label>

            {/* Total Quantity */}
            <label className="grid gap-2">
              <span className="type-label normal-case tracking-[0.18em] text-slate-300">Total Quantity</span>
              <input
                type="number"
                name="total_quantity"
                value={formData.total_quantity}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 340"
                className="app-input focus:border-cyan-400/60 focus:ring-cyan-400/20"
                required
              />
            </label>

            {/* Total Spend */}
            <label className="grid gap-2">
              <span className="type-label normal-case tracking-[0.18em] text-slate-300">Total Spend ($)</span>
              <input
                type="number"
                name="total_spend"
                value={formData.total_spend}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="e.g. 1580.50"
                className="app-input focus:border-cyan-400/60 focus:ring-cyan-400/20"
                required
              />
            </label>

            {/* Country */}
            <label className="grid gap-2">
              <span className="type-label normal-case tracking-[0.18em] text-slate-300">Country</span>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="app-select focus:border-cyan-400/60 focus:ring-cyan-400/20"
              >
                {countryOptions.map((c) => (
                  <option key={c} className="bg-slate-900 text-white">{c}</option>
                ))}
              </select>
            </label>

            {/* Days Since Last Purchase */}
            <label className="grid gap-2">
              <span className="type-label normal-case tracking-[0.18em] text-slate-300">Days Since Last Purchase</span>
              <input
                type="number"
                name="days_since_last_purchase"
                value={formData.days_since_last_purchase}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 45"
                className="app-input focus:border-cyan-400/60 focus:ring-cyan-400/20"
                required
              />
            </label>

            {/* Customer Lifetime Days */}
            <label className="grid gap-2">
              <span className="type-label normal-case tracking-[0.18em] text-slate-300">Customer Lifetime (days)</span>
              <input
                type="number"
                name="customer_lifetime_days"
                value={formData.customer_lifetime_days}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 365"
                className="app-input focus:border-cyan-400/60 focus:ring-cyan-400/20"
                required
              />
            </label>

          </div>

          {error ? (
            <p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? 'Evaluating...' : 'Evaluate Account Risk'}
          </button>
        </form>

        <aside className="app-panel p-6 shadow-2xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-400/15 text-cyan-200">
              <ShieldAlert size={20} />
            </div>
            <div>
              <p className="type-label">Analysis</p>
              <h3 className="text-xl font-semibold text-white">Risk Evaluation Summary</h3>
            </div>
          </div>

          {result ? (
            <div className="grid gap-4">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="type-label">Churn Probability</p>
                <p className="type-value-strong mt-2 text-3xl">{formatPercent(result.churnProbability)}</p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="type-label">Risk Category</p>
                <span
                  className={[
                    'mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-semibold',
                    getRiskStyles(result.riskLevel),
                  ].join(' ')}
                >
                  {result.riskLevel}
                </span>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="type-label">Model Confidence</p>
                <p className="type-value-strong mt-2 text-3xl">{formatPercent(result.confidenceScore)}</p>
              </div>

              {result.explanationSummary ? (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="type-label">Model Explanation</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{result.explanationSummary}</p>
                </div>
              ) : null}

              {result.topFactors.length > 0 ? (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="type-label mb-3">Top Contributing Factors</p>
                  <div className="grid gap-2">
                    {result.topFactors.map((f) => (
                      <div key={f.feature_name} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{f.feature_name}</span>
                        <span className={f.impact > 0 ? 'text-rose-300' : 'text-emerald-300'}>
                          {f.impact > 0 ? '+' : ''}{f.impact.toFixed(3)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] p-6 text-sm text-slate-400">
              Submit customer purchase history to generate a predictive churn risk score.
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
