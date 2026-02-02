import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, ArrowLeft, GraduationCap, Briefcase } from "lucide-react"

export default function Login() {
  const [role, setRole] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const navigate = useNavigate()

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (!savedRole) {
      navigate('/role-selection');
    } else {
      setRole(savedRole);
    }
  }, [navigate]);

  if (!role) return null;

  const isStudent = role === 'student';

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        // Final Split
        if (data.user.role === 'student') {
          navigate("/events");
        } else if (data.user.role === 'organizer') {
          navigate("/organizer/dashboard");
        }
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <button 
          onClick={() => navigate('/auth-choice')}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center mb-10">
          <div className={`w-16 h-16 rounded-2xl mb-4 flex items-center justify-center mx-auto shadow-lg ${isStudent ? 'bg-indigo-600 text-white' : 'bg-sky-600 text-white'}`}>
            {isStudent ? <GraduationCap className="w-8 h-8" /> : <Briefcase className="w-8 h-8" />}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Welcome back, <span className={isStudent ? 'text-indigo-600' : 'text-sky-600 capitalize'}>{role}</span>
          </h1>
          <p className="text-slate-500">Please enter your credentials to continue.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-10 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100 font-medium">{error}</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{isStudent ? 'College Email' : 'Email Address'}</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
                className="h-12 rounded-xl border-slate-200 focus:ring-indigo-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" virtual="true" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                  className="h-12 pr-10 rounded-xl border-slate-200 focus:ring-indigo-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className={`w-full h-14 rounded-2xl text-lg font-bold shadow-xl transition-all ${isStudent ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' : 'bg-sky-600 hover:bg-sky-700 shadow-sky-100'}`} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-slate-500">New here? </span>
            <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
