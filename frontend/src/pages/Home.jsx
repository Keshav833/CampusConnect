import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/Navbar"
import { ArrowRight, Calendar, Bell, Award, Search } from "lucide-react"
import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-950 font-sans">
      <Navbar />

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo */}
            <div className="mb-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-indigo-600 mb-2">Campus Connect</h1>
            </div>

            {/* Clear headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-display">
              All Campus Events. One Platform.
            </h2>

            {/* Short subheading */}
            <p className="text-lg sm:text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto">
              Discover, register, and track all campus events in one place. Never miss out on what's happening around
              you.
            </p>

            {/* Primary and Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/events">
                <Button size="lg" className="gap-2 text-base px-8 py-6">
                  Explore Events
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8 py-6 bg-transparent">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to stay connected
            </h2>
            <p className="text-lg text-gray-500">
              Manage your campus event experience with powerful features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg border">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Events</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Browse all campus events in one place with smart filters and search
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg border">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <Calendar className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Registration</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Register for events with just a few taps and manage your schedule
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg border">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <Bell className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Reminders</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Get timely notifications so you never miss an event you registered for
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg border">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <Award className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Your Journey</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Access certificates and view your complete event participation history
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-lg text-gray-500">Get started in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Events</h3>
              <p className="text-gray-500 leading-relaxed">
                Explore all campus events with filters by category, date, and location
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Register Easily</h3>
              <p className="text-gray-500 leading-relaxed">
                Sign up for events with one click and get instant confirmation
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Attend & Track</h3>
              <p className="text-gray-500 leading-relaxed">
                Receive reminders, check-in at events, and collect certificates
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-lg text-white/90 mb-8">
            Join Campus Connect today and never miss another event
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/events" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full gap-2 text-base px-8 py-6">
                Join as Student
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/organizer" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full gap-2 text-base px-8 py-6 bg-transparent text-white border-white/30 hover:bg-white/10"
              >
                Join as Organizer
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold text-indigo-600 mb-2">Campus Connect</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Your one-stop platform for discovering and managing all campus events.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/events" className="text-gray-500 hover:text-indigo-600">
                    Browse Events
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="text-gray-500 hover:text-indigo-600">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-500 hover:text-indigo-600">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* College Info */}
            <div>
              <h4 className="font-semibold mb-3">About</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Campus Connect is designed to help students stay engaged with campus life and discover opportunities.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
            <p>&copy; 2025 Campus Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
