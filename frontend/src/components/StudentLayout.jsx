import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { PortalHeader } from './PortalHeader';
import { BottomNav } from './BottomNav';
import { io } from "socket.io-client";

export default function StudentLayout() {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!token || userRole !== 'student' || !userData.id) return;

    const socket = io(import.meta.env.VITE_BACKEND_URL);

    socket.emit("join", userData.id);

    socket.on("notification", (data) => {
      console.log("New notification received:", data);
      setUnreadCount(prev => prev + 1);
      if ("Notification" in window && window.Notification.permission === "granted") {
        new window.Notification(data.title, { body: data.message });
      }
    });

    return () => socket.disconnect();
  }, [token, userRole, userData.id]);

  if (!token || userRole !== 'student') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-[#f5f7fb] p-0 md:p-4 gap-0 md:gap-4 box-border overflow-hidden relative overflow-x-hidden">
      {/* Sidebar - Floating Left (Hidden on Mobile) */}
      <Sidebar 
        role="student" 
        unreadNotifications={unreadCount} 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Right Section Wrapper */}
      <div className="flex-1 flex flex-col gap-0 md:gap-4 min-w-0 pb-16 md:pb-0">
        {/* Header - Floating Top */}
        <PortalHeader unreadNotifications={unreadCount} />

        {/* Main Content Container - Scrollable */}
        <main className="flex-1 bg-white md:rounded-[20px] p-4 md:p-6 shadow-sm overflow-y-auto border-t md:border border-gray-100/50">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav role="student" />
    </div>
  );
}
