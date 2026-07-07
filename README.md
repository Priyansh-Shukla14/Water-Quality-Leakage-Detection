# 🌊 AquaGuard — Water Quality Monitoring System

A modern, real-time IoT dashboard for monitoring water quality parameters using an ESP32 microcontroller with advanced sensor integration.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Project Overview

This system monitors water quality in real time using IoT sensors connected to an **ESP32** microcontroller. The dashboard provides live sensor readings, analytics, and alert management through a modern web interface. The backend server receives data directly from ESP32 — **no simulated data**.

## 🔧 Hardware Components

| Component | GPIO | Purpose |
|-----------|------|---------|
| ESP32 | — | Main microcontroller (WiFi-enabled) |
| pH Sensor | GPIO 14 | Measures water acidity/alkalinity |
| SEN0189 Turbidity | GPIO 35 | Measures water clarity (NTU) via voltage divider |
| Water Level Sensor | GPIO 32 | Detects water presence (HIGH = wet) |
| Relay Module | GPIO 25 | LED indicator — RED (dry) / GREEN (water detected) |
| Buzzer | GPIO 26 | Audio alert on water detection / leakage |

### ⚡ Pin Wiring Summary

```
SEN0189 Turbidity → 5V, GND, Signal → 10kΩ/20kΩ divider → GPIO 35
pH Sensor         → 5V, GND, PO → GPIO 14
Water Level       → 3.3V, GND, Signal → GPIO 32
Relay Module      → 5V, GND, IN → GPIO 25
Buzzer (+)        → GPIO 26 | Buzzer (−) → GND
```

### ⚠️ Voltage Divider for Turbidity Sensor

The SEN0189 outputs up to 4.5V but ESP32 GPIO is 3.3V max:

```
Sensor Signal ──┬── 10kΩ ──── GPIO 35
                │
               20kΩ
                │
               GND
```

## 🤖 Firmware Behavior

| Condition | Relay LED | Buzzer |
|-----------|-----------|--------|
| No water | 🔴 RED | Silent |
| Water detected | 🟢 GREEN | Beeping every 500ms |
| Leakage detected | 🟢 GREEN | Beeps for **5 seconds**, then auto OFF |

> **Leakage logic:** Water was previously detected, now sensor is dry → leakage alert triggers. Buzzer and relay LED activate for 5 seconds then automatically reset.

## 🖥️ Dashboard Features

### 1. Landing Page
- Project overview with engineering-themed UI
- Features, tech stack, and system architecture

### 2. Real-Time Monitoring Dashboard
- **pH Value** — color-coded status (7.4–7.6 range)
- **Turbidity (NTU)** — with progress bar
- **Water Level** — wet/dry detection
- **Water Quality Status** — Good / Moderate / Poor
- **Relay & Buzzer Status** — live ON/OFF indicators

### 3. Water Quality Analysis
- Color-coded quality cards (Good / Moderate / Poor)
- pH scale visualization
- Quality criteria breakdown

### 4. Analytics
- pH trend chart
- Turbidity trend chart
- Water level trend chart
- Summary statistics (averages, data points)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Arduino IDE with ESP32 board package

### Backend Server

```bash
# Install dependencies
npm install

# Start backend (port 3001)
node server.js
```

### Frontend Dashboard

```bash
# Start Vite dev server (port 5173)
npm run dev
```

Open `http://localhost:5173` in your browser.

### ESP32 Firmware

1. Open `firmware/water_quality_esp32.ino` in Arduino IDE
2. Update WiFi credentials:
   ```cpp
   const char* ssid     = "YOUR_WIFI_NAME";
   const char* password = "YOUR_WIFI_PASSWORD";
   ```
3. Update server IP:
   ```cpp
   const char* serverEndpoint = "http://<YOUR_PC_IP>:3001/api/sensors/data";
   ```
4. Upload to ESP32 → open Serial Monitor at **115200 baud**

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/sensors/latest` | Latest sensor readings |
| `GET` | `/api/sensors/history` | Historical data (last 50 readings) |
| `POST` | `/api/sensors/data` | ESP32 submits sensor data |
| `GET` | `/api/system/status` | System uptime & connection status |
| `POST` | `/api/relay/control` | Control relay (ON/OFF) |
| `POST` | `/api/buzzer/control` | Control buzzer (ON/OFF) |

### ESP32 Payload Format

```json
{
  "ph": 7.5,
  "turbidity": 6.2,
  "waterLevel": 100,
  "waterLevelPct": 100,
  "waterDetected": true,
  "leakageDetected": false,
  "relayStatus": true,
  "buzzerStatus": true
}
```

## 📁 Folder Structure

```
├── firmware/
│   └── water_quality_esp32.ino   # ESP32 Arduino firmware
├── src/
│   ├── charts/                   # Recharts chart components
│   ├── components/
│   │   ├── common/               # Shared UI components
│   │   ├── dashboard/            # Dashboard cards & widgets
│   │   └── layout/               # Navbar, Sidebar, Layout
│   ├── hooks/                    # useSensorData, useTheme
│   ├── pages/                    # Dashboard, WaterQuality, Analytics, LandingPage
│   ├── services/                 # API service layer
│   └── utils/                   # Constants, helpers, mockData
├── server.js                     # Express backend (port 3001)
├── connection_guide.md           # Hardware wiring reference
└── README.md
```

## 🎨 UI Features

- **Dark/Light mode** with system preference detection
- **Blue/Teal IoT theme** with gradient accents
- **Glassmorphism** cards with blur effects
- **Micro-animations** for hover, entrance, and pulse effects
- **Collapsible sidebar** for dashboard navigation

## 🛠️ Tech Stack

- **React 19** — UI framework
- **Vite 6** — Build tool
- **Vanilla CSS** — Custom styling with CSS variables
- **Recharts** — Chart library
- **React Router** — Client-side routing
- **Lucide React** — Icon library
- **Express.js** — Backend API server

## 📜 License

This project is part of an engineering project for academic purposes.

---

Built with ❤️ by Priyansh Shukla
