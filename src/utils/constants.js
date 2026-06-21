// API Base URL - Change this when deploying
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Sensor thresholds
export const PH_THRESHOLDS = {
  GOOD_MIN: 6.5,
  GOOD_MAX: 8.5,
  MODERATE_MIN: 5.5,
  MODERATE_MAX: 9.5,
};

export const TURBIDITY_THRESHOLDS = {
  GOOD_MAX: 5,      // NTU
  MODERATE_MAX: 20,  // NTU
};

export const WATER_LEVEL_THRESHOLDS = {
  NORMAL_MIN: 30,    // %
  LEAKAGE_DROP: 15,  // % drop per reading cycle
  CRITICAL_LOW: 10,  // %
};

// Quality status colors
export const QUALITY_COLORS = {
  Good: {
    bg: 'rgba(16, 185, 129, 0.1)',
    border: '#10b981',
    text: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
  Moderate: {
    bg: 'rgba(245, 158, 11, 0.1)',
    border: '#f59e0b',
    text: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  Poor: {
    bg: 'rgba(239, 68, 68, 0.1)',
    border: '#ef4444',
    text: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
  },
};

// Refresh intervals (ms)
export const REFRESH_INTERVALS = {
  SENSOR_DATA: 3000,
  SYSTEM_STATUS: 5000,
  HISTORY_DATA: 30000,
};

// Chart colors
export const CHART_COLORS = {
  ph: '#06b6d4',
  turbidity: '#8b5cf6',
  waterLevel: '#14b8a6',
  grid: '#e2e8f0',
  gridDark: '#334155',
};

// Navigation items
export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Leakage Detection', path: '/dashboard/leakage', icon: 'Droplets' },
  { label: 'Water Quality', path: '/dashboard/quality', icon: 'FlaskConical' },
  { label: 'Analytics', path: '/dashboard/analytics', icon: 'BarChart3' },
];

// Team members
export const TEAM_MEMBERS = [
  { name: 'Team Member 1', role: 'Hardware Design & ESP32', avatar: '🔧' },
  { name: 'Team Member 2', role: 'Sensor Integration', avatar: '📡' },
  { name: 'Team Member 3', role: 'Frontend Development', avatar: '💻' },
  { name: 'Team Member 4', role: 'Backend & IoT', avatar: '🌐' },
];

// Features list
export const FEATURES = [
  {
    title: 'Real-Time pH Monitoring',
    description: 'Continuous pH level monitoring with instant alerts for out-of-range values.',
    icon: 'FlaskConical',
  },
  {
    title: 'Turbidity Analysis',
    description: 'Measure water clarity using advanced turbidity sensors for quality assessment.',
    icon: 'Eye',
  },
  {
    title: 'Leakage Detection',
    description: 'Automatic detection of water tank leaks with immediate alarm activation.',
    icon: 'ShieldAlert',
  },
  {
    title: 'Water Level Tracking',
    description: 'Real-time water level monitoring with historical trends and analytics.',
    icon: 'Waves',
  },
  {
    title: 'Smart Alerts',
    description: 'Buzzer and relay-based alert system triggered by abnormal conditions.',
    icon: 'Bell',
  },
  {
    title: 'IoT Dashboard',
    description: 'Beautiful real-time dashboard accessible from any device over WiFi.',
    icon: 'Monitor',
  },
];

// Tech stack
export const TECH_STACK = [
  { name: 'ESP32', category: 'Hardware', icon: '🔌' },
  { name: 'pH Sensor', category: 'Sensor', icon: '🧪' },
  { name: 'Turbidity Sensor', category: 'Sensor', icon: '🔬' },
  { name: 'Water Level Sensor', category: 'Sensor', icon: '🌊' },
  { name: 'React.js', category: 'Frontend', icon: '⚛️' },
  { name: 'Vite', category: 'Build Tool', icon: '⚡' },
  { name: 'Tailwind CSS', category: 'Styling', icon: '🎨' },
  { name: 'Recharts', category: 'Visualization', icon: '📊' },
  { name: 'REST API', category: 'Communication', icon: '🔗' },
  { name: 'WiFi (HTTP)', category: 'Connectivity', icon: '📶' },
  { name: 'Buzzer', category: 'Actuator', icon: '🔔' },
  { name: 'Relay Module', category: 'Actuator', icon: '⚙️' },
];
