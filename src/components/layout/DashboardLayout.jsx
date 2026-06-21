import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';

const SIDEBAR_EXPANDED = 240;
const SIDEBAR_COLLAPSED = 72;

export default function DashboardLayout({ isMock }) {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar
        isMock={isMock}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(p => !p)}
      />
      {/* Main content — always offset by sidebar width on lg+ screens */}
      <main
        style={{
          marginLeft: `${sidebarWidth}px`,
          minHeight: 'calc(100vh - 64px)',
          background: 'var(--bg-primary)',
          transition: 'margin-left 0.3s ease',
          overflowX: 'hidden',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
