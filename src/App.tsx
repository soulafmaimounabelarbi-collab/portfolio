import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Portfolio3D } from './components/Portfolio3D';
import { Dashboard } from './components/dashboard/Dashboard';
import { recordVisit } from './hooks/usePortfolioStore';

// Tracks visits on the public portfolio pages only (not the dashboard)
function VisitTracker() {
  const location = useLocation();
  useEffect(() => {
    if (!location.pathname.startsWith('/dashboard')) {
      recordVisit();
    }
  }, [location.pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <VisitTracker />
      <Routes>
        <Route path="/" element={<Portfolio3D />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </>
  );
}
