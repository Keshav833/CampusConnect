import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2, CheckCircle2, GraduationCap, Briefcase, ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Signup() {
  const [role, setRole] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organization: "",
    orgRole: "",
    regNo: "",
    branch: "",
    year: "",
    terms: false,
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

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" }
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++

    const labels = ["Weak", "Fair", "Good", "Strong"]
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"]

    return {
      strength: (strength / 4) * 100,
      label: labels[strength - 1] || "",
      color: colors[strength - 1] || "",
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (isStudent) {
      if (!formData.regNo) {
        newErrors.regNo = "Registration number is required"
      } else if (!/^\d{8}$/.test(formData.regNo)) {
        newErrors.regNo = "Reg. No must be exactly 8 digits"
      }
      if (!formData.branch) newErrors.branch = "Branch is required"
      if (!formData.year) newErrors.year = "Year is required"
    } else {
      if (!formData.organization) newErrors.organization = "Organization name is required"
      if (!formData.orgRole) newErrors.orgRole = "Your role in organization is required"
    }

    if (!formData.terms) newErrors.terms = "You must accept the terms and conditions"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        setErrors({ general: data.error || "Signup failed. Please try again." });
      }
    } catch (err) {
      setErrors({ general: "Unable to connect to server. Please try again." });
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-slate-100 scale-in-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Account Created!</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Welcome to the community! Redirecting you to login...
            </p>
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg">
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
            Join as <span className={isStudent ? 'text-indigo-600' : 'text-sky-600 capitalize'}>{role}</span>
          </h1>
          <p className="text-slate-500">Create your professional profile to get started.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-10 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100">{errors.general}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isLoading}
                  className={`h-12 rounded-xl border-slate-200 focus:ring-indigo-600 ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{isStudent ? 'Email' : 'Work Email'}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={isStudent ? "john@example.com" : "john@company.com"}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isLoading}
                  className={`h-12 rounded-xl border-slate-200 focus:ring-indigo-600 ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
            </div>

            {isStudent ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="regNo">Registration Number (Reg. No)</Label>
                  <Input
                    id="regNo"
                    placeholder="e.g. 12345678"
                    maxLength={8}
                    value={formData.regNo}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 8) {
                        setFormData({ ...formData, regNo: value });
                      }
                    }}
                    disabled={isLoading}
                    className={`h-12 rounded-xl border-slate-200 focus:ring-indigo-600 ${errors.regNo ? "border-red-500" : ""}`}
                  />
                  {errors.regNo && <p className="text-xs text-red-500">{errors.regNo}</p>}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Select
                      value={formData.branch}
                      onValueChange={(value) => setFormData({ ...formData, branch: value })}
                      disabled={isLoading}
                    >
                      <SelectTrigger className={`h-12 rounded-xl border-slate-200 ${errors.branch ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Branch" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200">
                        <SelectItem value="cse">Computer Science</SelectItem>
                        <SelectItem value="ece">Electronics</SelectItem>
                        <SelectItem value="mech">Mechanical</SelectItem>
                        <SelectItem value="civil">Civil</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.branch && <p className="text-xs text-red-500">{errors.branch}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select
                      value={formData.year}
                      onValueChange={(value) => setFormData({ ...formData, year: value })}
                      disabled={isLoading}
                    >
                      <SelectTrigger className={`h-12 rounded-xl border-slate-200 ${errors.year ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200">
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.year && <p className="text-xs text-red-500">{errors.year}</p>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization / Club Name</Label>
                  <Input
                    id="organization"
                    placeholder="Tech Club"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    disabled={isLoading}
                    className={`h-12 rounded-xl border-slate-200 focus:ring-sky-600 ${errors.organization ? "border-red-500" : ""}`}
                  />
                  {errors.organization && <p className="text-xs text-red-500">{errors.organization}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orgRole">Your Role</Label>
                  <Input
                    id="orgRole"
                    placeholder="President / Coordinator"
                    value={formData.orgRole}
                    onChange={(e) => setFormData({ ...formData, orgRole: e.target.value })}
                    disabled={isLoading}
                    className={`h-12 rounded-xl border-slate-200 focus:ring-sky-600 ${errors.orgRole ? "border-red-500" : ""}`}
                  />
                  {errors.orgRole && <p className="text-xs text-red-500">{errors.orgRole}</p>}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={isLoading}
                    className={`h-12 pr-10 rounded-xl border-slate-200 ${errors.password ? "border-red-500" : ""}`}
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
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                {formData.password && (
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-2">
                    <div className={`h-full transition-all ${passwordStrength.color}`} style={{ width: `${passwordStrength.strength}%` }} />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    disabled={isLoading}
                    className={`h-12 pr-10 rounded-xl border-slate-200 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
              <Checkbox
                id="terms"
                checked={formData.terms}
                onCheckedChange={(checked) => setFormData({ ...formData, terms: checked })}
                disabled={isLoading}
                className={`rounded-md ${errors.terms ? "border-red-500" : "border-slate-300"}`}
              />
              <Label htmlFor="terms" className="text-sm leading-tight text-slate-500 cursor-pointer">
                I agree to the{" "}
                <Link to="/terms" className="text-indigo-600 hover:underline font-semibold">Terms & Conditions</Link> 
                {" "}and{" "}
                <Link to="/privacy" className="text-indigo-600 hover:underline font-semibold">Privacy Policy</Link>
              </Label>
            </div>
            {errors.terms && <p className="text-xs text-red-500 -mt-4">{errors.terms}</p>}

            <Button type="submit" className={`w-full h-14 rounded-2xl text-lg font-bold shadow-xl transition-all ${isStudent ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' : 'bg-sky-600 hover:bg-sky-700 shadow-sky-100'}`} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-slate-500">Already have an account? </span>
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
