import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
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
      // Optional: Show a browser notification or a custom toast
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
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        role="student" 
        unreadNotifications={unreadCount} 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      <main className={`flex-1 transition-all duration-300 p-6 overflow-y-auto ${isCollapsed ? "ml-[72px]" : "ml-[240px]"}`}>
        <Outlet />
      </main>
    </div>
  );
}
