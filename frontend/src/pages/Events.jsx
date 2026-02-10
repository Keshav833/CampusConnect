import { useState, useEffect, useMemo } from "react"
import { EventCard } from "@/components/EventCard"
import { EventControlBar } from "@/components/EventControlBar"
import { useTranslation } from "react-i18next"
import { Loader2, Calendar } from "lucide-react"
import axios from "axios"

export default function Events() {
  const { t, i18n } = useTranslation()
  const [events, setEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [dateFilter, setDateFilter] = useState("all")
  const [view, setView] = useState("grid")

  const categories = ["All", "Tech", "Cultural", "Sports", "Workshops", "Hackathons", "Clubs"]

  const tabs = [
    { id: "upcoming", label: t("student.myEvents.upcoming") || "Upcoming Events" },
    { id: "registered", label: t("student.myEvents.title") || "My Registered Events" },
    { id: "past", label: t("student.myEvents.past") || "Past Events" }
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        const lang = i18n.language;
        const [eventsRes, regsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/events?lang=${lang}`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/registrations/my`, {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => ({ data: [] }))
        ])

        if (Array.isArray(eventsRes.data)) {
          setEvents(eventsRes.data)
        }
        if (Array.isArray(regsRes.data)) {
          setRegistrations(regsRes.data)
        }
      } catch (err) {
        console.error("Error fetching events:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [i18n.language])

  const filteredEvents = useMemo(() => {
    if (!Array.isArray(events)) return []

    let result = []
    const now = new Date().setHours(0, 0, 0, 0)

    // 1. Tab Filtering
    if (activeTab === "upcoming") {
      result = events.filter(e => new Date(e.startDate || e.date) >= now)
    } else if (activeTab === "registered") {
      const registeredIds = new Set(registrations.map(r => r.eventId))
      result = events.filter(e => registeredIds.has(e._id || e.id))
    } else if (activeTab === "past") {
      result = events.filter(e => new Date(e.startDate || e.date) < now)
    }

    // 2. Category Filtering
    if (selectedCategory !== "All") {
      result = result.filter(e => e.category === selectedCategory)
    }

    // 3. Date Filtering
    if (dateFilter !== "all") {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      result = result.filter(e => {
        const eventDate = new Date(e.startDate || e.date)
        if (dateFilter === "today") {
          return eventDate.getTime() === today.getTime()
        }
        if (dateFilter === "week") {
          const weekEnd = new Date(today)
          weekEnd.setDate(today.getDate() + 7)
          return eventDate >= today && eventDate <= weekEnd
        }
        if (dateFilter === "month") {
          return eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear()
        }
        return true
      })
    }

    return result
  }, [events, registrations, activeTab, selectedCategory, dateFilter])

  const counts = useMemo(() => {
    const now = new Date().setHours(0, 0, 0, 0)
    return {
      upcoming: events.filter(e => new Date(e.startDate || e.date) >= now).length,
      registered: registrations.length,
      past: events.filter(e => new Date(e.startDate || e.date) < now).length
    }
  }, [events, registrations])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1600px]  ">
        
        {/* Top Control Bar */}
        <EventControlBar 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          view={view}
          onViewChange={setView}
          counts={counts}
        />

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
            <p className="text-gray-400 font-medium animate-pulse">{t("student.events.loading")}</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200 animate-in fade-in duration-700">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
               <Calendar className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{t("student.events.noResults")}</h3>
            <p className="text-gray-500 mt-2 max-w-xs text-center">{t("student.events.tryDifferentFilter") || "Try adjusting your filters to find more events."}</p>
          </div>
        ) : (
          <div className={`animate-in fade-in slide-in-from-bottom-4 duration-700 ${
            view === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10" 
              : "flex flex-col gap-4"
          }`}>
            {filteredEvents.map((event) => (
              <div key={event._id || event.id} className={view === "list" ? "w-full" : ""}>
                <EventCard
                  {...event}
                  id={event._id || event.id}
                  view={view}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
