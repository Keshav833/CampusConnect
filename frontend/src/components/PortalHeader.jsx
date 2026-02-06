import React, { useState, useEffect } from "react";
import { Bell, Search, User, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

export function PortalHeader({ unreadNotifications = 0 }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Map routes to page titles
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/events/')) return t("common.eventDetails", "Event Details");
    if (path === '/events') return t("student.events.title", "Discover Events");
    if (path === '/my-events') return t("student.myEvents.title", "My Events");
    if (path === '/schedule') return t("common.schedule", "Schedule");
    if (path === '/profile') return t("common.profile", "Profile");
    if (path === '/dashboard') return t("common.dashboard", "Dashboard");
    if (path.includes('/organizer')) return "Organizer Portal";
    if (path.includes('/admin')) return "Admin Portal";
    return "Campus Connect";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  return (
    <header className="h-[70px] bg-white md:rounded-[20px] px-4 md:px-6 flex items-center justify-between shadow-sm border-b md:border border-gray-100/50 transition-all shrink-0">
      {/* Left side: Page/Section Name */}
      <div className="flex-1">
         <span className="text-md font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">
           {getPageTitle()}
         </span>
      </div>

      {/* Right Container: Search + Actions */}
      <div className="flex items-center gap-4 md:gap-6">

        {/* Search - Smaller and Shorter */}
        <div className="relative group w-40 md:w-56 transition-all duration-300">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors rounded-full" />
          <input
            type="text"
            placeholder={t("student.events.searchPlaceholder")}
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-transparent rounded-lg text-xs focus:outline-none focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all h-8"
          />
        </div>

        {/* Utility Actions */}
        <div className="flex items-center gap-3 md:gap-4">
        {/* Notification Bell */}
        <button 
          onClick={() => navigate("/notifications")}
          className="relative p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
        >
          <Bell className="w-5 h-5" />
          {unreadNotifications > 0 && (
            <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in">
              {unreadNotifications > 9 ? "9+" : unreadNotifications}
            </span>
          )}
        </button>

        {/* User Identity */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 pl-4 pr-1.5 bg-gray-50 border border-gray-100 rounded-xl hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group"
          >
            <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors hidden sm:block">
              {userData.name || t("common.profile")}
            </span>
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-indigo-100">
              {userData.name ? userData.name.charAt(0) : "U"}
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 p-2 z-20 animate-in fade-in slide-in-from-top-2">
                <button 
                  onClick={() => { navigate("/profile"); setShowProfileMenu(false); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-xl transition-colors"
                >
                  <User className="w-4 h-4" />
                  {t("common.profile")}
                </button>
                <div className="h-px bg-gray-50 my-1 mx-2" />
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t("common.logout")}
                </button>
              </div>
            </>
          )}
        </div>
        </div>
      </div>
    </header>
  );
}
