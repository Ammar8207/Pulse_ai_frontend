import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Lazy-load all page-level components for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CustomerPrediction = lazy(() => import('./pages/CustomerPrediction'));
const Forecast = lazy(() => import('./pages/Forecast'));
const RiskAnalysis = lazy(() => import('./pages/RiskAnalysis'));
const BusinessInsights = lazy(() => import('./pages/BusinessInsights'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Minimal spinner — avoids layout shift, no heavy animations
function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-emerald-400" />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="predict"
          element={
            <Suspense fallback={<PageLoader />}>
              <CustomerPrediction />
            </Suspense>
          }
        />
        <Route
          path="forecast"
          element={
            <Suspense fallback={<PageLoader />}>
              <Forecast />
            </Suspense>
          }
        />
        <Route
          path="risk"
          element={
            <Suspense fallback={<PageLoader />}>
              <RiskAnalysis />
            </Suspense>
          }
        />
        <Route
          path="insights"
          element={
            <Suspense fallback={<PageLoader />}>
              <BusinessInsights />
            </Suspense>
          }
        />
        <Route path="dashboard" element={<Navigate to="/" replace />} />
        <Route
          path="*"
          element={
            <Suspense fallback={<PageLoader />}>
              <NotFound />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
