import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { io } from "socket.io-client";

export default function OrganizerLayout() {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!token || userRole !== 'organizer' || !userData.id) return;

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

  if (!token || userRole !== 'organizer') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="organizer" unreadNotifications={unreadCount} />
      <main className="flex-1 ml-0 md:ml-64 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
