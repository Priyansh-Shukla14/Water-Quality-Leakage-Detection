export default function SensorCard({ icon: Icon, title, value, unit, color, subtitle, children }) {
  return (
    <div
      className="glass-card p-5 flex flex-col gap-3 animate-fade-in-up"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${color}18` }}
          >
            {Icon && <Icon size={20} color={color} />}
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
              {title}
            </p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span
                className="text-2xl font-bold font-mono"
                style={{ color: 'var(--text-primary)' }}
              >
                {value ?? '—'}
              </span>
              {unit && (
                <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
                  {unit}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {subtitle && (
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
