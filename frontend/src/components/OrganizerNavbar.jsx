import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, PlusCircle, User, LogOut } from 'lucide-react';
import { cn } from "@/lib/utils";

const navItems = [
  { 
    label: 'Dashboard', 
    path: '/organizer/dashboard', 
    icon: LayoutDashboard 
  },
  { 
    label: 'Events', 
    path: '/organizer/events', 
    icon: Calendar 
  },
  { 
    label: 'Create', 
    path: '/organizer/create', 
    icon: PlusCircle 
  },
  { 
    label: 'Profile', 
    path: '/organizer/profile', 
    icon: User 
  }
];

export function OrganizerNavbar() {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    window.location.href = '/';
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex flex-col items-center gap-1 transition-all duration-300 active:scale-90",
                  isActive ? "text-indigo-600 scale-105" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                {isActive && (
                  <div className="w-1 h-1 bg-indigo-600 rounded-full animate-in zoom-in duration-300" />
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Web Top Navigation */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
          <NavLink to="/" className="group flex items-center gap-2">
            <img 
              src="/CC.png" 
              alt="CampusConnect Logo" 
              className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" 
            />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
              CampusConnect <span className="text-xs text-gray-400 font-sans tracking-widest uppercase ml-1">Organizer</span>
            </h1>
          </NavLink>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-6 text-sm text-slate-500 font-medium">
              <span className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <User className="w-4 h-4" />
              </span>
              Coding Club
            </div>
            
            <div className="flex items-center gap-4 border-l pl-6 border-slate-200">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => cn(
                      "flex items-center gap-2 py-2 px-3 rounded-xl transition-all duration-300 font-bold text-sm",
                      isActive 
                        ? "text-indigo-600 bg-indigo-50" 
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </NavLink>
                );
              })}
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 py-2 px-3 rounded-xl transition-all duration-300 font-bold text-sm text-red-500 hover:bg-red-50 ml-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer for Top Nav on Desktop */}
      <div className="hidden md:block h-16" />
    </>
  );
}
