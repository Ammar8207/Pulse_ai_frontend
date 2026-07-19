import { BriefcaseBusiness, ChartColumnIncreasing, House, LogOut, ShieldAlert, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: House },
  { to: '/predict', label: 'Customer Prediction', icon: Sparkles },
  { to: '/forecast', label: 'Forecast', icon: ChartColumnIncreasing },
  { to: '/risk', label: 'Risk Analysis', icon: ShieldAlert },
  { to: '/insights', label: 'Business Insights', icon: BriefcaseBusiness },
];

export default function Sidebar({ open, onClose }) {
  return (
    <aside
      className={[
        'fixed inset-y-0 left-0 z-30 flex w-[216px] flex-col border-r border-white/[0.06] bg-[#070c17] px-4 py-4 transition-transform duration-300',
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ].join(' ')}
    >
      {/* Brand */}
      <div className="flex items-center justify-between pb-5">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[14px] font-bold uppercase tracking-[0.15em] leading-none text-white">Predictive</h1>
          <p className="mt-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] leading-none text-slate-500">
            Analysis Systems
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid h-7 w-7 place-items-center rounded-md text-slate-500 transition-colors duration-150 hover:bg-white/[0.05] hover:text-white md:hidden"
          aria-label="Close sidebar"
        >
          <span className="text-base leading-none">×</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2" aria-label="Main navigation">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            end={to === '/'}
            className={({ isActive }) =>
              [
                // Base — full width, contained, no overflow
                'group flex w-full items-center gap-2.5 rounded-lg py-2 pl-3 pr-3 text-[13.5px] leading-tight transition-colors duration-150',
                isActive
                  ? 'bg-[rgba(56,242,161,0.07)] text-white font-medium'
                  : 'text-slate-400 font-normal hover:bg-white/[0.04] hover:text-slate-200',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                {/* Thin left accent — themed emerald, not white */}
                <span
                  className={[
                    'block shrink-0 w-0.5 rounded-full transition-all duration-200',
                    isActive ? 'h-4 bg-emerald-400/60' : 'h-4 bg-transparent',
                  ].join(' ')}
                  aria-hidden="true"
                />

                <Icon
                  size={15}
                  strokeWidth={isActive ? 2 : 1.6}
                  className={[
                    'shrink-0 transition-opacity duration-150',
                    isActive ? 'text-emerald-300 opacity-90' : 'opacity-50 group-hover:opacity-75',
                  ].join(' ')}
                />

                {/* Label — fully visible, no clipping */}
                <span className="whitespace-nowrap">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User profile */}
      <div className="mt-auto">
        <div className="flex items-center gap-2 rounded-lg border border-white/[0.04] bg-white/[0.02] p-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
            AU
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-semibold leading-tight text-slate-200">Admin User</p>
            <p className="text-[10px] font-medium leading-tight text-slate-500 mt-0.5">Admin</p>
          </div>
          <button
            type="button"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-slate-500 transition-colors duration-150 hover:bg-white/[0.06] hover:text-slate-300"
            aria-label="Logout"
          >
            <LogOut size={14} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </aside>
  );
}