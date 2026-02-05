import { Link } from "react-router-dom"

export function EventCard({ id, title, category, description, date, venue, image }) {
  // Handle relative vs absolute image paths (mock data uses relative)
  const imageUrl = image || "/placeholder.svg";

  return (
    <Link to={`/events/${id}`} className="block">
      <div className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
        <div className="h-40 bg-gradient-to-r from-indigo-500 to-purple-500 relative">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="p-4">
          <span className="text-xs text-indigo-600 font-semibold">{category}</span>

          <h3 className="mt-2 font-semibold text-lg line-clamp-2">{title}</h3>

          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>

          <div className="mt-4 text-sm text-gray-500">
            📅 {date} <br />📍 {venue}
          </div>

          <button className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">
            View Details
          </button>
        </div>
      </div>
    </Link>
  )
}
