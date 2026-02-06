import React, { useState, useEffect, useMemo } from "react"
import { EventCard } from "@/components/EventCard"
import { EventControlBar } from "@/components/EventControlBar"
import { Link } from "react-router-dom"
import { Calendar, Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import axios from "axios"

export default function MyEvents() {
  const { t } = useTranslation()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [dateFilter, setDateFilter] = useState("all")
  const [view, setView] = useState("grid")

  const categories = ["All", "Tech", "Cultural", "Sports", "Workshops", "Hackathons", "Clubs"]
  const tabs = [
    { id: "upcoming", label: t("student.myEvents.upcoming") || "Upcoming Events" },
    { id: "past", label: t("student.myEvents.past") || "Past Events" }
  ]

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/registrations/my`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRegistrations(res.data)
    } catch (error) {
      console.error("Error fetching registrations:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRegistrations = useMemo(() => {
    let result = [...registrations]
    const now = new Date().setHours(0, 0, 0, 0)

    // 1. Tab Filtering (Upcoming vs Past)
    if (activeTab === "upcoming") {
      result = result.filter(reg => new Date(reg.date) >= now)
    } else {
      result = result.filter(reg => new Date(reg.date) < now)
    }

    // 2. Category Filtering
    if (selectedCategory !== "All") {
      result = result.filter(reg => reg.category === selectedCategory)
    }

    // 3. Date Filtering
    if (dateFilter !== "all") {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      result = result.filter(reg => {
        const eventDate = new Date(reg.date)
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
  }, [registrations, activeTab, selectedCategory, dateFilter])

  const counts = useMemo(() => {
    const now = new Date().setHours(0, 0, 0, 0)
    return {
      upcoming: registrations.filter(reg => new Date(reg.date) >= now).length,
      past: registrations.filter(reg => new Date(reg.date) < now).length
    }
  }, [registrations])

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      <p className="text-gray-400 font-medium animate-pulse">{t("student.events.loading")}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1600px] mx-auto py-2">
        
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
        {filteredRegistrations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200 animate-in fade-in duration-700 mx-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
               <Calendar className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{t("student.events.noResults") || "No events found"}</h3>
            <p className="text-gray-500 mt-2 max-w-xs text-center">
              {registrations.length === 0 
                ? t("student.myEvents.noRegistrations") 
                : (t("student.events.tryDifferentFilter") || "Try adjusting your filters to find more events.")}
            </p>
            {registrations.length === 0 && (
              <Link 
                to="/events" 
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-100"
              >
                {t("student.myEvents.browseAll")}
              </Link>
            )}
          </div>
        ) : (
          <div className={`px-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ${
            view === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10" 
              : "flex flex-col gap-4"
          }`}>
            {filteredRegistrations.map((reg) => (
              <div key={reg.registrationId} className="relative group overflow-visible">
                <EventCard
                  {...reg}
                  id={reg.eventId}
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
