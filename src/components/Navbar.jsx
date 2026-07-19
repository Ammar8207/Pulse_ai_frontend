import { memo, useState, useEffect, useCallback } from 'react';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': 'Dashboard',
  '/predict': 'Customer Prediction',
  '/forecast': 'Forecast',
  '/risk': 'Risk Analysis',
  '/insights': 'Business Insights',
  '/dashboard': 'Dashboard',
};

// Memoized — only re-renders when onMenuClick identity or pathname changes
export default memo(function Navbar({ onMenuClick }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Passive scroll listener — GPU-friendly, no layout blocking
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-4 z-10 flex items-center justify-between rounded-3xl border border-white/10 bg-[rgba(9,14,32,0.45)] px-4 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.2)] sm:px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-100 transition duration-200 hover:-translate-y-0.5 hover:bg-white/[0.09] md:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>

        <div
          className={[
            'transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden',
            isScrolled
              ? 'pointer-events-none max-w-0 -translate-x-4 opacity-0'
              : 'max-w-[400px] translate-x-0 opacity-100',
          ].join(' ')}
        >
          <p className="type-label text-cyan-300">Page</p>
          <h2 className="text-lg font-semibold tracking-tight text-white sm:text-2xl">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-white">Admin User</p>
          <p className="type-label normal-case tracking-[0.18em]">Active session</p>
        </div>
        <div
          className="grid h-11 w-11 place-items-center rounded-full border border-[rgba(86,242,168,0.14)] bg-gradient-to-br from-[#38f2a1]/30 via-[#65f3bc]/20 to-[#d8ffe9]/20 text-sm font-semibold text-white"
          aria-label="User avatar placeholder"
        >
          AU
        </div>
      </div>
    </header>
  );
});