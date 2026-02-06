import React from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function UpcomingEventWidget({ event }) {
  const navigate = useNavigate();

  if (!event) return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center py-10">
      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
        <Calendar className="w-6 h-6 text-gray-300" />
      </div>
      <p className="text-gray-400 text-sm font-medium">No upcoming events</p>
    </div>
  );

  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-all">
      <div className="relative h-32 overflow-hidden">
        <img 
          src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80"} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
          Featured
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-indigo-600 transition-colors">
          {event.title}
        </h3>
        <div className="space-y-2 text-[11px] font-medium text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>
        <button 
          onClick={() => navigate(`/events/${event._id}`)}
          className="mt-4 w-full py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          View Event <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
