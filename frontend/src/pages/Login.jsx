import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import { ArrowLeft, Loader2, Sparkles, Eye, EyeOff } from "lucide-react"
import "./Login.css"

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
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
          localStorage.setItem('tempUser', JSON.stringify(data.user));
          navigate('/role-selection');
        } else {
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

  const handleLogin = (e) => {
    e.preventDefault()
    // Manual login logic would go here
    setError("Manual login is currently unavailable. Please use Google Login.")
  }

  return (
    <div className="login-page-wrapper">
      {/* Left Visual Section — Separate from Form Card */}
      <div className="visual-hero-section">
        <div className="panel-header-alt">
          <div className="logo-container-alt">
            <img src="/CC.png" alt="CampusConnect" className="logo-icon" />
            <span>Campus Connect</span>
          </div>
          <button onClick={() => navigate('/')} className="back-link-alt">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to website</span>
          </button>
        </div>

        <div className="panel-footer-alt">
          <h2 className="tagline-alt">Connecting Campus Events In One Place</h2>
          <p className="sub-tagline-alt">Join thousands of students and never miss an event again.</p>
        </div>
      </div>

      {/* Right Form Section — The Distinct Card */}
      <div className="form-content-section">
        <div className="login-form-card">
          <div className="form-header">
            <h1>Welcome back</h1>
            <p>Log in to continue to Campus Connect</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-300">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="auth-form">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="name@university.edu"
                className="styled-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="styled-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <div className="divider">
            Or continue with
          </div>

          <div className="oauth-options">
            <div className="google-btn-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_blue"
                shape="pill"
                size="large"
                width="100%"
                text="continue_with"
              />
            </div>
          </div>

          <div className="secondary-links">
            <p>
              Don't have an account?
              <button onClick={() => navigate('/signup')} className="link-btn">
                Get started
              </button>
            </p>
            <button className="link-btn mt-2 text-xs opacity-70">
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
