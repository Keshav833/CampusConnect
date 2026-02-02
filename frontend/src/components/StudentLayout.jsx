import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import StudentNavbar from './StudentNavbar';

export default function StudentLayout() {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Simple authentication and role check
  if (!token || userRole !== 'student') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <StudentNavbar />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
