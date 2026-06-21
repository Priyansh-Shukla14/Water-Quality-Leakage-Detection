import { AlertTriangle, CheckCircle, Clock, Droplets, TrendingDown, Activity } from 'lucide-react';
import { formatTimestamp } from '../utils/helpers';

const mockEvents = [
  { id: 1, type: 'warning', message: 'Water level dropped below 35%', time: '2 min ago', level: 34.2 },
  { id: 2, type: 'danger',  message: 'Leakage detected — relay activated', time: '5 min ago', level: 28.1 },
  { id: 3, type: 'success', message: 'System returned to normal', time: '12 min ago', level: 71.5 },
  { id: 4, type: 'warning', message: 'Rapid water level drop detected', time: '28 min ago', level: 41.0 },
  { id: 5, type: 'info',    message: 'Monitoring started', time: '1 hr ago', level: 82.3 },
];

const typeColor = { danger: '#ef4444', warning: '#f59e0b', success: '#10b981', info: '#06b6d4' };
const typeIcon  = { danger: AlertTriangle, warning: AlertTriangle, success: CheckCircle, info: Activity };

function StatBox({ label, value, color = 'var(--text-primary)', sub }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-color)',
      borderRadius: '14px', padding: '20px',
    }}>
      <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '0 0 6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
      <p style={{ fontSize: '28px', fontWeight: 800, color, margin: '0 0 4px', fontFamily: 'monospace' }}>{value}</p>
      {sub && <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>{sub}</p>}
    </div>
  );
}

export default function LeakageDetection({ data }) {
  const isLeaking = data?.leakageDetected;
  const waterLevel = data?.waterLevel ?? 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
          Leakage Detection
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
          Real-time water tank leakage monitoring and alert system
        </p>
      </div>

      {/* Status banner */}
      <div style={{
        padding: '20px 24px',
        borderRadius: '16px',
        background: isLeaking ? 'linear-gradient(135deg, #dc2626, #ef4444)' : 'linear-gradient(135deg, #059669, #10b981)',
        display: 'flex', alignItems: 'center', gap: '16px',
        boxShadow: isLeaking ? '0 0 32px rgba(239,68,68,0.3)' : '0 0 24px rgba(16,185,129,0.2)',
      }}>
        {isLeaking
          ? <AlertTriangle size={32} color="white" />
          : <CheckCircle size={32} color="white" />
        }
        <div>
          <p style={{ fontWeight: 800, fontSize: '18px', color: 'white', margin: '0 0 4px' }}>
            {isLeaking ? '⚠ Leakage Detected!' : '✓ System Normal'}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: '13px' }}>
            {isLeaking
              ? 'Abnormal water level drop. Relay module activated. Buzzer sounding.'
              : 'No anomalies detected. Water level is stable and within normal range.'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        <StatBox label="Water Level" value={`${waterLevel.toFixed(1)}%`} color={waterLevel < 30 ? '#ef4444' : waterLevel < 50 ? '#f59e0b' : '#10b981'} sub="Current reading" />
        <StatBox label="Relay Status" value={data?.relayStatus ? 'ON' : 'OFF'} color={data?.relayStatus ? '#06b6d4' : 'var(--text-tertiary)'} sub="Valve control" />
        <StatBox label="Buzzer" value={data?.buzzerStatus ? 'ACTIVE' : 'SILENT'} color={data?.buzzerStatus ? '#f59e0b' : 'var(--text-tertiary)'} sub="Alert sound" />
        <StatBox label="Leakage" value={isLeaking ? 'YES' : 'NO'} color={isLeaking ? '#ef4444' : '#10b981'} sub="Detection status" />
      </div>

      {/* Water level visual */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
        borderRadius: '16px', padding: '24px',
      }}>
        <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', margin: '0 0 16px' }}>
          Water Level Gauge
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Tank visual */}
          <div style={{
            width: '80px', flexShrink: 0,
            height: '140px', border: '3px solid var(--border-color)',
            borderRadius: '8px', overflow: 'hidden', position: 'relative',
            background: 'var(--bg-tertiary)',
          }}>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: `${Math.min(waterLevel, 100)}%`,
              background: waterLevel < 30 ? 'linear-gradient(180deg, #ef4444, #dc2626)' : 'linear-gradient(180deg, #06b6d4, #14b8a6)',
              transition: 'height 1s ease',
            }} />
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '13px', fontWeight: 700, color: 'white',
              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            }}>
              {waterLevel.toFixed(0)}%
            </div>
          </div>
          {/* Level bar */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Level</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{waterLevel.toFixed(1)}%</span>
            </div>
            <div style={{ height: '12px', background: 'var(--bg-tertiary)', borderRadius: '999px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{
                height: '100%',
                width: `${Math.min(waterLevel, 100)}%`,
                background: waterLevel < 30 ? '#ef4444' : 'linear-gradient(90deg, #06b6d4, #14b8a6)',
                borderRadius: '999px', transition: 'width 1s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600 }}>Critical &lt;30%</span>
              <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600 }}>Warning &lt;50%</span>
              <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>Normal &gt;50%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Event log */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
        borderRadius: '16px', padding: '24px',
      }}>
        <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', margin: '0 0 16px' }}>
          Recent Events
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {mockEvents.map(evt => {
            const color = typeColor[evt.type];
            const Icon = typeIcon[evt.type];
            return (
              <div key={evt.id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', borderRadius: '10px',
                background: 'var(--bg-tertiary)',
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: `${color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={16} color={color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{evt.message}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-tertiary)' }}>Level: {evt.level}%</p>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', flexShrink: 0 }}>{evt.time}</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
