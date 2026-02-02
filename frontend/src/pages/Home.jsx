import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { ArrowRight, Calendar, Bell, Award, Search } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-950 font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <section id="hero">
        <Hero />
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              One Platform, Endless Possibilities
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Everything you need to navigate campus life, all in one verified place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Discover Events</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Smart filters and real-time search to find exactly what interests you.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Easy Registration</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                One-tap registration and instant QR passes for seamless entry.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bell className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Smart Reminders</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Never miss an event with personalized push and email notifications.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Verified History</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Track your participation and access all your event certificates in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Students Section */}
      <section id="students" className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-4 block">For Students</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                Enhance your campus experience
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Stay updated with everything happening on campus. From technical hackathons to cultural fests, Campus Connect is your key to an active student life.
              </p>
              <ul className="space-y-4 mb-10">
                {['Verified events from official clubs', 'Instant event certificates', 'Networking with like-minded peers'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-green-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-indigo-100 rounded-3xl blur-3xl opacity-30 transform rotate-6" />
              <img src="/st.avif" alt="Student Dashboard" className="relative rounded-2xl shadow-2xl border border-gray-100 grayscale-[0.2] hover:grayscale-0 transition-all duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* For Organizers Section */}
      <section id="organizers" className="py-24 bg-indigo-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <div className="flex-1">
              <span className="text-indigo-400 font-bold tracking-wider uppercase text-sm mb-4 block">For Organizers</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                Manage events with precision
              </h2>
              <p className="text-lg text-indigo-100/80 mb-8 leading-relaxed">
                Empower your club or organization with a professional management dashboard. Track registrations, verify attendance, and issue certificates automatically.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-10">
                {[
                  { label: 'Analytics', desc: 'Real-time data' },
                  { label: 'Security', desc: 'Verified entry' },
                  { label: 'Scaling', desc: '5000+ capacity' },
                  { label: 'Automation', desc: 'Auto-certs' }
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="font-bold text-lg mb-1">{item.label}</div>
                    <div className="text-indigo-300 text-sm">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative min-h-[500px] w-full mt-12 md:mt-0">
              {/* Decorative Background Blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

              {/* Main Image: Organizer Dashboard */}
              <div className="absolute top-0 right-0 w-[85%] z-20 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-sky-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <img 
                  src="/org.jpg" 
                  alt="Organizer Dashboard" 
                  className="relative rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 grayscale-[0.05] hover:grayscale-0 transition-all duration-500" 
                />
              </div>
              
              {/* Secondary Image: Analytics */}
              <div className="absolute bottom-20 left-0 w-[55%] z-30 group hover:z-40 transition-all duration-300">
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                <img 
                  src="/analytics.jpg" 
                  alt="Analytics Dashboard" 
                  className="relative rounded-2xl shadow-2xl border border-white/10 hover:scale-105 transition-all duration-500" 
                />
              </div>

              {/* Tertiary Image: Security */}
              <div className="absolute -bottom-6 right-12 w-[45%] z-10 group">
                <div className="absolute inset-0 bg-black/20 rounded-2xl blur-sm group-hover:blur-none transition-all duration-500" />
                <img 
                  src="/security.jpg" 
                  alt="Security Controls" 
                  className="relative rounded-2xl shadow-xl border border-white/10 opacity-70 group-hover:opacity-100 transition-all duration-500" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">How it works</h2>
            <p className="text-xl text-gray-500">Get started in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gray-100" />
            
            <div className="relative group text-center">
              <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-3xl font-extrabold mb-8 mx-auto shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Explore</h3>
              <p className="text-gray-500 leading-relaxed">
                Browse official campus events with live updates and smart filters.
              </p>
            </div>

            <div className="relative group text-center">
              <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-3xl font-extrabold mb-8 mx-auto shadow-xl group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Register</h3>
              <p className="text-gray-500 leading-relaxed">
                Secure your spot instantly and receive your digital entry pass.
              </p>
            </div>

            <div className="relative group text-center">
              <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-3xl font-extrabold mb-8 mx-auto shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Experience</h3>
              <p className="text-gray-500 leading-relaxed">
                Attend the event, get verified, and access your certificates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl -ml-48 -mb-48" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 tracking-tight"> Ready to dive in? </h2>
              <p className="text-xl md:text-2xl text-indigo-100 max-w-2xl mx-auto mb-12 leading-relaxed"> Join thousands of students and organizers building the future of campus connection. </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/role-selection" className="w-full sm:w-auto">
                  <Button size="lg" variant="secondary" className="w-full gap-3 text-lg px-12 py-8 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all">
                    Get Started Now
                    <ArrowRight className="w-6 h-6" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-indigo-600 mb-2">Campus Connect</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Your one-stop platform for discovering and managing all campus events.
              </p>
            </div>

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
