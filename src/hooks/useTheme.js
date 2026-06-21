import { useState, useEffect } from 'react';

/**
 * Custom hook for dark/light theme management
 * Persists preference to localStorage
 */
export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('aquaguard-theme');
    if (saved !== null) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('aquaguard-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => setIsDark(prev => !prev);

  return { isDark, toggle };
}
