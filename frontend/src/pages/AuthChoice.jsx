import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Briefcase, ArrowLeft, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AuthChoice() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-3xl opacity-20 ${isStudent ? 'bg-indigo-400' : 'bg-sky-400'}`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-3xl opacity-20 ${isStudent ? 'bg-purple-400' : 'bg-indigo-400'}`} />

      <div className="max-w-md w-full relative z-10 text-center">
        <button 
          onClick={() => navigate('/role-selection')}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-12 mx-auto font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Change Role
        </button>

        <div className={`w-24 h-24 rounded-3xl mb-8 flex items-center justify-center mx-auto shadow-xl ${isStudent ? 'bg-indigo-600 text-white' : 'bg-sky-600 text-white'}`}>
          {isStudent ? <GraduationCap className="w-12 h-12" /> : <Briefcase className="w-12 h-12" />}
        </div>

        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Continue as <span className={isStudent ? 'text-indigo-600' : 'text-sky-600 text-capitalize'}>{role}</span>
        </h1>
        <p className="text-lg text-slate-500 mb-12">
          {isStudent 
            ? "Ready to explore your campus? Let's get you set up."
            : "Ready to manage your community? Access your dashboard."}
        </p>

        <div className="flex flex-col gap-4">
          <Link to="/login">
            <Button className={`w-full py-8 rounded-2xl text-lg font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${isStudent ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-sky-600 hover:bg-sky-700'}`}>
              <LogIn className="mr-3 w-5 h-5" />
              Log In
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 my-2">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">or</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <Link to="/signup">
            <Button variant="outline" className="w-full py-8 rounded-2xl text-lg font-bold border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <UserPlus className="mr-3 w-5 h-5" />
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
