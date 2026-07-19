import { memo, useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

// Overlay extracted to prevent re-rendering Layout when clicked
const MobileOverlay = memo(function MobileOverlay({ open, onClose }) {
  return (
    <div
      className={[
        'fixed inset-0 z-20 bg-slate-950/55 transition-opacity duration-300 md:hidden',
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      ].join(' ')}
      onClick={onClose}
      aria-hidden="true"
    />
  );
});

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on navigation
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Stable callbacks — prevent child re-renders on every Layout render
  const handleClose = useCallback(() => setSidebarOpen(false), []);
  const handleMenuClick = useCallback(() => setSidebarOpen((c) => !c), []);

  return (
    <div className="app-shell">
      {/* Aurora orbs — fixed decorative, no interaction */}
      <div className="aurora-orb aurora-orb--one" aria-hidden="true" />
      <div className="aurora-orb aurora-orb--two" aria-hidden="true" />
      <div className="aurora-orb aurora-orb--three" aria-hidden="true" />

      <MobileOverlay open={sidebarOpen} onClose={handleClose} />

      <div className="mx-auto min-h-screen w-full max-w-7xl md:pl-[216px]">
        <Sidebar open={sidebarOpen} onClose={handleClose} />
        <main className="relative z-10 min-h-screen px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
          <Navbar onMenuClick={handleMenuClick} />
          <div className="pt-4 sm:pt-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
