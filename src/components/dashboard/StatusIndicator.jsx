export default function StatusIndicator({ label, isActive, activeColor = '#10b981', activeText = 'ON', inactiveText = 'OFF' }) {
  return (
    <div
      className="glass-card p-4 flex items-center justify-between animate-fade-in-up"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-3 h-3 rounded-full"
          style={{
            background: isActive ? activeColor : '#64748b',
            boxShadow: isActive ? `0 0 10px ${activeColor}60` : 'none',
          }}
        />
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </span>
      </div>
      <span
        className="px-3 py-1 rounded-full text-xs font-bold"
        style={{
          background: isActive ? `${activeColor}18` : 'var(--bg-tertiary)',
          color: isActive ? activeColor : 'var(--text-tertiary)',
        }}
      >
        {isActive ? activeText : inactiveText}
      </span>
    </div>
  );
}
