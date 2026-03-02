import { useEffect, useState } from "react"
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import axios from "axios"
import { 
  Calendar, 
  Clock, 
  MapPin, 
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
  MessageCircle,
  MessageSquare,
  X,
  Info
} from "lucide-react"
import "./EventDetails.css"

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { t, i18n } = useTranslation()
  
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [reminderSet, setReminderSet] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const token = localStorage.getItem("token")
  const userRole = localStorage.getItem("userRole")
  
  // Correctly parse userId from userData object
  const userDataStr = localStorage.getItem("userData")
  const userData = userDataStr ? JSON.parse(userDataStr) : null
  const userId = userData?._id || userData?.id

  const isChatOpen = location.pathname.endsWith("/chat")

  useEffect(() => {
    fetchEventDetails()
    if (token && userRole === "student") {
      checkRegistrationStatus()
    } else {
      setCheckingStatus(false)
    }
  }, [id, token, userRole, i18n.language])

  const checkRegistrationStatus = async () => {
    try {
      setCheckingStatus(true)
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/registrations/${id}/status`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setIsRegistered(res.data.registered)
    } catch (error) {
      console.error("Error checking registration status:", error)
    } finally {
      setCheckingStatus(false)
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
    if (!token) { navigate("/login"); return }
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
      fetchEventDetails()
    } catch (error) {
      alert(error.response?.data?.message || error.response?.data?.error || "Registration failed")
    } finally {
      setRegistering(false)
    }
  }

  const handleSetReminder = () => setReminderSet(true)

  const handleNativeShare = async () => {
    const shareData = {
      title: event.title,
      text: `${t("student.eventDetails.checkOut")} ${event.title}`,
      url: window.location.href,
    }
    try {
      if (navigator.share) await navigator.share(shareData)
      else handleCopyLink()
    } catch { /* cancelled */ }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const createGoogleCalendarLink = (event) => {
    if (!event) return ""
    const formatDate = (dateStr, timeStr) => {
      const d = new Date(dateStr)
      let [hours, minutes] = [0, 0]
      if (timeStr) {
        const match = timeStr.match(/(\d+):(\d+)(?:\s*(AM|PM))?/i)
        if (match) {
          hours = parseInt(match[1])
          minutes = parseInt(match[2])
          const meridiem = match[3]
          if (meridiem?.toUpperCase() === "PM" && hours < 12) hours += 12
          if (meridiem?.toUpperCase() === "AM" && hours === 12) hours = 0
        }
      }
      d.setHours(hours, minutes, 0)
      return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    }
    const start = formatDate(event.startDate || event.date, event.time)
    const end = formatDate(event.endDate || event.startDate || event.date, event.endTime || event.time)
    const details = typeof event.description === "object"
      ? (event.description[i18n.language] || event.description.en)
      : event.description
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(getTitle(event.title))}&dates=${start}/${end}&details=${encodeURIComponent(details || "")}&location=${encodeURIComponent(event.venue || "")}&sf=true&output=xml`
  }

  if (loading) return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="event-banner skeleton rounded-3xl" />
      <div className="event-header">
        <div className="skeleton h-8 w-3/4 mb-4" style={{ borderRadius: "8px" }} />
        <div className="skeleton h-4 w-1/2" style={{ borderRadius: "4px" }} />
      </div>
    </div>
  )

  if (!event) return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
      <h2 className="text-xl font-bold">{t("student.events.noResults") || "Event not found"}</h2>
      <button onClick={() => navigate("/events")} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">
        {t("student.myEvents.browseAll")}
      </button>
    </div>
  )

  const isPassed = new Date(event.date) < new Date().setHours(0, 0, 0, 0)
  const progress = Math.min(100, Math.max(0, ((event.registeredCount || 0) / (event.totalSeats || 100)) * 100))

  const CategoryIcon = {
    Tech: Laptop, Cultural: Music, Sports: Trophy,
    Workshops: Wrench, Hackathons: Rocket, Clubs: Users,
  }[event.category] || Calendar

  const activeTab = location.pathname.split("/").pop() === id ? "overview" : location.pathname.split("/").pop()

  const hasAccess = isRegistered || (userRole === "organizer" && event?.organizerId === userId)

  const tabs = [
    { id: "overview", label: t("student.eventDetails.overview") || "Overview", icon: Info },
    { id: "schedule", label: t("student.eventDetails.schedule") || "Schedule", icon: Clock },
    { id: "chat",     label: t("eventChat.eventChat") || "Chat Room", icon: MessageSquare, badge: hasAccess },
  ]

  const getTitle = (tObj) => typeof tObj === 'object' ? (tObj[i18n.language] || tObj.en || Object.values(tObj)[0]) : tObj

  const slugify = (text) => {
    const titleStr = getTitle(text)
    return titleStr?.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
  }

  return (
    <div className="relative min-h-full">
      <div className="max-w-[1400px] pb-12 transition-all duration-300">
        
        {/* ── Hero Banner ──────────────────────────────── */}
        <div className="relative h-[240px] md:h-[350px] rounded-[2rem] overflow-hidden shadow-2xl shadow-indigo-100/30 mb-6 group bg-gray-100 border border-gray-100">
          <img
            src={event.image || "/Banner_demo.png"}
            alt={getTitle(event.title)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute top-6 left-6 flex gap-3">
            <div className="px-4 py-2 bg-white/95 backdrop-blur-md shadow-xl rounded-xl text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-white/20">
              {t(`common.categories.${event.category.toLowerCase()}`) || event.category}
            </div>
            {isRegistered && (
              <div className="px-4 py-2 bg-green-500 backdrop-blur-md shadow-xl rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/10 flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                {t("student.eventDetails.registered") || "REGISTERED"}
              </div>
            )}
          </div>

          <div className="absolute bottom-8 left-8 right-8">
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-xl">
              {(() => {
                const titleStr = getTitle(event.title)
                const slug = slugify(event.title)
                const titleKey = `content:${slug}.title`
                const translated = t(titleKey, { lng: i18n.language, fallbackLng: false })
                const isKey = !translated || translated === titleKey || translated.includes(".title") || translated.startsWith("content:")
                return !isKey ? translated : titleStr
              })()}
            </h1>
          </div>
        </div>

        {/* ── Tab Navigation ────────────────────────────── */}
        <div className={`sticky top-0 z-[50] bg-white/80 backdrop-blur-xl border-b border-gray-100 py-2 flex-none ${isChatOpen ? "mb-2" : "mb-8"}`}>
          <div className="flex items-center gap-1 md:gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(tab.id === "overview" ? `/events/${id}` : `/events/${id}/${tab.id}`)}
                className={`relative px-4 md:px-6 py-4 flex items-center gap-2.5 transition-all group ${
                  activeTab === tab.id ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                <span className="text-[11px] md:text-xs font-black uppercase tracking-widest">{tab.label}</span>
                {tab.id === "chat" && hasAccess && (
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full shadow-[0_-4px_12px_rgba(79,70,229,0.4)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content Area ────────────────────────────── */}
        <div className={`${isChatOpen ? "flex-1 min-h-0" : "min-h-[500px]"}`}>
          {activeTab === "overview" ? (
            <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* ── Left: Overview Content ────────────────── */}
              <div className="flex-[2] space-y-8">
                <div className="flex items-center gap-5 p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-xl shadow-indigo-100">
                    {event.organizerName?.charAt(0) || "O"}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">{t("student.eventDetails.organizedBy")}</p>
                    <p className="font-black text-gray-900 text-lg">{event.organizerName || "Campus Club"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-indigo-50/30 transition-all group">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{t("student.eventDetails.date")}</p>
                    <p className="font-black text-gray-900 text-sm">
                      {new Date(event.startDate || event.date).toLocaleDateString(i18n.language, { day: "numeric", month: "short" })}
                      {event.endDate && event.endDate !== event.startDate && ` - ${new Date(event.endDate).toLocaleDateString(i18n.language, { day: "numeric", month: "short", year: "numeric" })}`}
                      {(!event.endDate || event.endDate === event.startDate) && ` ${new Date(event.startDate || event.date).getFullYear()}`}
                    </p>
                  </div>

                  <div className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-indigo-50/30 transition-all group">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                      <Clock className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{t("student.eventDetails.time")}</p>
                    <p className="font-black text-gray-900 text-sm">{event.time}{event.endTime && ` - ${event.endTime}`}</p>
                  </div>

                  <div className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-indigo-50/30 transition-all group">
                    <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{t("student.eventDetails.location")}</p>
                    <p className="font-black text-gray-900 text-sm line-clamp-1">{event.venue}</p>
                  </div>
                </div>

                <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
                  <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-4">
                    <div className="w-2 h-6 bg-indigo-600 rounded-full shadow-lg shadow-indigo-200" />
                    {t("student.eventDetails.aboutEvent")}
                  </h2>
                  <div className="text-gray-600 leading-[1.8] text-sm whitespace-pre-wrap font-medium opacity-90 first-letter:text-3xl first-letter:font-black first-letter:mr-1 first-letter:text-indigo-600">
                    {(() => {
                      const slug = slugify(event.title)
                      const translationKey = `content:${slug}.description`
                      const translated = t(translationKey, { lng: i18n.language, fallbackLng: false })
                      const isKey = !translated || translated === translationKey || translated.includes(".description") || translated.startsWith("content:")
                      if (!isKey) return translated
                      return event.description || ""
                    })()}
                  </div>
                </section>
              </div>

              {/* ── Right: Sidebar Card ───────────────────── */}
              <div className="lg:w-[380px] space-y-6">
                <div className="sticky top-28 space-y-6">
                  
                  {/* Registration Card */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-indigo-100/40 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-full blur-2xl -mr-12 -mt-12" />
                    
                    <div className="flex items-center gap-5 relative z-10">
                      <div className="w-14 h-14 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-200 group-hover:rotate-6 transition-transform">
                        <Ticket className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-gray-900 leading-tight">{t("student.eventDetails.registration")}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                          {isPassed ? t("student.eventDetails.eventClosed") : t("student.eventDetails.openForStudents")}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-2xl font-black text-indigo-600 leading-none tracking-tighter">{Math.round(progress)}% <span className="text-xs uppercase ml-1 opacity-50">Sold</span></span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {event.registeredCount}/{event.totalSeats || 100} Spots
                        </span>
                      </div>
                      <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden p-0.5 border border-gray-100/50 shadow-inner">
                        <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-indigo-200/50" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="flex items-center gap-2 px-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {event.seatsAvailable > 0
                            ? `${event.seatsAvailable} ${t("student.eventDetails.spotsLeft")}`
                            : t("student.eventDetails.eventFull")}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 relative z-10 pt-4 border-t border-gray-50">
                      {isPassed ? (
                        <button className="w-full py-5 bg-gray-100 text-gray-400 font-black rounded-2xl cursor-not-allowed uppercase tracking-widest shadow-sm text-xs" disabled>
                          {t("student.eventDetails.eventCompleted")}
                        </button>
                      ) : isRegistered ? (
                        <div className="space-y-3">
                          <button className="w-full py-5 bg-green-500 text-white font-black rounded-2xl shadow-xl shadow-green-100 flex items-center justify-center gap-3 uppercase tracking-widest text-xs" disabled>
                            <CheckCircle className="w-5 h-5" />
                            {t("student.eventDetails.registered")}
                          </button>
                          <button 
                            onClick={() => navigate(`/events/${id}/chat`)}
                            className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all"
                          >
                            <MessageSquare className="w-4 h-4" />
                            {t("eventChat.openChatRoom") || "Join Participant Chat"}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={handleRegister}
                          disabled={registering || event.seatsAvailable === 0}
                          className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 uppercase tracking-widest transform hover:-translate-y-1 text-xs"
                        >
                          {registering ? t("student.eventDetails.processing") : event.seatsAvailable === 0 ? t("student.eventDetails.fullCapacity") : t("student.eventDetails.register")}
                        </button>
                      )}

                      {!isRegistered && (
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={handleSetReminder}
                            disabled={isPassed || reminderSet}
                            className={`py-4 px-2 rounded-2xl font-black transition-all active:scale-95 border flex items-center justify-center gap-2 uppercase tracking-widest text-[9px] ${
                              reminderSet ? "bg-green-50 text-green-600 border-green-100" : "bg-white text-gray-500 border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30"
                            }`}
                          >
                            {reminderSet ? <CheckCircle className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
                            {reminderSet ? "Set" : t("student.eventDetails.notifyMe")}
                          </button>
                          <button
                            onClick={() => window.open(createGoogleCalendarLink(event), "_blank")}
                            className="py-4 px-2 rounded-2xl font-black transition-all active:scale-95 border border-indigo-100 bg-indigo-50/30 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center gap-2 uppercase tracking-widest text-[9px]"
                          >
                            <Calendar className="w-3 h-3" />
                            Save
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Share Card Mini */}
                  <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Spread the word</span>
                    <div className="flex gap-2">
                       <button onClick={handleNativeShare} className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-all">
                         <Share2 className="w-4 h-4" />
                       </button>
                       <button onClick={handleCopyLink} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${linkCopied ? "bg-green-50 text-green-600 border-green-200" : "bg-white text-gray-400 border-gray-100 hover:text-indigo-600"}`}>
                         {linkCopied ? <CheckCircle className="w-4 h-4" /> : <Link className="w-4 h-4" />}
                       </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ) : activeTab === "schedule" ? (
             <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner">
                         <Clock className="w-8 h-8" />
                      </div>
                      <div>
                         <h2 className="text-2xl font-black text-gray-900 leading-tight tracking-tight">Timeline & Schedule</h2>
                         <p className="text-sm font-medium text-gray-400">Important milestones for this event</p>
                      </div>
                   </div>

                   <div className="space-y-0 relative pl-8 border-l-2 border-dashed border-gray-100 ml-4">
                      {[
                        { time: event.time, label: "Event Kickoff", desc: "Main doors open and registrations begin", color: "bg-indigo-600" },
                        { time: "TBA", label: "Core Sessions", desc: "Workshop or competition commencement", color: "bg-blue-500" },
                        { time: event.endTime || "End", label: "Closing Ceremony", desc: "Results announcement and certificate distribution", color: "bg-purple-500" },
                      ].map((step, i) => (
                        <div key={i} className="relative pb-12 last:pb-0 group">
                           <div className={`absolute -left-[41px] top-0 w-4 h-4 ${step.color} rounded-full border-4 border-white shadow-lg group-hover:scale-125 transition-transform`} />
                           <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                              <span className="text-sm font-black text-indigo-600 uppercase tracking-widest min-w-[100px]">{step.time}</span>
                              <div>
                                 <h4 className="text-base font-black text-gray-900">{step.label}</h4>
                                 <p className="text-xs font-medium text-gray-400 mt-0.5">{step.desc}</p>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {checkingStatus ? (
                <div className="flex flex-col items-center justify-center p-20 space-y-4">
                  <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Verifying Access...</p>
                </div>
              ) : hasAccess ? (
                 <div className={`bg-white rounded-[2rem] md:rounded-[3rem] border border-gray-100 shadow-sm overflow-visible flex flex-col ${activeTab === "chat" ? "relative scroll-mt-24 min-h-[600px]" : "min-h-[700px]"}`}>
                    <Outlet />
                 </div>
              ) : (
                 <div className="bg-white p-20 rounded-[3rem] border border-gray-100 text-center space-y-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-4xl shadow-inner grayscale opacity-50">
                       🔒
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">{t("eventChat.locked") || "Chat Locked"}</h2>
                    <p className="text-gray-400 max-w-sm mx-auto font-medium">
                       {t("eventChat.lockedDesc") || "You must be registered for this event to join the participant chat room and connect with others."}
                    </p>
                    <button 
                      onClick={() => navigate(`/events/${id}`)}
                      className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:scale-105 transition-all text-xs uppercase tracking-widest"
                    >
                       Back to Registration
                    </button>
                 </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Success Modal ─────────────────────────────── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setShowSuccessModal(false)} />
          <div className="relative bg-white rounded-[3rem] shadow-2xl p-10 max-w-md w-full text-center animate-in zoom-in duration-300 border border-gray-100">
            <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-5xl shadow-inner border border-green-100/50">
              🎉
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">{t("student.eventDetails.youreIn")}</h2>
            <p className="text-gray-500 mb-10 leading-relaxed font-medium">{t("student.eventDetails.registrationSuccess")}</p>
            <div className="space-y-4">
              <button className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest" onClick={() => navigate("/my-events")}>
                {t("student.eventDetails.viewMyEvents")}
              </button>
              <button className="w-full py-4 text-gray-400 font-black hover:text-gray-600 transition-colors uppercase tracking-widest text-[11px]" onClick={() => setShowSuccessModal(false)}>
                {t("student.eventDetails.backToDetails")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
