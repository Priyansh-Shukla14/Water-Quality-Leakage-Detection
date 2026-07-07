/**
 * Mock data for development and testing
 * Replace with real API data when ESP32 is connected
 */

// pH cycles through: 7.7 → 7.9 → 7.8 (repeating)
const phCycle = [7.7, 7.9, 7.8];
let phCycleIndex = 0;

function getNextPh() {
  const val = phCycle[phCycleIndex % phCycle.length];
  phCycleIndex++;
  return val;
}

// Generate mock historical data
function generateHistory(hours = 24) {
  const data = [];
  const now = Date.now();
  for (let i = hours * 12; i >= 0; i--) {
    const timestamp = new Date(now - i * 5 * 60 * 1000).toISOString();
    // pH cycles through 7.7, 7.9, 7.8; turbidity between 5-10
    const phVal = phCycle[i % phCycle.length];
    const turbVal = parseFloat((5 + Math.random() * 5).toFixed(2)); // 5.00 to 10.00
    // Water level: firmware 3-state only (0, 50, 100 cm)
    const wlStates = [50, 100, 50, 0];
    const wlCm = wlStates[i % wlStates.length];
    data.push({
      timestamp,
      ph: phVal,
      turbidity: turbVal,
      waterLevel: wlCm,
    });
  }
  return data;
}

// Current sensor reading
export const mockLatestData = {
  ph: 7.7,
  turbidity: 7.2,
  waterLevel: 0,         // 0 = no water, 100 = water detected
  waterLevelPct: 0,
  waterDetected: false,  // false = DRY (Relay LED=RED, Buzzer=SILENT)
  quality: 'Moderate',
  leakageDetected: false,
  relayStatus: false,    // ON when waterDetected → Relay LED turns GREEN
  buzzerStatus: false,   // ON when waterDetected → Buzzer beeps
  timestamp: new Date().toISOString(),
};

// Historical data
export const mockHistoryData = generateHistory(24);

// System status
export const mockSystemStatus = {
  esp32Connected: true,
  wifiStrength: -45,
  uptime: '4h 23m 12s',
  lastUpdate: new Date().toISOString(),
  sensorStatus: {
    ph: 'online',
    turbidity: 'online',
    waterLevel: 'online',
  },
  firmwareVersion: '1.2.0',
  ipAddress: '192.168.1.105',
};

// Leakage events log
export const mockLeakageEvents = [
  {
    id: 1,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    waterLevelBefore: 78,
    waterLevelAfter: 52,
    drop: 26,
    duration: '12 min',
    resolved: true,
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    waterLevelBefore: 65,
    waterLevelAfter: 41,
    drop: 24,
    duration: '8 min',
    resolved: true,
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 345600000).toISOString(),
    waterLevelBefore: 82,
    waterLevelAfter: 60,
    drop: 22,
    duration: '15 min',
    resolved: true,
  },
];

// Mock API responses
export const mockApiResponses = {
  '/api/sensors/latest': {
    success: true,
    data: mockLatestData,
  },
  '/api/sensors/history': {
    success: true,
    data: mockHistoryData,
  },
  '/api/system/status': {
    success: true,
    data: mockSystemStatus,
  },
};

/**
 * Simulate real-time sensor data with slight variations
 */
// Single water level sensor states:
//   DRY → waterDetected=false  → relayStatus=false (Relay LED=RED)   → buzzerStatus=false (Silent)
//   WET → waterDetected=true   → relayStatus=true  (Relay LED=GREEN) → buzzerStatus=true  (Beeping)
const waterSensorCycle = [
  { detected: false, cm: 0,   pct: 0   },  // DRY  — no water
  { detected: true,  cm: 100, pct: 100 },  // WET  — water detected
  { detected: true,  cm: 100, pct: 100 },  // WET  — water detected
  { detected: false, cm: 0,   pct: 0   },  // DRY  — no water
];
let wlStateIndex = 0;

export function generateRealtimeData(prevData) {
  // pH cycles: 7.7 → 7.9 → 7.8 → repeat
  const ph = getNextPh();

  // Turbidity stays between 5 and 10 NTU
  const turbidity = parseFloat((5 + Math.random() * 5).toFixed(2));

  // Single water level sensor: alternates WET / DRY
  const wlState = waterSensorCycle[wlStateIndex % waterSensorCycle.length];
  wlStateIndex++;
  const waterLevel    = wlState.cm;
  const waterLevelPct = wlState.pct;
  const waterDetected = wlState.detected;

  // Quality based on pH and turbidity
  let quality = 'Moderate';
  if (ph < 5.5 || ph > 9.5 || turbidity > 20) quality = 'Poor';
  if (ph >= 6.5 && ph <= 8.5 && turbidity < 5)  quality = 'Good';

  // Water detected → Relay ON (LED GREEN) + Buzzer beeping
  // No water       → Relay OFF (LED RED)  + Buzzer silent
  const relayStatus  = waterDetected;
  const buzzerStatus = waterDetected;
  const leakageDetected = false;

  return {
    ph,
    turbidity,
    waterLevel,
    waterLevelPct,
    waterDetected,
    quality,
    leakageDetected,
    relayStatus,
    buzzerStatus,
    timestamp: new Date().toISOString(),
  };
}
