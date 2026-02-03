import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Sparkles } from "lucide-react"

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.needsRole) {
          // New User: Save Google info and redirect to role selection
          localStorage.setItem('tempUser', JSON.stringify(data.user));
          navigate('/role-selection');
        } else {
          // Existing User: Log in
          localStorage.setItem('token', data.token);
          localStorage.setItem('userRole', data.role);
          localStorage.setItem('userData', JSON.stringify(data.user));

          if (data.role === 'student') {
            navigate("/events");
          } else if (data.role === 'organizer') {
            navigate("/organizer/dashboard");
          }
        }
      } else {
        setError(data.error || "Google authentication failed");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleError = () => {
    setError("Google Sign-In was unsuccessful. Please try again.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white rounded-3xl mb-6 flex items-center justify-center mx-auto shadow-xl shadow-indigo-100/50 border border-slate-100">
            <img 
              src="/CC.png" 
              alt="CampusConnect Logo" 
              className="w-12 h-12 object-contain" 
            />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 font-medium max-w-[280px] mx-auto">
            Log in to access your campus community and events.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/20 p-10 border border-slate-100 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50" />
          
          <div className="relative space-y-8">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-sm border border-red-100 font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}

            <div className="flex flex-col items-center gap-6">
              <div className="w-full h-[50px] relative">
                {isLoading && (
                  <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                    <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                  </div>
                )}
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="filled_blue"
                  shape="pill"
                  width="400"
                  text="continue_with"
                />
              </div>

              <div className="relative w-full py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-100"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">
                    One Tap Away
                  </span>
                </div>
              </div>

              <p className="text-slate-400 text-sm text-center px-4 leading-relaxed">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center flex items-center justify-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
            ))}
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Join <span className="text-indigo-600 font-bold">2,000+</span> students today
          </p>
        </div>
      </div>
    </div>
  )
}
