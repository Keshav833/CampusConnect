import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  User,
  AlertCircle,
  Mail,
  Phone,
  CheckCircle,
  Download,
  Share2,
  Bookmark,
  FileText,
  Laptop,
} from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router-dom"

export default function EventDetails() {
  const { id } = useParams()
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [selectedReminder, setSelectedReminder] = useState(null)
  const [reminderSet, setReminderSet] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  // In a real app, you would fetch event details by ID here using useEffect
  // For now we use the mock data provided
  const event = {
    id: id,
    title: "Tech Talks 2024: Future of AI in Education",
    tagline: "Learn how AI is transforming the way we learn and teach",
    category: "Tech",
    emoji: "💻",
    status: "Open", // Open / Full / Closed
    date: "December 25, 2024",
    time: "6:00 PM - 8:00 PM",
    duration: "2 hours",
    venue: "Engineering Auditorium, Block A",
    mode: "Offline",
    organizer: "Tech Club IIT Delhi",
    organizerLogo: "🎓",
    registrationDeadline: "December 23, 2024",
    seatsAvailable: 45,
    totalSeats: 100,
    posterImage: "/tech-conference-with-laptop-and-code.jpg",
    description:
      "Join us for an exciting evening exploring the intersection of artificial intelligence and education. Industry experts and researchers will share their insights on how AI is revolutionizing learning experiences, personalized education, and the future of teaching methodologies. This event is perfect for students interested in EdTech, AI, and the future of learning.",
    highlights: [
      "Industry experts sharing real-world AI applications",
      "Live demonstrations of AI-powered learning tools",
      "Networking opportunities with EdTech professionals",
      "Certificate of participation for all attendees",
    ],
    learnings: [
      "Understanding current AI applications in educational technology",
      "Exploring personalized learning through machine learning algorithms",
      "Ethical considerations in AI-powered education systems",
      "Future trends and opportunities in EdTech startups",
      "Hands-on demonstration of AI-powered learning tools",
    ],
    schedule: [
      { time: "6:00 PM", activity: "Registration & Networking", speaker: "" },
      { time: "6:30 PM", activity: "Opening Remarks", speaker: "Dr. Anjali Verma, Head of Tech Club" },
      { time: "6:45 PM", activity: "Keynote: AI in Modern Education", speaker: "Prof. Rajesh Kumar, IIT Delhi" },
      { time: "7:30 PM", activity: "Panel Discussion & Q&A", speaker: "Industry Experts Panel" },
      { time: "8:00 PM", activity: "Closing & Refreshments", speaker: "" },
    ],
    eligibility: "Open to all undergraduate and graduate students from any branch",
    requirements: [
      "Valid student ID card (mandatory for entry)",
      "Laptop (optional, but recommended for live demos)",
      "Notebook and pen for taking notes",
    ],
    rules: [
      "Please arrive 15 minutes before the event start time",
      "Mobile phones must be on silent during presentations",
      "Photography allowed only during designated times",
      "Certificate will be provided only to attendees with 100% attendance",
    ],
    softwareRequired: "No specific software required. Demo links will be shared during the event.",
    contactName: "Rahul Sharma",
    contactEmail: "rahul@techclub.edu",
    contactPhone: "+91 98765 43210",
    qrCode: "/event-qr-code.jpg",
  }

  const handleRegister = () => {
    setIsRegistered(true)
  }

  const handleConfirmReminder = () => {
    if (selectedReminder) {
      setReminderSet(true)
      setShowReminderModal(false)
      setTimeout(() => setReminderSet(false), 3000)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.tagline,
        url: window.location.href,
      })
    }
  }

  const handleAddToCalendar = () => {
    // Simple calendar download (ICS format)
    const calendarEvent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART:20241225T180000
DTEND:20241225T200000
LOCATION:${event.venue}
DESCRIPTION:${event.tagline}
END:VEVENT
END:VCALENDAR`
    const blob = new Blob([calendarEvent], { type: "text/calendar" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "event.ics"
    link.click()
  }

  return (
    <div className="min-h-screen bg-background">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="relative h-80">
                <img src={event.posterImage || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm text-sm font-semibold text-indigo-700">
                    <span className="text-xl">{event.emoji}</span>
                    {event.category}
                  </span>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${
                      event.status === "Open"
                        ? "bg-green-500/95 text-white"
                        : event.status === "Full"
                          ? "bg-orange-500/95 text-white"
                          : "bg-red-500/95 text-white"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance">{event.title}</h1>
                  <div className="flex items-center gap-2 text-white/90">
                    <span className="text-2xl">{event.organizerLogo}</span>
                    <span className="text-lg">{event.organizer}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">At a Glance</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-semibold">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="font-semibold">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Venue</p>
                    <p className="font-semibold">{event.venue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Seats Available</p>
                    <p className="font-semibold">
                      {event.seatsAvailable} of {event.totalSeats}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 sm:col-span-2">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Registration Deadline</p>
                    <p className="font-semibold text-red-600">{event.registrationDeadline}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Event Details Grid */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Event Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-semibold">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Venue</p>
                    <p className="font-semibold">{event.venue}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Video className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Mode</p>
                    <p className="font-semibold">{event.mode}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Organizer</p>
                    <p className="font-semibold">{event.organizer}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{event.duration}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Registration Deadline</p>
                    <p className="font-semibold">{event.registrationDeadline}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{event.description}</p>

              <h3 className="text-lg font-semibold mb-3">Key Highlights</h3>
              <ul className="space-y-2 mb-6">
                {event.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-indigo-600 text-sm font-bold">{index + 1}</span>
                    </div>
                    <span className="text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold mb-3">What You'll Learn</h3>
              <ul className="space-y-2">
                {event.learnings.map((learning, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{learning}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Event Schedule</h2>
              <div className="space-y-4">
                {event.schedule.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="text-indigo-600 font-semibold min-w-[100px] flex-shrink-0">{item.time}</div>
                    <div className="flex-1">
                      <div className="font-semibold mb-1">{item.activity}</div>
                      {item.speaker && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {item.speaker}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Eligibility & Guidelines</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    Who Can Attend
                  </h3>
                  <p className="text-muted-foreground">{event.eligibility}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-indigo-600" />
                    Rules & Guidelines
                  </h3>
                  <ul className="space-y-2">
                    {event.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-indigo-600 font-bold mt-1">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">What to Bring</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Required Items
                  </h3>
                  <ul className="space-y-2">
                    {event.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-indigo-600" />
                    Software / Tools
                  </h3>
                  <p className="text-muted-foreground">{event.softwareRequired}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Organizer Information</h2>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-3xl flex-shrink-0">
                  {event.organizerLogo}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{event.organizer}</h3>
                  <p className="text-sm text-muted-foreground">Event Organizer</p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <h3 className="font-semibold mb-3">Contact Details</h3>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <User className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>{event.contactName}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <a href={`mailto:${event.contactEmail}`} className="hover:text-indigo-600 hover:underline">
                    {event.contactEmail}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <a href={`tel:${event.contactPhone}`} className="hover:text-indigo-600">
                    {event.contactPhone}
                  </a>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 lg:sticky lg:top-8 space-y-4">
              {!isRegistered ? (
                <>
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span className="font-semibold">{event.seatsAvailable} seats left</span>
                    </div>
                    <span className="text-sm text-muted-foreground">of {event.totalSeats}</span>
                  </div>

                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg font-semibold"
                    onClick={handleRegister}
                    disabled={event.status === "Closed" || event.status === "Full"}
                  >
                    {event.status === "Open" ? "Register Now" : event.status}
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setIsBookmarked(!isBookmarked)}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-indigo-600 text-indigo-600" : ""}`} />
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={handleShare}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setShowReminderModal(true)}
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Set Reminder
                  </Button>

                  <Button variant="outline" className="w-full bg-transparent" onClick={handleAddToCalendar}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Add to Calendar
                  </Button>

                  {reminderSet && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-sm text-green-800">
                      <CheckCircle className="w-4 h-4" />
                      Reminder set successfully!
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Registration Successful!</h3>
                    <p className="text-sm text-muted-foreground mb-4">You're all set for {event.title}</p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-3">Event Check-in QR Code</p>
                    <div className="bg-white p-4 rounded-lg inline-block">
                      <img
                        src={event.qrCode || "/placeholder.svg"}
                        alt="Event QR Code"
                        width={160}
                        height={160}
                        className="mx-auto"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">Show this QR code at the event entrance</p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Button variant="outline" className="w-full bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Download QR Code
                    </Button>

                    <Button variant="outline" className="w-full bg-transparent" onClick={handleAddToCalendar}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Add to Calendar
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => setShowReminderModal(true)}
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {reminderSet ? "Reminder Set ✓" : "Set Reminder"}
                    </Button>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm">
                    <p className="font-semibold text-indigo-900 mb-1">Event added to My Events</p>
                    <p className="text-indigo-700 text-xs">You'll receive updates and reminders via email</p>
                  </div>
                </>
              )}

              <div className="pt-4 border-t space-y-2 text-xs text-muted-foreground">
                <p>By registering, you agree to receive event updates and reminders.</p>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Set Event Reminder</h3>
            <p className="text-sm text-muted-foreground mb-6">Choose when you'd like to be reminded about this event</p>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => setSelectedReminder("1-day")}
                className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedReminder === "1-day"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-border hover:border-indigo-300"
                }`}
              >
                <div className="font-semibold">1 day before</div>
                <div className="text-sm text-muted-foreground">December 24, 2024 at 6:00 PM</div>
              </button>

              <button
                onClick={() => setSelectedReminder("3-hours")}
                className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedReminder === "3-hours"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-border hover:border-indigo-300"
                }`}
              >
                <div className="font-semibold">3 hours before</div>
                <div className="text-sm text-muted-foreground">December 25, 2024 at 3:00 PM</div>
              </button>

              <button
                onClick={() => setSelectedReminder("30-minutes")}
                className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedReminder === "30-minutes"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-border hover:border-indigo-300"
                }`}
              >
                <div className="font-semibold">30 minutes before</div>
                <div className="text-sm text-muted-foreground">December 25, 2024 at 5:30 PM</div>
              </button>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  setShowReminderModal(false)
                  setSelectedReminder(null)
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                onClick={handleConfirmReminder}
                disabled={!selectedReminder}
              >
                Confirm Reminder
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
