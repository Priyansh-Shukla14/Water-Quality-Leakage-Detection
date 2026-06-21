import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { useSensorData } from './hooks/useSensorData';
import Navbar from './components/layout/Navbar';
import DashboardLayout from './components/layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import LeakageDetection from './pages/LeakageDetection';
import WaterQuality from './pages/WaterQuality';
import Analytics from './pages/Analytics';

export default function App() {
  const { isDark, toggle } = useTheme();
  const { latestData, historyData, loading, error, isMock, refresh } = useSensorData();

  return (
    <Router>
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Navbar isDark={isDark} toggleTheme={toggle} />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardLayout isMock={isMock} />}>
            <Route
              index
              element={
                <Dashboard
                  data={latestData}
                  loading={loading}
                  isMock={isMock}
                  onRefresh={refresh}
                />
              }
            />
            <Route
              path="leakage"
              element={<LeakageDetection data={latestData} />}
            />
            <Route
              path="quality"
              element={<WaterQuality data={latestData} />}
            />
            <Route
              path="analytics"
              element={<Analytics historyData={historyData} />}
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
