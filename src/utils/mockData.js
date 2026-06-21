/**
 * Mock data for development and testing
 * Replace with real API data when ESP32 is connected
 */

// Generate mock historical data
function generateHistory(hours = 24) {
  const data = [];
  const now = Date.now();
  for (let i = hours * 12; i >= 0; i--) {
    const timestamp = new Date(now - i * 5 * 60 * 1000).toISOString();
    data.push({
      timestamp,
      ph: parseFloat((6.5 + Math.random() * 2.5 + Math.sin(i / 10) * 0.5).toFixed(2)),
      turbidity: parseFloat((1 + Math.random() * 8 + Math.cos(i / 8) * 2).toFixed(2)),
      waterLevel: parseFloat((55 + Math.random() * 30 + Math.sin(i / 15) * 10).toFixed(1)),
    });
  }
  return data;
}

// Current sensor reading
export const mockLatestData = {
  ph: 7.24,
  turbidity: 3.8,
  waterLevel: 72,
  temperature: 26.5,
  quality: 'Good',
  leakageDetected: false,
  relayStatus: false,
  buzzerStatus: false,
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
export function generateRealtimeData(prevData) {
  const variation = (base, range) => {
    const change = (Math.random() - 0.5) * range;
    return parseFloat((base + change).toFixed(2));
  };

  const ph = Math.max(4, Math.min(10, variation(prevData?.ph || 7.2, 0.3)));
  const turbidity = Math.max(0, Math.min(50, variation(prevData?.turbidity || 3.5, 1.5)));
  const waterLevel = Math.max(0, Math.min(100, variation(prevData?.waterLevel || 72, 3)));

  // Determine quality
  let quality = 'Good';
  if (ph < 6.5 || ph > 8.5 || turbidity > 5) quality = 'Moderate';
  if (ph < 5.5 || ph > 9.5 || turbidity > 20) quality = 'Poor';

  const leakageDetected = waterLevel < 15;
  const buzzerStatus = leakageDetected || quality === 'Poor';
  const relayStatus = leakageDetected;

  return {
    ph,
    turbidity,
    waterLevel,
    temperature: variation(prevData?.temperature || 26.5, 0.5),
    quality,
    leakageDetected,
    relayStatus,
    buzzerStatus,
    timestamp: new Date().toISOString(),
  };
}
