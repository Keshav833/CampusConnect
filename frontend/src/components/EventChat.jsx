import { useEffect, useRef, useState, useCallback } from "react"
import { io } from "socket.io-client"
import axios from "axios"
import { Send, MessageSquare, Wifi, WifiOff, Users } from "lucide-react"
import { useTranslation } from "react-i18next"

let socketInstance = null

function getSocket() {
  if (!socketInstance) {
    let backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
    if (!backendUrl.startsWith("http://") && !backendUrl.startsWith("https://")) {
      backendUrl = "http://" + backendUrl
    }
    socketInstance = io(backendUrl)
  }
  return socketInstance
}

function Avatar({ name, role, size = "md" }) {
  const colors = {
    organizer: "linear-gradient(135deg, #6366f1, #4f46e5)",
    student: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
  }
  const sizes = { sm: "w-7 h-7 text-[10px]", md: "w-9 h-9 text-xs", lg: "w-11 h-11 text-sm" }
  return (
    <div
      className={`${sizes[size]} rounded-xl flex items-center justify-center font-black text-white flex-shrink-0 shadow-lg`}
      style={{ background: colors[role] || colors.student }}
    >
      {name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  )
}

export default function EventChat({ eventId, eventTitle, registeredCount }) {
  const { t } = useTranslation()
  const token = localStorage.getItem("token")
  const userRole = localStorage.getItem("userRole")
  
  // Correctly parse from userData object
  const userDataStr = localStorage.getItem("userData")
  const userData = userDataStr ? JSON.parse(userDataStr) : {}
  const userId = userData._id || userData.id
  const userName = userData.name || userData.email || "You"

  const [messages, setMessages] = useState([])
  const [participants, setParticipants] = useState([])
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("chat") // "chat" | "people"
  const [onlineUsers, setOnlineUsers] = useState(new Set())

  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      try {
        const [msgsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${eventId}`),
        ])
        if (mounted) {
          setMessages(msgsRes.data)
          // Build participants from message history (unique senders)
          const seen = new Map()
          msgsRes.data.forEach((m) => {
            if (!seen.has(m.senderId)) {
              seen.set(m.senderId, { id: m.senderId, name: m.senderName, role: m.senderRole })
            }
          })
          setParticipants(Array.from(seen.values()))
        }
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchData()

    const socket = getSocket()

    socket.emit("join-event-chat", { eventId, userId, name: userName, role: userRole })
    if (userId) setOnlineUsers((prev) => new Set([...prev, userId]))

    const handleMessage = (msg) => {
      if (!mounted) return
      setMessages((prev) => {
        if (prev.find((m) => m._id === msg._id)) return prev
        return [...prev, msg]
      })
      setParticipants((prev) => {
        if (prev.find((p) => p.id === msg.senderId)) return prev
        return [...prev, { id: msg.senderId, name: msg.senderName, role: msg.senderRole }]
      })
    }

    const handleUserJoined = ({ userId: uid, name, role }) => {
      if (!mounted) return
      setOnlineUsers((prev) => new Set([...prev, uid]))
      setParticipants((prev) => {
        if (prev.find((p) => p.id === uid)) return prev
        return [...prev, { id: uid, name, role }]
      })
    }

    const handleUserLeft = ({ userId: uid }) => {
      if (!mounted) return
      setOnlineUsers((prev) => { const s = new Set(prev); s.delete(uid); return s })
    }

    const handleConnect = () => mounted && setConnected(true)
    const handleDisconnect = () => mounted && setConnected(false)

    socket.on("chat-message", handleMessage)
    socket.on("user-joined-chat", handleUserJoined)
    socket.on("user-left-chat", handleUserLeft)
    socket.on("connect", handleConnect)
    socket.on("disconnect", handleDisconnect)
    setConnected(socket.connected)

    return () => {
      mounted = false
      socket.emit("leave-event-chat", eventId)
      socket.off("chat-message", handleMessage)
      socket.off("user-joined-chat", handleUserJoined)
      socket.off("user-left-chat", handleUserLeft)
      socket.off("connect", handleConnect)
      socket.off("disconnect", handleDisconnect)
    }
  }, [eventId, userId])

  const handleSend = useCallback(async () => {
    if (!text.trim() || sending || !token) return

    setSending(true)
    const optimisticId = `opt-${Date.now()}`
    const optimistic = {
      _id: optimisticId,
      senderId: userId,
      senderName: userName,
      senderRole: userRole,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      _optimistic: true,
    }
    setMessages((prev) => [...prev, optimistic])
    const sent = text.trim()
    setText("")

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/${eventId}`,
        { text: sent },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessages((prev) => prev.filter((m) => m._id !== optimisticId))
    } catch {
      setMessages((prev) => prev.filter((m) => m._id !== optimisticId))
      setText(sent)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }, [text, sending, token, eventId, userId, userName, userRole])

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const formatDateGroup = (iso) => {
    const d = new Date(iso)
    const today = new Date()
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
    if (d.toDateString() === today.toDateString()) return "Today"
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday"
    return d.toLocaleDateString([], { day: "numeric", month: "short" })
  }

  // Group messages by date
  const grouped = messages.reduce((acc, msg) => {
    const label = formatDateGroup(msg.createdAt)
    if (!acc[label]) acc[label] = []
    acc[label].push(msg)
    return acc
  }, {})

  const onlineCount = onlineUsers.size

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{
        background: "linear-gradient(170deg, #0a0a1a 0%, #0f0f2a 50%, #080818 100%)",
      }}
    >
      {/* ── Header ─────────────────────────────────── */}
      <div
        className="flex-shrink-0 px-5 pt-5 pb-4 border-b border-white/8"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        {/* Title Row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-indigo-900/60"
            style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}
          >
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-white text-sm leading-tight truncate">{eventTitle}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              {connected
                ? <Wifi className="w-3 h-3 text-emerald-400" />
                : <WifiOff className="w-3 h-3 text-red-400" />
              }
              <span className={`text-[10px] font-bold uppercase tracking-widest ${connected ? "text-emerald-400" : "text-red-400"}`}>
                {connected ? (t("eventChat.live") || "Live") : (t("eventChat.reconnecting") || "Reconnecting...")}
              </span>
              {onlineCount > 0 && (
                <>
                  <span className="text-white/20 text-[10px]">·</span>
                  <span className="text-[10px] text-white/40 font-bold">{onlineCount} online</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tab Row */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-2 px-3 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              activeTab === "chat"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/60"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <MessageSquare className="w-3 h-3" />
            {t("eventChat.chat") || "Chat"}
          </button>
          <button
            onClick={() => setActiveTab("people")}
            className={`flex-1 py-2 px-3 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              activeTab === "people"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/60"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <Users className="w-3 h-3" />
            {t("eventChat.people") || "People"}
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black"
              style={{ background: activeTab === "people" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)" }}
            >
              {participants.length}
            </span>
          </button>
        </div>
      </div>

      {/* ── Chat Tab ────────────────────────────────── */}
      {activeTab === "chat" && (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 chat-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-6 h-6 border-2 border-indigo-500/40 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-10">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))", border: "1px solid rgba(99,102,241,0.2)" }}
                >
                  <MessageSquare className="w-9 h-9" style={{ color: "rgba(99,102,241,0.5)" }} />
                </div>
                <div>
                  <p className="text-sm font-black text-white/40 mb-1">{t("eventChat.noMessages") || "No messages yet"}</p>
                  <p className="text-[11px] text-white/20 font-medium">{t("eventChat.beFirst") || "Be the first to say something!"}</p>
                </div>
              </div>
            ) : (
              Object.entries(grouped).map(([dateLabel, msgs]) => (
                <div key={dateLabel}>
                  {/* Date Divider */}
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <span className="text-[10px] font-black text-white/25 uppercase tracking-widest px-3 py-1 rounded-full"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      {dateLabel}
                    </span>
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                  </div>

                  <div className="space-y-3">
                    {msgs.map((msg, idx) => {
                      const isMe = msg.senderId === userId || msg._optimistic
                      const prevMsg = idx > 0 ? msgs[idx - 1] : null
                      const isContinuation = prevMsg && prevMsg.senderId === msg.senderId

                      return (
                        <div
                          key={msg._id}
                          className={`flex items-end gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"} ${isContinuation ? "mt-1" : "mt-3"}`}
                        >
                          {/* Avatar — show only for the last message in a group */}
                          {!isMe ? (
                            !isContinuation ? (
                              <Avatar name={msg.senderName} role={msg.senderRole} size="sm" />
                            ) : (
                              <div className="w-7 flex-shrink-0" />
                            )
                          ) : null}

                          <div className={`flex flex-col gap-0.5 max-w-[80%] ${isMe ? "items-end" : "items-start"}`}>
                            {!isMe && !isContinuation && (
                              <div className="flex items-center gap-2 px-1 mb-1">
                                <span className="text-[10px] font-black text-white/50">{msg.senderName}</span>
                                {msg.senderRole === "organizer" && (
                                  <span className="px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider"
                                    style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }}
                                  >
                                    {t("eventChat.organizer") || "Organizer"}
                                  </span>
                                )}
                              </div>
                            )}

                            <div
                              className={`px-3.5 py-2.5 text-sm font-medium leading-relaxed break-words transition-opacity ${
                                msg._optimistic ? "opacity-50" : "opacity-100"
                              }`}
                              style={isMe ? {
                                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                                color: "white",
                                borderRadius: isContinuation ? "18px 18px 6px 18px" : "18px 18px 6px 18px",
                                boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
                              } : {
                                background: "rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.9)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: isContinuation ? "18px 18px 18px 6px" : "18px 18px 18px 6px",
                                backdropFilter: "blur(8px)",
                              }}
                            >
                              {msg.text}
                            </div>

                            <span className="text-[9px] px-1 mt-0.5"
                              style={{ color: "rgba(255,255,255,0.2)" }}
                            >
                              {formatTime(msg.createdAt)}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* ── Input ─────────────────────────────────── */}
          <div className="flex-shrink-0 px-4 pb-4 pt-3 border-t"
            style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
          >
            {token ? (
              <div className="flex items-end gap-2.5">
                <Avatar name={userName} role={userRole} size="sm" />
                <div className="flex-1 flex items-end gap-2 rounded-2xl px-3 py-2.5 border"
                  style={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.12)" }}
                >
                  <textarea
                    ref={inputRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t("eventChat.placeholder") || "Type a message..."}
                    rows={1}
                    className="flex-1 bg-transparent text-sm text-white/90 placeholder-white/25 resize-none outline-none font-medium leading-relaxed"
                    style={{ minHeight: "22px", maxHeight: "88px", fieldSizing: "content" }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!text.trim() || sending}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white transition-all active:scale-90 flex-shrink-0 disabled:opacity-30"
                    style={{
                      background: text.trim() && !sending
                        ? "linear-gradient(135deg, #6366f1, #4f46e5)"
                        : "rgba(255,255,255,0.1)",
                      boxShadow: text.trim() && !sending ? "0 4px 14px rgba(99,102,241,0.5)" : "none"
                    }}
                  >
                    {sending
                      ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <Send className="w-3.5 h-3.5" />
                    }
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-3 px-4 rounded-2xl text-center"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <p className="text-xs text-white/35 font-medium">
                  {t("eventChat.loginToChat") || "Log in to join the conversation"}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── People Tab ──────────────────────────────── */}
      {activeTab === "people" && (
        <div className="flex-1 overflow-y-auto px-4 py-4 chat-scrollbar">
          {/* Stats bar */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-2xl px-4 py-3 text-center"
              style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}
            >
              <p className="text-xl font-black text-indigo-300">{registeredCount || participants.length}</p>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-0.5">Registered</p>
            </div>
            <div className="rounded-2xl px-4 py-3 text-center"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              <p className="text-xl font-black text-emerald-400">{onlineCount || 0}</p>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-0.5">Online</p>
            </div>
          </div>

          {/* Active in chat */}
          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 px-1">
            {t("eventChat.activePeople") || "Active in Chat"} ({participants.length})
          </p>

          {participants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <Users className="w-7 h-7" style={{ color: "rgba(255,255,255,0.2)" }} />
              </div>
              <p className="text-sm font-black text-white/30">No participants yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {participants.map((p) => {
                const isOnline = onlineUsers.has(p.id)
                const isCurrentUser = p.id === userId
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 px-3 py-3 rounded-2xl transition-all"
                    style={{
                      background: isCurrentUser ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${isCurrentUser ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.06)"}`,
                    }}
                  >
                    <div className="relative">
                      <Avatar name={p.name} role={p.role} size="md" />
                      {isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2"
                          style={{ borderColor: "#0a0a1a" }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-black text-white/80 truncate">{p.name}</span>
                        {isCurrentUser && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                            style={{ background: "rgba(99,102,241,0.25)", color: "#a5b4fc" }}
                          >You</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[10px] font-bold ${isOnline ? "text-emerald-400" : "text-white/25"}`}>
                          {isOnline ? "Online" : "Offline"}
                        </span>
                        {p.role === "organizer" && (
                          <>
                            <span className="text-white/20 text-[10px]">·</span>
                            <span className="text-[10px] font-black"
                              style={{ color: "#a5b4fc" }}
                            >
                              {t("eventChat.organizer") || "Organizer"}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
