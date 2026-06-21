import {
  FlaskConical,
  Eye,
  Waves,
  Thermometer,
  RefreshCw,
  Clock,
  Zap,
  Volume2,
} from 'lucide-react';
import SensorCard from '../components/dashboard/SensorCard';
import StatusIndicator from '../components/dashboard/StatusIndicator';
import ProgressBar from '../components/dashboard/ProgressBar';
import LeakageAlert from '../components/dashboard/LeakageAlert';
import WaterQualityCard from '../components/dashboard/WaterQualityCard';
import { formatTimestamp, getPhColor, getTurbidityColor, getWaterLevelColor } from '../utils/helpers';

export default function Dashboard({ data, loading, isMock, onRefresh }) {
  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <RefreshCw size={40} color="#06b6d4" className="mx-auto mb-4 animate-spin" />
          <p style={{ color: 'var(--text-secondary)' }}>Loading sensor data...</p>
        </div>
      </div>
    );
  }

  const phColor = getPhColor(data?.ph);
  const turbColor = getTurbidityColor(data?.turbidity);
  const levelColor = getWaterLevelColor(data?.waterLevel);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Dashboard Overview
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Clock size={14} color="var(--text-tertiary)" />
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Last updated: {formatTimestamp(data?.timestamp)}
            </p>
            {isMock && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}
              >
                Demo Mode
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
          style={{
            background: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
          }}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Leakage Alert */}
      <LeakageAlert
        isDetected={data?.leakageDetected}
        timestamp={data?.timestamp}
        waterLevel={data?.waterLevel}
      />

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SensorCard
          icon={FlaskConical}
          title="pH Level"
          value={data?.ph?.toFixed(2)}
          color={phColor}
          subtitle="Optimal: 6.5 – 8.5"
        >
          <ProgressBar
            value={((data?.ph || 7) / 14) * 100}
            color={phColor}
            showPercentage={false}
          />
        </SensorCard>

        <SensorCard
          icon={Eye}
          title="Turbidity"
          value={data?.turbidity?.toFixed(1)}
          unit="NTU"
          color={turbColor}
          subtitle="Good: < 5 NTU"
        >
          <ProgressBar
            value={Math.min((data?.turbidity || 0) / 50 * 100, 100)}
            color={turbColor}
            showPercentage={false}
          />
        </SensorCard>

        <SensorCard
          icon={Waves}
          title="Water Level"
          value={data?.waterLevel?.toFixed(1)}
          unit="%"
          color={levelColor}
          subtitle="Normal: > 30%"
        >
          <ProgressBar
            value={data?.waterLevel}
            color={levelColor}
            showPercentage={false}
          />
        </SensorCard>

        <SensorCard
          icon={Thermometer}
          title="Temperature"
          value={data?.temperature?.toFixed(1)}
          unit="°C"
          color="#f59e0b"
          subtitle="Ambient reading"
        />
      </div>

      {/* Water Quality + Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <WaterQualityCard
            quality={data?.quality}
            ph={data?.ph}
            turbidity={data?.turbidity}
          />
        </div>

        <div className="space-y-3">
          <StatusIndicator
            label="Relay Module"
            isActive={data?.relayStatus}
            activeColor="#06b6d4"
          />
          <StatusIndicator
            label="Buzzer"
            isActive={data?.buzzerStatus}
            activeColor="#f59e0b"
            activeText="ACTIVE"
            inactiveText="SILENT"
          />
          <StatusIndicator
            label="Leakage"
            isActive={data?.leakageDetected}
            activeColor="#ef4444"
            activeText="DETECTED"
            inactiveText="NORMAL"
          />
          <StatusIndicator
            label="Water Quality"
            isActive={data?.quality === 'Good'}
            activeColor="#10b981"
            activeText={data?.quality || 'N/A'}
            inactiveText={data?.quality || 'N/A'}
          />
        </div>
      </div>
    </div>
  );
}
