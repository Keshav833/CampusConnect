import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { OrganizerNavbar } from './OrganizerNavbar';

export default function OrganizerLayout() {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Simple authentication and role check
  if (!token || userRole !== 'organizer') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <OrganizerNavbar />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
