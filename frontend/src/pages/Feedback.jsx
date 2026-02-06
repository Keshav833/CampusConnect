import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star, Send } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export default function Feedback() {
  const { t } = useTranslation()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState("")
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const events = ["Tech Meetup 2024", "Cultural Night", "Basketball Championship", "Resume Workshop", "Other"]

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setRating(0)
      setSelectedEvent("")
      setFeedback("")
    }, 3000)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">{t("student.feedback.title")}</h1>
        <p className="text-gray-500 font-medium text-lg">{t("student.feedback.subtitle")}</p>
      </div>

      <Card className="p-10 border-gray-100 shadow-xl shadow-indigo-100/30 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
        
        {submitted ? (
          <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 rounded-3xl bg-green-50 flex items-center justify-center mx-auto mb-6 text-4xl">
              ✨
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t("student.feedback.successTitle")}</h3>
            <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
              {t("student.feedback.successText")}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center">
              <Label className="text-base font-bold text-gray-700 mb-6 block uppercase tracking-widest">
                {t("student.feedback.experienceRating")}
              </Label>
              <div className="flex gap-3 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-all duration-300 hover:scale-125 active:scale-90"
                  >
                    <Star
                      className={`w-12 h-12 transition-all duration-300 ${
                        star <= (hoveredRating || rating) 
                          ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" 
                          : "text-gray-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="mt-4 text-sm font-bold text-indigo-500 min-h-[20px]">
                {rating > 0 && (rating === 5 ? "Loved it! ❤️" : rating >= 4 ? "Great Experience! 😊" : rating >= 3 ? "It was okay. 👍" : "Could be better. 🧐")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-3">
                <Label htmlFor="event" className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  {t("student.feedback.relatedEvent")}
                </Label>
                <select
                  id="event"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-semibold"
                >
                  <option value="">{t("student.feedback.selectEvent")}</option>
                  {events.map((event) => (
                    <option key={event} value={event}>
                      {event}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="feedback" className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  {t("student.feedback.yourFeedback")}
                </Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={t("student.feedback.placeholder")}
                  rows={6}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-medium leading-relaxed resize-none"
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-7 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3">
              <Send className="w-5 h-5" />
              {t("student.feedback.submit")}
            </Button>
          </form>
        )}
      </Card>
    </div>
  )
}
