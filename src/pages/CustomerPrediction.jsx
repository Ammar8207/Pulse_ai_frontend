import { useState } from 'react';
import { Loader2, ShieldAlert, Sparkles } from 'lucide-react';
import apiClient from '../api/axios';

const initialFormState = {
  tenure: '',
  monthlyCharges: '',
  contractType: 'Month-to-month',
  internetService: 'Fiber optic',
  techSupport: 'No',
};

const internetServiceOptions = ['Fiber optic', 'DSL', 'No'];

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

  if (!Number.isFinite(numericValue)) {
    return '0.0%';
  }

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
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        tenure: Number(formData.tenure),
        monthlyCharges: Number(formData.monthlyCharges),
        contractType: formData.contractType,
        internetService: formData.internetService,
        techSupport: formData.techSupport,
      };

      const response = await apiClient.post('/predict-churn', payload);
      const data = response.data ?? {};

      const churnProbability = Number(
        data.churnProbability ?? data.churn_probability ?? data.probability ?? data.prediction ?? 0,
      );
      const confidenceScore = Number(
        data.confidenceScore ?? data.confidence_score ?? data.confidence ?? data.confidenceScorePercentage ?? 0,
      );
      const riskLevelValue = data.riskLevel ?? data.risk_level ?? getRiskLevel(churnProbability);
      const riskLevel = typeof riskLevelValue === 'string'
        ? riskLevelValue.charAt(0).toUpperCase() + riskLevelValue.slice(1).toLowerCase()
        : getRiskLevel(churnProbability);

      setResult({
        churnProbability,
        riskLevel,
        confidenceScore,
      });
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message || requestError?.message || 'Prediction request failed.',
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
          Input customer parameters below to run simulated modeling. Evaluates key indicators to determine risk distribution, model confidence, and retention paths.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <form
          onSubmit={handleSubmit}
          className="app-panel p-6 shadow-2xl"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="type-label normal-case tracking-[0.18em] text-slate-300">Tenure</span>
              <input
                type="number"
                name="tenure"
                value={formData.tenure}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 12"
                className="app-input focus:border-cyan-400/60 focus:ring-cyan-400/20"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="type-label normal-case tracking-[0.18em] text-slate-300">Monthly Charges</span>
              <input
                type="number"
                name="monthlyCharges"
                value={formData.monthlyCharges}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="e.g. 79.99"
                className="app-input focus:border-cyan-400/60 focus:ring-cyan-400/20"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="type-label normal-case tracking-[0.18em] text-slate-300">Contract Type</span>
              <select
                name="contractType"
                value={formData.contractType}
                onChange={handleChange}
                className="app-select focus:border-cyan-400/60 focus:ring-cyan-400/20"
              >
                <option className="bg-slate-900 text-white">Month-to-month</option>
                <option className="bg-slate-900 text-white">One year</option>
                <option className="bg-slate-900 text-white">Two year</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="type-label normal-case tracking-[0.18em] text-slate-300">Internet Service</span>
              <select
                name="internetService"
                value={formData.internetService}
                onChange={handleChange}
                className="app-select focus:border-cyan-400/60 focus:ring-cyan-400/20"
              >
                {internetServiceOptions.map((option) => (
                  <option key={option} className="bg-slate-900 text-white">
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 sm:col-span-2">
              <span className="type-label normal-case tracking-[0.18em] text-slate-300">Tech Support</span>
              <div className="grid grid-cols-2 gap-4">
                {['Yes', 'No'].map((option) => (
                  <label
                    key={option}
                    className={[
                      'flex cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-sm font-light transition',
                      formData.techSupport === option
                        ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10',
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      name="techSupport"
                      value={option}
                      checked={formData.techSupport === option}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    {option}
                  </label>
                ))}
              </div>
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
                <p className="type-value-strong mt-2 text-3xl">
                  {formatPercent(result.churnProbability)}
                </p>
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
                <p className="type-value-strong mt-2 text-3xl">
                  {formatPercent(result.confidenceScore)}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] p-6 text-sm text-slate-400">
              Submit contract telemetry and execute analysis to generate predictive risk scoring.
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
