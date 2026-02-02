export function Sidebar({ activeSection, onSectionChange }) {
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "my-events", label: "My Events" },
    { id: "create-event", label: "Create Event" },
    { id: "participants", label: "Participants" },
    { id: "announcements", label: "Announcements" },
    { id: "analytics", label: "Analytics" },
    { id: "settings", label: "Settings" },
  ]

  return (
    <aside className="w-64 h-screen border-r p-6 hidden md:block bg-white sticky top-0">
      <nav className="space-y-2 text-sm">
        <p className="text-gray-400 uppercase text-xs font-semibold mb-4">Dashboard</p>

        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
              activeSection === section.id
                ? "bg-indigo-50 text-indigo-600 font-semibold"
                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
            }`}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
