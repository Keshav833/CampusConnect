import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export default function StudentLayout() {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token || userRole !== 'student') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar role="student" />
      <main className="flex-1 ml-0 md:ml-64 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
