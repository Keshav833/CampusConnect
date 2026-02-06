import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import StudentCalendar from "../components/StudentCalendar";
import { Calendar as CalendarIcon, Filter, Info } from "lucide-react";

export default function Schedule() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/registrations/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(response.data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load your schedule. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pt-2">

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4 font-medium">Loading your academic calendar...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-center">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
             <StudentCalendar events={events} />
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-600" />
                Quick Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Registered Events</span>
                  <span className="font-bold text-gray-900">{events.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Upcoming This Week</span>
                  <span className="font-bold text-indigo-600">
                    {events.filter(e => {
                      const eventDate = new Date(e.date);
                      const now = new Date();
                      const nextWeek = new Date();
                      nextWeek.setDate(now.getDate() + 7);
                      return eventDate >= now && eventDate <= nextWeek;
                    }).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-200">
              <h4 className="font-bold mb-2">Participation Note</h4>
              <p className="text-indigo-100 text-xs leading-relaxed">
                Registered events appear automatically on your calendar. Click on any event to view detailed information, venue maps, and attendance QR codes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
