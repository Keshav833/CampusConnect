import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, ArrowRight, CheckCircle2, Loader2, Building2, UserCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [tempUser, setTempUser] = useState(null);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [showOrgForm, setShowOrgForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [orgData, setOrgData] = useState({
    organization: "",
    orgRole: ""
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('tempUser');
    if (user) {
      setTempUser(JSON.parse(user));
      setIsOnboarding(true);
    }
  }, []);

  const finalizeSocialSignup = async (role, extraData = {}) => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...tempUser,
          role,
          ...extraData
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem('tempUser');
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('userData', JSON.stringify(data.user));

        if (data.role === 'student') {
          navigate("/events");
        } else if (data.role === 'admin') {
          navigate("/admin/dashboard");
        } else {
          navigate("/organizer/dashboard");
        }
      } else {
        setError(data.error || "Failed to finalize profile");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (!selectedRole) return;

    if (isOnboarding) {
      if (selectedRole === 'student') {
        finalizeSocialSignup('student');
      } else {
        setShowOrgForm(true);
      }
    } else {
      localStorage.setItem('userRole', selectedRole);
      navigate('/signup');
    }
  };

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Discover events, register with one tap, and track your campus journey.',
      icon: GraduationCap,
      color: 'indigo',
    },
    {
      id: 'organizer',
      title: 'Organizer',
      description: 'Host events, manage registrations, and grow your campus community.',
      icon: Briefcase,
      color: 'sky',
    }
  ];

  if (showOrgForm) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-sky-600 text-white rounded-2xl mb-4 flex items-center justify-center mx-auto shadow-lg">
              <Building2 className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Organizer Details</h1>
            <p className="text-slate-500">Just a few more things to get you started.</p>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-slate-100 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100 font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="org">Organization Name</Label>
              <Input
                id="org"
                placeholder="e.g. Computer Science Society"
                value={orgData.organization}
                onChange={(e) => setOrgData({ ...orgData, organization: e.target.value })}
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgRole">Your Role</Label>
              <Input
                id="orgRole"
                placeholder="e.g. President, Coordinator"
                value={orgData.orgRole}
                onChange={(e) => setOrgData({ ...orgData, orgRole: e.target.value })}
                className="h-12 rounded-xl"
              />
            </div>

            <Button 
              onClick={() => finalizeSocialSignup('organizer', orgData)}
              disabled={isLoading || !orgData.organization || !orgData.orgRole}
              className="w-full h-14 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-lg font-bold shadow-sky-100 shadow-xl"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Complete Setup"}
            </Button>
            
            <button 
              onClick={() => setShowOrgForm(false)}
              className="w-full text-slate-400 hover:text-slate-600 text-sm font-medium"
            >
              Back to role selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold mb-6">
            <Sparkles className="w-4 h-4" />
            {isOnboarding ? 'One last step' : 'Getting Started'}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            How will you use Campus Connect?
          </h1>
          <p className="text-lg text-slate-600">
            {isOnboarding ? `Hi ${tempUser?.name.split(' ')[0]}, select your role to finish setting up your account.` : 'Select your role to get the right experience.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <div 
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`relative group cursor-pointer p-8 rounded-[2.5rem] border-2 transition-all duration-300 bg-white shadow-sm hover:shadow-xl ${
                  isSelected 
                    ? 'border-indigo-600 ring-4 ring-indigo-50' 
                    : 'border-transparent hover:border-slate-200'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-6 right-6 text-indigo-600">
                    <CheckCircle2 className="w-8 h-8 fill-indigo-50" />
                  </div>
                )}
                
                <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                  role.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : 'bg-sky-50 text-sky-600'
                }`}>
                  <Icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{role.title}</h3>
                <p className="text-slate-500 leading-relaxed mb-4">
                  {role.description}
                </p>
                
                <div className={`flex items-center font-bold text-sm uppercase tracking-wider ${
                  isSelected ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}>
                  {isSelected ? 'Selected' : 'Select Role'}
                  {!isSelected && <ArrowRight className="ml-2 w-4 h-4" />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-6 animate-in fade-in duration-1000">
          <Button 
            onClick={handleContinue}
            disabled={!selectedRole || isLoading}
            className={`px-16 py-8 rounded-full text-xl font-bold shadow-2xl transition-all duration-300 scale-100 active:scale-95 ${
              selectedRole 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200/50' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? <Loader2 className="animate-spin mr-3 w-6 h-6" /> : (
              <>
                {isOnboarding ? 'Finish Setup' : 'Continue'}
                <ArrowRight className="ml-3 w-6 h-6" />
              </>
            )}
          </Button>

          {isOnboarding && (
            <button 
              onClick={() => {
                localStorage.removeItem('tempUser');
                navigate('/login');
              }}
              className="text-slate-400 hover:text-slate-600 text-sm font-medium underline underline-offset-4"
            >
              Sign in with a different account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
