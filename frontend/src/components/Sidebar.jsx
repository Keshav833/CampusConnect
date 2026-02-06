import { 
  LayoutDashboard, 
  Calendar, 
  LogOut, 
  CheckCircle, 
  History,
  Users,
  Search,
  Menu,
  ChevronLeft
} from "lucide-react"

import { NavLink, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { LanguageSwitcher } from "./LanguageSwitcher"

export function Sidebar({ role, unreadNotifications = 0, isCollapsed = false, onToggle }) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userData")
    navigate("/login")
  }

  const menuItems = {
    student: [
      { id: "dashboard", label: t("common.dashboard"), path: "/dashboard", icon: LayoutDashboard },
      { id: "discover", label: t("common.discover"), path: "/events", icon: Search },
      { id: "schedule", label: t("common.schedule"), path: "/schedule", icon: Calendar },
      { id: "my-events", label: t("common.myEvents"), path: "/my-events", icon: History },
    ],
    organizer: [
      { id: "dashboard", label: t("common.dashboard"), path: "/organizer/dashboard", icon: LayoutDashboard },
      { id: "my-events", label: t("common.myEvents"), path: "/organizer/events", icon: Calendar },
    ],
    admin: [
      { id: "dashboard", label: t("common.dashboard"), path: "/admin/dashboard", icon: LayoutDashboard },
      { id: "pending", label: t("common.pending"), path: "/admin/pending", icon: CheckCircle },
      { id: "all-events", label: t("common.myEvents"), path: "/admin/events", icon: Calendar },
      { id: "organizers", label: t("common.organizers"), path: "/admin/organizers", icon: Users },
    ],
  }

  const items = menuItems[role] || []

  return (
    <aside 
      className={`bg-white border border-gray-100 flex flex-col md:rounded-[20px] shadow-sm transition-all duration-300 z-50 ${
        isCollapsed ? "md:w-[80px]" : "md:w-[260px]"
      } ${
        // Mobile: Fixed drawer, Desktop: Relative flex item
        "fixed inset-y-0 left-0 md:relative md:inset-auto md:h-full"
      } ${
        // Hide on mobile unless we implement a toggle for it (which usually sits in the header)
        "hidden md:flex"
      }`}
    >
      <div className={`p-6 border-b border-gray-100/50 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
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
          className={`p-2 rounded-lg hover:bg-white text-gray-400 transition-colors shadow-sm border border-transparent hover:border-gray-100 ${!isCollapsed ? "ml-2" : ""}`}
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? "bg-white text-indigo-600 shadow-sm border border-gray-100"
                  : "text-gray-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm hover:border-gray-100"
              } ${isCollapsed ? "justify-center" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 shrink-0 transition-all ${isActive ? "opacity-100 scale-110" : "opacity-60 group-hover:opacity-100 group-hover:scale-110"}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-[11px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 shadow-xl z-[60]">
                    {item.label}
                  </div>
                )}

                {item.id === "notifications" && unreadNotifications > 0 && (
                  <span className={`${isCollapsed ? "absolute top-2 right-2" : "ml-auto"} w-2 h-2 bg-red-500 rounded-full animate-pulse ring-4 ring-white`}></span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-2 border-t border-gray-100/50 space-y-1">
        <LanguageSwitcher isCollapsed={isCollapsed} />
        
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors group relative ${isCollapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-5 h-5 opacity-60 group-hover:opacity-100 shrink-0 transition-transform group-hover:translate-x-1" />
          {!isCollapsed && <span>{t("common.logout")}</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-[11px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 shadow-xl z-[60]">
              {t("common.logout")}
            </div>
          )}
        </button>
      </div>
    </aside>
  )
}
