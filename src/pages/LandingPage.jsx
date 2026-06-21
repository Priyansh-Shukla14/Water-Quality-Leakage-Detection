import { Link } from 'react-router-dom';
import {
  Droplets,
  FlaskConical,
  Eye,
  ShieldAlert,
  Waves,
  Bell,
  Monitor,
  ArrowRight,
  Cpu,
  Wifi,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { FEATURES, TECH_STACK, TEAM_MEMBERS } from '../utils/constants';

const iconMap = {
  FlaskConical,
  Eye,
  ShieldAlert,
  Waves,
  Bell,
  Monitor,
};

export default function LandingPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: 'calc(100vh - 64px)' }}
      >
        {/* Background gradient orbs */}
        <div
          className="absolute top-20 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #14b8a6)' }}
        />
        <div
          className="absolute bottom-20 -right-32 w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center"
          style={{ minHeight: 'calc(100vh - 64px)' }}
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-fade-in-up"
            style={{
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
            }}
          >
            <Cpu size={14} color="#06b6d4" />
            <span className="text-xs font-semibold" style={{ color: '#06b6d4' }}>
              ESP32-Powered IoT System
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight animate-fade-in-up"
            style={{ color: 'var(--text-primary)', animationDelay: '0.1s' }}
          >
            Water Quality &
            <br />
            <span className="gradient-text">Leakage Monitoring</span>
            <br />
            System
          </h1>

          {/* Subtitle */}
          <p
            className="max-w-2xl mt-6 text-lg sm:text-xl leading-relaxed animate-fade-in-up"
            style={{ color: 'var(--text-secondary)', animationDelay: '0.2s' }}
          >
            Real-time IoT dashboard for monitoring water quality parameters and detecting
            tank leakage using ESP32 microcontroller with advanced sensor integration.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center gap-4 mt-10 animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            <Link to="/dashboard" className="no-underline">
              <button className="gradient-btn flex items-center gap-2 text-base">
                <Monitor size={18} />
                Open Dashboard
                <ArrowRight size={16} />
              </button>
            </Link>
            <a
              href="https://github.com/Priyansh-Shukla14"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              <button
                className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <ExternalLink size={18} />
                View on GitHub
              </button>
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 animate-float">
            <ChevronDown size={24} color="var(--text-tertiary)" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: '#06b6d4' }}>
              Features
            </p>
            <h2 className="section-heading" style={{ color: 'var(--text-primary)' }}>
              Comprehensive Monitoring
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-base" style={{ color: 'var(--text-secondary)' }}>
              A complete solution for water quality assessment and leakage detection
              with real-time data visualization and intelligent alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {FEATURES.map((feature, idx) => {
              const FeatureIcon = iconMap[feature.icon] || Monitor;
              return (
                <div
                  key={idx}
                  className="glass-card p-6 group"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(20,184,166,0.1))',
                    }}
                  >
                    <FeatureIcon size={24} color="#06b6d4" />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: '#06b6d4' }}>
              Technology
            </p>
            <h2 className="section-heading" style={{ color: 'var(--text-primary)' }}>
              Built With Modern Stack
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-base" style={{ color: 'var(--text-secondary)' }}>
              Combining cutting-edge IoT hardware with modern web technologies
              for a seamless monitoring experience.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 stagger-children">
            {TECH_STACK.map((tech, idx) => (
              <div
                key={idx}
                className="glass-card p-4 text-center group"
              >
                <div className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-125">
                  {tech.icon}
                </div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {tech.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                  {tech.category}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture overview */}
      <section className="py-24 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: '#06b6d4' }}>
              Architecture
            </p>
            <h2 className="section-heading" style={{ color: 'var(--text-primary)' }}>
              System Architecture
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Hardware Layer */}
            <div className="glass-card p-6 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}
              >
                <Cpu size={32} color="white" />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Hardware Layer
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                ESP32 reads pH, Turbidity, and Water Level sensors. Controls Buzzer & Relay for alerts.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['ESP32', 'pH', 'Turbidity', 'Level', 'Buzzer', 'Relay'].map(t => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium"
                    style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Communication */}
            <div className="glass-card p-6 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
              >
                <Wifi size={32} color="white" />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Communication
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                ESP32 sends data over WiFi via HTTP REST API. Supports real-time polling and push updates.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['WiFi', 'REST API', 'HTTP', 'JSON', 'Polling'].map(t => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium"
                    style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Dashboard */}
            <div className="glass-card p-6 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}
              >
                <Monitor size={32} color="white" />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Web Dashboard
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                React + Vite dashboard with real-time charts, alerts, and responsive design for any device.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['React', 'Vite', 'Recharts', 'Tailwind', 'Responsive'].map(t => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium"
                    style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: '#06b6d4' }}>
              Team
            </p>
            <h2 className="section-heading" style={{ color: 'var(--text-primary)' }}>
              Meet the Team
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {TEAM_MEMBERS.map((member, idx) => (
              <div key={idx} className="glass-card p-6 text-center group">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(20,184,166,0.1))',
                  }}
                >
                  {member.avatar}
                </div>
                <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                  {member.name}
                </h3>
                <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-4 text-center"
        style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Droplets size={18} color="#06b6d4" />
          <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
            Aqua<span className="gradient-text">Guard</span>
          </span>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          © {new Date().getFullYear()} Water Quality & Leakage Monitoring System. Engineering Project.
        </p>
      </footer>
    </div>
  );
}
