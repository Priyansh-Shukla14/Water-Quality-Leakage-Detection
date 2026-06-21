/**
 * Base API Service
 * 
 * Handles all HTTP requests to the ESP32 backend server.
 * 
 * REST API Endpoints:
 * ─────────────────────────────────────────────────────────
 * GET  /api/sensors/latest    → Get latest sensor readings
 * GET  /api/sensors/history   → Get historical sensor data
 * POST /api/sensors/data      → ESP32 sends sensor data
 * GET  /api/system/status     → Get system/connection status
 * POST /api/relay/control     → Control relay ON/OFF
 * POST /api/buzzer/control    → Control buzzer ON/OFF
 * ─────────────────────────────────────────────────────────
 */

import { API_BASE_URL } from '../utils/constants';

class ApiService {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
}

export const apiService = new ApiService();
export default ApiService;
