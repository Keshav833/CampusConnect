import { 
  Search, 
  History, 
  LayoutDashboard, 
  Calendar, 
  CheckCircle, 
  Users
} from "lucide-react"
import { NavLink } from "react-router-dom"
import { useTranslation } from "react-i18next"

export function BottomNav({ role }) {
  const { t } = useTranslation()

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

  if (items.length === 0) return null

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 pb-safe-area-inset-bottom z-50">
      <div className="flex justify-around items-center h-16">
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 min-w-0 h-full transition-colors ${
                isActive ? "text-indigo-600" : "text-gray-400"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 mb-1 transition-transform ${isActive ? "scale-110" : ""}`} />
                <span className="text-[10px] font-medium truncate w-full text-center px-1">
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute top-0 w-8 h-1 bg-indigo-600 rounded-b-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
