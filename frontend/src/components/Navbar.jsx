import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole');
    if (storedToken && storedToken !== 'null') {
      setToken(storedToken);
      setUserRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    setToken(null);
    setUserRole(null);
    navigate('/');
  };

  const dashboardPath = userRole === 'student' ? '/events' : '/organizer/dashboard';

  return (
    <div className="fixed top-3 left-0 right-0 z-50 px-6 pointer-events-none">
      <nav className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md border border-white/20 rounded-full px-8 py-3 flex items-center justify-between shadow-xl shadow-indigo-100/20 pointer-events-auto">
        <Link to="/" className="group flex items-center gap-2">
          <img 
            src="/CC.png" 
            alt="CampusConnect Logo" 
            className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" 
          />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
            CampusConnect
          </h1>
        </Link>

        <div className="flex items-center gap-10 text-sm font-medium hidden md:flex">
          <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">
            Features
          </a>
          <a href="#students" className="text-gray-600 hover:text-indigo-600 transition-colors">
            Students
          </a>
          <a href="#organizers" className="text-gray-600 hover:text-indigo-600 transition-colors">
            Organizers
          </a>
          <a href="#how-it-works" className="text-gray-600 hover:text-indigo-600 transition-colors">
            How it Works
          </a>
        </div>

        <div className="flex items-center gap-4 hidden md:flex">
          {!token ? (
            <>
              <Link to="/role-selection" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors px-4">
                Login
              </Link>
              <Link to="/role-selection">
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 shadow-md shadow-indigo-200/50 transition-all hover:scale-105 active:scale-95"
                  size="sm"
                >
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to={dashboardPath}>
                <Button
                  variant="ghost"
                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-full px-4 flex items-center gap-2 font-bold"
                  size="sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full px-4 flex items-center gap-2 font-bold"
                size="sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden">
          <Button variant="ghost" size="sm" className="rounded-full">
            <span className="font-semibold">Menu</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
