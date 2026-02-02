import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function OrganizerDashboard() {
  const location = useLocation()
  const [activeSection, setActiveSection] = useState("overview")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)

  useEffect(() => {
    const path = location.pathname;
    if (path === '/organizer/dashboard') setActiveSection('overview');
    else if (path === '/organizer/events') setActiveSection('my-events');
    else if (path === '/organizer/create') setActiveSection('create-event');
    else if (path === '/organizer/profile') setActiveSection('settings');
  }, [location]);

  const stats = [
    { label: "Total Events", value: "12" },
    { label: "Upcoming Events", value: "5" },
    { label: "Total Registrations", value: "1,240" },
    { label: "Events This Month", value: "3" },
  ]

  const upcomingEvents = [
    { title: "Web Dev Workshop", date: "Jan 20, 2025", status: "Published" },
    { title: "AI Seminar", date: "Jan 25, 2025", status: "Published" },
    { title: "Hackathon 2025", date: "Feb 1, 2025", status: "Draft" },
  ]

  const allEvents = [
    {
      id: 1,
      title: "Web Development Workshop",
      date: "Jan 20, 2025",
      registrations: 320,
      status: "Published",
    },
    {
      id: 2,
      title: "AI & Machine Learning Seminar",
      date: "Jan 25, 2025",
      registrations: 185,
      status: "Published",
    },
    {
      id: 3,
      title: "Hackathon 2025",
      date: "Feb 1, 2025",
      registrations: 450,
      status: "Draft",
    },
    {
      id: 4,
      title: "Career Fair 2025",
      date: "Feb 10, 2025",
      registrations: 680,
      status: "Published",
    },
  ]

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
              <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.date}</p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        event.status === "Published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                ))}
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
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="p-4 text-left">Event Name</th>
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-center">Registrations</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allEvents.map((event) => (
                    <tr key={event.id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-medium">{event.title}</td>
                      <td className="p-4">{event.date}</td>
                      <td className="p-4 text-center">{event.registrations}</td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            event.status === "Published"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="p-4 text-center space-x-2">
                        <button className="text-indigo-600 hover:underline">Edit</button>
                        <button className="text-red-500 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )

      case "create-event":
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Create New Event</h2>

            <div className="bg-white rounded-xl border shadow-sm p-8">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Event Title</label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Web Development Workshop"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Tell students about your event..."
                    rows={4}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>Tech</option>
                      <option>Cultural</option>
                      <option>Sports</option>
                      <option>Academic</option>
                      <option>Workshop</option>
                      <option>Career</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Registration Limit</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 100"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date & Time</label>
                    <input
                      type="datetime-local"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Venue</label>
                    <input
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Main Auditorium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Banner Image</label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-indigo-400 cursor-pointer">
                    <p className="text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded" />
                    <span className="text-sm">Publish immediately</span>
                  </label>

                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
                    Create Event
                  </button>
                </div>
              </div>
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
    </div>
  )
}
