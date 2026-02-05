import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

const AdminLayout = () => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token || userRole !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar role="admin" />
      <main className="flex-1 ml-0 md:ml-64 p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
