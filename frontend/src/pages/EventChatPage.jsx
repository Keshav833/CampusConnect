import { useEffect, useRef, useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { io } from "socket.io-client"
import axios from "axios"
import { useTranslation } from "react-i18next"
import {
  ArrowLeft,
  Send,
  MessageSquare,
  Users,
  Wifi,
  WifiOff,
  Calendar,
  MapPin,
  Clock,
  Hash,
  Info
} from "lucide-react"

/* ─── Shared socket singleton ──────────────────────────────────── */
let _socket = null
function getSocket() {
  if (!_socket) {
    let backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
    // Handle cases where URL might be missing the protocol scheme
    if (!backendUrl.startsWith("http://") && !backendUrl.startsWith("https://")) {
      backendUrl = "http://" + backendUrl
    }
    _socket = io(backendUrl)
  }
  return _socket
}

/* ─── Avatar component ─────────────────────────────────────────── */
function Avatar({ name, role, size = "md", showRing = false }) {
  const gradients = {
    organizer: "linear-gradient(135deg,#6366f1,#4f46e5)",
    student:   "linear-gradient(135deg,#8b5cf6,#6d28d9)",
    default:   "linear-gradient(135deg,#64748b,#475569)",
  }
  const sizes = {
    xs: "w-6 h-6 text-[9px]",
    sm: "w-8 h-8 text-[11px]",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  }
  return (
    <div
      className={`${sizes[size]} rounded-xl flex items-center justify-center font-black text-white flex-shrink-0 ${showRing ? "ring-2 ring-white/20" : ""}`}
      style={{ background: gradients[role] || gradients.default, boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
    >
      {name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  )
}

/* ─── Helpers ──────────────────────────────────────────────────── */
const fmtTime  = (iso) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
const fmtGroup = (iso) => {
  const d = new Date(iso), today = new Date()
  const yest = new Date(); yest.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return "Today"
  if (d.toDateString() === yest.toDateString())  return "Yesterday"
  return d.toLocaleDateString([], { weekday: "long", day: "numeric", month: "short" })
}

/* ═══════════════════════════════════════════════════════════════ */
export default function EventChatPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const token    = localStorage.getItem("token")
  const userRole = localStorage.getItem("userRole")
  const userData = JSON.parse(localStorage.getItem("userData") || "{}")
  const userId   = userData._id || userData.id
  const userName = userData.name || userData.email || "You"

  /* ── State ────────────────────────────────────────────────────── */
  const [event,        setEvent]        = useState(null)
  const [messages,     setMessages]     = useState([])
  const [participants, setParticipants] = useState([])   // { id, name, role }
  const [onlineSet,    setOnlineSet]    = useState(new Set())
  const [text,         setText]         = useState("")
  const [sending,      setSending]      = useState(false)
  const [connected,    setConnected]    = useState(false)
  const [loading,      setLoading]      = useState(true)
  const [activeTab,    setActiveTab]    = useState("chat") // "chat" | "people" | "info"

  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  /* ── Helpers ──────────────────────────────────────────────────── */
  const addParticipant = useCallback((p) => {
    setParticipants((prev) => prev.find((x) => x.id === p.id) ? prev : [...prev, p])
  }, [])

  /* ── Fetch event + message history ───────────────────────────── */
  useEffect(() => {
    const lang = i18n.language
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

    Promise.all([
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/events/${id}?lang=${lang}`, config),
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${id}`),
    ]).then(([evRes, msgRes]) => {
      setEvent(evRes.data)
      setMessages(msgRes.data)

      const seen = new Map()
      msgRes.data.forEach((m) => {
        if (!seen.has(m.senderId)) seen.set(m.senderId, { id: m.senderId, name: m.senderName, role: m.senderRole })
      })
      setParticipants(Array.from(seen.values()))
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [id, token, i18n.language])

  /* ── Auto-scroll ─────────────────────────────────────────────── */
  useEffect(() => {
    if (activeTab === "chat") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, activeTab])

  /* ── Socket.IO ───────────────────────────────────────────────── */
  useEffect(() => {
    let live = true
    const socket = getSocket()

    socket.emit("join-event-chat", { eventId: id, userId, name: userName, role: userRole })
    if (userId) setOnlineSet((s) => new Set([...s, userId]))

    const onMsg = (msg) => {
      if (!live) return
      setMessages((p) => p.find((m) => m._id === msg._id) ? p : [...p, msg])
      addParticipant({ id: msg.senderId, name: msg.senderName, role: msg.senderRole })
    }
    const onJoin = ({ userId: uid, name, role }) => {
      if (!live) return
      setOnlineSet((s) => new Set([...s, uid]))
      addParticipant({ id: uid, name, role })
    }
    const onLeave = ({ userId: uid }) => live && setOnlineSet((s) => { const n = new Set(s); n.delete(uid); return n })
    const onConn  = () => live && setConnected(true)
    const onDisc  = () => live && setConnected(false)

    socket.on("chat-message",    onMsg)
    socket.on("user-joined-chat",onJoin)
    socket.on("user-left-chat",  onLeave)
    socket.on("connect",         onConn)
    socket.on("disconnect",      onDisc)
    setConnected(socket.connected)

    return () => {
      live = false
      socket.emit("leave-event-chat", id)
      socket.off("chat-message",    onMsg)
      socket.off("user-joined-chat",onJoin)
      socket.off("user-left-chat",  onLeave)
      socket.off("connect",         onConn)
      socket.off("disconnect",      onDisc)
    }
  }, [id, userId, userName, userRole, addParticipant])

  /* ── Send message ─────────────────────────────────────────────── */
  const handleSend = useCallback(async () => {
    if (!text.trim() || sending || !token) return
    setSending(true)
    const oid = `opt-${Date.now()}`
    const optimistic = { _id: oid, senderId: userId, senderName: userName, senderRole: userRole, text: text.trim(), createdAt: new Date().toISOString(), _opt: true }
    setMessages((p) => [...p, optimistic])
    const sent = text.trim()
    setText("")
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${id}`, { text: sent }, { headers: { Authorization: `Bearer ${token}` } })
      setMessages((p) => p.filter((m) => m._id !== oid))
    } catch {
      setMessages((p) => p.filter((m) => m._id !== oid))
      setText(sent)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }, [text, sending, token, id, userId, userName, userRole])

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }

  /* ── Group messages by date ──────────────────────────────────── */
  const grouped = messages.reduce((acc, m) => {
    const k = fmtGroup(m.createdAt)
    ;(acc[k] = acc[k] || []).push(m)
    return acc
  }, {})

  /* ── Event display helpers ───────────────────────────────────── */
  const getTitle = (tObj) => typeof tObj === 'object' ? (tObj[i18n.language] || tObj.en || Object.values(tObj)[0]) : tObj

  const slugify = (txt) => {
    const titleStr = getTitle(txt)
    return titleStr?.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")
  }

  const displayTitle = event ? (() => {
    const titleStr = getTitle(event.title)
    const slug = slugify(event.title)
    const key  = `content:${slug}.title`
    const tr   = t(key, { lng: i18n.language, fallbackLng: false })
    return (!tr || tr === key || tr.startsWith("content:")) ? titleStr : tr
  })() : ""

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header Info Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/30">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex -space-x-2">
            {participants.slice(0, 3).map((p, i) => (
              <div key={p.id} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm">
                 <Avatar name={p.name} role={p.role} size="xs" />
              </div>
            ))}
            {participants.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-gray-500 shadow-sm">
                +{participants.length - 3}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest truncate">{t("eventChat.eventChat") || "Event Chat"}</h2>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-500" : "bg-red-500"} animate-pulse`} />
              <span className="text-[10px] font-bold text-gray-400">
                {connected ? t("eventChat.live") || "Connected" : t("eventChat.reconnecting") || "Connecting..."}
              </span>
              <span className="text-gray-200 text-[10px]">•</span>
              <span className="text-[10px] font-bold text-indigo-600">
                {onlineSet.size} {t("eventChat.online") || "Online"}
              </span>
            </div>
          </div>
        </div>

        {/* Inner Tab Switcher */}
        <div className="flex gap-1 p-1 bg-gray-100/50 rounded-xl border border-gray-100">
          {[
            { id: "chat",   icon: MessageSquare, label: t("eventChat.chat") || "Chat" },
            { id: "people", icon: Users,         label: t("eventChat.people") || "People" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id ? "bg-white text-indigo-600 shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <tab.icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto relative scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        
        {/* ── Chat Tab ── */}
        {activeTab === "chat" && (
          <div className="px-6 py-6 space-y-1">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-20 gap-4 opacity-50 text-center px-10">
                <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center shadow-inner">
                   <MessageSquare className="w-10 h-10 text-gray-300" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">{t("eventChat.noMessages") || "No messages yet"}</p>
                  <p className="text-xs font-medium text-gray-400 mt-1">{t("eventChat.beFirst") || "Start the first conversation with fellow participants!"}</p>
                </div>
              </div>
            ) : (
              Object.entries(grouped).map(([dateLabel, msgs]) => (
                <div key={dateLabel}>
                  <div className="flex items-center gap-4 my-8">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{dateLabel}</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                  {msgs.map((msg, idx) => {
                    const isMe = msg.senderId === userId || msg._opt
                    const prev = msgs[idx - 1]
                    const isCont = prev && prev.senderId === msg.senderId
                    return (
                      <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"} ${isCont ? "mt-0.5" : "mt-4"}`}>
                        {!isMe && !isCont && (
                          <div className="mr-3">
                            <Avatar name={msg.senderName} role={msg.senderRole} size="sm" />
                          </div>
                        )}
                        {!isMe && isCont && <div className="w-11" />}
                        
                        <div className={`flex flex-col max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                          {!isMe && !isCont && (
                            <span className="text-[10px] font-black text-gray-400 mb-1.5 flex items-center gap-2 ml-1">
                              {msg.senderName}
                              {msg.senderRole === "organizer" && (
                                <span className="text-[8px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100/50 font-black">ORGANIZER</span>
                              )}
                            </span>
                          )}
                          <div className={`px-4 py-2.5 rounded-2xl text-[13px] font-medium leading-relaxed ${
                            isMe 
                              ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100/50 rounded-tr-none" 
                              : "bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200/50"
                          } ${msg._opt ? "opacity-50" : ""}`}>
                            {msg.text}
                          </div>
                          <span className="text-[9px] text-gray-300 font-bold mt-1.5 mx-1 uppercase tracking-tighter">{fmtTime(msg.createdAt)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))
            )}
            <div ref={bottomRef} className="h-4" />
          </div>
        )}

        {/* ── People Tab ── */}
        {activeTab === "people" && (
          <div className="p-8 space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 px-2">
              {participants.length} {t("eventChat.participants") || "Participants"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {participants.map((p) => {
                const isOnline = onlineSet.has(p.id)
                const isMe = p.id === userId
                return (
                  <div key={p.id} className="flex items-center gap-4 p-4 rounded-3xl bg-white border border-gray-100 hover:shadow-lg hover:shadow-indigo-50/50 transition-all group">
                    <div className="relative">
                      <Avatar name={p.name} role={p.role} size="md" />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${isOnline ? "bg-emerald-500" : "bg-gray-200"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{p.name}</span>
                        {isMe && <span className="text-[8px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-black uppercase">You</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${isOnline ? "text-emerald-500" : "text-gray-400"}`}>
                          {isOnline ? "Online" : "Away"}
                        </span>
                        {p.role === "organizer" && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-200 text-[10px]">|</span>
                            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Organizer</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      {activeTab === "chat" && (
        <div className="p-6 border-t border-gray-100 bg-gray-50/20">
          <div className="relative flex items-end gap-3 rounded-[1.5rem] bg-white border border-gray-200 p-2.5 focus-within:border-indigo-600/30 focus-within:shadow-xl focus-within:shadow-indigo-50 transition-all">
            <textarea
              ref={inputRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder={t("eventChat.placeholder") || "Share something with the team..."}
              className="flex-1 bg-transparent border-none outline-none text-sm py-2 px-4 resize-none text-gray-800 placeholder:text-gray-300 leading-relaxed font-medium"
              style={{ maxHeight: "120px" }}
            />
            <button
              onClick={handleSend}
              disabled={!text.trim() || sending}
              className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all active:scale-90 ${
                text.trim() && !sending 
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700" 
                  : "bg-gray-50 text-gray-200 cursor-not-allowed"
              }`}
            >
              {sending ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}
      
      <style>{`
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  )
}
