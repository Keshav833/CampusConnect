import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import TextType from "./TextType"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      <div className="absolute  right-[-10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute left-[-10%] w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl opacity-60" />

      <div className="max-w-7xl mx-auto p-6 sm:pb-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <div className="flex-1 text-left z-10 animate-in fade-in slide-in-from-left duration-1000 lg:-mt-20">
            <div className="mb-2">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
                <span className="block mb-2">All Campus Events.</span>
                <TextType 
                  text={["One Verified Platform", "Connect with Peers", "Discover Opportunities"]}
                  as="div"
                  className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-400 py-2 min-h-[2em] block"
                  typingSpeed={100}
                  deletingSpeed={50}
                  pauseDuration={2000}
                  showCursor={true}
                  cursorCharacter="|"
                  cursorClassName="text-sky-400"
                />
              </h1>
            </div>
            
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
              Discover, register, and track all campus events in one place. 
              Never miss out on what's happening around you with our seamless experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/events">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-10 py-7 text-lg shadow-xl shadow-indigo-200/50 transition-all hover:scale-105 active:scale-95 group">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <div className="flex -space-x-3 items-center ml-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
                <span className="ml-4 text-sm font-medium text-gray-500">
                  Joined by 500+ students
                </span>
              </div>
            </div>
          </div>

          <div className="flex-[1.4] relative z-0 animate-in fade-in slide-in-from-right duration-1000 overflow-hidden max-h-[700px] -mr-12 lg:-mr-24">
            
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="absolute left-0 top-0 bottom-0 w-[80px] bg-gradient-to-r from-white via-white/50 to-transparent" />
              <div className="absolute right-0 top-0 bottom-0 w-[60px] bg-gradient-to-l from-white via-white/20 to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-white via-white/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-white via-white/30 to-transparent" />
            </div>
            
          
            <div className="absolute inset-0 bg-indigo-600/40 blur-[100px] rounded-full transform -rotate-12 translate-x-1/4 scale-110 pointer-events-none" />
            
            <div className="flex gap-4 transform rotate-[-10deg] justify-center scale-110 origin-center pl-16">
              
              <div className="flex flex-col gap-4 animate-marquee">
                {[
                  "/Hackathon.jpg",
                  "/fest.jpg",
                  "/event.avif",
                  "/workshop.jpg",
                  "/Hackathon.jpg",
                  "/fest.jpg",
                  "/event.avif",
                  "/workshop.jpg"
                ].map((src, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-2xl aspect-[4/5] w-[140px] bg-indigo-100 shadow-2xl hover:scale-105 transition-transform duration-500">
                    <img src={src} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" alt="Event" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 animate-marquee-reverse pt-20">
                {[
                  "/techTalk.jpg",
                  "/event2.avif",
                  "/workshop2.jpg",
                  "/Hackathon2.jpg",
                  "/techTalk.jpg",
                  "/event2.avif",
                  "/workshop2.jpg",
                  "/Hackathon2.jpg"
                ].map((src, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-2xl aspect-[4/5] w-[140px] bg-blue-100 shadow-2xl hover:scale-105 transition-transform duration-500">
                    <img src={src} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" alt="Event" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 animate-marquee pt-10">
                {[
                  "/fest.jpg",
                  "/workshop.jpg",
                  "/event.avif",
                  "/Hackathon2.jpg",
                  "/fest.jpg",
                  "/workshop.jpg",
                  "/event.avif",
                  "/Hackathon2.jpg"
                ].map((src, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-2xl aspect-[4/5] w-[140px] bg-indigo-50 shadow-2xl hover:scale-105 transition-transform duration-500">
                    <img src={src} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" alt="Event" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
