import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { Upload, X, ImageIcon, LayoutDashboard, PlusCircle, Calendar, Bell, Clock, CheckCircle2, XCircle, ChevronRight, Edit3 } from "lucide-react"

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

  const [events, setEvents] = useState([])
  const [statsData, setStatsData] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 })
  const [recentNotifications, setRecentNotifications] = useState([])

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

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/events/organizer/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      setStatsData(res.data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const fetchRecentNotifications = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      setRecentNotifications(res.data.slice(0, 4))
    } catch (error) {
      console.error("Error fetching notifications:", error)
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
      image: event.image,
      totalSeats: event.totalSeats || 100
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
    fetchStats()
    fetchRecentNotifications()
  }, [])

  useEffect(() => {
    const path = location.pathname;
    if (path === '/organizer/dashboard') setActiveSection('overview');
    else if (path === '/organizer/events') setActiveSection('my-events');
    else if (path === '/organizer/create') setActiveSection('create-event');
    else if (path === '/organizer/profile') setActiveSection('settings');
  }, [location]);

  const dashboardStats = [
    { label: "Pending Approval", value: statsData.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Approved Events", value: statsData.approved, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Rejected Events", value: statsData.rejected, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Total Submissions", value: statsData.total, icon: Calendar, color: "text-indigo-600", bg: "bg-indigo-50" },
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
    image: "",
    totalSeats: 100
  })

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboardStats.map((stat) => (
                <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <h2 className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</h2>
                </div>
              ))}
            </div>

            {/* Quick Actions Hero */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200/50 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">Ready to host something amazing?</h2>
                <p className="text-indigo-100 mb-0 opacity-90">Create and submit your event for approval instantly.</p>
              </div>
              <button
                onClick={() => setActiveSection("create-event")}
                className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-2 shrink-0 shadow-lg"
              >
                <PlusCircle className="w-5 h-5" />
                Create New Event
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* My Events List Preview */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Recent Events</h3>
                  <button onClick={() => setActiveSection("my-events")} className="text-indigo-600 font-medium text-sm hover:underline flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {events.slice(0, 5).map((event) => (
                    <div 
                      key={event._id} 
                      className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between hover:border-indigo-100 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                          {event.image ? (
                            <img src={event.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 line-clamp-1">{event.title}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{event.date} • {event.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                          event.status === "approved" ? "bg-green-50 text-green-600" :
                          event.status === "rejected" ? "bg-red-50 text-red-600" : "bg-yellow-50 text-yellow-600"
                        }`}>
                          {event.status}
                        </span>
                        {event.status === "rejected" && (
                          <button 
                            onClick={() => handleEditEvent(event)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit & Resubmit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {events.length === 0 && (
                     <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                        <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400">No events created yet.</p>
                     </div>
                  )}
                </div>
              </div>

              {/* Notifications Widget */}
              <div className="space-y-6">
                 <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
                 <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-50">
                       {recentNotifications.length > 0 ? (
                         recentNotifications.map((notif) => (
                           <div key={notif._id} className="p-4 hover:bg-gray-50 transition-colors">
                              <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notif.message}</p>
                           </div>
                         ))
                       ) : (
                         <div className="p-8 text-center">
                            <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                            <p className="text-xs text-gray-400">No recent notifications</p>
                         </div>
                       )}
                    </div>
                    <button 
                      onClick={() => navigate("/notifications")}
                      className="w-full p-4 text-center text-sm font-bold text-indigo-600 hover:bg-indigo-50 border-t border-gray-50 transition-colors"
                    >
                      View All Inbox
                    </button>
                 </div>
              </div>
            </div>
          </div>
        )

      case "my-events":
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Event Portfolio</h2>
                <p className="text-gray-500 text-sm mt-1">Manage and track your submissions</p>
              </div>
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
                    image: "",
                    totalSeats: 100
                  })
                  setBannerPreview("")
                  setActiveSection("create-event")
                }}
                className="px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 font-bold flex items-center gap-2 shadow-lg shadow-indigo-100"
              >
                <PlusCircle className="w-5 h-5" />
                New Event
              </button>
            </div>

            {/* Enhanced Status Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-2xl w-fit">
              {["all", "pending", "approved", "rejected"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setEventTab(tab)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    eventTab === tab
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span className="capitalize">{tab}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {loading ? (
                 <div className="col-span-full py-20 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading your portfolio...</p>
                 </div>
               ) : filteredEvents.length === 0 ? (
                 <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                    <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">No {eventTab !== "all" ? eventTab : ""} events found.</p>
                 </div>
               ) : (
                 filteredEvents.map((event) => (
                    <div key={event._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col group">
                       <div className="h-44 relative overflow-hidden">
                          <img 
                            src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"} 
                            alt="" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 right-4">
                             <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                               event.status === "approved" ? "bg-green-500 text-white" :
                               event.status === "rejected" ? "bg-red-500 text-white" : "bg-amber-500 text-white"
                             }`}>
                               {event.status}
                             </span>
                          </div>
                       </div>
                       <div className="p-6 flex-1 flex flex-col">
                          <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">{event.category}</div>
                          <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{event.title}</h4>
                          <div className="space-y-2 mb-6 flex-1">
                             <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                {new Date(event.date).toLocaleDateString()}
                             </div>
                             <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                {event.time}
                             </div>
                          </div>

                          {event.status === "rejected" && event.rejectionReason && (
                             <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-100">
                                <p className="text-[10px] text-red-700 leading-tight">
                                  <span className="font-bold">Reason:</span> {event.rejectionReason}
                                </p>
                             </div>
                          )}

                          <div className="flex gap-2 mt-auto">
                             {event.status === "rejected" ? (
                               <button 
                                 onClick={() => handleEditEvent(event)}
                                 className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                               >
                                  <Edit3 className="w-4 h-4" />
                                  Edit & Resubmit
                               </button>
                             ) : (
                               <button 
                                 disabled={event.status === "pending"}
                                 onClick={() => handleEditEvent(event)}
                                 className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                               >
                                  Edit Details
                               </button>
                             )}
                          </div>
                       </div>
                    </div>
                 ))
               )}
            </div>
          </div>
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

      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-gray-100">
             <LayoutDashboard className="w-16 h-16 text-gray-100 mb-4" />
             <h3 className="text-xl font-bold text-gray-900">Module Coming Soon</h3>
             <p className="text-gray-500">This feature is currently under active development.</p>
             <button 
               onClick={() => setActiveSection("overview")}
               className="mt-6 px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
             >
               Back to Home
             </button>
          </div>
        )
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-4">
      {renderContent()}

      {/* Modern Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
             <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
             </div>
             <h2 className="text-2xl font-black text-gray-900 mb-3">Submission Sent!</h2>
             <p className="text-gray-500 mb-8 font-medium">Your event has been forwarded to campus administrators for review.</p>
             <button
               onClick={() => {
                 setShowSuccessModal(false)
                 setActiveSection("my-events")
               }}
               className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl"
             >
               Explore My Hub
             </button>
          </div>
        </div>
      )}
    </div>
  )
}
