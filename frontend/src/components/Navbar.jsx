import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="w-full px-8 py-4 flex items-center justify-between border-b bg-white">
      <Link to="/">
        <h1 className="text-xl font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">CampusConnect</h1>
      </Link>

      <div className="flex items-center gap-6 text-sm hidden md:flex">
        <Link to="/events" className="hover:text-indigo-600">
          Events
        </Link>
        <Link to="/my-events" className="hover:text-indigo-600">
          My Registrations
        </Link>
        <Link to="/notifications" className="hover:text-indigo-600">
          Notifications
        </Link>
        <Link to="/profile" className="hover:text-indigo-600">
          Profile
        </Link>
        <Link to="/login">
          <Button variant="outline" size="sm">
            Login
          </Button>
        </Link>
      </div>
      
      {/* Mobile Menu Placeholder - minimal */}
       <div className="md:hidden">
          <Link to="/events">Menu</Link>
       </div>
    </nav>
  )
}
