/**
 * System Service
 * 
 * Handles system status, relay control, and buzzer control API calls.
 * 
 * ESP32 Control Endpoints:
 * - POST /api/relay/control   → { "state": true/false }
 * - POST /api/buzzer/control  → { "state": true/false }
 */

import { apiService } from './api';
import { mockSystemStatus } from '../utils/mockData';

/**
 * GET /api/system/status
 * Get current system status including ESP32 connectivity
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "esp32Connected": true,
 *     "wifiStrength": -45,
 *     "uptime": "4h 23m 12s",
 *     "lastUpdate": "2026-06-21T16:30:00.000Z",
 *     "sensorStatus": {
 *       "ph": "online",
 *       "turbidity": "online",
 *       "waterLevel": "online"
 *     },
 *     "firmwareVersion": "1.2.0",
 *     "ipAddress": "192.168.1.105"
 *   }
 * }
 */
export async function getSystemStatus() {
  const result = await apiService.get('/api/system/status');
  
  if (result.success) {
    // Unwrap backend's { success, data: {...} } envelope
    const statusData = result.data?.data ?? result.data;
    return { success: true, data: statusData };
  }
  
  return {
    success: true,
    data: { ...mockSystemStatus, lastUpdate: new Date().toISOString() },
    isMock: true,
  };
}

/**
 * POST /api/relay/control
 * Control the relay module (ON/OFF)
 * 
 * Request: { "state": true }  → Turn relay ON
 * Request: { "state": false } → Turn relay OFF
 * 
 * Response: { "success": true, "relayState": true }
 */
export async function controlRelay(state) {
  const result = await apiService.post('/api/relay/control', { state });
  
  if (result.success) {
    return result;
  }
  
  // Mock response
  return { success: true, data: { relayState: state }, isMock: true };
}

/**
 * POST /api/buzzer/control
 * Control the buzzer (ON/OFF)
 * 
 * Request: { "state": true }  → Turn buzzer ON
 * Request: { "state": false } → Turn buzzer OFF
 * 
 * Response: { "success": true, "buzzerState": true }
 */
export async function controlBuzzer(state) {
  const result = await apiService.post('/api/buzzer/control', { state });
  
  if (result.success) {
    return result;
  }
  
  // Mock response
  return { success: true, data: { buzzerState: state }, isMock: true };
}
