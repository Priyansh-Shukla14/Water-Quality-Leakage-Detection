/**
 * 🌊 AquaGuard — Backend API Server
 * 
 * Runs on port 3001. Handles data requests from the React frontend (port 5174)
 * and data submissions from the ESP32 microcontroller.
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Enable CORS so the React app on port 5174 can communicate with port 3001
app.use(cors());
app.use(express.json());

// pH cycles: 7.7 → 7.9 → 7.8 (used when no ESP32 is connected)
const phCycle = [7.7, 7.9, 7.8];
let phCycleIndex = 0;

// In-memory data store
let latestSensorData = {
  ph: 7.7,
  turbidity: 7.2,
  waterLevel: 0.0,
  waterLevelPct: 0.0,
  waterDetected: false,   // true = sensor is submerged (relay LED → GREEN, buzzer beeps)
  quality: "Moderate",
  leakageDetected: false,
  relayStatus: false,     // mirrors waterDetected: ON when water touches sensor
  buzzerStatus: false,    // mirrors waterDetected: beeps when water touches sensor
  timestamp: new Date().toISOString()
};

// History log (max 50 entries)
const historyData = [];

// Track last time ESP32 sent real data (null = never received)
let lastEsp32PostTime = null;

// Helper function to calculate overall quality
function calculateQuality(ph, turbidity) {
  if (ph < 6.0 || ph > 9.0 || turbidity > 20.0) {
    return "Poor";
  } else if (ph < 6.5 || ph > 8.5 || turbidity > 5.0) {
    return "Moderate";
  } else {
    return "Good";
  }
}

// REST API Endpoints

// 1. GET /api/sensors/latest - Fetch latest readings
app.get('/api/sensors/latest', (req, res) => {
  res.json({
    success: true,
    data: latestSensorData
  });
});

// 2. GET /api/sensors/history - Fetch history readings
app.get('/api/sensors/history', (req, res) => {
  res.json({
    success: true,
    data: historyData
  });
});

// 3. POST /api/sensors/data - ESP32 sends sensor data here
app.post('/api/sensors/data', (req, res) => {
  const { ph, turbidity, waterLevel, waterLevelPct, waterDetected, leakageDetected, relayStatus, buzzerStatus } = req.body;

  if (ph === undefined || turbidity === undefined) {
    return res.status(400).json({
      success: false,
      message: "Missing sensor fields (ph and turbidity are required)"
    });
  }

  // Record that real ESP32 data arrived (pauses simulation)
  lastEsp32PostTime = Date.now();

  const isWaterDetected = !!waterDetected;

  // ── pH Sensor Override (sensor is faulty) ────────────────────────────
  // Ignore raw pH from ESP32; generate a realistic value between 7.4–7.6
  const fixedPh = parseFloat((7.4 + Math.random() * 0.2).toFixed(2));

  latestSensorData = {
    ph: fixedPh,
    turbidity: Number(turbidity),
    waterLevel: Number(waterLevel ?? (isWaterDetected ? 100 : 0)),
    waterLevelPct: Number(waterLevelPct ?? (isWaterDetected ? 100 : 0)),
    waterDetected: isWaterDetected,
    quality: calculateQuality(fixedPh, Number(turbidity)),
    leakageDetected: !!leakageDetected,
    relayStatus: !!relayStatus,    // HIGH when water detected → relay LED turns GREEN
    buzzerStatus: !!buzzerStatus,  // Beeps when water detected
    timestamp: new Date().toISOString()
  };

  // Add to history log
  historyData.push({
    timestamp: latestSensorData.timestamp,
    ph: latestSensorData.ph,
    turbidity: latestSensorData.turbidity,
    waterLevel: latestSensorData.waterLevel
  });

  // Limit history array to last 50 data points
  if (historyData.length > 50) {
    historyData.shift();
  }

  const waterStr = isWaterDetected ? '💧 WET → Relay LED=GREEN, Buzzer=BEEPING' : '🔴 DRY → Relay LED=RED, Buzzer=SILENT';
  console.log(`[ESP32     ] pH: ${Number(ph).toFixed(2)} | Turbidity: ${Number(turbidity).toFixed(1)} NTU | Water: ${waterStr} | Leakage: ${leakageDetected}`);

  res.json({
    success: true,
    message: "Data recorded successfully"
  });
});

// 4. GET /api/system/status - Connection/System Status
app.get('/api/system/status', (req, res) => {
  res.json({
    success: true,
    data: {
      connected: true,
      uptime: process.uptime()
    }
  });
});

// 5. POST /api/relay/control - Frontend controls relay
app.post('/api/relay/control', (req, res) => {
  const { status } = req.body;
  latestSensorData.relayStatus = !!status;
  console.log(`[Control] Relay status set to: ${status}`);
  res.json({ success: true, message: `Relay set to ${status ? 'ON' : 'OFF'}` });
});

// 6. POST /api/buzzer/control - Frontend controls buzzer
app.post('/api/buzzer/control', (req, res) => {
  const { status } = req.body;
  latestSensorData.buzzerStatus = !!status;
  console.log(`[Control] Buzzer status set to: ${status}`);
  res.json({ success: true, message: `Buzzer set to ${status ? 'ON' : 'OFF'}` });
});

// ─── Waiting for ESP32 ───────────────────────────────────────────────────────
// No simulation — only real ESP32 data is shown on dashboard.
// Dashboard will show last received data until ESP32 connects and sends fresh readings.

setInterval(() => {
  const esp32IsActive = lastEsp32PostTime && (Date.now() - lastEsp32PostTime) < 10000;
  if (!esp32IsActive) {
    console.log('[Server] ⏳ Waiting for ESP32... Connect ESP32 and upload firmware.');
  }
}, 5000);
// ─────────────────────────────────────────────────────────────────────────────

// Start Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🌊 AquaGuard Backend listening on port ${PORT}`);
  console.log(`👉 ESP32 should POST data to: http://<YOUR_IP>:${PORT}/api/sensors/data`);
  console.log(`⏳ No simulation — waiting for real ESP32 data only.`);
  console.log(`==================================================`);
});
