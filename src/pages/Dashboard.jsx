import {
  FlaskConical, Eye, Waves, Thermometer,
  RefreshCw, Clock, Zap, Volume2,
  CheckCircle, AlertTriangle,
} from 'lucide-react';
import { formatTimestamp, getPhColor, getTurbidityColor, getWaterLevelColor } from '../utils/helpers';

function MetricCard({ icon: Icon, title, value, unit, subtitle, color, children }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      transition: 'box-shadow 0.2s ease',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: `${color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon size={20} color={color} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>{title}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, fontFamily: 'var(--font-mono, monospace)' }}>
          {value ?? '—'}
        </span>
        {unit && <span style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: 600 }}>{unit}</span>}
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>{subtitle}</p>
      {children}
    </div>
  );
}

function ProgressBar({ value = 0, color }) {
  const pct = Math.min(Math.max(value, 0), 100);
  return (
    <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '999px', overflow: 'hidden' }}>
      <div style={{
        height: '100%',
        width: `${pct}%`,
        background: `linear-gradient(90deg, ${color}, ${color}cc)`,
        borderRadius: '999px',
        transition: 'width 0.8s ease',
      }} />
    </div>
  );
}

function StatusBadge({ label, isActive, activeText, inactiveText, activeColor = '#10b981' }) {
  const color = isActive ? activeColor : 'var(--text-tertiary)';
  const text = isActive ? (activeText || 'ON') : (inactiveText || 'OFF');
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: color,
          boxShadow: isActive ? `0 0 8px ${color}88` : 'none',
        }} />
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
      </div>
      <span style={{ fontSize: '12px', fontWeight: 700, color, letterSpacing: '0.04em' }}>{text}</span>
    </div>
  );
}

function QualityCard({ quality, ph, turbidity }) {
  const colorMap = { Good: '#10b981', Moderate: '#f59e0b', Poor: '#ef4444' };
  const color = colorMap[quality] || '#94a3b8';
  const IconComp = quality === 'Good' ? CheckCircle : AlertTriangle;
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid ${color}44`,
      borderRadius: '16px',
      padding: '20px',
      boxShadow: `0 0 0 0 ${color}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          width: '42px', height: '42px', borderRadius: '12px',
          background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconComp size={22} color={color} />
        </div>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>Overall Water Quality</p>
          <p style={{ fontSize: '22px', fontWeight: 800, color, margin: 0 }}>{quality || '—'}</p>
        </div>
      </div>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        {quality === 'Good'
          ? 'Water parameters are within safe limits. Suitable for usage.'
          : quality === 'Moderate'
          ? 'Some parameters are slightly outside optimal range. Monitor closely.'
          : 'Critical water quality issue detected. Immediate action required.'}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ textAlign: 'center', padding: '10px', background: 'var(--bg-tertiary)', borderRadius: '10px' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: '0 0 4px' }}>pH Level</p>
          <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'monospace' }}>{ph?.toFixed(2) ?? '—'}</p>
        </div>
        <div style={{ textAlign: 'center', padding: '10px', background: 'var(--bg-tertiary)', borderRadius: '10px' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: '0 0 4px' }}>Turbidity</p>
          <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'monospace' }}>{turbidity?.toFixed(1) ?? '—'} <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>NTU</span></p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ data, loading, isMock, onRefresh }) {
  if (loading && !data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <RefreshCw size={36} color="#06b6d4" style={{ margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Loading sensor data…</p>
        </div>
      </div>
    );
  }

  const phColor = getPhColor(data?.ph);
  const turbColor = getTurbidityColor(data?.turbidity);
  const levelColor = getWaterLevelColor(data?.waterLevel);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            Dashboard Overview
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Clock size={13} color="var(--text-tertiary)" />
            <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
              Updated: {formatTimestamp(data?.timestamp)}
            </span>
            {isMock && (
              <span style={{
                padding: '2px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
                background: 'rgba(245,158,11,0.12)', color: '#f59e0b',
              }}>
                Demo
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onRefresh}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
            background: 'var(--bg-card)', color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)', cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Leakage alert */}
      {data?.leakageDetected && (
        <div style={{
          background: 'linear-gradient(135deg, #dc2626, #ef4444)',
          borderRadius: '14px', padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 0 24px rgba(239,68,68,0.35)',
          animation: 'pulse-glow 2s ease-in-out infinite',
        }}>
          <AlertTriangle size={22} color="white" />
          <div>
            <p style={{ fontWeight: 700, color: 'white', margin: 0, fontSize: '15px' }}>⚠ Leakage Detected!</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '13px' }}>
              Water level drop detected — relay & buzzer have been activated.
            </p>
          </div>
        </div>
      )}

      {/* Sensor cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <MetricCard icon={FlaskConical} title="pH Level" value={data?.ph?.toFixed(2)} color={phColor} subtitle="Optimal: 6.5 – 8.5">
          <ProgressBar value={((data?.ph || 7) / 14) * 100} color={phColor} />
        </MetricCard>

        <MetricCard icon={Eye} title="Turbidity" value={data?.turbidity?.toFixed(1)} unit="NTU" color={turbColor} subtitle="Good: < 5 NTU">
          <ProgressBar value={Math.min((data?.turbidity || 0) / 50 * 100, 100)} color={turbColor} />
        </MetricCard>

        <MetricCard icon={Waves} title="Water Level" value={data?.waterLevel?.toFixed(1)} unit="%" color={levelColor} subtitle="Normal: > 30%">
          <ProgressBar value={data?.waterLevel} color={levelColor} />
        </MetricCard>

        <MetricCard icon={Thermometer} title="Temperature" value={data?.temperature?.toFixed(1)} unit="°C" color="#f59e0b" subtitle="Ambient reading" />
      </div>

      {/* Quality + Status row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: '16px', alignItems: 'start' }}>
          <QualityCard quality={data?.quality} ph={data?.ph} turbidity={data?.turbidity} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <StatusBadge label="Relay Module" isActive={data?.relayStatus} activeColor="#06b6d4" />
            <StatusBadge label="Buzzer" isActive={data?.buzzerStatus} activeColor="#f59e0b" activeText="ACTIVE" inactiveText="SILENT" />
            <StatusBadge label="Leakage" isActive={data?.leakageDetected} activeColor="#ef4444" activeText="DETECTED" inactiveText="NORMAL" />
            <StatusBadge
              label="Water Quality"
              isActive={data?.quality === 'Good'}
              activeColor="#10b981"
              activeText={data?.quality || 'N/A'}
              inactiveText={data?.quality || 'N/A'}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
