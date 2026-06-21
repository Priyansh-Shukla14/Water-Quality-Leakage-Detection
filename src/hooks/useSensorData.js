import { useState, useEffect, useCallback, useRef } from 'react';
import { getLatestSensorData, getSensorHistory } from '../services/sensorService';
import { REFRESH_INTERVALS } from '../utils/constants';

/**
 * Custom hook for fetching and managing real-time sensor data
 * Automatically polls the API at configured intervals
 */
export function useSensorData() {
  const [latestData, setLatestData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMock, setIsMock] = useState(true);
  const intervalRef = useRef(null);
  const historyIntervalRef = useRef(null);

  // Fetch latest sensor data
  const fetchLatest = useCallback(async () => {
    try {
      const result = await getLatestSensorData();
      if (result.success) {
        setLatestData(result.data);
        setIsMock(!!result.isMock);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch history data
  const fetchHistory = useCallback(async (hours = 24) => {
    try {
      const result = await getSensorHistory(hours);
      if (result.success) {
        setHistoryData(result.data);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  }, []);

  // Set up polling
  useEffect(() => {
    fetchLatest();
    fetchHistory();

    intervalRef.current = setInterval(fetchLatest, REFRESH_INTERVALS.SENSOR_DATA);
    historyIntervalRef.current = setInterval(fetchHistory, REFRESH_INTERVALS.HISTORY_DATA);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (historyIntervalRef.current) clearInterval(historyIntervalRef.current);
    };
  }, [fetchLatest, fetchHistory]);

  // Manual refresh
  const refresh = useCallback(() => {
    setLoading(true);
    fetchLatest();
    fetchHistory();
  }, [fetchLatest, fetchHistory]);

  return {
    latestData,
    historyData,
    loading,
    error,
    isMock,
    refresh,
  };
}
