import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
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
  Share2
} from "lucide-react"
import "./EventDetails.css"

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [reminderSet, setReminderSet] = useState(false)

  const token = localStorage.getItem("token")
  const userRole = localStorage.getItem("userRole")

  useEffect(() => {
    fetchEventDetails()
    if (token && userRole === "student") {
      checkRegistrationStatus()
    }
  }, [id, token, userRole])

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
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/events/${id}`, config)
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
      alert("Only students can register for events.")
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
    // In a real app, this might call an API
  }

  if (loading) return (
    <div className="event-details-container">
      <div className="event-banner skeleton" />
      <div className="event-header">
        <div className="skeleton h-8 w-3/4 mb-4" style={{ borderRadius: '8px' }} />
        <div className="skeleton h-4 w-1/2" style={{ borderRadius: '4px' }} />
      </div>
      <div className="meta-block">
        {[1, 2, 3].map(i => (
          <div key={i} className="meta-row">
            <div className="meta-icon skeleton" />
            <div className="meta-text">
              <div className="skeleton h-4 w-24 mb-2" />
              <div className="skeleton h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (!event) return (
    <div className="event-details-container flex flex-col items-center justify-center p-10 text-center">
      <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
      <h2 className="text-xl font-bold">Event not found</h2>
      <p className="text-gray-500 mb-6">The event you're looking for doesn't exist or was removed.</p>
      <button onClick={() => navigate('/events')} className="btn-modal-primary">Go back to Discover</button>
    </div>
  )

  const isPassed = new Date(event.date) < new Date().setHours(0,0,0,0)
  const isFull = event.seatsAvailable <= 0

  return (
    <div className="event-details-container">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="absolute top-4 left-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full shadow-lg">
        <ArrowLeft className="w-5 h-5 text-gray-800" />
      </button>

      {/* 1️⃣ Event Banner */}
      <div className="event-banner">
        <img src={event.image || "/Banner_demo.png"} alt={event.title} />
        <div className="category-badge-overlay">{event.category}</div>
      </div>

      {/* 2️⃣ Title + Category */}
      <div className="event-header">
        <h1 className="event-title">{event.title}</h1>
        <div className="category-chip">[ {event.category} ]</div>
      </div>

      {/* 3️⃣ Organizer Info */}
      <div className="organizer-info">
        <div className="organizer-avatar">
          {event.organizerName?.charAt(0) || "O"}
        </div>
        <div className="organizer-name">
          Organized by <span>{event.organizerName || "Campus Club"}</span>
        </div>
      </div>

      {/* 4️⃣ Event Meta Info */}
      <div className="meta-block">
        <div className="meta-row">
          <div className="meta-icon">📅</div>
          <div className="meta-text">
            <div className="meta-title">{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div className="meta-subtitle">Event Date</div>
          </div>
        </div>
        <div className="meta-row">
          <div className="meta-icon">⏰</div>
          <div className="meta-text">
            <div className="meta-title">{event.time}</div>
            <div className="meta-subtitle">Starts At</div>
          </div>
        </div>
        <div className="meta-row">
          <div className="meta-icon">📍</div>
          <div className="meta-text">
            <div className="meta-title">{event.venue}</div>
            <div className="meta-subtitle">Venue Location</div>
          </div>
        </div>
      </div>

      {/* 5️⃣ Description Section */}
      <div className="description-section">
        <h2 className="section-title">About Event</h2>
        <div className="description-content">{event.description}</div>
      </div>

      {/* Statistics Block */}
      <div className="description-section pt-0">
         <div className="flex gap-4 p-4 bg-indigo-50 rounded-2xl">
            <Users className="text-indigo-600" />
            <div className="text-sm">
                <span className="font-bold text-indigo-900">{event.registeredCount} Students</span> already registered.
                {event.seatsAvailable > 0 ? ` ${event.seatsAvailable} spots left!` : " Event is full."}
            </div>
         </div>
      </div>

      {/* 6️⃣ & 7️⃣ Sticky Footer CTAs */}
      <div className="sticky-footer">
        <button
          className={`btn-secondary ${reminderSet ? 'active' : ''}`}
          onClick={handleSetReminder}
          disabled={isPassed}
        >
          {reminderSet ? <><CheckCircle size={18} className="mr-2" /> Set</> : <><Bell size={18} className="mr-2" /> Reminder</>}
        </button>

        {isPassed ? (
          <button className="btn-primary" disabled>Event Completed</button>
        ) : isRegistered ? (
          <button className="btn-primary" disabled>
            Registered ✓
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={handleRegister}
            disabled={registering || event.seatsAvailable === 0}
          >
            {registering ? "Processing..." : event.seatsAvailable === 0 ? "Event Full" : "Register for Event"}
          </button>
        )}
      </div>

      {/* 8️⃣ Registration Confirmation Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <div className="conf-icon">🎉</div>
            <h2 className="conf-title">You’re registered!</h2>
            <p className="conf-text">
              We've added <strong>{event.title}</strong> to your events. See you there!
            </p>
            <div className="modal-actions">
              <button 
                className="btn-modal-primary"
                onClick={() => navigate('/my-events')}
              >
                View My Events
              </button>
              <button 
                className="btn-modal-ghost"
                onClick={() => setShowSuccessModal(false)}
              >
                Back to Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
