export default function ProgressBar({ value, max = 100, color, label, showPercentage = true }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
            {label}
          </span>
          {showPercentage && (
            <span className="text-xs font-bold font-mono" style={{ color }}>
              {value?.toFixed(1)}%
            </span>
          )}
        </div>
      )}
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
            background: color
              ? `linear-gradient(90deg, ${color}, ${color}cc)`
              : undefined,
          }}
        />
      </div>
    </div>
  );
}
