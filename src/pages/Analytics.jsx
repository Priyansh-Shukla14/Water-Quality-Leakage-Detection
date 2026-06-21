import { BarChart3, TrendingUp, Database, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart, Area,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';

const cardStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: 'var(--shadow-sm)',
};

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: 'var(--shadow-lg)',
        fontSize: '13px',
      }}>
        <p style={{ margin: '0 0 4px', color: 'var(--text-tertiary)', fontWeight: 600 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ margin: 0, color: p.color, fontWeight: 700 }}>
            {p.name}: {p.value?.toFixed(2)}{unit}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function StatCard({ icon: Icon, label, value, unit, color, sub }) {
  return (
    <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '14px' }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        background: `${color}18`, display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <p style={{ margin: '0 0 2px', fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
        <p style={{ margin: '0 0 2px', fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
          {value ?? '—'}<span style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: 600, marginLeft: '3px' }}>{unit}</span>
        </p>
        {sub && <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-tertiary)' }}>{sub}</p>}
      </div>
    </div>
  );
}

function ChartSection({ title, subtitle, children }) {
  return (
    <div style={cardStyle}>
      <div style={{ marginBottom: '20px' }}>
        <p style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</p>
        {subtitle && <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-tertiary)' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export default function Analytics({ historyData = [] }) {
  // Derive summary stats
  const pHValues    = historyData.map(d => d.ph).filter(Boolean);
  const turbValues  = historyData.map(d => d.turbidity).filter(Boolean);
  const levelValues = historyData.map(d => d.waterLevel).filter(Boolean);

  const avg  = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : '—';
  const minV = arr => arr.length ? Math.min(...arr).toFixed(2) : '—';
  const maxV = arr => arr.length ? Math.max(...arr).toFixed(2) : '—';

  // Format x-axis ticks
  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
  };

  const axisStyle = { fontSize: 11, fill: 'var(--text-tertiary)' };
  const gridStyle = { stroke: 'var(--border-color)', strokeDasharray: '3 3' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
          Analytics
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
          Historical sensor trends over the last 24 hours ({historyData.length} data points)
        </p>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <StatCard icon={Activity}   label="Avg pH"        value={avg(pHValues)}    unit=""     color="#06b6d4" sub={`Min ${minV(pHValues)} · Max ${maxV(pHValues)}`} />
        <StatCard icon={Database}   label="Avg Turbidity" value={avg(turbValues)}  unit="NTU"  color="#8b5cf6" sub={`Min ${minV(turbValues)} · Max ${maxV(turbValues)}`} />
        <StatCard icon={TrendingUp} label="Avg Level"     value={avg(levelValues)} unit="%"    color="#10b981" sub={`Min ${minV(levelValues)} · Max ${maxV(levelValues)}`} />
        <StatCard icon={BarChart3}  label="Data Points"   value={historyData.length} unit=""  color="#f59e0b" sub="Last 24 hours" />
      </div>

      {/* pH Chart */}
      <ChartSection title="pH Level Trend" subtitle="Optimal range: 6.5 – 8.5 | Recorded over 24 hours">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="phGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="timestamp" tickFormatter={formatTime} tick={axisStyle} interval="preserveStartEnd" />
            <YAxis domain={[4, 10]} tick={axisStyle} />
            <Tooltip content={<CustomTooltip unit="" />} />
            <ReferenceLine y={6.5} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: '6.5', fill: '#10b981', fontSize: 10 }} />
            <ReferenceLine y={8.5} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: '8.5', fill: '#10b981', fontSize: 10 }} />
            <Area type="monotone" dataKey="ph" name="pH" stroke="#06b6d4" strokeWidth={2} fill="url(#phGrad)" dot={false} activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartSection>

      {/* Turbidity Chart */}
      <ChartSection title="Turbidity Trend" subtitle="Good: &lt;5 NTU · Moderate: &lt;20 NTU · Poor: &gt;20 NTU">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="turbGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="timestamp" tickFormatter={formatTime} tick={axisStyle} interval="preserveStartEnd" />
            <YAxis tick={axisStyle} />
            <Tooltip content={<CustomTooltip unit=" NTU" />} />
            <ReferenceLine y={5}  stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: '5', fill: '#10b981', fontSize: 10 }} />
            <ReferenceLine y={20} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: '20', fill: '#ef4444', fontSize: 10 }} />
            <Area type="monotone" dataKey="turbidity" name="Turbidity" stroke="#8b5cf6" strokeWidth={2} fill="url(#turbGrad)" dot={false} activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartSection>

      {/* Water Level Chart */}
      <ChartSection title="Water Level Trend" subtitle="Critical threshold: &lt;30% · Normal: &gt;50%">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="levelGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="timestamp" tickFormatter={formatTime} tick={axisStyle} interval="preserveStartEnd" />
            <YAxis domain={[0, 100]} tick={axisStyle} />
            <Tooltip content={<CustomTooltip unit="%" />} />
            <ReferenceLine y={30} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: '30%', fill: '#ef4444', fontSize: 10 }} />
            <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: '50%', fill: '#f59e0b', fontSize: 10 }} />
            <Area type="monotone" dataKey="waterLevel" name="Water Level" stroke="#10b981" strokeWidth={2} fill="url(#levelGrad)" dot={false} activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartSection>

    </div>
  );
}
