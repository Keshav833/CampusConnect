import { useState, useEffect } from "react"
import { Bell, CheckCircle2, XCircle, Info, Calendar, Loader2, Check } from "lucide-react"
import axios from "axios"

export default function Notifications() {
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
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">Stay updated with your activities</p>
        </div>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={markAllAsRead}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification._id}
              onClick={() => !notification.read && markAsRead(notification._id)}
              className={`p-5 rounded-2xl border transition-all duration-200 flex gap-4 cursor-pointer ${
                notification.read 
                  ? "bg-white border-gray-100 opacity-75" 
                  : "bg-white border-indigo-100 shadow-sm shadow-indigo-50"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                notification.read ? "bg-gray-50" : "bg-indigo-50"
              }`}>
                {getIcon(notification.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between gap-4">
                  <h3 className={`text-sm font-semibold ${notification.read ? "text-gray-700" : "text-gray-900"}`}>
                    {notification.title}
                  </h3>
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className={`text-sm mt-1 mb-2 ${notification.read ? "text-gray-500" : "text-gray-600"}`}>
                  {notification.message}
                </p>
                {!notification.read && (
                  <span className="w-2 h-2 bg-indigo-500 rounded-full inline-block"></span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
