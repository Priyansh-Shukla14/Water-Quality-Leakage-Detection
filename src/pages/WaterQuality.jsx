import { FlaskConical, Droplets, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { PH_THRESHOLDS, TURBIDITY_THRESHOLDS, QUALITY_COLORS } from '../utils/constants';

const qualityLevels = [
  {
    status: 'Good',
    icon: CheckCircle,
    criteria: [
      `pH: ${PH_THRESHOLDS.GOOD_MIN} – ${PH_THRESHOLDS.GOOD_MAX}`,
      `Turbidity: < ${TURBIDITY_THRESHOLDS.GOOD_MAX} NTU`,
    ],
    description: 'Water is safe for drinking and general usage. All parameters within WHO recommended limits.',
  },
  {
    status: 'Moderate',
    icon: AlertTriangle,
    criteria: [
      `pH: ${PH_THRESHOLDS.MODERATE_MIN} – ${PH_THRESHOLDS.MODERATE_MAX}`,
      `Turbidity: ${TURBIDITY_THRESHOLDS.GOOD_MAX} – ${TURBIDITY_THRESHOLDS.MODERATE_MAX} NTU`,
    ],
    description: 'Water quality is acceptable but approaching limits. Close monitoring is recommended.',
  },
  {
    status: 'Poor',
    icon: XCircle,
    criteria: [
      `pH: < ${PH_THRESHOLDS.MODERATE_MIN} or > ${PH_THRESHOLDS.MODERATE_MAX}`,
      `Turbidity: > ${TURBIDITY_THRESHOLDS.MODERATE_MAX} NTU`,
    ],
    description: 'Water quality is poor. Not suitable for consumption. Immediate treatment required.',
  },
];

export default function WaterQuality({ data }) {
  const currentQuality = data?.quality || 'Good';
  const currentColors = QUALITY_COLORS[currentQuality];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Water Quality Analysis
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Detailed water quality assessment based on pH and turbidity readings.
        </p>
      </div>

      {/* Current Quality Summary */}
      <div
        className="rounded-2xl p-6 animate-fade-in-up"
        style={{
          background: currentColors.bg,
          border: `1px solid ${currentColors.border}30`,
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center"
            style={{ background: currentColors.gradient }}
          >
            <Droplets size={36} color="white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
              Current Water Quality
            </p>
            <h2
              className="text-3xl font-extrabold mt-1"
              style={{ color: currentColors.text }}
            >
              {currentQuality}
            </h2>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              Based on real-time pH ({data?.ph?.toFixed(2)}) and turbidity ({data?.turbidity?.toFixed(1)} NTU) readings.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div
              className="rounded-xl p-4 text-center"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              <FlaskConical size={18} color="#06b6d4" className="mx-auto mb-1" />
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>pH</p>
              <p className="text-xl font-bold font-mono mt-0.5" style={{ color: 'var(--text-primary)' }}>
                {data?.ph?.toFixed(2) || '—'}
              </p>
            </div>
            <div
              className="rounded-xl p-4 text-center"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              <Droplets size={18} color="#8b5cf6" className="mx-auto mb-1" />
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Turbidity</p>
              <p className="text-xl font-bold font-mono mt-0.5" style={{ color: 'var(--text-primary)' }}>
                {data?.turbidity?.toFixed(1) || '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quality Levels Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
        {qualityLevels.map(({ status, icon: Icon, criteria, description }) => {
          const colors = QUALITY_COLORS[status];
          const isActive = currentQuality === status;

          return (
            <div
              key={status}
              className="glass-card p-5 transition-all duration-300"
              style={{
                borderTop: `4px solid ${colors.border}`,
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isActive ? `0 0 25px ${colors.border}20` : undefined,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: colors.bg }}
                >
                  <Icon size={20} color={colors.text} />
                </div>
                <div>
                  <h3 className="font-bold text-base" style={{ color: colors.text }}>
                    {status}
                  </h3>
                  {isActive && (
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${colors.border}18`, color: colors.text }}
                    >
                      Current
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                {description}
              </p>
              <div className="space-y-1.5">
                {criteria.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: colors.border }}
                    />
                    <span className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
                      {c}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* pH Scale visualization */}
      <div className="glass-card p-6 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-4">
          <Info size={18} color="#06b6d4" />
          <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>pH Scale Reference</h3>
        </div>
        <div className="relative h-10 rounded-full overflow-hidden mb-2">
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, #ef4444, #f59e0b, #eab308, #10b981, #10b981, #eab308, #f59e0b, #ef4444)',
            }}
          />
          {/* Current pH marker */}
          <div
            className="absolute top-0 bottom-0 w-1 rounded-full"
            style={{
              left: `${((data?.ph || 7) / 14) * 100}%`,
              background: 'white',
              boxShadow: '0 0 8px rgba(0,0,0,0.4)',
            }}
          />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--text-tertiary)' }}>
          <span>0 (Acidic)</span>
          <span>7 (Neutral)</span>
          <span>14 (Basic)</span>
        </div>
        <p className="text-center text-sm mt-3 font-mono" style={{ color: 'var(--text-primary)' }}>
          Current pH: <strong>{data?.ph?.toFixed(2) || '—'}</strong>
        </p>
      </div>
    </div>
  );
}
