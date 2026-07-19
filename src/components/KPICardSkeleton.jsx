export default function KPICardSkeleton({ count = 3 }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <article key={index} className="app-panel p-6 animate-pulse">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="h-3 w-28 rounded-full bg-white/10" />
              <div className="mt-4 h-8 w-20 rounded-full bg-white/10" />
            </div>

            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/10" />
          </div>

          <div className="h-7 w-24 rounded-full bg-white/10" />
        </article>
      ))}
    </div>
  );
}