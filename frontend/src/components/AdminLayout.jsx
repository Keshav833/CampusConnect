import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { PortalHeader } from './PortalHeader';
import { BottomNav } from './BottomNav';

const AdminLayout = () => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!token || userRole !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-[#f5f7fb] p-0 md:p-4 gap-0 md:gap-4 box-border overflow-hidden relative">
      {/* Sidebar - Floating Left (Hidden on Mobile) */}
      <Sidebar 
        role="admin" 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Right Section Wrapper */}
      <div className="flex-1 flex flex-col gap-0 md:gap-4 min-w-0 pb-16 md:pb-0">
        {/* Header - Floating Top */}
        <PortalHeader />

        {/* Main Content Container - Scrollable */}
        <main className="flex-1 bg-white md:rounded-[20px] p-4 md:p-10 shadow-sm overflow-y-auto border-t md:border border-gray-100/50">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav role="admin" />
    </div>
  );
};

export default AdminLayout;
