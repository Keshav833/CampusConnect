import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

const AdminLayout = () => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!token || userRole !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar 
        role="admin" 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      <main className={`flex-1 transition-all duration-300 p-10 overflow-y-auto ${isCollapsed ? "ml-[72px]" : "ml-[240px]"}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
