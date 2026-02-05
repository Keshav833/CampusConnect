import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { Upload, X, ImageIcon } from "lucide-react"

export default function OrganizerDashboard() {
  const location = useLocation()
  const [activeSection, setActiveSection] = useState("overview")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [bannerFile, setBannerFile] = useState(null)
  const [bannerPreview, setBannerPreview] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [eventTab, setEventTab] = useState("all")
  const [editingEvent, setEditingEvent] = useState(null)

  const allEventsMock = [
    {
      id: 1,
      title: "Web Development Workshop",
      date: "Jan 20, 2025",
      registrations: 320,
      status: "approved",
    },
    {
      id: 2,
      title: "AI & Machine Learning Seminar",
      date: "Jan 25, 2025",
      registrations: 185,
      status: "approved",
    },
    {
      id: 3,
      title: "Hackathon 2025",
      date: "Feb 1, 2025",
      registrations: 450,
      status: "pending",
    },
    {
      id: 4,
      title: "Career Fair 2025",
      date: "Feb 10, 2025",
      registrations: 680,
      status: "approved",
    },
  ]

  const [events, setEvents] = useState(allEventsMock)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setBannerFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/events/my-events`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setEvents(res.data)
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditEvent = (event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date,
      time: event.time,
      venue: event.venue,
      image: event.image
    })
    setBannerPreview(event.image)
    setActiveSection("create-event")
  }

  const handleCreateEvent = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      let finalImageUrl = formData.image

      // If there's a file to upload
      if (bannerFile) {
        const uploadFormData = new FormData()
        uploadFormData.append("banner", bannerFile)
        
        try {
          const uploadRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, uploadFormData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          finalImageUrl = uploadRes.data.imageUrl
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError)
          alert("Image upload failed. Please try again.")
          setLoading(false)
          return
        }
      }

      const eventData = { ...formData, image: finalImageUrl }

      if (editingEvent) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/events/${editingEvent._id}`, eventData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/events`, eventData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
      }
      
      // Reset flow
      setBannerFile(null)
      setBannerPreview("")
      setFormData({
        title: "",
        description: "",
        category: "Tech",
        date: "",
        time: "",
        venue: "",
        image: ""
      })
      setEditingEvent(null)
      
      // Show success modal instead of silent redirect
      setShowSuccessModal(true)
      fetchEvents() // Refresh list
    } catch (error) {
      console.error("Error creating/updating event:", error)
      alert(error.response?.data?.error || "Error processing event. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    const path = location.pathname;
    if (path === '/organizer/dashboard') setActiveSection('overview');
    else if (path === '/organizer/events') setActiveSection('my-events');
    else if (path === '/organizer/create') setActiveSection('create-event');
    else if (path === '/organizer/profile') setActiveSection('settings');
  }, [location]);

  const stats = [
    { label: "Total Events", value: events.length },
    { label: "Approved Events", value: events.filter(e => e.status === "approved").length },
    { label: "Pending Approval", value: events.filter(e => e.status === "pending").length },
    { label: "Rejected Events", value: events.filter(e => e.status === "rejected").length },
  ]

  const upcomingEvents = events.filter(e => e.status === "approved")

  const filteredEvents = events.filter(event => {
    if (eventTab === "all") return true
    return event.status === eventTab
  })

  const participants = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@university.edu",
      registrationDate: "Jan 10, 2025",
      status: "Confirmed",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@university.edu",
      registrationDate: "Jan 12, 2025",
      status: "Confirmed",
    },
    {
      id: 3,
      name: "Emma Davis",
      email: "emma.d@university.edu",
      registrationDate: "Jan 15, 2025",
      status: "Pending",
    },
    {
      id: 4,
      name: "James Wilson",
      email: "j.wilson@university.edu",
      registrationDate: "Jan 16, 2025",
      status: "Confirmed",
    },
  ]

  const announcements = [
    {
      id: 1,
      title: "Event Venue Changed",
      message: "The Web Dev Workshop will now be held in Room 305.",
      event: "Web Development Workshop",
      date: "Jan 15, 2025",
    },
    {
      id: 2,
      title: "Registration Reminder",
      message: "Only 50 spots remaining for the AI Seminar!",
      event: "AI & Machine Learning Seminar",
      date: "Jan 18, 2025",
    },
  ]

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Tech",
    date: "",
    time: "",
    venue: "",
    image: ""
  })

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <>
            {/* Stats Cards */}
            <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white p-6 rounded-xl border shadow-sm">
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <h2 className="text-3xl font-bold mt-2">{stat.value}</h2>
                </div>
              ))}
            </section>

            {/* Upcoming Events */}
            <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Upcoming Events (Approved)</h2>
              <div className="space-y-3">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, index) => (
                    <div key={index} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-500">{event.date}</p>
                      </div>
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        {event.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No upcoming approved events</p>
                )}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => setActiveSection("create-event")}
              className="w-full py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
            >
              + Create New Event
            </button>
          </>
        )

      case "my-events":
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Events</h2>
              <button
                onClick={() => {
                  setEditingEvent(null)
                  setFormData({
                    title: "",
                    description: "",
                    category: "Tech",
                    date: "",
                    time: "",
                    venue: "",
                    image: ""
                  })
                  setBannerPreview("")
                  setActiveSection("create-event")
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
              >
                + Create New
              </button>
            </div>

            {/* Status Tabs */}
            <div className="flex border-b mb-6 overflow-x-auto no-scrollbar">
              {["all", "pending", "approved", "rejected"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setEventTab(tab)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    eventTab === tab
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span className="capitalize">{tab}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    eventTab === tab ? "bg-indigo-100" : "bg-gray-100"
                  }`}>
                    {tab === "all" ? events.length : events.filter(e => e.status === tab).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="p-4 text-left">Event Name</th>
                    <th className="p-4 text-left">Category / Details</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="p-4 text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                      <p className="mt-2 text-gray-500">Loading events...</p>
                    </td></tr>
                  ) : filteredEvents.length === 0 ? (
                    <tr><td colSpan="4" className="p-4 text-center py-12 text-gray-500">
                      No events found in this category.
                    </td></tr>
                  ) : (
                    filteredEvents.map((event) => (
                      <tr key={event._id} className="border-t hover:bg-gray-50 group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-16 rounded overflow-hidden bg-gray-100 hidden sm:block">
                              <img src={event.image || "https://via.placeholder.com/150"} alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="font-medium text-gray-900">{event.title}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-gray-600 font-medium">{event.category}</div>
                          <div className="text-gray-400 text-xs">{event.date} • {event.time}</div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span
                              className={`px-3 py-1 text-xs rounded-full inline-flex items-center gap-1.5 ${
                                event.status === "approved"
                                  ? "bg-green-100 text-green-700 font-medium"
                                  : event.status === "rejected"
                                  ? "bg-red-100 text-red-700 font-medium"
                                  : "bg-yellow-100 text-yellow-700 font-medium"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                event.status === "approved" ? "bg-green-500" : event.status === "rejected" ? "bg-red-500" : "bg-yellow-500"
                              }`}></span>
                              <span className="capitalize">{event.status}</span>
                            </span>
                            {event.status === "rejected" && event.rejectionReason && (
                              <p className="text-[10px] text-red-500 max-w-[150px] leading-tight mt-1">
                                Reason: {event.rejectionReason}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => handleEditEvent(event)}
                              disabled={event.status === "pending"}
                              className={`p-2 rounded-lg border transition-all ${
                                event.status === "pending"
                                  ? "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400"
                                  : "bg-white text-indigo-600 hover:bg-indigo-50 border-gray-200"
                              }`}
                              title={event.status === "pending" ? "Cannot edit while pending approval" : "Edit Event"}
                            >
                              Edit
                            </button>
                            <button 
                              className="p-2 rounded-lg border border-gray-200 bg-white text-red-500 hover:bg-red-50 transition-all"
                              title="Delete Event"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )

      case "create-event":
        return (
          <>
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => {
                  setEditingEvent(null)
                  setActiveSection("my-events")
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <h2 className="text-2xl font-bold">
                {editingEvent ? "Edit & Resubmit Event" : "Create New Event"}
              </h2>
            </div>

            <div className="bg-white rounded-xl border shadow-sm p-8">
              <form onSubmit={handleCreateEvent} className="space-y-5">
                {editingEvent?.status === "rejected" && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-lg mb-6">
                    <p className="text-sm text-red-700 font-medium">Rejection Reason:</p>
                    <p className="text-sm text-red-600 mt-1">{editingEvent.rejectionReason}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2">Event Title</label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Web Development Workshop"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Tell students about your event..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select 
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option>Tech</option>
                      <option>Cultural</option>
                      <option>Sports</option>
                      <option>Workshops</option>
                      <option>Hackathons</option>
                      <option>Clubs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Venue / Location</label>
                    <input
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Main Auditorium"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <input
                      type="time"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Event Banner Image</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors bg-gray-50/50">
                    <div className="space-y-1 text-center">
                      {bannerPreview ? (
                        <div className="relative inline-block">
                          <img 
                            src={bannerPreview} 
                            alt="Preview" 
                            className="max-h-48 rounded-lg shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setBannerFile(null)
                              setBannerPreview("")
                            }}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col items-center">
                            <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                              <ImageIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">PNG, JPG, WEBP up to 5MB</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Or use Image URL</label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    disabled={!!bannerFile}
                  />
                </div>

                <div className="flex items-center justify-end pt-4 border-t gap-3">
                  <button 
                    type="button"
                    onClick={() => setActiveSection("my-events")}
                    className="px-6 py-2 border rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold flex items-center gap-2"
                  >
                    {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                    {editingEvent ? "Update & Resubmit" : "Submit for Approval"}
                  </button>
                </div>
              </form>
            </div>
          </>
        )

      case "participants":
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Participants</h2>

            <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
              <label className="block text-sm font-medium mb-2">Select Event</label>
              <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Web Development Workshop</option>
                <option>AI & Machine Learning Seminar</option>
                <option>Hackathon 2025</option>
                <option>Career Fair 2025</option>
              </select>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Email/ID</th>
                    <th className="p-4 text-left">Registration Date</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant) => (
                    <tr key={participant.id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-medium">{participant.name}</td>
                      <td className="p-4 text-gray-600">{participant.email}</td>
                      <td className="p-4">{participant.registrationDate}</td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            participant.status === "Confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {participant.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )

      case "announcements":
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Announcements</h2>
              <button
                onClick={() => setShowAnnouncementModal(true)}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                + New Announcement
              </button>
            </div>

            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="bg-white rounded-xl border shadow-sm p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{announcement.title}</h3>
                    <span className="text-xs text-gray-500">{announcement.date}</span>
                  </div>
                  <p className="text-gray-600 mb-3">{announcement.message}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Linked to:</span>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs">
                      {announcement.event}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )

      case "analytics":
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Analytics</h2>

            {/* Summary Cards */}
            <section className="grid sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <p className="text-sm text-gray-500">Total Views</p>
                <h2 className="text-3xl font-bold mt-2">8,420</h2>
                <p className="text-xs text-green-600 mt-2">+12% from last month</p>
              </div>
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <p className="text-sm text-gray-500">Registrations</p>
                <h2 className="text-3xl font-bold mt-2">1,240</h2>
                <p className="text-xs text-green-600 mt-2">+8% from last month</p>
              </div>
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <p className="text-sm text-gray-500">Attendance Rate</p>
                <h2 className="text-3xl font-bold mt-2">87%</h2>
                <p className="text-xs text-green-600 mt-2">+5% from last month</p>
              </div>
            </section>

            {/* Chart Placeholders */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h3 className="font-semibold mb-4">Event Views Over Time</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-400">Chart visualization</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h3 className="font-semibold mb-4">Registration by Category</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-400">Chart visualization</p>
                </div>
              </div>
            </div>
          </>
        )

      case "settings":
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Settings</h2>

            {/* Profile Section */}
            <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Organizer Profile</h3>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Organization Name</label>
                    <input
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      defaultValue="Coding Club"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      defaultValue="contact@codingclub.edu"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                    defaultValue="Official student coding club at the university"
                  />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Notifications</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">Email notifications for new registrations</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">Push notifications for event reminders</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">Weekly analytics summary</span>
                  <input type="checkbox" className="w-4 h-4 rounded" />
                </label>
              </div>
            </div>

            {/* Theme Preference */}
            <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Theme Preference</h3>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="theme" defaultChecked />
                  <span className="text-sm">Light</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="theme" />
                  <span className="text-sm">Dark</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="theme" />
                  <span className="text-sm">System</span>
                </label>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 rounded-xl border border-red-200 p-6">
              <h3 className="font-semibold text-lg text-red-700 mb-2">Danger Zone</h3>
              <p className="text-sm text-gray-600 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete Account</button>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {renderContent()}

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">Create Announcement</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Announcement title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Your announcement message..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Linked Event</label>
                <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Web Development Workshop</option>
                  <option>AI & Machine Learning Seminar</option>
                  <option>Hackathon 2025</option>
                  <option>Career Fair 2025</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAnnouncementModal(false)}
                className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Publish Announcement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-green-600">🎉</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Successful!</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Your event has been submitted and is now under admin review. You can track its status in the "My Events" section.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  setActiveSection("my-events")
                }}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                Go to My Events
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  setEditingEvent(null)
                  setActiveSection("create-event")
                }}
                className="w-full py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                Create Another Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
