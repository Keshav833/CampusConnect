import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AgendaWidget({ events = [] }) {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  
  const todayEvents = events.filter(e => (e.startDate || e.date) === today);

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-sm">Today's Agenda</h3>
        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[9px] font-black uppercase">
          {todayEvents.length} Events
        </span>
      </div>

      <div className="space-y-3">
        {todayEvents.length > 0 ? (
          todayEvents.map((event) => (
            <div 
              key={event._id}
              onClick={() => navigate(`/events/${event._id}`)}
              className="group cursor-pointer p-3 rounded-xl border border-transparent hover:border-indigo-100 hover:bg-gray-50/50 transition-all"
            >
              <h4 className="font-bold text-gray-800 text-[12px] group-hover:text-indigo-600 transition-colors line-clamp-1">
                {event.title}
              </h4>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                  <Clock className="w-3 h-3" />
                  {event.time || "All Day"}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate max-w-[80px]">{event.venue}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-400 text-xs italic">No items scheduled for today</p>
          </div>
        )}
      </div>
    </div>
  );
}
