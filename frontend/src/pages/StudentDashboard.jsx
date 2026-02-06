import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { 
  PlusCircle, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  LayoutDashboard
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Widgets
import { UpcomingEventWidget } from "../components/widgets/UpcomingEventWidget";
import { MiniCalendarWidget } from "../components/widgets/MiniCalendarWidget";
import { AgendaWidget } from "../components/widgets/AgendaWidget";
import { RecentActivityWidget } from "../components/widgets/RecentActivityWidget";

export default function StudentDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        
        const [eventsRes, regsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/events`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/registrations/my`, { headers })
        ]);

        setEvents(eventsRes.data);
        setRegistrations(regsRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { label: "My Registrations", value: registrations.length, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Available Events", value: events.length, icon: Calendar, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Upcoming Soon", value: events.filter(e => new Date(e.date) > new Date()).length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const upcomingEvent = events.filter(e => new Date(e.date) > new Date()).sort((a,b) => new Date(a.date) - new Date(b.date))[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-6 min-h-full">
      
      {/* Main Content Area (Fluid) */}
      <div className="flex-1 space-y-8 pb-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200/50 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="relative z-10 text-center md:text-left">
            <h1 className="text-3xl font-black mb-2 animate-in slide-in-from-left duration-500">
              Welcome back, Student! 👋
            </h1>
            <p className="text-indigo-100 opacity-90 max-w-sm">
              You have {registrations.length} active registrations. Don't miss out on upcoming campus activities.
            </p>
          </div>
          <button 
            onClick={() => navigate("/events")}
            className="relative z-10 bg-white text-indigo-600 px-6 py-3 rounded-2xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-2 shrink-0 shadow-lg active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            Discover New Events
          </button>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full -ml-16 -mb-16 blur-2xl"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {stats.map((stat, idx) => (
             <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-3">
               <div className={`w-9 h-9 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center shrink-0`}>
                 <stat.icon className="w-5 h-5" />
               </div>
               <div>
                 <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                 <h2 className="text-lg font-black text-gray-900 mt-0">{stat.value}</h2>
               </div>
             </div>
           ))}
        </div>

        {/* Featured Section / Recommended */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Recommended for You
            </h3>
            <button onClick={() => navigate("/events")} className="text-xs font-bold text-indigo-600 hover:underline">
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.slice(0, 2).map((event) => (
              <div 
                key={event._id}
                onClick={() => navigate(`/events/${event._id}`)}
                className="bg-gray-50 rounded-3xl p-6 border border-gray-100 hover:border-indigo-100 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white shadow-sm">
                    <img src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200"} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase mb-1 inline-block">
                      {event.category}
                    </span>
                    <h4 className="font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {event.venue}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Extreme Right Container (Awareness Panel) - 340px */}
      <div className="w-full xl:w-[340px] shrink-0 xl:sticky xl:top-0 space-y-6 overflow-y-auto scrollbar-hide pb-8 xl:max-h-[calc(100vh-140px)]">
        <div className="right-container-inner flex flex-col gap-6">
          <UpcomingEventWidget event={upcomingEvent} />
          
          <div className="widget-wrapper">
             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-2">Calendar</h4>
             <MiniCalendarWidget events={registrations} />
          </div>

          <div className="widget-wrapper">
             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-2">Agenda</h4>
             <AgendaWidget events={registrations} />
          </div>

          <div className="widget-wrapper">
             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-2">Activity</h4>
             <RecentActivityWidget />
          </div>
        </div>
      </div>

      {/* Global CSS for Independent Scroll and Layout */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (min-width: 1280px) {
          .right-container-inner {
            background: #f9fafc;
            border-radius: 28px;
            padding: 24px 16px;
          }
        }
      `}</style>
    </div>
  );
}
