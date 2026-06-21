import { PH_THRESHOLDS, TURBIDITY_THRESHOLDS, WATER_LEVEL_THRESHOLDS } from './constants';

/**
 * Determine water quality status based on pH and turbidity
 * @param {number} ph - pH value
 * @param {number} turbidity - Turbidity in NTU
 * @returns {'Good' | 'Moderate' | 'Poor'}
 */
export function getWaterQuality(ph, turbidity) {
  const phGood = ph >= PH_THRESHOLDS.GOOD_MIN && ph <= PH_THRESHOLDS.GOOD_MAX;
  const phModerate = ph >= PH_THRESHOLDS.MODERATE_MIN && ph <= PH_THRESHOLDS.MODERATE_MAX;
  const turbGood = turbidity <= TURBIDITY_THRESHOLDS.GOOD_MAX;
  const turbModerate = turbidity <= TURBIDITY_THRESHOLDS.MODERATE_MAX;

  if (phGood && turbGood) return 'Good';
  if (phModerate && turbModerate) return 'Moderate';
  return 'Poor';
}

/**
 * Detect leakage based on water level drop
 * @param {number} currentLevel - Current water level %
 * @param {number} previousLevel - Previous water level %
 * @returns {boolean}
 */
export function detectLeakage(currentLevel, previousLevel) {
  if (previousLevel === null || previousLevel === undefined) return false;
  const drop = previousLevel - currentLevel;
  return drop >= WATER_LEVEL_THRESHOLDS.LEAKAGE_DROP || currentLevel <= WATER_LEVEL_THRESHOLDS.CRITICAL_LOW;
}

/**
 * Format timestamp to locale string
 * @param {string|number|Date} timestamp
 * @returns {string}
 */
export function formatTimestamp(timestamp) {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

/**
 * Format a short time label for charts
 * @param {string|number|Date} timestamp
 * @returns {string}
 */
export function formatChartTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Get color class for pH value
 * @param {number} ph
 * @returns {string}
 */
export function getPhColor(ph) {
  if (ph >= PH_THRESHOLDS.GOOD_MIN && ph <= PH_THRESHOLDS.GOOD_MAX) return '#10b981';
  if (ph >= PH_THRESHOLDS.MODERATE_MIN && ph <= PH_THRESHOLDS.MODERATE_MAX) return '#f59e0b';
  return '#ef4444';
}

/**
 * Get color for turbidity value
 * @param {number} turbidity
 * @returns {string}
 */
export function getTurbidityColor(turbidity) {
  if (turbidity <= TURBIDITY_THRESHOLDS.GOOD_MAX) return '#10b981';
  if (turbidity <= TURBIDITY_THRESHOLDS.MODERATE_MAX) return '#f59e0b';
  return '#ef4444';
}

/**
 * Get color for water level
 * @param {number} level
 * @returns {string}
 */
export function getWaterLevelColor(level) {
  if (level >= WATER_LEVEL_THRESHOLDS.NORMAL_MIN) return '#06b6d4';
  if (level >= WATER_LEVEL_THRESHOLDS.CRITICAL_LOW) return '#f59e0b';
  return '#ef4444';
}

/**
 * Clamp a number between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
