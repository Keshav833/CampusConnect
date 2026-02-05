import { Link } from "react-router-dom"

export function EventCard({ id, title, category, description, date, time, venue, image, organizerName }) {
  // Handle relative vs absolute image paths (mock data uses relative)
  const imageUrl = image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800";

  return (
    <Link to={`/events/${id}`} className="block h-full group">
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col">
        <div className="h-48 bg-gray-100 relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
              {category}
            </span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
              {title}
            </h3>
            
            <p className="text-gray-500 text-sm mt-3 line-clamp-2 leading-relaxed">
              {description}
            </p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2 opacity-70">📅</span>
                <span className="font-medium">{date}</span>
                {time && <span className="ml-2 pl-2 border-l border-gray-200">{time}</span>}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2 opacity-70">📍</span>
                <span className="truncate">{venue}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                {organizerName?.charAt(0) || "O"}
              </div>
              <span className="text-xs font-medium text-gray-500">By {organizerName || "Organizer"}</span>
            </div>
            <span className="text-indigo-600 font-bold text-xs group-hover:translate-x-1 transition-transform">
              Join →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
