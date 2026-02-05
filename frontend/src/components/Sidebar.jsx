import { 
  LayoutDashboard, 
  Calendar, 
  Bell, 
  User, 
  LogOut, 
  CheckCircle, 
  History,
  Users,
  Search,
  Menu,
  ChevronLeft
} from "lucide-react"

import { NavLink, useNavigate } from "react-router-dom"

export function Sidebar({ role, unreadNotifications = 0, isCollapsed = false, onToggle }) {
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
      { id: "my-events", label: "My Events", path: "/organizer/events", icon: Calendar },
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
    <aside 
      className={`h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 hidden md:flex z-50 transition-all duration-300 ${
        isCollapsed ? "w-[72px]" : "w-[240px]"
      }`}
    >
      <div className={`p-6 border-b border-gray-50 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate">
              Campus Connect
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              {role} Portal
            </p>
          </div>
        )}
        {isCollapsed && (
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shrink-0">
             <span className="text-white font-bold text-lg">C</span>
           </div>
        )}
        <button 
          onClick={onToggle}
          className={`p-2 rounded-lg hover:bg-gray-50 text-gray-400 transition-colors ${!isCollapsed ? "ml-2" : ""}`}
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50"
                  : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
              } ${isCollapsed ? "justify-center" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 shrink-0 transition-opacity ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60]">
                    {item.label}
                  </div>
                )}

                {item.id === "notifications" && unreadNotifications > 0 && (
                  <span className={`${isCollapsed ? "absolute top-2 right-2" : "ml-auto"} w-2 h-2 bg-red-500 rounded-full animate-pulse`}></span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors group relative ${isCollapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-5 h-5 opacity-70 group-hover:opacity-100 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60]">
              Logout
            </div>
          )}
        </button>
      </div>
    </aside>
  )
}
