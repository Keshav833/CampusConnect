import { useState, useEffect } from "react"
import { Bell, CheckCircle2, XCircle, Info, Calendar, Loader2, Check } from "lucide-react"
import { useTranslation } from "react-i18next"
import axios from "axios"

export default function Notifications() {
  const { t } = useTranslation()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNotifications(res.data)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n))
    } catch (error) {
      console.error("Error marking as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNotifications(notifications.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case "approval": return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case "rejection": return <XCircle className="w-5 h-5 text-red-500" />
      case "registration": return <Calendar className="w-5 h-5 text-blue-500" />
      case "reminder": return <Bell className="w-5 h-5 text-amber-500" />
      default: return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("student.notifications.title")}</h1>
          <p className="text-gray-500 mt-1">{t("student.notifications.subtitle")}</p>
        </div>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={markAllAsRead}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all active:scale-95"
          >
            <Check className="w-4 h-4" />
            {t("student.notifications.markAllRead")}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">{t("student.notifications.noNotifications")}</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification._id}
              onClick={() => !notification.read && markAsRead(notification._id)}
              className={`p-5 rounded-2xl border transition-all duration-300 flex gap-4 cursor-pointer group hover:scale-[1.01] ${
                notification.read 
                  ? "bg-white border-gray-100 opacity-80" 
                  : "bg-white border-indigo-100 shadow-sm shadow-indigo-100/50 ring-1 ring-indigo-50"
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                notification.read ? "bg-gray-50" : "bg-indigo-50 group-hover:bg-indigo-100"
              }`}>
                {getIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <h3 className={`text-sm font-bold truncate ${notification.read ? "text-gray-700" : "text-gray-900"}`}>
                    {notification.title}
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md shrink-0">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${notification.read ? "text-gray-500" : "text-gray-600"}`}>
                  {notification.message}
                </p>
                {!notification.read && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">New</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
