import React from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { MapPin, ChevronDown, Calendar, Ticket, Laptop, Music, Trophy, Wrench, Rocket, Users } from 'lucide-react';

export function EventCard({ id, title, category, description, startDate, endDate, date, time, endTime, venue, image, organizerName, registeredCount, totalSeats, status, view = "grid", detailPath }) {
  const { t, i18n } = useTranslation();
  
  const slugify = (text) => {
    return text
      ?.toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  };

  // Handle localized description object or plain string
  let displayDescription = "";
  let displayTitle = title;

  if (title) {
    const slug = slugify(title);
    const titleKey = `content:${slug}.title`;
    const descKey = `content:${slug}.description`;
    
    // Check if translation exists for the specific language (never use English fallback keys)
    const translatedTitle = t(titleKey, { lng: i18n.language, fallbackLng: false });
    const translatedDesc = t(descKey, { lng: i18n.language, fallbackLng: false });

    // Ensure it's not the key itself (handles different i18next missing key formats)
    const isKey = (val, key) => !val || val === key || val.includes('.title') || val.includes('.description') || val.startsWith('content:');

    if (!isKey(translatedTitle, titleKey)) {
      displayTitle = translatedTitle;
    }
    
    if (!isKey(translatedDesc, descKey)) {
      displayDescription = translatedDesc;
    }
  }

  if (!displayDescription && description) {
    displayDescription = description;
  }

  // Category to Icon mapping
  const CategoryIcon = {
    "Tech": Laptop,
    "Cultural": Music,
    "Sports": Trophy,
    "Workshops": Wrench,
    "Hackathons": Rocket,
    "Clubs": Users
  }[category] || Calendar;

  // Gradient based on category
  const gradients = {
    "Tech": "from-blue-200 via-blue-300 to-indigo-200",
    "Cultural": "from-purple-200 via-purple-300 to-pink-200",
    "Sports": "from-green-200 via-green-300 to-blue-200",
    "Workshops": "from-yellow-200 via-orange-300 to-yellow-200",
    "Hackathons": "from-indigo-200 via-purple-300 to-blue-200",
    "Clubs": "from-pink-200 via-red-300 to-pink-200"
  }[category] || "from-gray-200 via-gray-300 to-gray-200";

  const progress = Math.min(100, Math.max(0, ((registeredCount || 0) / (totalSeats || 100)) * 100));
  
  // Normalize status label for UI
  const displayStatus = (status === "approved" || !status) ? "ACTIVE" : status;

  if (view === "list") {
    const remainingSeats = Math.max(0, (totalSeats || 100) - (registeredCount || 0));
    const targetPath = detailPath || `/events/${id}`;
    
    return (
      <Link to={targetPath} className="block group transition-all hover:translate-x-1 duration-300">
        <div className="w-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-indigo-50/50 border border-gray-100/60 flex flex-row items-center p-2.5 gap-0">
          
          {/* Zone 1: Image Section */}
          <div className="pl-1 pr-4 shrink-0">
            <div className={`relative w-[140px] h-[100px] rounded-xl overflow-hidden bg-gradient-to-br ${gradients} shadow-inner border border-gray-100`}>
              {image ? (
                 <img 
                   src={image} 
                   alt={title} 
                   className="w-full h-full object-cover opacity-60 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" 
                 />
              ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl opacity-40 grayscale group-hover:scale-110 transition-transform duration-500">
                    <CategoryIcon className="w-10 h-10" />
                  </div>
              )}

              {/* Status Pill for List View */}
              <div className="absolute top-2 right-2 bg-indigo-600/90 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[7px] font-black flex items-center gap-1 shadow-lg border border-white/20 uppercase tracking-widest">
                <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                {displayStatus}
              </div>
            </div>
          </div>

          {/* Zone 2: Category | Event Name | Short Description */}
          <div className="flex-[4] flex flex-col min-w-0 px-3">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                {category}
              </span>
            </div>
            <h2 className="text-base font-black text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors truncate mb-1">
              {displayTitle}
            </h2>
            <p className="text-gray-500 text-[11px] line-clamp-2 leading-relaxed font-medium opacity-80">
              {displayDescription}
            </p>
          </div>

          {/* Zone 3: Time | Venue */}
          <div className="hidden md:flex flex-1 flex-col gap-1 min-w-[150px] px-5 border-l border-gray-50">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-4 h-4 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Calendar className="w-3 h-3 text-indigo-500" />
              </div>
              <span className="text-[11px] font-bold">
                {new Date(startDate || date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                {endDate && endDate !== startDate && ` - ${new Date(endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
                {` • ${time}`} {endTime && ` - ${endTime}`}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span className="text-[11px] font-bold truncate">{venue}</span>
            </div>
          </div>

          {/* Zone 4: Progress / Slots Filled */}
          <div className="hidden lg:flex flex-1 flex-col justify-center min-w-[140px] px-6 border-l border-gray-50">
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-sm font-black text-gray-900 leading-none">
                {Math.round(progress)}%
              </span>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                {registeredCount || 0}/{totalSeats || 0} Sold
              </span>
            </div>
            <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden p-0.5 border border-gray-100">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-sm" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Zone 5: Ticket Left */}
          <div className="hidden sm:flex flex-row items-center justify-center min-w-[130px] px-6 border-l border-gray-50 gap-3">
            <Ticket className="w-8 h-8 text-indigo-500 opacity-90" />
            <div className="flex flex-col items-start justify-center">
              <span className="text-xl font-black text-gray-900 leading-none">
                {remainingSeats}
              </span>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5 whitespace-nowrap">
                Tickets Left
              </span>
            </div>
          </div>

          {/* Zone 6: Price (Free) */}
          <div className="shrink-0 flex items-center justify-center min-w-[100px] px-5 border-l border-gray-100">
            <div className="bg-gray-50 text-gray-900 px-4 py-2 rounded-xl text-xs font-black shadow-sm border border-gray-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all uppercase tracking-widest leading-none">
              FREE
            </div>
          </div>
        </div>
      </Link>
    );
  }

  const targetPath = detailPath || `/events/${id}`;

  return (
    <Link to={targetPath} className="block group transition-transform hover:scale-[1.01] duration-300 h-full">
      <div className="w-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 font-sans h-full border border-gray-100/60 flex flex-col transition-all">
        {/* Header Image Area */}
        <div className={`relative h-40 m-2 rounded-2xl bg-gradient-to-br ${gradients}`}>
          {image ? (
             <img 
               src={image} 
               alt={title} 
               className="w-full h-full object-cover opacity-60 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" 
             />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl opacity-30 grayscale group-hover:scale-110 transition-transform duration-500">
              <CategoryIcon className="w-16 h-16" />
            </div>
          )}
          
          {/* Badge */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-[8px] font-black text-gray-700 uppercase tracking-widest shadow-sm border border-gray-100/50">
            {category}
          </div>
          
          <div className="absolute top-4 right-4 bg-indigo-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[8px] font-black flex items-center gap-1.5 shadow-lg border border-white/20 uppercase tracking-widest">
            <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
            {displayStatus}
          </div>
          
          {/* Character/Icon Illustration */}
          {/* <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-white text-indigo-500">
              <CategoryIcon className="w-8 h-8" />
            </div>
          </div> */}
        </div>

        {/* Content */}
        <div className="pt-2 px-5 pb-5 flex flex-col flex-1">
          <div className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1">
            {new Date(startDate || date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            {endDate && endDate !== startDate && ` - ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
            {(!endDate || endDate === startDate) && `, ${new Date(startDate || date).getFullYear()}`}
            {` • ${time}`} {endTime && ` - ${endTime}`}
          </div>
          
          <h2 className="text-sm font-black text-gray-900 mb-1 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1">
            {displayTitle}
          </h2>
          
          <div className="flex items-center gap-1.5 text-gray-400 mb-2">
            <MapPin className="w-3 h-3" />
            <span className="text-[10px] font-bold truncate">{venue}</span>
          </div>

          <p className="text-gray-500 text-[10px] line-clamp-2 mb-3 leading-relaxed font-medium">
            {displayDescription}
          </p>

          <div className="mt-auto">
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Progress</span>
                <span className="text-[9px] font-black text-indigo-600">{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden p-0.5 border border-gray-100">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-sm" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-[8px] font-black text-gray-400">
                  {organizerName?.charAt(0) || "O"}
                </div>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest truncate max-w-[80px]">{organizerName || "Organizer"}</span>
              </div>
              <span className="px-2.5 py-1 bg-gray-50 text-indigo-600 text-[8px] font-black rounded-lg uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all border border-gray-100">
                View Details →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
