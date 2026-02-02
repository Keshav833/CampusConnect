import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole) {
      // Store role in local storage or state management
      localStorage.setItem('userRole', selectedRole);
      navigate('/auth-choice');
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom duration-700">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            How will you use Campus Connect?
          </h1>
          <p className="text-lg text-slate-600">
            Select your role to get the right experience.
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

        <div className="flex justify-center animate-in fade-in duration-1000">
          <Button 
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`px-16 py-8 rounded-full text-xl font-bold shadow-2xl transition-all duration-300 scale-100 active:scale-95 ${
              selectedRole 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200/50' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Continue
            <ArrowRight className="ml-3 w-6 h-6" />
          </Button>
        </div>

        <p className="text-center mt-8 text-slate-400 text-sm">
          You can always change your mind later.
        </p>
      </div>
    </div>
  );
}
