import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Droplets,
  FlaskConical,
  BarChart3,
  Wifi,
  WifiOff,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Leakage Detection', path: '/dashboard/leakage', icon: Droplets },
  { label: 'Water Quality', path: '/dashboard/quality', icon: FlaskConical },
  { label: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
];

export default function Sidebar({ isMock, collapsed, onToggleCollapse }) {
  return (
    <aside
      className="hidden lg:flex flex-col fixed left-0 top-16 bottom-0 z-40 transition-all duration-300"
      style={{
        width: collapsed ? '72px' : '240px',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
      }}
    >
      {/* Nav items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium no-underline transition-all duration-200"
            style={({ isActive }) => ({
              color: isActive ? '#06b6d4' : 'var(--text-secondary)',
              background: isActive ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
            })}
            title={collapsed ? label : undefined}
          >
            <Icon size={20} style={{ flexShrink: 0 }} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Connection status */}
      <div className="px-3 pb-4">
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
          style={{ background: 'var(--bg-tertiary)' }}
        >
          {isMock ? (
            <WifiOff size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
          ) : (
            <Wifi size={16} color="#10b981" style={{ flexShrink: 0 }} />
          )}
          {!collapsed && (
            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
              {isMock ? 'Demo Mode' : 'ESP32 Connected'}
            </span>
          )}
        </div>
      </div>

      {/* Collapse button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-colors"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-tertiary)',
        }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}
