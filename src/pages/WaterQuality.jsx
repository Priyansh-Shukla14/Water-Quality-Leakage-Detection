import { FlaskConical, Droplets, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

const criteria = [
  { param: 'pH Level', good: '6.5 – 8.5', moderate: '6.0 – 6.5 / 8.5 – 9.0', poor: '< 6.0 or > 9.0', unit: '' },
  { param: 'Turbidity', good: '< 5 NTU', moderate: '5 – 20 NTU', poor: '> 20 NTU', unit: 'NTU' },
  { param: 'Water Level', good: '> 50%', moderate: '30 – 50%', poor: '< 30%', unit: '%' },
];

function QualityMeter({ value, max, color, label, unit }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
          {value?.toFixed(2) ?? '—'}{unit}
        </span>
      </div>
      <div style={{ height: '10px', background: 'var(--bg-tertiary)', borderRadius: '999px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}, ${color}bb)`,
          borderRadius: '999px', transition: 'width 1s ease',
        }} />
      </div>
    </div>
  );
}

export default function WaterQuality({ data }) {
  const quality = data?.quality;
  const colorMap = { Good: '#10b981', Moderate: '#f59e0b', Poor: '#ef4444' };
  const qColor = colorMap[quality] || '#94a3b8';
  const QIcon = quality === 'Good' ? CheckCircle : quality === 'Moderate' ? AlertTriangle : XCircle;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
          Water Quality Analysis
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
          Comprehensive water quality assessment based on sensor readings
        </p>
      </div>

      {/* Overall quality banner */}
      <div style={{
        background: 'var(--bg-card)',
        border: `1px solid ${qColor}44`,
        borderRadius: '16px',
        padding: '24px',
        display: 'flex', alignItems: 'center', gap: '20px',
        boxShadow: `0 0 0 3px ${qColor}12`,
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '16px',
          background: `${qColor}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <QIcon size={34} color={qColor} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 4px', fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: 600 }}>OVERALL STATUS</p>
          <p style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: 800, color: qColor, letterSpacing: '-0.5px' }}>{quality || 'N/A'}</p>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
            {quality === 'Good'
              ? 'All water parameters are within safe limits. Water is suitable for usage.'
              : quality === 'Moderate'
              ? 'Some parameters need attention. Monitor closely and consider treatment.'
              : 'Critical water quality issues detected. Immediate action is required.'}
          </p>
        </div>
      </div>

      {/* Parameter gauges */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
        borderRadius: '16px', padding: '24px',
        display: 'flex', flexDirection: 'column', gap: '20px',
      }}>
        <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', margin: 0 }}>
          Parameter Readings
        </p>
        <QualityMeter label="pH Level" value={data?.ph} max={14} color="#06b6d4" unit="" />
        <QualityMeter label="Turbidity" value={data?.turbidity} max={50} color="#8b5cf6" unit=" NTU" />
        <QualityMeter label="Water Level" value={data?.waterLevel} max={100} color="#10b981" unit="%" />
        <QualityMeter label="Temperature" value={data?.temperature} max={50} color="#f59e0b" unit="°C" />
      </div>

      {/* Reference criteria table */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
        borderRadius: '16px', padding: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Info size={16} color="#06b6d4" />
          <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', margin: 0 }}>
            Quality Reference Standards
          </p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Parameter', 'Good ✓', 'Moderate ⚠', 'Poor ✗'].map((h, i) => (
                  <th key={i} style={{
                    padding: '10px 14px', textAlign: 'left', fontSize: '12px',
                    fontWeight: 700, color: 'var(--text-tertiary)',
                    background: 'var(--bg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em',
                    borderBottom: '1px solid var(--border-color)',
                    borderRadius: i === 0 ? '8px 0 0 8px' : i === 3 ? '0 8px 8px 0' : '0',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criteria.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{row.param}</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: '#10b981', fontWeight: 600 }}>{row.good}</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: '#f59e0b', fontWeight: 600 }}>{row.moderate}</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: '#ef4444', fontWeight: 600 }}>{row.poor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
