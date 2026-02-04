import React from 'react';
import { NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token || userRole !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 text-zinc-400 p-8 flex flex-col fixed h-full border-r border-zinc-800">
        <h1 className="text-white text-xl font-bold mb-10">Campus Connect (Admin)</h1>
        <nav className="flex flex-col gap-2">
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => `px-4 py-3 rounded-md font-medium transition-colors ${isActive ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-900 hover:text-white'}`}
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/admin/pending" 
            className={({ isActive }) => `px-4 py-3 rounded-md font-medium transition-colors ${isActive ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-900 hover:text-white'}`}
          >
            Pending Events
          </NavLink>
          <NavLink 
            to="/admin/events" 
            className={({ isActive }) => `px-4 py-3 rounded-md font-medium transition-colors ${isActive ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-900 hover:text-white'}`}
          >
            All Events
          </NavLink>
          <NavLink 
            to="/admin/organizers" 
            className={({ isActive }) => `px-4 py-3 rounded-md font-medium transition-colors ${isActive ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-900 hover:text-white'}`}
          >
            Organizers
          </NavLink>
          <button 
            onClick={handleLogout} 
            className="mt-4 px-4 py-3 rounded-md font-medium text-left hover:bg-zinc-900 hover:text-white transition-colors"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
