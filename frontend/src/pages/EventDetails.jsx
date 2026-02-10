import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import axios from "axios"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  CheckCircle, 
  Bell, 
  AlertCircle,
  Users,
  Share2,
  Ticket,
  Laptop,
  Music,
  Trophy,
  Wrench,
  Rocket,
  Linkedin,
  Twitter,
  Link,
  MessageCircle
} from "lucide-react"
import "./EventDetails.css"

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [reminderSet, setReminderSet] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const token = localStorage.getItem("token")
  const userRole = localStorage.getItem("userRole")

  useEffect(() => {
    fetchEventDetails()
    if (token && userRole === "student") {
      checkRegistrationStatus()
    }
  }, [id, token, userRole, i18n.language])

  const checkRegistrationStatus = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/registrations/${id}/status`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setIsRegistered(res.data.registered)
    } catch (error) {
      console.error("Error checking registration status:", error)
    }
  }

  const fetchEventDetails = async () => {
    try {
      const lang = i18n.language;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/events/${id}?lang=${lang}`, config)
      setEvent(res.data)
    } catch (error) {
      console.error("Error fetching event details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!token) {
      navigate("/login")
      return
    }

    if (userRole !== "student") {
      alert(t("organizer.createEvent.error") || "Only students can register for events.")
      return
    }

    setRegistering(true)
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/registrations`,
        { eventId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setShowSuccessModal(true)
      setIsRegistered(true)
      fetchEventDetails() // Refresh registration count
    } catch (error) {
      alert(error.response?.data?.message || error.response?.data?.error || "Registration failed")
    } finally {
      setRegistering(false)
    }
  }

  const handleSetReminder = () => {
    setReminderSet(true)
  }

  const handleNativeShare = async () => {
    const shareData = {
      title: event.title,
      text: `${t("student.eventDetails.checkOut")} ${event.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback or just do nothing (social links are below)
        handleCopyLink();
      }
    } catch (err) {
      console.log("Share cancelled");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const createGoogleCalendarLink = (event) => {
    if (!event) return "";
    
    // Format: YYYYMMDDTHHmmssZ
    const formatDate = (dateStr, timeStr) => {
      const d = new Date(dateStr);
      // Simple parsing of "10:00 AM" or "14:00"
      let [hours, minutes] = [0, 0];
      if (timeStr) {
        const match = timeStr.match(/(\d+):(\d+)(?:\s*(AM|PM))?/i);
        if (match) {
          hours = parseInt(match[1]);
          minutes = parseInt(match[2]);
          const meridiem = match[3];
          if (meridiem?.toUpperCase() === 'PM' && hours < 12) hours += 12;
          if (meridiem?.toUpperCase() === 'AM' && hours === 12) hours = 0;
        }
      }
      d.setHours(hours, minutes, 0);
      return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const start = formatDate(event.startDate || event.date, event.time);
    // Use actual endDate if available, otherwise fallback to startDate
    const end = formatDate(event.endDate || event.startDate || event.date, event.endTime || event.time);

    const details = typeof event.description === 'object' 
      ? (event.description[i18n.language] || event.description.en)
      : event.description;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(details || "")}&location=${encodeURIComponent(event.venue || "")}&sf=true&output=xml`;
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="event-banner skeleton rounded-3xl" />
      <div className="event-header">
        <div className="skeleton h-8 w-3/4 mb-4" style={{ borderRadius: '8px' }} />
        <div className="skeleton h-4 w-1/2" style={{ borderRadius: '4px' }} />
      </div>
    </div>
  )

  if (!event) return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
      <h2 className="text-xl font-bold">{t("student.events.noResults") || "Event not found"}</h2>
      <button onClick={() => navigate('/events')} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">
        {t("student.myEvents.browseAll")}
      </button>
    </div>
  )

  const isPassed = new Date(event.date) < new Date().setHours(0,0,0,0)
  const progress = Math.min(100, Math.max(0, ((event.registeredCount || 0) / (event.totalSeats || 100)) * 100));

  // Category to Icon mapping
  const CategoryIcon = {
    "Tech": Laptop,
    "Cultural": Music,
    "Sports": Trophy,
    "Workshops": Wrench,
    "Hackathons": Rocket,
    "Clubs": Users
  }[event.category] || Calendar;

  // Visual gradients for categories
  const gradients = {
    "Tech": "from-blue-600 via-indigo-600 to-violet-600",
    "Cultural": "from-orange-500 via-rose-500 to-purple-600",
    "Sports": "from-emerald-500 via-teal-600 to-cyan-600",
    "Workshops": "from-amber-400 via-orange-500 to-yellow-600",
    "Hackathons": "from-fuchsia-600 via-purple-600 to-indigo-600",
    "Clubs": "from-sky-400 via-blue-500 to-indigo-600"
  }[event.category] || "from-gray-200 via-gray-300 to-gray-200";

  const slugify = (text) => {
    return text
      ?.toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  };

  return (
    <div className="max-w-[1400px] pb-12">
      {/* 1️⃣ Editorial Hero Section */}
      <div className="relative h-[280px] md:h-[400px] rounded-[1rem] overflow-hidden shadow-2xl shadow-indigo-100/50 mb-4 group bg-gray-100 border border-gray-100">
        <img 
          src={event.image || "/Banner_demo.png"} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
        />
        
        {/* Glassmorphism Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-6 left-6 flex gap-3">
          <div className="px-4 py-2 bg-white/90 backdrop-blur-md shadow-xl rounded-xl text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-white/20">
            {t(`common.categories.${event.category.toLowerCase()}`) || event.category}
          </div>
          <div className="px-4 py-2 bg-indigo-600/90 backdrop-blur-md shadow-xl rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/10 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            {t("student.eventDetails.active") || "ACTIVE"}
          </div>
        </div>

        {/* Event Title in Banner (Bottom Left) */}
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
            {(() => {
              const slug = slugify(event.title);
              const titleKey = `content:${slug}.title`;
              const translated = t(titleKey, { lng: i18n.language, fallbackLng: false });
              const isKey = !translated || translated === titleKey || translated.includes('.title') || translated.startsWith('content:');
              return !isKey ? translated : event.title;
            })()}
          </h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 2️⃣ Main Content (Left Column) */}
        <div className="flex-[2] space-y-6">
          {/* Organizer Info (Compact) */}
          <div className="hidden lg:flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 inline-flex">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-indigo-100">
              {event.organizerName?.charAt(0) || "O"}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">{t("student.eventDetails.organizedBy")}</p>
              <p className="font-black text-gray-900 text-base">{event.organizerName || "Campus Club"}</p>
            </div>
          </div>

          {/* Quick Info Grid (Forensic Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-indigo-50/30 transition-all group">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t("student.eventDetails.date")}</p>
              <p className="font-black text-gray-900 text-sm">
                {new Date(event.startDate || event.date).toLocaleDateString(i18n.language, { day: 'numeric', month: 'short' })}
                {event.endDate && event.endDate !== event.startDate && ` - ${new Date(event.endDate).toLocaleDateString(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' })}`}
                {(!event.endDate || event.endDate === event.startDate) && ` ${new Date(event.startDate || event.date).getFullYear()}`}
              </p>
            </div>
            
            <div className="p-5 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-indigo-50/30 transition-all group">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t("student.eventDetails.time")}</p>
              <p className="font-black text-gray-900 text-sm">
                {event.time} {event.endTime && ` - ${event.endTime}`}
              </p>
            </div>
            
            <div className="p-5 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-indigo-50/30 transition-all group">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t("student.eventDetails.location")}</p>
              <p className="font-black text-gray-900 text-sm line-clamp-1">{event.venue}</p>
            </div>
          </div>

          {/* About Section */}
          <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-1.5 h-5 bg-indigo-600 rounded-full" />
              {t("student.eventDetails.aboutEvent")}
            </h2>
            <div className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap font-medium opacity-90">
              {(() => {
                const slug = slugify(event.title);
                const translationKey = `content:${slug}.description`;
                
                // Prioritize manual override if it exists in current language
                const translated = t(translationKey, { lng: i18n.language, fallbackLng: false });
                const isKey = !translated || translated === translationKey || translated.includes('.description') || translated.startsWith('content:');
                
                if (!isKey) return translated;

                // Fallback to the already-localized string from backend
                return event.description || "";
              })()}
            </div>
          </section>
        </div>

        {/* 3️⃣ Sticky Sidebar (Right Column) */}
        <div className="lg:w-[360px] space-y-6">
          <div className="sticky top-20 space-y-6">
            {/* Registration Card (Forensic Style) */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-2xl shadow-indigo-100/40 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                  <Ticket className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900 leading-tight">{t("student.eventDetails.registration")}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isPassed ? t("student.eventDetails.eventClosed") : t("student.eventDetails.openForStudents")}</p>
                </div>
              </div>

              {/* Progress Bar (Integrated) */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-black text-indigo-600 leading-none">
                    {Math.round(progress)}%
                  </span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {event.registeredCount}/{event.totalSeats || 100} {t("student.eventDetails.sold")}
                  </span>
                </div>
                <div className="h-2.5 w-full bg-gray-50 rounded-full overflow-hidden p-0.5 border border-gray-100/50">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-indigo-200/50" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-gray-500">
                    {event.seatsAvailable > 0 
                      ? `${event.seatsAvailable} ${t("student.eventDetails.spotsLeft")}` 
                      : t("student.eventDetails.eventFull")}
                  </span>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="space-y-3 pt-4 border-t border-gray-50">
                {isPassed ? (
                  <button className="w-full py-4 bg-gray-100 text-gray-400 font-black rounded-2xl cursor-not-allowed uppercase tracking-widest shadow-sm text-xs" disabled>
                    {t("student.eventDetails.eventCompleted")}
                  </button>
                ) : isRegistered ? (
                  <button className="w-full py-4 bg-green-500 text-white font-black rounded-2xl shadow-xl shadow-green-100 flex items-center justify-center gap-2 uppercase tracking-widest text-xs" disabled>
                    <CheckCircle className="w-5 h-5" />
                    {t("student.eventDetails.registered")}
                  </button>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering || event.seatsAvailable === 0}
                    className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 uppercase tracking-widest transform hover:-translate-y-1 text-xs"
                  >
                    {registering ? t("student.eventDetails.processing") : event.seatsAvailable === 0 ? t("student.eventDetails.fullCapacity") : t("student.eventDetails.register")}
                  </button>
                )}
                
                <button
                  onClick={handleSetReminder}
                  disabled={isPassed || reminderSet}
                  className={`w-full py-3.5 px-6 rounded-2xl font-black transition-all active:scale-95 border flex items-center justify-center gap-3 uppercase tracking-widest text-[9px] ${
                    reminderSet 
                      ? "bg-green-50 text-green-600 border-green-100" 
                      : "bg-white text-gray-600 border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30"
                  }`}
                >
                  {reminderSet ? <CheckCircle className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                  {reminderSet ? t("student.eventDetails.reminderSet") : t("student.eventDetails.notifyMe")}
                </button>

                <button
                  onClick={() => window.open(createGoogleCalendarLink(event), '_blank')}
                  className="w-full py-3.5 px-6 rounded-2xl font-black transition-all active:scale-95 border border-indigo-100 bg-indigo-50/30 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center gap-3 uppercase tracking-widest text-[9px]"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {t("student.eventDetails.addToCalendar")}
                </button>
              </div>
            </div>

            {/* Additional Meta (Share etc) */}
            <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t("student.eventDetails.share")}</span>
                <button 
                  onClick={handleNativeShare}
                  className="w-9 h-9 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all"
                  title="Native Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#0077b5] hover:border-[#0077b5]/30 hover:bg-[#0077b5]/5 transition-all"
                  title="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(event?.title || "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/5 transition-all"
                  title="Share on Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a 
                  href={`https://wa.me/?text=${encodeURIComponent(`${event?.title}: ${window.location.href}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#25D366] hover:border-[#25D366]/30 hover:bg-[#25D366]/5 transition-all"
                  title="Share on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <button 
                  onClick={handleCopyLink}
                  className={`h-10 rounded-xl flex items-center justify-center transition-all border ${
                    linkCopied 
                      ? "bg-green-50 text-green-600 border-green-200" 
                      : "bg-white text-gray-400 border-gray-100 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/30"
                  }`}
                  title="Copy Link"
                >
                  {linkCopied ? <CheckCircle className="w-4 h-4" /> : <Link className="w-4 h-4" />}
                </button>
              </div>
              {linkCopied && (
                <p className="text-[9px] font-black text-green-600 uppercase tracking-widest text-center animate-pulse">
                  {t("student.eventDetails.linkCopied") || "Link Copied!"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setShowSuccessModal(false)} />
          <div className="relative bg-white rounded-[3rem] shadow-2xl p-10 max-w-md w-full text-center animate-in zoom-in duration-300 border border-gray-100">
            <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-5xl shadow-inner border border-green-100/50">
              🎉
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">{t("student.eventDetails.youreIn")}</h2>
            <p className="text-gray-500 mb-10 leading-relaxed font-medium">
              {t("student.eventDetails.registrationSuccess")}
            </p>
            <div className="space-y-4">
              <button 
                className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest"
                onClick={() => navigate('/my-events')}
              >
                {t("student.eventDetails.viewMyEvents")}
              </button>
              <button 
                className="w-full py-4 text-gray-400 font-black hover:text-gray-600 transition-colors uppercase tracking-widest text-[11px]"
                onClick={() => setShowSuccessModal(false)}
              >
                {t("student.eventDetails.backToDetails")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
