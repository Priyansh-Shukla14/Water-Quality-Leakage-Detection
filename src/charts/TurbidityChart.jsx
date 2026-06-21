import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatChartTime } from '../utils/helpers';
import { TURBIDITY_THRESHOLDS, CHART_COLORS } from '../utils/constants';

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
      <p style={{ color: CHART_COLORS.turbidity, fontWeight: 600, fontSize: '16px' }}>
        Turbidity: {payload[0].value} NTU
      </p>
    </div>
  );
};

export default function TurbidityChart({ data }) {
  const chartData = data?.map(d => ({
    time: d.timestamp,
    turbidity: d.turbidity,
  })) || [];

  return (
    <div className="chart-container">
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '18px' }}>
          Turbidity Trend
        </h3>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '14px', marginTop: '4px' }}>
          Good: &lt;{TURBIDITY_THRESHOLDS.GOOD_MAX} NTU | Moderate: &lt;{TURBIDITY_THRESHOLDS.MODERATE_MAX} NTU
        </p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="turbGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.turbidity} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS.turbidity} stopOpacity={0.02} />
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
            domain={[0, 30]}
            stroke="var(--text-tertiary)"
            fontSize={12}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={TURBIDITY_THRESHOLDS.GOOD_MAX} stroke="#10b981" strokeDasharray="5 5" strokeOpacity={0.5} />
          <ReferenceLine y={TURBIDITY_THRESHOLDS.MODERATE_MAX} stroke="#f59e0b" strokeDasharray="5 5" strokeOpacity={0.5} />
          <Area
            type="monotone"
            dataKey="turbidity"
            stroke={CHART_COLORS.turbidity}
            strokeWidth={2.5}
            fill="url(#turbGradient)"
            dot={false}
            activeDot={{ r: 5, fill: CHART_COLORS.turbidity }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
