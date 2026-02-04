import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import { ArrowLeft, Loader2, Eye, EyeOff, Github } from "lucide-react"
import "./Login.css"

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const navigate = useNavigate()
  const location = useLocation()

  // Handle OAuth redirects (GitHub)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get('success');
    const errorParam = params.get('error');
    const dataParam = params.get('data');

    if (success === 'true' && dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataParam));
        loginUser(decodedData);
      } catch (err) { setError("OAuth parsing failed") }
    } else if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [location, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true); setError("")
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.needsRole) {
           // Redirect to role selection if new user from Google
           navigate(`/signup?tempUser=${encodeURIComponent(JSON.stringify(data.user))}`);
        } else {
          loginUser(data);
        }
      } else setError(data.error);
    } catch (err) { setError("Connection failed") }
    finally { setIsLoading(false) }
  }

  const loginUser = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userRole', data.role);
    localStorage.setItem('userData', JSON.stringify(data.user));
    if (data.role === 'student') navigate("/events");
    else if (data.role === 'admin') navigate("/admin/dashboard");
    else navigate("/organizer/dashboard");
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true); setError("")
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) loginUser(data);
      else setError(data.error);
    } catch (err) { setError("Authentication failed") }
    finally { setIsLoading(false) }
  }

  return (
    <div className="login-page-wrapper">
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
          <h2 className="tagline-alt">Welcome Back</h2>
          <p className="sub-tagline-alt">Log in to your Campus Connect account</p>
        </div>
      </div>

      <div className="form-content-section">
        <div className="login-form-card">
          <div className="form-header-simple">
            <h1>Login</h1>
          </div>
          {error && <div className="error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <input
                id="email"
                type="email"
                placeholder="Email address"
                className="styled-input"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="styled-input"
                  value={formData.password}
                  onChange={handleInputChange}
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
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Login"}
            </button>
          </form>

          <div className="form-toggle-link">
            <p>New to Campus Connect? <Link to="/signup"><span>Create an account</span></Link></p>
          </div>

          <div className="divider">Or continue with</div>

          <div className="oauth-options">
            <div className="google-btn-wrapper">
              <GoogleLogin onSuccess={handleGoogleSuccess} theme="filled_blue" shape="pill" size="large" />
            </div>
            <button onClick={() => window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/github`} className="github-login-btn">
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
