import { Link } from 'react-router-dom';
import {
  Droplets, FlaskConical, Eye, ShieldAlert, Waves, Bell, Monitor,
  ArrowRight, Cpu, Wifi, ExternalLink, ChevronDown,
} from 'lucide-react';
import { FEATURES, TECH_STACK, TEAM_MEMBERS } from '../utils/constants';

const iconMap = { FlaskConical, Eye, ShieldAlert, Waves, Bell, Monitor };

const S = {
  section: (bg) => ({
    padding: '96px 24px',
    background: bg || 'transparent',
  }),
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '6px 16px', borderRadius: '999px', marginBottom: '28px',
    background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)',
  },
  badgeText: { fontSize: '12px', fontWeight: 700, color: '#06b6d4', letterSpacing: '0.05em' },
  sectionLabel: { fontSize: '12px', fontWeight: 700, color: '#06b6d4', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' },
  sectionTitle: { fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 14px', letterSpacing: '-0.5px', lineHeight: 1.2 },
  sectionSub: { fontSize: '16px', color: 'var(--text-secondary)', margin: '0 auto', maxWidth: '600px', lineHeight: 1.7 },
};

export default function LandingPage() {
  return (
    <div style={{ paddingTop: '64px' }}>

      {/* ── Hero ── */}
      <section style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '80px 24px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', top: '80px', left: '-80px', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.15), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '80px', right: '-80px', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={S.badge}>
            <Cpu size={13} color="#06b6d4" />
            <span style={S.badgeText}>ESP32-Powered IoT System</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 7vw, 68px)', fontWeight: 900, letterSpacing: '-1.5px',
            lineHeight: 1.1, color: 'var(--text-primary)', margin: '0 0 24px',
          }}>
            Water Quality &amp;<br />
            <span style={{ background: 'linear-gradient(135deg, #06b6d4, #14b8a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Leakage Monitoring
            </span>
            <br />System
          </h1>

          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '560px', lineHeight: 1.7, margin: '0 auto 40px' }}>
            Real-time IoT dashboard for monitoring water quality parameters and detecting tank leakage using ESP32 microcontroller with advanced sensor integration.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '14px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: 700,
                background: 'linear-gradient(135deg, #06b6d4, #14b8a6)',
                color: 'white', border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(6,182,212,0.4)',
                transition: 'all 0.2s ease',
              }}>
                <Monitor size={18} /> Open Dashboard <ArrowRight size={16} />
              </button>
            </Link>
          </div>

          <div style={{ marginTop: '72px', animation: 'float 3s ease-in-out infinite' }}>
            <ChevronDown size={22} color="var(--text-tertiary)" />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ ...S.section('var(--bg-secondary)') }}>
        <div style={S.inner}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={S.sectionLabel}>Features</p>
            <h2 style={S.sectionTitle}>Comprehensive Monitoring</h2>
            <p style={S.sectionSub}>A complete solution for water quality assessment and leakage detection with real-time data visualization and intelligent alerts.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {FEATURES.map((f, i) => {
              const Icon = iconMap[f.icon] || Monitor;
              return (
                <div key={i} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                  borderRadius: '16px', padding: '24px',
                  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'rgba(6,182,212,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
                  }}>
                    <Icon size={22} color="#06b6d4" />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>{f.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section style={S.section()}>
        <div style={S.inner}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={S.sectionLabel}>Technology</p>
            <h2 style={S.sectionTitle}>Built With Modern Stack</h2>
            <p style={S.sectionSub}>Combining cutting-edge IoT hardware with modern web technologies for a seamless monitoring experience.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '14px' }}>
            {TECH_STACK.map((t, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                borderRadius: '14px', padding: '20px 12px', textAlign: 'center',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}>
                <div style={{ fontSize: '30px', marginBottom: '10px' }}>{t.icon}</div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>{t.name}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: 0 }}>{t.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Architecture ── */}
      <section style={{ ...S.section('var(--bg-secondary)') }}>
        <div style={S.inner}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={S.sectionLabel}>Architecture</p>
            <h2 style={S.sectionTitle}>System Architecture</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              { icon: Cpu, title: 'Hardware Layer', color: '#06b6d4', desc: 'ESP32 reads pH, Turbidity & Water Level sensors. Controls Buzzer & Relay for alerts.', tags: ['ESP32','pH','Turbidity','Level','Buzzer','Relay'] },
              { icon: Wifi, title: 'Communication', color: '#8b5cf6', desc: 'ESP32 sends data over WiFi via HTTP REST API. Supports real-time polling and push updates.', tags: ['WiFi','REST API','HTTP','JSON','Polling'] },
              { icon: Monitor, title: 'Web Dashboard', color: '#14b8a6', desc: 'React + Vite dashboard with real-time charts, alerts, and responsive design for any device.', tags: ['React','Vite','Recharts','Tailwind','Responsive'] },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                borderRadius: '16px', padding: '28px', textAlign: 'center',
              }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '16px',
                  background: `linear-gradient(135deg, ${item.color}, ${item.color}bb)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 18px',
                  boxShadow: `0 8px 24px ${item.color}33`,
                }}>
                  <item.icon size={28} color="white" />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 16px' }}>{item.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px' }}>
                  {item.tags.map(t => (
                    <span key={t} style={{
                      padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                      background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── Footer ── */}
      <footer style={{
        padding: '32px 24px', textAlign: 'center',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <Droplets size={18} color="#06b6d4" />
          <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Aqua<span style={{ background: 'linear-gradient(135deg,#06b6d4,#14b8a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Guard</span>
          </span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', margin: 0 }}>
          © {new Date().getFullYear()} Water Quality &amp; Leakage Monitoring System. Engineering Project.
        </p>
      </footer>
    </div>
  );
}
