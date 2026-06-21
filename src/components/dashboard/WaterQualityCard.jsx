import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { QUALITY_COLORS } from '../../utils/constants';

const icons = {
  Good: CheckCircle,
  Moderate: AlertTriangle,
  Poor: XCircle,
};

const descriptions = {
  Good: 'Water parameters are within safe limits. Suitable for usage.',
  Moderate: 'Some parameters are slightly outside optimal range. Monitor closely.',
  Poor: 'Water quality is poor. Immediate action required!',
};

export default function WaterQualityCard({ quality, ph, turbidity }) {
  const status = quality || 'Good';
  const colors = QUALITY_COLORS[status];
  const StatusIcon = icons[status];

  return (
    <div
      className="glass-card p-6 animate-fade-in-up"
      style={{ borderTop: `4px solid ${colors.border}` }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: colors.bg }}
        >
          <StatusIcon size={28} color={colors.text} />
        </div>
        <div>
          <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
            Overall Water Quality
          </p>
          <h3
            className="text-2xl font-extrabold mt-0.5"
            style={{ color: colors.text }}
          >
            {status}
          </h3>
        </div>
      </div>

      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
        {descriptions[status]}
      </p>

      <div className="flex gap-4">
        <div
          className="flex-1 rounded-xl p-3 text-center"
          style={{ background: 'var(--bg-tertiary)' }}
        >
          <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>pH Level</p>
          <p className="text-lg font-bold font-mono mt-1" style={{ color: 'var(--text-primary)' }}>
            {ph?.toFixed(2) ?? '—'}
          </p>
        </div>
        <div
          className="flex-1 rounded-xl p-3 text-center"
          style={{ background: 'var(--bg-tertiary)' }}
        >
          <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Turbidity</p>
          <p className="text-lg font-bold font-mono mt-1" style={{ color: 'var(--text-primary)' }}>
            {turbidity?.toFixed(1) ?? '—'} <span className="text-xs font-normal">NTU</span>
          </p>
        </div>
      </div>
    </div>
  );
}
