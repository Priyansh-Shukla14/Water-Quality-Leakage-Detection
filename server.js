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

// In-memory data store
let latestSensorData = {
  ph: 7.0,
  turbidity: 0.0,
  waterLevel: 50.0,
  quality: "Good",
  leakageDetected: false,
  relayStatus: false,
  buzzerStatus: false,
  timestamp: new Date().toISOString()
};

// History log (max 50 entries)
const historyData = [];

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
  const { ph, turbidity, waterLevel, leakageDetected, relayStatus, buzzerStatus } = req.body;

  if (ph === undefined || turbidity === undefined || waterLevel === undefined) {
    return res.status(400).json({
      success: false,
      message: "Missing sensor fields (ph, turbidity, waterLevel are required)"
    });
  }

  // Update latest readings
  latestSensorData = {
    ph: Number(ph),
    turbidity: Number(turbidity),
    waterLevel: Number(waterLevel),
    quality: calculateQuality(Number(ph), Number(turbidity)),
    leakageDetected: !!leakageDetected,
    relayStatus: !!relayStatus,
    buzzerStatus: !!buzzerStatus,
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

  console.log(`[Sensor Update] pH: ${ph}, Turbidity: ${turbidity} NTU, Water Level: ${waterLevel} cm, Leakage: ${leakageDetected}`);

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

// Start Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🌊 AquaGuard Backend listening on port ${PORT}`);
  console.log(`👉 ESP32 should POST data to: http://<YOUR_IP>:${PORT}/api/sensors/data`);
  console.log(`==================================================`);
});
