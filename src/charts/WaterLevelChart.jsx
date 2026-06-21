import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatChartTime } from '../utils/helpers';
import { WATER_LEVEL_THRESHOLDS, CHART_COLORS } from '../utils/constants';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '12px 16px',
      boxShadow: 'var(--shadow-lg)',
    }}>
      <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', marginBottom: '4px' }}>
        {formatChartTime(label)}
      </p>
      <p style={{ color: CHART_COLORS.waterLevel, fontWeight: 600, fontSize: '16px' }}>
        Level: {payload[0].value}%
      </p>
    </div>
  );
};

export default function WaterLevelChart({ data }) {
  const chartData = data?.map(d => ({
    time: d.timestamp,
    waterLevel: d.waterLevel,
  })) || [];

  return (
    <div className="chart-container">
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '18px' }}>
          Water Level Trend
        </h3>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '14px', marginTop: '4px' }}>
          Normal: &gt;{WATER_LEVEL_THRESHOLDS.NORMAL_MIN}% | Critical: &lt;{WATER_LEVEL_THRESHOLDS.CRITICAL_LOW}%
        </p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="levelGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.waterLevel} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS.waterLevel} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis
            dataKey="time"
            tickFormatter={formatChartTime}
            stroke="var(--text-tertiary)"
            fontSize={12}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            stroke="var(--text-tertiary)"
            fontSize={12}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={WATER_LEVEL_THRESHOLDS.NORMAL_MIN} stroke="#10b981" strokeDasharray="5 5" strokeOpacity={0.5} />
          <ReferenceLine y={WATER_LEVEL_THRESHOLDS.CRITICAL_LOW} stroke="#ef4444" strokeDasharray="5 5" strokeOpacity={0.5} />
          <Area
            type="monotone"
            dataKey="waterLevel"
            stroke={CHART_COLORS.waterLevel}
            strokeWidth={2.5}
            fill="url(#levelGradient)"
            dot={false}
            activeDot={{ r: 5, fill: CHART_COLORS.waterLevel }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
