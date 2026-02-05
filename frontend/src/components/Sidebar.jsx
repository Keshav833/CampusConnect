import { NavLink, useNavigate } from "react-router-dom"
import { 
  LayoutDashboard, 
  Calendar, 
  PlusCircle, 
  Bell, 
  User, 
  LogOut, 
  CheckCircle, 
  History,
  Users,
  Search
} from "lucide-react"

export function Sidebar({ role }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userData")
    navigate("/login")
  }

  const menuItems = {
    student: [
      { id: "discover", label: "Discover Events", path: "/events", icon: Search },
      { id: "my-events", label: "My Events", path: "/my-events", icon: History },
      { id: "notifications", label: "Notifications", path: "/notifications", icon: Bell },
      { id: "profile", label: "Profile", path: "/profile", icon: User },
    ],
    organizer: [
      { id: "dashboard", label: "Dashboard", path: "/organizer/dashboard", icon: LayoutDashboard },
      { id: "create", label: "Create Event", path: "/organizer/create", icon: PlusCircle },
      { id: "my-events", label: "My Events", path: "/organizer/events", icon: Calendar },
      { id: "notifications", label: "Notifications", path: "/notifications", icon: Bell },
      { id: "profile", label: "Profile", path: "/organizer/profile", icon: User },
    ],
    admin: [
      { id: "dashboard", label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      { id: "pending", label: "Pending Events", path: "/admin/pending", icon: CheckCircle },
      { id: "all-events", label: "All Events", path: "/admin/events", icon: Calendar },
      { id: "organizers", label: "Organizers", path: "/admin/organizers", icon: Users },
    ],
  }

  const items = menuItems[role] || []

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 hidden md:flex z-50">
      <div className="p-6 border-b border-gray-50">
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Campus Connect
        </h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
          {role} Portal
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50"
                  : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
              }`
            }
          >
            <item.icon className="w-5 h-5 opacity-70" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5 opacity-70" />
          Logout
        </button>
      </div>
    </aside>
  )
}
