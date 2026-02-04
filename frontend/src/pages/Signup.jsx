import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import { ArrowLeft, Loader2, Eye, EyeOff, Github, GraduationCap, Users } from "lucide-react"
import "./Login.css"

export default function Signup() {
  const [role, setRole] = useState("student") // 'student' | 'organizer'
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organization: "",
    orgRole: ""
  })

  const navigate = useNavigate()
  const location = useLocation()

  // Handle OAuth redirects/pre-fills
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tempUserParam = params.get('tempUser');

    if (tempUserParam) {
      try {
        const tempUser = JSON.parse(decodeURIComponent(tempUserParam));
        setFormData(prev => ({ ...prev, name: tempUser.name, email: tempUser.email }));
        setError("Please choose your role for this account.");
      } catch (err) { setError("Failed to process user info") }
    }
  }, [location]);

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
          // Stay on signup, pre-fill is handled or we just set what we got
          setFormData(prev => ({ ...prev, name: data.user.name, email: data.user.email }));
          setError("Please choose your role to complete registration.");
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
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true); setError("")
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role }),
      });
      const data = await response.json();
      if (response.ok) loginUser(data);
      else setError(data.error);
    } catch (err) { setError("Signup failed") }
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
          <h2 className="tagline-alt">Create your Campus Connect account</h2>
          <p className="sub-tagline-alt">Join our campus community</p>
        </div>
      </div>

      <div className="form-content-section">
        <div className="login-form-card">


          <div className="role-selector">
            <button 
              className={`role-tab ${role === 'student' ? 'active' : ''}`}
              onClick={() => {setRole('student'); setError("")}}
            >
              <GraduationCap className="w-5 h-5" />
              <span>Student</span>
            </button>
            <button 
              className={`role-tab ${role === 'organizer' ? 'active' : ''}`}
              onClick={() => {setRole('organizer'); setError("")}}
            >
              <Users className="w-5 h-5" />
              <span>Organizer</span>
            </button>
          </div>

          {error && <div className="error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className={`form-row ${role === 'student' ? 'single' : ''}`}>
              <div className="input-group">
                <input
                  id="name"
                  type="text"
                  placeholder="Full Name"
                  className="styled-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              {role === 'student' && (
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
              )}
            </div>

            {role === 'organizer' && (
              <>
                <div className="form-row">
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
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <input
                      id="organization"
                      type="text"
                      placeholder="Organization / Club Name"
                      className="styled-input"
                      value={formData.organization}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <input
                      id="orgRole"
                      type="text"
                      placeholder="Role (e.g. Coordinator, Lead)"
                      className="styled-input"
                      value={formData.orgRole}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-row">
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

              <div className="input-group">
                <div className="input-wrapper">
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="styled-input"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 
               `Sign Up as ${role === 'student' ? 'Student' : 'Organizer'}`}
            </button>
          </form>

          <div className="form-toggle-link">
            <p>Already have an account? <Link to="/login"><span>Log in</span></Link></p>
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
