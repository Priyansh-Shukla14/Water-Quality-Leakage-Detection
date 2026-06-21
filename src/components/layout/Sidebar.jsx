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
  { label: 'Overview',          path: '/dashboard',           icon: LayoutDashboard, end: true },
  { label: 'Leakage Detection', path: '/dashboard/leakage',   icon: Droplets },
  { label: 'Water Quality',     path: '/dashboard/quality',   icon: FlaskConical },
  { label: 'Analytics',         path: '/dashboard/analytics', icon: BarChart3 },
];

export default function Sidebar({ isMock, collapsed, onToggleCollapse }) {
  const width = collapsed ? 72 : 240;

  return (
    <aside
      style={{
        position: 'fixed',
        top: '64px',
        left: 0,
        bottom: 0,
        width: `${width}px`,
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        zIndex: 40,
        overflowX: 'hidden',
      }}
    >
      {/* Logo area */}
      {!collapsed && (
        <div style={{
          padding: '20px 16px 8px',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Navigation
          </span>
        </div>
      )}
      {collapsed && <div style={{ height: '28px' }} />}

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
        {navItems.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            title={label}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: collapsed ? '12px' : '10px 12px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              color: isActive ? '#06b6d4' : 'var(--text-secondary)',
              background: isActive ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
              border: isActive ? '1px solid rgba(6, 182, 212, 0.2)' : '1px solid transparent',
              transition: 'all 0.2s ease',
              justifyContent: collapsed ? 'center' : 'flex-start',
            })}
          >
            <Icon size={20} style={{ flexShrink: 0 }} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Connection status badge */}
      <div style={{ padding: '12px 10px 20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: collapsed ? '10px' : '10px 12px',
          borderRadius: '10px',
          background: 'var(--bg-tertiary)',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          {isMock
            ? <WifiOff size={15} color="#f59e0b" />
            : <Wifi size={15} color="#10b981" />
          }
          {!collapsed && (
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
              {isMock ? 'Demo Mode' : 'ESP32 Connected'}
            </span>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggleCollapse}
        style={{
          position: 'absolute',
          top: '50%',
          right: '-12px',
          transform: 'translateY(-50%)',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-tertiary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: 'var(--shadow-md)',
          transition: 'all 0.2s ease',
        }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>
    </aside>
  );
}
