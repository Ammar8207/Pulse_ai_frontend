const overviewItems = [
  { title: 'Contract Value (ARR)', value: '$128k', note: '+18% MoM growth' },
  { title: 'Active Accounts', value: '5.2k', note: '+2.4% vs. trailing 7 days' },
  { title: 'Net Revenue Retention', value: '92%', note: 'Within target threshold' },
  { title: 'Operational Risk', value: 'Low', note: '0 critical escalations active' },
];

export default function Dashboard() {
  return (
    <section className="grid gap-6">
      <div className="app-panel p-6 sm:p-8">
        <div className="max-w-3xl">
          <p className="type-label text-cyan-300">Overview</p>
          <h2 className="mt-4 app-heading-title">Account Health & Revenue Intelligence</h2>
          <p className="mt-4 app-heading-copy">
            Monitor real-time customer health, track monthly retention metrics, forecast expansion revenue, and surface predictive risk signals.
          </p>
        </div>

        {/* Unified Inline Metrics Row */}
        <div className="mt-8 border-t border-white/[0.06] pt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {overviewItems.map((item, index) => (
            <div key={item.title} className={["flex flex-col gap-1", index > 0 ? "lg:border-l lg:border-white/[0.06] lg:pl-6" : ""].join(" ")}>
              <p className="type-label text-slate-500">{item.title}</p>
              <h3 className="text-2xl font-bold tracking-tight text-white mt-1">{item.value}</h3>
              <p className="text-[12px] font-normal text-slate-400 mt-1">{item.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}