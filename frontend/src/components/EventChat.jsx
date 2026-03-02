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
  const sizes = { sm: "w-8 h-8 text-[11px]", md: "w-10 h-10 text-xs", lg: "w-12 h-12 text-sm" }
  return (
    <div
      className={`${sizes[size]} rounded-[1rem] flex items-center justify-center font-black text-white flex-shrink-0 shadow-2xl transition-transform hover:scale-110 group cursor-default`}
      style={{ background: colors[role] || colors.student, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.4)" }}
    >
      <span className="relative z-10">{name?.charAt(0)?.toUpperCase() || "?"}</span>
      <div className="absolute inset-0 rounded-[1rem] bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
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
    if (activeTab === "chat" && messages.length > 0) {
      const timer = setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [messages, activeTab])

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

// Replace render contents for EventChat
  return (
    <div className="event-chat-v2 layout">
      <div className="chat-panel">
        
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="avatar">
              {eventTitle ? eventTitle.charAt(0)?.toUpperCase() : "E"}
            </div>
            <div className="chat-header-info">
              <h3>{eventTitle || "Event Chat"}</h3>
              <div className="chat-header-meta">
                <span className="status-badge">
                  <span className={`live-dot ${connected ? '' : 'offline'}`} 
                        style={!connected ? { background: '#ef4444', boxShadow: '0 0 0 2px rgba(239,68,68,0.25)', animation: 'none' } : {}}>
                  </span>
                  {connected ? "Live" : "Reconnecting..."}
                </span>
                <span className="online-count">{onlineCount} Online</span>
              </div>
            </div>
          </div>
          <div className="chat-header-right">
            <button className={`toggle-btn ${activeTab === 'chat' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('chat')}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Chat
            </button>
            <button className={`toggle-btn ${activeTab === 'people' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('people')}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              People
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="messages" id="messages">
          {messages.length === 0 ? (
            <div className="text-center text-slate-400 mt-10 font-medium text-sm">
              No messages yet. Be the first to say something!
            </div>
          ) : (
            Object.entries(grouped).map(([dateLabel, msgs]) => (
              <div key={dateLabel}>
                <div className="date-divider">{dateLabel}</div>
                {msgs.map((msg) => {
                  const isMe = msg.senderId === userId || msg._optimistic;
                  const gradient = msg.senderRole === 'organizer' 
                    ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' 
                    : (isMe ? 'linear-gradient(135deg, #4F46E5, #818CF8)' : 'linear-gradient(135deg, #94a3b8, #64748b)');

                  return (
                    <div key={msg._id} className={`msg-row ${isMe ? 'own' : ''} ${msg._optimistic ? 'opacity-60' : ''}`}>
                      <div className="msg-avatar" style={{ background: gradient }}>
                        {msg.senderName?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="msg-content">
                        {!isMe && <span className="msg-name">{msg.senderName}</span>}
                        <div className="msg-bubble">{msg.text}</div>
                        <span className="msg-time">{formatTime(msg.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={bottomRef} className="h-2" />
        </div>

        {/* Input Bar */}
        <div className="input-bar pb-[max(32px,env(safe-area-inset-bottom))]">
          {token ? (
            <div className="input-container">
              <div className="input-actions-left">
                <button className="icon-btn" title="Attach file">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                </button>
                <button className="icon-btn" title="Emoji">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>
                </button>
              </div>
              <textarea
                ref={inputRef}
                className="msg-input"
                placeholder="Type a message…"
                rows="1"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={handleKeyDown}
              />
              <button className="send-btn" onClick={handleSend} disabled={!text.trim() || sending}>
                {sending ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                )}
              </button>
            </div>
          ) : (
             <div className="text-center py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-500 font-medium">
                Log in to join the conversation
             </div>
          )}
        </div>

      </div>

      {/* PEOPLE SIDEBAR */}
      <div className={`people-panel ${activeTab === 'people' ? 'open !max-w-full md:!max-w-[260px]' : ''}`}>
        <div className="people-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Participants · {participants.length}</span>
          <button onClick={() => setActiveTab('chat')} className="md:hidden" style={{ width: '26px', height: '26px', borderRadius: '7px', border: 'none', background: 'var(--bg)', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="people-list">
          {participants.map((p) => {
            const isOnline = onlineUsers.has(p.id);
            const isMe = p.id === userId;
            const gradient = p.role === 'organizer' 
              ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' 
              : (isMe ? 'linear-gradient(135deg, #4F46E5, #818CF8)' : 'linear-gradient(135deg, #94a3b8, #64748b)');

            return (
              <div key={p.id} className="person-row">
                <div className="person-avatar" style={{ background: gradient }}>
                  {p.name?.charAt(0)?.toUpperCase()}
                  {isOnline && <span className="person-online-dot"></span>}
                </div>
                <span className="person-name">{p.name} {isMe && "(You)"}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Injected CSS strictly scoped to .event-chat-v2 */}
      <style>{`
        .event-chat-v2 {
          --indigo: #4F46E5;
          --indigo-dark: #3730A3;
          --indigo-light: #EEF2FF;
          --indigo-mid: #818CF8;
          --surface: #FAFAFA;
          --bg: #F4F4F8;
          --text: #1E1B4B;
          --muted: #6B7280;
          --border: #E5E7EB;
          --white: #FFFFFF;
          --online: #22C55E;
          --radius: 16px;
          --shadow: 0 1px 3px rgba(0,0,0,.07), 0 4px 12px rgba(79,70,229,.08);
          
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          display: flex;
          height: 100%;
          width: 100%;
          overflow: hidden;
          position: relative; /* For mobile absolute sidebar if needed */
        }

        .event-chat-v2 .layout {
          display: flex;
          flex: 1;
          overflow: hidden;
          gap: 0;
          width: 100%;
          height: 100%;
        }

        .event-chat-v2 .chat-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--white);
          overflow: hidden;
          min-width: 0;
        }

        .event-chat-v2 .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid var(--border);
          background: var(--white);
          flex-shrink: 0;
          height: 72px; /* Fixed height for consistent flex layout */
        }

        .event-chat-v2 .chat-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .event-chat-v2 .avatar {
          width: 40px; height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--indigo), var(--indigo-mid));
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }

        .event-chat-v2 .chat-header-info {
           min-width: 0;
        }

        .event-chat-v2 .chat-header-info h3 {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .05em;
          text-transform: uppercase;
          color: var(--text);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .event-chat-v2 .chat-header-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 3px;
        }

        .event-chat-v2 .status-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 500;
          color: var(--online);
        }

        .event-chat-v2 .online-count {
          font-size: 11px;
          color: var(--muted);
          background: var(--indigo-light);
          padding: 2px 8px;
          border-radius: 20px;
          font-weight: 500;
          color: var(--indigo);
        }

        .event-chat-v2 .chat-header-right {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .event-chat-v2 .toggle-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: .04em;
          cursor: pointer;
          border: none;
          transition: all .2s;
        }

        .event-chat-v2 .toggle-btn.active {
          background: var(--indigo);
          color: white;
          box-shadow: 0 2px 8px rgba(79,70,229,.3);
        }

        .event-chat-v2 .toggle-btn.inactive {
          background: var(--bg);
          color: var(--muted);
        }

        .event-chat-v2 .toggle-btn:hover:not(.active) {
          background: var(--indigo-light);
          color: var(--indigo);
        }

        .event-chat-v2 .messages {
          flex: 1;
          max-height: 50vh;
          margin-top: auto;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: var(--surface);
          scroll-behavior: smooth;
        }

        .event-chat-v2 .messages::-webkit-scrollbar { width: 4px; }
        .event-chat-v2 .messages::-webkit-scrollbar-track { background: transparent; }
        .event-chat-v2 .messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

        .event-chat-v2 .date-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 16px 0 8px;
          color: var(--muted);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .event-chat-v2 .date-divider::before, 
        .event-chat-v2 .date-divider::after {
          content: ''; flex: 1; height: 1px; background: var(--border);
        }

        .event-chat-v2 .msg-row {
          display: flex;
          gap: 10px;
          padding: 4px 0;
          align-items: flex-end;
          animation: fadeUp .25s ease;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .event-chat-v2 .msg-row.own {
          flex-direction: row-reverse;
        }

        .event-chat-v2 .msg-avatar {
          width: 30px; height: 30px;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }

        .event-chat-v2 .msg-content {
          max-width: 70%;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .event-chat-v2 .msg-row.own .msg-content { align-items: flex-end; }

        .event-chat-v2 .msg-name {
          font-size: 11px;
          font-weight: 600;
          color: var(--muted);
          padding: 0 4px;
          letter-spacing: .02em;
        }

        .event-chat-v2 .msg-bubble {
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 14px;
          line-height: 1.5;
          position: relative;
          word-break: break-word;
          white-space: pre-wrap;
        }

        .event-chat-v2 .msg-row:not(.own) .msg-bubble {
          background: var(--white);
          color: var(--text);
          border: 1px solid var(--border);
          border-bottom-left-radius: 4px;
          box-shadow: var(--shadow);
        }

        .event-chat-v2 .msg-row.own .msg-bubble {
          background: linear-gradient(135deg, var(--indigo) 0%, #6366F1 100%);
          color: white;
          border-bottom-right-radius: 4px;
          box-shadow: 0 2px 8px rgba(79,70,229,.3);
        }

        .event-chat-v2 .msg-time {
          font-size: 10px;
          color: var(--muted);
          padding: 0 4px;
          opacity: .7;
        }

        .event-chat-v2 .input-bar {
          padding: 16px 24px;
          background: var(--white);
          border-top: 1px solid var(--border);
          flex-shrink: 0;
        }

        .event-chat-v2 .input-container {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg);
          border: 1.5px solid var(--border);
          border-radius: 14px;
          padding: 8px 8px 8px 16px;
          transition: border-color .2s, box-shadow .2s;
        }

        .event-chat-v2 .input-container:focus-within {
          border-color: var(--indigo-mid);
          box-shadow: 0 0 0 3px rgba(79,70,229,.1);
          background: var(--white);
        }

        .event-chat-v2 .input-actions-left {
          display: flex;
          gap: 4px;
          flex-shrink: 0;
        }

        .event-chat-v2 .icon-btn {
          width: 32px; height: 32px;
          border-radius: 8px;
          border: none;
          background: transparent;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: var(--muted);
          transition: all .15s;
        }

        .event-chat-v2 .icon-btn:hover {
          background: var(--indigo-light);
          color: var(--indigo);
        }

        .event-chat-v2 .msg-input {
          flex: 1;
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 14px;
          color: var(--text);
          outline: none;
          resize: none;
          max-height: 120px;
          line-height: 1.5;
        }

        .event-chat-v2 .msg-input::placeholder { color: #9CA3AF; }

        .event-chat-v2 .send-btn {
          width: 38px; height: 38px;
          border-radius: 10px;
          border: none;
          background: var(--indigo);
          color: white;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all .2s;
          box-shadow: 0 2px 8px rgba(79,70,229,.35);
        }

        .event-chat-v2 .send-btn:hover:not(:disabled) {
          background: var(--indigo-dark);
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(79,70,229,.4);
        }

        .event-chat-v2 .send-btn:active:not(:disabled) { transform: scale(.97); }
        .event-chat-v2 .send-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        /* PEOPLE SIDEBAR */
        .event-chat-v2 .people-panel {
          width: 260px;
          flex-shrink: 0;
          background: var(--white);
          border-left: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          max-width: 0;
          border-left-width: 0;
          transition: max-width .3s cubic-bezier(.4,0,.2,1) !important, border-left-width .3s;
        }

        .event-chat-v2 .people-panel.open {
          max-width: 260px;
          border-left-width: 1px;
        }

        @media (max-width: 768px) {
          .event-chat-v2 .people-panel {
            position: absolute;
            top: 72px; /* Height of the header */
            right: 0;
            bottom: 0;
            z-index: 50;
            background: var(--surface);
          }
          
          /* Full width on very small screens if toggled */
          .event-chat-v2 .people-panel.open {
             max-width: 100%;
             width: 100%;
             border-left-width: 0;
          }
        }

        .event-chat-v2 .people-header {
          padding: 16px 20px 12px;
          border-bottom: 1px solid var(--border);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--muted);
        }

        .event-chat-v2 .people-list {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .event-chat-v2 .people-list::-webkit-scrollbar { width: 3px; }
        .event-chat-v2 .people-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

        .event-chat-v2 .person-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 10px;
          cursor: pointer;
          transition: background .15s;
        }

        .event-chat-v2 .person-row:hover { background: var(--indigo-light); }

        .event-chat-v2 .person-avatar {
          width: 32px; height: 32px;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
          position: relative;
        }

        .event-chat-v2 .person-online-dot {
          position: absolute;
          bottom: -1px; right: -1px;
          width: 9px; height: 9px;
          border-radius: 50%;
          background: var(--online);
          border: 2px solid var(--white);
        }

        .event-chat-v2 .person-name {
          font-size: 13px;
          font-weight: 500;
          color: var(--text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .event-chat-v2 .live-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--online);
          box-shadow: 0 0 0 2px rgba(34,197,94,.25);
          animation: pulse 2s infinite;
        }

        .event-chat-v2 .live-dot.offline {
           animation: none !important;
        }

        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 2px rgba(34,197,94,.25); }
          50% { box-shadow: 0 0 0 5px rgba(34,197,94,.08); }
        }
      `}</style>
    </div>
  )
}
