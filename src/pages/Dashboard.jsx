// const overviewItems = [
//   { title: 'Contract Value (ARR)', value: '$128k', note: '+18% MoM growth' },
//   { title: 'Active Accounts', value: '5.2k', note: '+2.4% vs. trailing 7 days' },
//   { title: 'Net Revenue Retention', value: '92%', note: 'Within target threshold' },
//   { title: 'Operational Risk', value: 'Low', note: '0 critical escalations active' },
// ];

// export default function Dashboard() {
//   return (
//     <section className="grid gap-6">
//       <div className="app-panel p-6 sm:p-8">
//         <div className="max-w-3xl">
//           <p className="type-label text-cyan-300">Overview</p>
//           <h2 className="mt-4 app-heading-title">Account Health & Revenue Intelligence</h2>
//           <p className="mt-4 app-heading-copy">
//             Monitor real-time customer health, track monthly retention metrics, forecast expansion revenue, and surface predictive risk signals.
//           </p>
//         </div>

//         {/* Unified Inline Metrics Row */}
//         <div className="mt-8 border-t border-white/[0.06] pt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//           {overviewItems.map((item, index) => (
//             <div key={item.title} className={["flex flex-col gap-1", index > 0 ? "lg:border-l lg:border-white/[0.06] lg:pl-6" : ""].join(" ")}>
//               <p className="type-label text-slate-500">{item.title}</p>
//               <h3 className="text-2xl font-bold tracking-tight text-white mt-1">{item.value}</h3>
//               <p className="text-[12px] font-normal text-slate-400 mt-1">{item.note}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
import { useEffect, useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, UserRoundCheck, ShieldCheck } from 'lucide-react';
import apiClient from '../api/axios';

function LoadingSkeleton() {
  return (
    <div className="mt-8 border-t border-white/[0.06] pt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2 animate-pulse">
          <div className="h-3 w-24 rounded-full bg-white/10" />
          <div className="h-7 w-20 rounded-full bg-white/10" />
          <div className="h-3 w-32 rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function fetchSummary() {
      setLoading(true);
      setError('');

      try {
        // Backend: GET /dashboard-summary
        const response = await apiClient.get('/dashboard-summary');
        if (active) {
          setSummary(response.data ?? {});
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError?.response?.data?.detail ||
            requestError?.message ||
            'Unable to load dashboard summary.',
          );
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

  // Backend returns flat fields: total_customers, active_customers, churn_rate, total_revenue, forecast_summary
  const overviewItems = useMemo(() => {
    if (!summary) return [];

    return [
      {
        title: 'Total Revenue',
        value:
          summary.total_revenue != null
            ? `$${Number(summary.total_revenue).toLocaleString()}`
            : '—',
        note: summary.forecast_summary || 'Based on current customer data',
        icon: TrendingUp,
      },
      {
        title: 'Active Customers',
        value: summary.active_customers != null ? Number(summary.active_customers).toLocaleString() : '—',
        note: `of ${summary.total_customers != null ? Number(summary.total_customers).toLocaleString() : '—'} total customers`,
        icon: UserRoundCheck,
      },
      {
        title: 'Churn Rate',
        value: summary.churn_rate != null ? `${Number(summary.churn_rate).toFixed(1)}%` : '—',
        note: 'Share of customers who have churned',
        icon: TrendingDown,
      },
      {
        title: 'Total Customers',
        value: summary.total_customers != null ? Number(summary.total_customers).toLocaleString() : '—',
        note: 'All customers in the current dataset',
        icon: ShieldCheck,
      },
    ];
  }, [summary]);

  return (
    <section className="grid gap-6">
      <div className="app-panel p-6 sm:p-8">
        <div className="max-w-3xl">
          <p className="type-label text-cyan-300">Overview</p>
          <h2 className="mt-4 app-heading-title">Account Health & Revenue Intelligence</h2>
          <p className="mt-4 app-heading-copy">
            Monitor real-time customer health, track churn, and surface predictive risk signals
            based on live model output.
          </p>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
            {error}
          </div>
        ) : loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="mt-8 border-t border-white/[0.06] pt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {overviewItems.map((item, index) => (
              <div
                key={item.title}
                className={[
                  'flex flex-col gap-1',
                  index > 0 ? 'lg:border-l lg:border-white/[0.06] lg:pl-6' : '',
                ].join(' ')}
              >
                <p className="type-label text-slate-500">{item.title}</p>
                <h3 className="text-2xl font-bold tracking-tight text-white mt-1">{item.value}</h3>
                <p className="text-[12px] font-normal text-slate-400 mt-1">{item.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}