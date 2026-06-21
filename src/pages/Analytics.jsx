import PhChart from '../charts/PhChart';
import TurbidityChart from '../charts/TurbidityChart';
import WaterLevelChart from '../charts/WaterLevelChart';
import { BarChart3, TrendingUp, Database } from 'lucide-react';

export default function Analytics({ historyData }) {
  const dataPoints = historyData?.length || 0;
  const latestPh = historyData?.[historyData.length - 1]?.ph;
  const latestTurb = historyData?.[historyData.length - 1]?.turbidity;
  const latestLevel = historyData?.[historyData.length - 1]?.waterLevel;

  // Calculate averages
  const avgPh = historyData?.length
    ? (historyData.reduce((s, d) => s + d.ph, 0) / historyData.length).toFixed(2)
    : '—';
  const avgTurb = historyData?.length
    ? (historyData.reduce((s, d) => s + d.turbidity, 0) / historyData.length).toFixed(1)
    : '—';
  const avgLevel = historyData?.length
    ? (historyData.reduce((s, d) => s + d.waterLevel, 0) / historyData.length).toFixed(1)
    : '—';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Analytics
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Historical trends and data analysis for all sensor parameters.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database size={16} color="#06b6d4" />
            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Data Points</span>
          </div>
          <p className="text-2xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
            {dataPoints}
          </p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} color="#06b6d4" />
            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Avg pH</span>
          </div>
          <p className="text-2xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
            {avgPh}
          </p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={16} color="#8b5cf6" />
            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Avg Turbidity</span>
          </div>
          <p className="text-2xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
            {avgTurb} <span className="text-xs font-normal">NTU</span>
          </p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} color="#14b8a6" />
            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Avg Water Level</span>
          </div>
          <p className="text-2xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
            {avgLevel}<span className="text-xs font-normal">%</span>
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PhChart data={historyData} />
        <TurbidityChart data={historyData} />
      </div>

      <WaterLevelChart data={historyData} />
    </div>
  );
}
