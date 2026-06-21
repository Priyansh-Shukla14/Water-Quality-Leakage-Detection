import { AlertTriangle, CheckCircle, Clock, Droplets, TrendingDown } from 'lucide-react';
import { formatTimestamp } from '../utils/helpers';
import { mockLeakageEvents } from '../utils/mockData';

export default function LeakageDetection({ data }) {
  const leakageDetected = data?.leakageDetected;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Leakage Detection
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Monitor water tank integrity and detect abnormal water level drops.
        </p>
      </div>

      {/* Current Status Banner */}
      <div
        className="rounded-2xl p-6 animate-fade-in-up"
        style={{
          background: leakageDetected
            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))'
            : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
          border: `1px solid ${leakageDetected ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: leakageDetected
                ? 'rgba(239, 68, 68, 0.15)'
                : 'rgba(16, 185, 129, 0.15)',
            }}
          >
            {leakageDetected ? (
              <AlertTriangle size={32} color="#ef4444" />
            ) : (
              <CheckCircle size={32} color="#10b981" />
            )}
          </div>
          <div>
            <h2
              className="text-xl font-bold"
              style={{ color: leakageDetected ? '#ef4444' : '#10b981' }}
            >
              {leakageDetected ? '⚠️ Leakage Detected!' : '✅ No Leakage Detected'}
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {leakageDetected
                ? `Water level is critically low at ${data?.waterLevel?.toFixed(1)}%. Immediate action required.`
                : `Water level is stable at ${data?.waterLevel?.toFixed(1)}%. System operating normally.`}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Clock size={12} color="var(--text-tertiary)" />
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {formatTimestamp(data?.timestamp)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert notification if leakage */}
      {leakageDetected && (
        <div className="leakage-banner flex items-center gap-3 animate-fade-in-up">
          <AlertTriangle size={22} color="white" />
          <div>
            <p className="font-bold">Warning: Abnormal Water Level Drop</p>
            <p className="text-sm opacity-90">
              Buzzer and relay have been activated. Check for physical leaks in the tank.
            </p>
          </div>
        </div>
      )}

      {/* Current readings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-3">
            <Droplets size={20} color="#06b6d4" />
            <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
              Current Level
            </span>
          </div>
          <p className="text-3xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
            {data?.waterLevel?.toFixed(1)}
            <span className="text-sm font-normal ml-1" style={{ color: 'var(--text-tertiary)' }}>%</span>
          </p>
          <div className="mt-3 progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${data?.waterLevel || 0}%`,
                background: leakageDetected
                  ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                  : 'linear-gradient(90deg, #06b6d4, #14b8a6)',
              }}
            />
          </div>
        </div>

        <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-3">
            <TrendingDown size={20} color={leakageDetected ? '#ef4444' : '#10b981'} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
              Detection Threshold
            </span>
          </div>
          <p className="text-3xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
            15
            <span className="text-sm font-normal ml-1" style={{ color: 'var(--text-tertiary)' }}>% drop</span>
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
            Alert triggers when level drops &gt;15% per cycle
          </p>
        </div>

        <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle size={20} color="#f59e0b" />
            <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
              Critical Low
            </span>
          </div>
          <p className="text-3xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
            10
            <span className="text-sm font-normal ml-1" style={{ color: 'var(--text-tertiary)' }}>%</span>
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
            Emergency alert below 10% water level
          </p>
        </div>
      </div>

      {/* Leakage Event History */}
      <div className="glass-card p-6 animate-fade-in-up">
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Recent Leakage Events
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th className="text-left py-3 px-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                  Timestamp
                </th>
                <th className="text-left py-3 px-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                  Level Before
                </th>
                <th className="text-left py-3 px-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                  Level After
                </th>
                <th className="text-left py-3 px-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                  Drop
                </th>
                <th className="text-left py-3 px-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                  Duration
                </th>
                <th className="text-left py-3 px-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {mockLeakageEvents.map((event) => (
                <tr
                  key={event.id}
                  style={{ borderBottom: '1px solid var(--border-color)' }}
                >
                  <td className="py-3 px-2 font-mono text-xs" style={{ color: 'var(--text-primary)' }}>
                    {formatTimestamp(event.timestamp)}
                  </td>
                  <td className="py-3 px-2" style={{ color: 'var(--text-primary)' }}>
                    {event.waterLevelBefore}%
                  </td>
                  <td className="py-3 px-2" style={{ color: 'var(--text-primary)' }}>
                    {event.waterLevelAfter}%
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                    >
                      -{event.drop}%
                    </span>
                  </td>
                  <td className="py-3 px-2" style={{ color: 'var(--text-secondary)' }}>
                    {event.duration}
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: event.resolved ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: event.resolved ? '#10b981' : '#ef4444',
                      }}
                    >
                      {event.resolved ? 'Resolved' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
