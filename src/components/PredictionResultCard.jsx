import { LabelList, PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';

function normalizePercent(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return numericValue > 1 ? numericValue : numericValue * 100;
}

function getRiskTheme(riskLevel) {
  const normalizedRisk = String(riskLevel || '').trim().toLowerCase();

  if (normalizedRisk === 'high') {
    return {
      card: 'border-rose-400/30 bg-rose-500/10',
      accent: 'text-rose-300',
      track: 'text-rose-400/20',
      ring: 'stroke-rose-400',
    };
  }

  if (normalizedRisk === 'medium') {
    return {
      card: 'border-amber-400/30 bg-amber-500/10',
      accent: 'text-amber-300',
      track: 'text-amber-400/20',
      ring: 'stroke-amber-400',
    };
  }

  return {
    card: 'border-emerald-400/30 bg-emerald-500/10',
    accent: 'text-emerald-300',
    track: 'text-emerald-400/20',
    ring: 'stroke-emerald-400',
  };
}

export default function PredictionResultCard({ churn_probability, risk_level, confidence_score }) {
  const probabilityPercent = normalizePercent(churn_probability);
  const confidencePercent = normalizePercent(confidence_score);
  const theme = getRiskTheme(risk_level);

  const chartData = [
    {
      name: 'Churn Probability',
      value: probabilityPercent,
      fill: 'currentColor',
    },
  ];

  return (
    <article
      className={[
        'rounded-[1.8rem] border p-6 shadow-[0_20px_70px_rgba(0,0,0,0.24)]',
        theme.card,
      ].join(' ')}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="type-label text-slate-300">Prediction Result</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Churn Summary</h3>
        </div>

        <div className={['app-badge', theme.accent].join(' ')}>
          {String(risk_level || 'Low')}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
        <div className="relative mx-auto aspect-square w-full max-w-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="78%"
              outerRadius="100%"
              barSize={18}
              data={chartData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" cornerRadius={999} background clockWise />
              <LabelList
                dataKey="value"
                position="center"
                content={() => null}
              />
            </RadialBarChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div>
                <p className="type-label">Churn Probability</p>
                <p className="type-value-strong mt-2 text-4xl">{probabilityPercent.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="type-label">Risk Level</p>
            <p className={['type-value-strong mt-2 text-2xl', theme.accent].join(' ')}>{String(risk_level || 'Low')}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="type-label">Confidence Score</p>
            <p className="type-value-strong mt-2 text-2xl">{confidencePercent.toFixed(1)}%</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="type-label">Status</p>
            <p className={['mt-2 text-sm font-light', theme.accent].join(' ')}>
              {String(risk_level || 'Low')} risk monitoring active
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}