import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ isDark, toggle }) {
  return (
    <button
      id="theme-toggle"
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative w-14 h-7 rounded-full transition-colors duration-300 cursor-pointer"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #1e293b, #334155)'
          : 'linear-gradient(135deg, #06b6d4, #14b8a6)',
        border: `1px solid ${isDark ? '#475569' : '#0891b2'}`,
      }}
    >
      <div
        className="absolute top-0.5 flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300"
        style={{
          left: isDark ? '28px' : '2px',
          background: isDark ? '#0f172a' : '#ffffff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        {isDark ? (
          <Moon size={13} color="#94a3b8" />
        ) : (
          <Sun size={13} color="#f59e0b" />
        )}
      </div>
    </button>
  );
}
