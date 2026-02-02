import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <div className="fixed top-3 left-0 right-0 z-50 px-6 pointer-events-none">
      <nav className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md border border-white/20 rounded-full px-8 py-3 flex items-center justify-between shadow-xl shadow-indigo-100/20 pointer-events-auto">
        <Link to="/" className="group flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
            CampusConnect
          </h1>
        </Link>

        <div className="flex items-center gap-8 text-sm font-medium hidden md:flex">
          <Link
            to="/events"
            className="text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Events
          </Link>
          <Link
            to="/my-events"
            className="text-gray-600 hover:text-indigo-600 transition-colors"
          >
            My Registrations
          </Link>
          <Link
            to="/notifications"
            className="text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Notifications
          </Link>
          <Link
            to="/profile"
            className="text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Profile
          </Link>
          <Link to="/login">
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 shadow-md shadow-indigo-200/50 transition-all hover:scale-105 active:scale-95"
              size="sm"
            >
              Get Started
            </Button>
          </Link>
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
