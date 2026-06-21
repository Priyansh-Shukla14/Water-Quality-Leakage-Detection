import { AlertTriangle, XCircle } from 'lucide-react';
import { formatTimestamp } from '../../utils/helpers';

export default function LeakageAlert({ isDetected, timestamp, waterLevel, onDismiss }) {
  if (!isDetected) return null;

  return (
    <div className="leakage-banner flex items-center justify-between flex-wrap gap-3 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <AlertTriangle size={22} color="#ffffff" />
        </div>
        <div>
          <h4 className="font-bold text-base">⚠️ Leakage Detected!</h4>
          <p className="text-sm opacity-90">
            Water level: {waterLevel?.toFixed(1)}% — Abnormal drop detected at {formatTimestamp(timestamp)}
          </p>
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="Dismiss alert"
        >
          <XCircle size={20} />
        </button>
      )}
    </div>
  );
}
