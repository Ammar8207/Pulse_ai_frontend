import { memo } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

// Memoized — only re-renders when props change
export default memo(function KPICard({ title, value, change, icon: Icon }) {
  const isPositive = Number(change) >= 0;
  const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <article className="app-panel p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="type-label">{title}</p>
          <h3 className="type-value-strong mt-2 text-3xl">{value}</h3>
        </div>

        {Icon ? (
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[rgba(86,242,168,0.14)] bg-[rgba(56,242,161,0.08)] text-[#c8ffe0]">
            <Icon size={22} aria-hidden="true" />
          </div>
        ) : null}
      </div>

      <div
        className={[
          'app-pill type-value text-xs',
          isPositive ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300' : 'border-rose-400/20 bg-rose-400/10 text-rose-300',
        ].join(' ')}
      >
        <ChangeIcon size={16} aria-hidden="true" />
        <span>
          {isPositive ? '+' : ''}
          {Math.abs(Number(change))}%
        </span>
      </div>
    </article>
  );
});