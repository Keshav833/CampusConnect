import { Navbar } from "@/components/Navbar"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Calendar, Download, QrCode, Filter } from "lucide-react"

// Mock data for registered events
const mockRegisteredEvents = [
  {
    id: 1,
    title: "AI & Machine Learning Workshop",
    category: "Tech",
    date: "March 25, 2024",
    time: "2:00 PM - 5:00 PM",
    venue: "Computer Science Lab, Block A",
    image: "/tech-conference-with-laptop-and-code.jpg",
    status: "Registered",
    type: "upcoming",
    isEventDay: false,
    certificateAvailable: false,
  },
  {
    id: 2,
    title: "Cultural Night 2024",
    category: "Cultural",
    date: "March 20, 2024",
    time: "6:00 PM - 10:00 PM",
    venue: "Main Auditorium",
    image: "/outdoor-music-festival-with-stage-and-crowd.jpg",
    status: "Registered",
    type: "ongoing",
    isEventDay: true,
    certificateAvailable: false,
  },
  {
    id: 3,
    title: "Basketball Tournament Finals",
    category: "Sports",
    date: "March 18, 2024",
    time: "10:00 AM - 1:00 PM",
    venue: "Sports Complex Court 1",
    image: "/indoor-basketball-game.png",
    status: "Attended",
    type: "past",
    isEventDay: false,
    certificateAvailable: true,
  },
  {
    id: 4,
    title: "Resume Building Workshop",
    category: "Workshop",
    date: "March 15, 2024",
    time: "3:00 PM - 5:00 PM",
    venue: "Career Development Center",
    image: "/professional-workshop-with-people-writing-resumes.jpg",
    status: "Attended",
    type: "past",
    isEventDay: false,
    certificateAvailable: true,
  },
  {
    id: 5,
    title: "Startup Pitch Competition",
    category: "Workshop",
    date: "March 28, 2024",
    time: "1:00 PM - 6:00 PM",
    venue: "Innovation Hub",
    image: "/business-pitch-presentation-with-audience.jpg",
    status: "Registered",
    type: "upcoming",
    isEventDay: false,
    certificateAvailable: false,
  },
  {
    id: 6,
    title: "International Food Festival",
    category: "Cultural",
    date: "March 12, 2024",
    time: "12:00 PM - 8:00 PM",
    venue: "Campus Ground",
    image: "/international-food-buffet-with-various-cuisines.jpg",
    status: "Cancelled",
    type: "past",
    isEventDay: false,
    certificateAvailable: false,
  },
]

export default function MyEvents() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")

  const categories = ["All", "Tech", "Cultural", "Sports", "Workshop"]
  const statuses = ["All", "Registered", "Attended", "Cancelled"]

  const filteredEvents = mockRegisteredEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory
    const matchesStatus = selectedStatus === "All" || event.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const upcomingEvents = filteredEvents.filter((e) => e.type === "upcoming")
  const ongoingEvents = filteredEvents.filter((e) => e.type === "ongoing")
  const pastEvents = filteredEvents.filter((e) => e.type === "past")

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Registered Events</h1>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-4 mb-6 border">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search registered events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "All" ? "All Status" : status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Ongoing Events */}
        {ongoingEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              Ongoing Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoingEvents.map((event) => (
                <EventRegistrationCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventRegistrationCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <EventRegistrationCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">No events found matching your filters</p>
            <Link to="/events" className="text-indigo-600 hover:underline">
              Browse all events
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function EventRegistrationCard({ event }) {
  return (
    <div className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition">
      <div className="h-40 relative">
        <img 
          src={event.image || "/placeholder.svg"} 
          alt={event.title} 
          className="object-cover w-full h-full" 
        />
        <div className="absolute top-3 right-3">
          <StatusBadge status={event.status} />
        </div>
      </div>

      <div className="p-4">
        <span className="text-xs text-indigo-600 font-semibold">{event.category}</span>
        <h3 className="mt-2 font-semibold text-lg line-clamp-2">{event.title}</h3>

        <div className="mt-3 space-y-1 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {event.date} • {event.time}
          </div>
          <div className="flex items-start gap-2">
            <span>📍</span>
            <span className="line-clamp-2">{event.venue}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          <Link
            to={`/events/${event.id}`}
            className="block w-full py-2 bg-indigo-600 text-white rounded-lg text-sm text-center hover:bg-indigo-700 transition"
          >
            View Details
          </Link>

          {/* Event Day Check-in */}
          {event.isEventDay && event.status === "Registered" && (
            <button className="w-full py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition flex items-center justify-center gap-2">
              <QrCode className="w-4 h-4" />
              Check-in Now
            </button>
          )}

          {/* Upcoming Event Actions */}
          {event.type === "upcoming" && !event.isEventDay && (
            <button className="w-full py-2 border border-indigo-600 text-indigo-600 rounded-lg text-sm hover:bg-indigo-50 transition flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              Add to Calendar
            </button>
          )}

          {/* Past Event Certificate */}
          {event.type === "past" && event.certificateAvailable && event.status === "Attended" && (
            <button className="w-full py-2 border border-indigo-600 text-indigo-600 rounded-lg text-sm hover:bg-indigo-50 transition flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download Certificate
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    Registered: "bg-blue-100 text-blue-700",
    Attended: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || ""}`}>
      {status}
    </span>
  )
}
