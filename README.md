# 🌊 AquaGuard — Water Quality & Leakage Monitoring System

A modern, real-time IoT dashboard for monitoring water quality parameters and detecting water tank leakage using ESP32 microcontroller with advanced sensor integration.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Project Overview

This system monitors water quality and detects water tank leakage in real time using IoT sensors connected to an **ESP32** microcontroller. The dashboard provides live sensor readings, analytics, and alert management through a modern web interface.

## 🔧 Hardware Components

| Component | Purpose |
|-----------|---------|
| ESP32 | Main microcontroller (WiFi-enabled) |
| pH Sensor | Measures water acidity/alkalinity |
| Turbidity Sensor | Measures water clarity (NTU) |
| Water Level Sensor | Monitors tank water level (%) |
| Buzzer | Audio alert for critical conditions |
| Relay Module | Automated valve/pump control |

## 🖥️ Dashboard Features

### 1. Landing Page
- Project overview with engineering-themed UI
- Features, tech stack, and team sections
- System architecture visualization

### 2. Real-Time Monitoring Dashboard
- **pH Value** — with color-coded status
- **Turbidity (NTU)** — with progress bar
- **Water Level (%)** — with fill indicator
- **Water Quality Status** — Good / Moderate / Poor
- **Leakage Detection** — with warning banner
- **Relay & Buzzer Status** — ON/OFF indicators

### 3. Leakage Detection Module
- Real-time leakage status banner
- Event history table
- Threshold configuration display

### 4. Water Quality Analysis
- Color-coded quality cards (Good/Moderate/Poor)
- pH scale visualization
- Quality criteria breakdown

### 5. Analytics
- pH trend chart
- Turbidity trend chart
- Water level trend chart
- Summary statistics (averages, data points)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Priyansh-Shukla14/water-quality-monitoring.git
cd water-quality-monitoring

# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at `http://localhost:5173`

## 📡 REST API Endpoints

The ESP32 communicates with the dashboard via these HTTP endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/sensors/latest` | Get latest sensor readings |
| `GET` | `/api/sensors/history` | Get historical sensor data |
| `POST` | `/api/sensors/data` | ESP32 sends new sensor data |
| `GET` | `/api/system/status` | Get system/connection status |
| `POST` | `/api/relay/control` | Control relay (ON/OFF) |
| `POST` | `/api/buzzer/control` | Control buzzer (ON/OFF) |

### ESP32 Sample Payload

```json
{
  "ph": 7.24,
  "turbidity": 3.8,
  "waterLevel": 72,
  "temperature": 26.5
}
```

## 📁 Folder Structure

```
src/
├── charts/              # Recharts chart components
│   ├── PhChart.jsx
│   ├── TurbidityChart.jsx
│   └── WaterLevelChart.jsx
├── components/
│   ├── common/          # Shared components
│   │   └── ThemeToggle.jsx
│   ├── dashboard/       # Dashboard-specific components
│   │   ├── LeakageAlert.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── SensorCard.jsx
│   │   ├── StatusIndicator.jsx
│   │   └── WaterQualityCard.jsx
│   └── layout/          # Layout components
│       ├── DashboardLayout.jsx
│       ├── Navbar.jsx
│       └── Sidebar.jsx
├── hooks/               # Custom React hooks
│   ├── useSensorData.js
│   └── useTheme.js
├── pages/               # Page components
│   ├── Analytics.jsx
│   ├── Dashboard.jsx
│   ├── LandingPage.jsx
│   ├── LeakageDetection.jsx
│   └── WaterQuality.jsx
├── services/            # API service layer
│   ├── api.js
│   ├── sensorService.js
│   └── systemService.js
├── utils/               # Utilities & constants
│   ├── constants.js
│   ├── helpers.js
│   └── mockData.js
├── App.jsx
├── index.css
└── main.jsx
```

## 🎨 UI Features

- **Dark/Light mode** with system preference detection
- **Blue/Teal IoT theme** with gradient accents
- **Glass morphism** cards with blur effects
- **Micro-animations** for hover, entrance, and pulse effects
- **Responsive design** for mobile, tablet, and desktop
- **Collapsible sidebar** for dashboard navigation

## 🛠️ Tech Stack

- **React 19** — UI framework
- **Vite 6** — Build tool
- **Tailwind CSS 4** — Utility-first CSS
- **Recharts** — Chart library
- **React Router** — Client-side routing
- **Lucide React** — Icon library

## 📜 License

This project is part of an engineering project for academic purposes.

---

Built with ❤️ by the Water Quality Monitoring Team
