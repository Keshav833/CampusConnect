import { useState, useEffect } from "react"
import { EventCard } from "@/components/EventCard"
import axios from "axios"

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [dateFilter, setDateFilter] = useState("All Dates")

  const categories = ["All", "Tech", "Cultural", "Sports", "Workshops", "Hackathons", "Clubs"]

  useEffect(() => {
    // Fetch events from backend
    axios.get('http://localhost:5000/api/events')
      .then(res => {
        setEvents(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching events:", err)
        setLoading(false)
      })
  }, [])

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory

    // Date filter logic can be expanded here
    const matchesDate = dateFilter === "All Dates" // Placeholder for now

    return matchesSearch && matchesCategory && matchesDate
  })

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Search + Filters */}
      <section className="px-8 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search events, clubs, workshops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option>All Dates</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>
      </section>

      {/* Category Pills */}
      <section className="px-8 pb-6">
        <div className="max-w-6xl mx-auto flex gap-3 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 border rounded-full text-sm transition whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "hover:bg-indigo-600 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Events Grid */}
      <section className="px-8 py-10">
        <div className="max-w-6xl mx-auto">
          {loading ? (
             <div className="text-center py-20 text-gray-500">Loading events...</div>
          ) : filteredEvents.length === 0 ? (
             <div className="text-center py-20 text-gray-500">No events found matching your criteria.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event._id || event.id} // Handle MongoDB _id or seed id
                  id={event._id || event.id}
                  title={event.title}
                  category={event.category}
                  description={event.description}
                  date={event.date}
                  location={event.location}
                  image={event.image}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
