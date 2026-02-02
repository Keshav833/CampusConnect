import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle2, AlertTriangle, Award, MapPin, Clock } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"

// Mock data
const mockNotifications = [
  {
    id: "1",
    type: "reminder",
    eventName: "Tech Conference 2024",
    message: "Event starts tomorrow at 10:00 AM",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
    category: "Tech",
    eventId: "1",
  },
  {
    id: "2",
    type: "update",
    eventName: "Spring Music Festival",
    message: "Venue changed to Main Campus Auditorium",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isRead: false,
    category: "Cultural",
    eventId: "2",
  },
  {
    id: "3",
    type: "registration",
    eventName: "Basketball Championship",
    message: "Registration confirmed! Event on March 25, 2024",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
    category: "Sports",
    eventId: "3",
  },
  {
    id: "4",
    type: "certificate",
    eventName: "Resume Workshop",
    message: "Your participation certificate is ready to download",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isRead: false,
    category: "Career",
    eventId: "4",
  },
  {
    id: "5",
    type: "reminder",
    eventName: "International Food Fair",
    message: "Event starts today at 12:00 PM",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    isRead: false,
    category: "Food",
    eventId: "5",
  },
  {
    id: "6",
    type: "cancellation",
    eventName: "Outdoor Yoga Session",
    message: "Event cancelled due to weather conditions. Refund processed.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: true,
    category: "Health",
    eventId: "6",
  },
  {
    id: "7",
    type: "update",
    eventName: "AI Workshop",
    message: "Time changed to 3:00 PM instead of 2:00 PM",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isRead: true,
    category: "Tech",
    eventId: "7",
  },
  {
    id: "8",
    type: "registration",
    eventName: "Startup Pitch Competition",
    message: "Successfully registered for the event",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    isRead: true,
    category: "Career",
    eventId: "8",
  },
]

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeFilter, setActiveFilter] = useState("all")

  const getNotificationIcon = (type) => {
    switch (type) {
      case "registration":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case "reminder":
        return <Bell className="w-5 h-5 text-blue-600" />
      case "update":
        return <MapPin className="w-5 h-5 text-orange-600" />
      case "cancellation":
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case "certificate":
        return <Award className="w-5 h-5 text-purple-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case "registration":
        return "bg-green-50 border-green-200"
      case "reminder":
        return "bg-blue-50 border-blue-200"
      case "update":
        return "bg-orange-50 border-orange-200"
      case "cancellation":
        return "bg-red-50 border-red-200"
      case "certificate":
        return "bg-purple-50 border-purple-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const formatTimestamp = (date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const groupNotificationsByDate = (notifs) => {
    const today = []
    const yesterday = []
    const earlier = []

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000)

    notifs.forEach((notif) => {
      // Ensure timestamp is Date object in case it's stringified
      const ts = new Date(notif.timestamp)
      if (ts >= todayStart) {
        today.push(notif)
      } else if (ts >= yesterdayStart) {
        yesterday.push(notif)
      } else {
        earlier.push(notif)
      }
    })

    return { today, yesterday, earlier }
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const markAsRead = (id) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "all") return true
    if (activeFilter === "unread") return !n.isRead
    if (activeFilter === "reminders") return n.type === "reminder"
    if (activeFilter === "updates") return n.type === "update"
    return true
  })

  const { today, yesterday, earlier } = groupNotificationsByDate(filteredNotifications)
  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="min-h-screen bg-background">

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
              Mark all as read
            </Button>
            <Button variant="ghost" size="sm" onClick={clearAll} disabled={notifications.length === 0}>
              Clear all
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("all")}
          >
            All
            {activeFilter === "all" && notifications.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {notifications.length}
              </Badge>
            )}
          </Button>
          <Button
            variant={activeFilter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("unread")}
          >
            Unread
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </Button>
          <Button
            variant={activeFilter === "reminders" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("reminders")}
          >
            Reminders
          </Button>
          <Button
            variant={activeFilter === "updates" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("updates")}
          >
            Updates
          </Button>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No notifications yet</h3>
            <p className="text-muted-foreground">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Today */}
            {today.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground mb-3">Today</h2>
                <div className="space-y-2">
                  {today.map((notification) => (
                    <Link
                      key={notification.id}
                      to={notification.eventId ? `/events/${notification.eventId}` : "/my-events"}
                      onClick={() => markAsRead(notification.id)}
                      className="block"
                    >
                      <div
                        className={`p-4 rounded-lg border ${getNotificationColor(notification.type)} hover:shadow-md transition-shadow ${
                          !notification.isRead ? "border-l-4" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-semibold text-foreground text-sm">{notification.eventName}</h3>
                              {!notification.isRead && (
                                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {notification.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Yesterday */}
            {yesterday.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground mb-3">Yesterday</h2>
                <div className="space-y-2">
                  {yesterday.map((notification) => (
                    <Link
                      key={notification.id}
                      to={notification.eventId ? `/events/${notification.eventId}` : "/my-events"}
                      onClick={() => markAsRead(notification.id)}
                      className="block"
                    >
                      <div
                        className={`p-4 rounded-lg border ${getNotificationColor(notification.type)} hover:shadow-md transition-shadow ${
                          !notification.isRead ? "border-l-4" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-semibold text-foreground text-sm">{notification.eventName}</h3>
                              {!notification.isRead && (
                                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {notification.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Earlier */}
            {earlier.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground mb-3">Earlier</h2>
                <div className="space-y-2">
                  {earlier.map((notification) => (
                    <Link
                      key={notification.id}
                      to={notification.eventId ? `/events/${notification.eventId}` : "/my-events"}
                      onClick={() => markAsRead(notification.id)}
                      className="block"
                    >
                      <div
                        className={`p-4 rounded-lg border ${getNotificationColor(notification.type)} hover:shadow-md transition-shadow ${
                          !notification.isRead ? "border-l-4" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-semibold text-foreground text-sm">{notification.eventName}</h3>
                              {!notification.isRead && (
                                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {notification.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
