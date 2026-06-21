import { Link, useLocation } from 'react-router-dom';
import { Droplets, Menu, X } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from '../common/ThemeToggle';

export default function Navbar({ isDark, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: 'var(--bg-navbar)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #14b8a6)',
                boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
              }}
            >
              <Droplets size={20} color="white" />
            </div>
            <div>
              <span
                className="text-lg font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                Aqua<span className="gradient-text">Guard</span>
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline"
              style={{
                color: location.pathname === '/' ? '#06b6d4' : 'var(--text-secondary)',
                background: location.pathname === '/' ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
              }}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline"
              style={{
                color: isDashboard ? '#06b6d4' : 'var(--text-secondary)',
                background: isDashboard ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
              }}
            >
              Dashboard
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle isDark={isDark} toggle={toggleTheme} />

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg transition-colors cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden animate-fade-in"
          style={{
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium no-underline"
              style={{ color: 'var(--text-secondary)' }}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium no-underline"
              style={{ color: 'var(--text-secondary)' }}
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
