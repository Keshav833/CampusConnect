import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export default function OrganizerLayout() {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token || userRole !== 'organizer') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="organizer" />
      <main className="flex-1 ml-0 md:ml-64 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
