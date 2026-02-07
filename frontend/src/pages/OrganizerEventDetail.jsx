import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Users, Calendar, MapPin, Clock, ShieldCheck, Mail, GraduationCap, Hash, Download } from "lucide-react";

export default function OrganizerEventDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const [eventRes, studentRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/events/${id}`, config),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/events/${id}/participants`, config)
        ]);

        setEvent(eventRes.data);
        setStudents(studentRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-gray-500 font-medium">Loading participants...</p>
    </div>
  );

  if (!event) return (
    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
      <p className="text-gray-500 text-lg font-medium">Event not found</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 font-bold hover:underline">Go Back</button>
    </div>
  );

  const registeredCount = students.length;
  const totalSeats = event.totalSeats || 100;
  const progress = Math.min(100, (registeredCount / totalSeats) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Top Navigation & Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-3 hover:bg-white hover:shadow-lg rounded-2xl transition-all border border-transparent hover:border-gray-100 group"
        >
          <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-indigo-600" />
        </button>
         <div>
            <h1 className="text-3xl font-black text-gray-900 leading-tight">
               {event.title}
            </h1>
            <div className="flex items-center gap-3 mt-1">
               <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50 px-2 py-0.5 rounded-md">
                  Organizer Dashboard
               </span>
               <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">
                  Reference: #{event._id.slice(-6)}
               </p>
            </div>
         </div>
      </div>

      {/* Stats Summary Row (Above Table) */}
      <div className="grid md:grid-cols-3 gap-6">
         
         {/* Registration Health Card */}
         <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-xl hover:shadow-indigo-50/50 transition-all">
            <div className="flex justify-between items-start mb-6">
               <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <Users className="w-7 h-7" />
               </div>
               <div className="text-right">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Capacity</h3>
                  <p className="text-2xl font-black text-gray-900">{totalSeats}</p>
               </div>
            </div>
            
            <div className="space-y-4">
               <div className="flex justify-between items-end">
                  <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Registered</p>
                     <p className="text-4xl font-black text-indigo-600 leading-none">{registeredCount}</p>
                  </div>
                  <div className="text-right">
                     <span className="text-xs font-black text-indigo-600">{Math.round(progress)}% Full</span>
                  </div>
               </div>
               <div className="h-2.5 w-full bg-gray-50 rounded-full overflow-hidden p-0.5 border border-gray-100">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-sm shadow-indigo-200" 
                    style={{ width: `${progress}%` }}
                  ></div>
               </div>
            </div>
         </div>

         {/* Event Logistics Grid Card */}
         <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 transition-all overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-full -translate-y-12 translate-x-12 blur-3xl"></div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Logistics Summary</h3>
            
            <div className="grid grid-cols-2 gap-4">
               {[
                  { icon: Calendar, label: "Date", value: new Date(event.startDate || event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) },
                  { icon: Clock, label: "Time", value: event.time },
                  { icon: MapPin, label: "Venue", value: event.venue },
                  { icon: ShieldCheck, label: "Status", value: event.status.toUpperCase(), color: event.status === "approved" ? "text-green-600" : "text-amber-500" }
               ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5 p-3 rounded-2xl bg-gray-50/50 border border-gray-100/50">
                     <div className="flex items-center gap-2">
                        <item.icon className="w-3.5 h-3.5 text-gray-400" />
                        <p className="text-[9px] uppercase font-black tracking-widest text-gray-400 leading-none">{item.label}</p>
                     </div>
                     <p className={`text-xs font-bold ${item.color || 'text-gray-900'} truncate`}>{item.value}</p>
                  </div>
               ))}
            </div>
         </div>

         {/* Organizer Utilities Card */}
         <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-xl shadow-indigo-100 flex flex-col justify-between group hover:scale-[1.02] transition-transform">
            <div>
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 border border-white/20">
                  <Download className="w-6 h-6" />
               </div>
               <h4 className="text-lg font-black leading-tight mb-2">Participant Exports</h4>
               <p className="text-[11px] text-indigo-100 opacity-70 leading-relaxed font-medium">Download Student Registration details in CSV format for offline reporting and attendance sheets.</p>
            </div>
            
            <button 
              onClick={() => alert("CSV Export coming soon!")}
              className="w-full py-3.5 bg-white text-indigo-600 hover:bg-indigo-50 transition-all rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-900/20"
            >
               Export Participant List
            </button>
         </div>

      </div>

      {/* Main Content: Student Table (Below Stats) */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
         <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-4">
               <div className="w-1 h-8 bg-indigo-600 rounded-full"></div>
               <h3 className="text-xl font-black text-gray-900 tracking-tight">Registered Students</h3>
            </div>
            <div className="flex items-center gap-3">
               <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
                     {students.length} Verified Entries
                  </span>
               </div>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-gray-50/50">
                     <th className="pl-10 pr-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] border-b border-gray-100">Student Identity</th>
                     <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] border-b border-gray-100">Academic Context</th>
                     <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] border-b border-gray-100">Registration Timestamp</th>
                     <th className="pl-8 pr-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] border-b border-gray-100 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {students.length > 0 ? (
                    students.map((reg) => (
                      <tr key={reg._id} className="group hover:bg-gray-50/80 transition-all">
                         <td className="pl-10 pr-8 py-7">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center font-black text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all group-hover:scale-110 duration-300">
                                  {reg.studentId?.name?.charAt(0) || "?"}
                               </div>
                               <div>
                                  <p className="text-sm font-black text-gray-900 leading-none mb-1.5">{reg.studentId?.name || "Unknown Student"}</p>
                                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 group-hover:text-gray-500">
                                     <Mail className="w-3.5 h-3.5" />
                                     {reg.studentId?.email}
                                  </div>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-7">
                            <div className="space-y-2">
                               <div className="flex items-center gap-2.5 text-gray-700">
                                  <div className="w-5 h-5 rounded-lg bg-indigo-50 flex items-center justify-center">
                                     <GraduationCap className="w-3 h-3 text-indigo-600" />
                                  </div>
                                  <span className="text-[11px] font-bold leading-none">{reg.studentId?.course || "N/A"}</span>
                               </div>
                               <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
                                  Year {reg.studentId?.year || "N/A"}
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-7">
                            <p className="text-xs font-bold text-gray-900 mb-1">
                               {new Date(reg.registeredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-indigo-50/50 text-indigo-600 inline-block px-1.5 py-0.5 rounded leading-none">
                               {new Date(reg.registeredAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                            </p>
                         </td>
                         <td className="pl-8 pr-10 py-7 text-right">
                            <button className="p-3 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all group-hover:text-gray-400">
                               <Mail className="w-5 h-5" />
                            </button>
                         </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-10 py-32 text-center text-gray-300">
                         <div className="flex flex-col items-center max-w-sm mx-auto p-12 rounded-[32px] border-2 border-dashed border-gray-50">
                            <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mb-6">
                               <Users className="w-10 h-10" />
                            </div>
                            <h4 className="text-lg font-black text-gray-400 mb-2 lowercase">Waiting for participants</h4>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center leading-relaxed">As soon as students register for this event, they will appear in this secure list.</p>
                         </div>
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
