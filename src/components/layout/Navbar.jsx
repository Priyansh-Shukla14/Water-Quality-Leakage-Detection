import { Link, useLocation } from 'react-router-dom';
import { Droplets, Menu, X } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from '../common/ThemeToggle';

export default function Navbar({ isDark, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  const navLinkStyle = (active) => ({
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    color: active ? '#06b6d4' : 'var(--text-secondary)',
    background: active ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
  });

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        zIndex: 50,
        background: 'var(--bg-navbar)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        transition: 'background 0.3s ease',
      }}
    >
      <div style={{ width: '100%', maxWidth: '100%', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #06b6d4, #14b8a6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(6, 182, 212, 0.35)',
            flexShrink: 0,
          }}>
            <Droplets size={19} color="white" />
          </div>
          <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
            Aqua<span style={{ background: 'linear-gradient(135deg, #06b6d4, #14b8a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Guard</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Link to="/" style={navLinkStyle(location.pathname === '/')}>Home</Link>
          <Link to="/dashboard" style={navLinkStyle(isDashboard)}>Dashboard</Link>
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeToggle isDark={isDark} toggle={toggleTheme} />
          {/* Mobile menu btn — hidden on desktop for simplicity */}
        </div>
      </div>
    </nav>
  );
}
