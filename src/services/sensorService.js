/**
 * Sensor Data Service
 * 
 * Handles all sensor-related API calls.
 * Falls back to mock data when the backend is unavailable.
 * 
 * ESP32 Integration:
 * The ESP32 sends sensor data via HTTP POST to /api/sensors/data
 * Example ESP32 payload:
 * {
 *   "ph": 7.24,
 *   "turbidity": 3.8,
 *   "waterLevel": 72,
 *   "temperature": 26.5
 * }
 */

import { apiService } from './api';
import { mockLatestData, mockHistoryData, generateRealtimeData } from '../utils/mockData';

// Track whether we're using mock data
let useMockData = true;
let lastMockData = { ...mockLatestData };

/**
 * GET /api/sensors/latest
 * Fetch the most recent sensor readings
 * 
 * Response format:
 * {
 *   "success": true,
 *   "data": {
 *     "ph": 7.24,
 *     "turbidity": 3.8,
 *     "waterLevel": 72,
 *     "temperature": 26.5,
 *     "quality": "Good",
 *     "leakageDetected": false,
 *     "relayStatus": false,
 *     "buzzerStatus": false,
 *     "timestamp": "2026-06-21T16:30:00.000Z"
 *   }
 * }
 */
export async function getLatestSensorData() {
  const result = await apiService.get('/api/sensors/latest');

  if (result.success) {
    useMockData = false;

    // Server returns: { success: true, data: { ph, turbidity, ... } }
    // apiService wraps it as:  { success: true, data: { success: true, data: {...} } }
    // So real sensor data is at result.data.data
    const sensorData = result.data?.data ?? result.data;

    // Always show real ESP32 data — no isMock flag when server is reachable
    return { success: true, data: sensorData, isMock: false };
  }

  // Only use mock data when server is completely unreachable
  useMockData = true;
  lastMockData = generateRealtimeData(lastMockData);
  console.warn('[sensorService] Server unreachable — showing mock data');
  return { success: true, data: lastMockData, isMock: true };
}

/**
 * GET /api/sensors/history?hours=24
 * Fetch historical sensor data
 * 
 * Query parameters:
 * - hours: Number of hours of history (default: 24)
 * - limit: Maximum number of data points (default: 288)
 * 
 * Response format:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "timestamp": "2026-06-21T16:30:00.000Z",
 *       "ph": 7.24,
 *       "turbidity": 3.8,
 *       "waterLevel": 72
 *     },
 *     ...
 *   ]
 * }
 */
export async function getSensorHistory(hours = 24) {
  const result = await apiService.get('/api/sensors/history', { hours });
  
  if (result.success) {
    // Unwrap backend's { success, data: [...] } envelope
    const historyArray = result.data?.data ?? result.data;
    return { success: true, data: historyArray };
  }
  
  // Fallback to mock history
  return { success: true, data: mockHistoryData, isMock: true };
}

/**
 * POST /api/sensors/data
 * Used by ESP32 to send new sensor readings
 * 
 * Request body:
 * {
 *   "ph": 7.24,
 *   "turbidity": 3.8,
 *   "waterLevel": 72,
 *   "temperature": 26.5
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Data recorded successfully",
 *   "id": 12345
 * }
 */
export async function postSensorData(sensorData) {
  return apiService.post('/api/sensors/data', sensorData);
}

/**
 * Check if we're currently using mock data
 */
export function isUsingMockData() {
  return useMockData;
}
