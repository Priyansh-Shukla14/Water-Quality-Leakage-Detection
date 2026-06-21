import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

export default function DashboardLayout({ isMock }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const sidebarWidth = sidebarCollapsed ? 72 : 240;

  return (
    <div className="flex min-h-screen pt-16">
      <Sidebar
        isMock={isMock}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
      />
      <main
        className="flex-1 w-0 transition-all duration-300"
        style={{
          background: 'var(--bg-primary)',
          marginLeft: isDesktop ? `${sidebarWidth}px` : '0',
        }}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
