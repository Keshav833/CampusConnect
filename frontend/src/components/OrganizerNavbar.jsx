import { Link } from "react-router-dom"

export function OrganizerNavbar() {
  return (
    <nav className="w-full px-8 py-4 flex justify-between items-center border-b bg-white">
      <Link to="/">
        <h1 className="text-xl font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">
          CampusConnect <span className="text-sm text-gray-400">Organizer</span>
        </h1>
      </Link>

      <div className="flex items-center gap-6 text-sm">
        <span className="text-gray-600">Coding Club</span>
        <Link to="/">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Logout</button>
        </Link>
      </div>
    </nav>
  )
}
