import { useTranslation } from "react-i18next";
import { Languages, ChevronDown } from "lucide-react";
import { useState } from "react";

const languages = [
  { code: "en", label: "English", short: "ENG", flag: "🇺🇸" },
  { code: "hi", label: "हिंदी", short: "हिन्", flag: "🇮🇳" },
  { code: "gu", label: "ગુજરાતી", short: "ગુજ", flag: "🇮🇳" },
  { code: "mr", label: "मराठी", short: "मरा", flag: "🇮🇳" },
  { code: "bn", label: "বাংলা", short: "বাং", flag: "🇮🇳" },
  { code: "ta", label: "தமிழ்", short: "தமி", flag: "🇮🇳" }
];

export function StickyLanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="fixed bottom-6 right-6 z-[100] group">
      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[101]" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full right-0 mb-4 w-56 bg-white border border-gray-100 rounded-3xl shadow-2xl z-[102] p-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="px-4 py-2 border-b border-gray-50 mb-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Language</span>
            </div>
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setIsOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl text-sm transition-all group/item ${
                    i18n.language === lang.code
                        ? "bg-purple-600 text-white font-bold"
                        : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.label}</span>
                    </div>
                    {i18n.language === lang.code && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                </button>
                ))}
            </div>
          </div>
        </>
      )}

      {/* Main Sticky Circular Button with Hover Transition */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-14 h-14 bg-white border-2 border-purple-500 shadow-2xl rounded-full transition-all duration-300 hover:scale-110 active:scale-90 group relative z-[103] ${
            isOpen ? "bg-purple-50 ring-4 ring-purple-100" : "hover:border-purple-600"
        }`}
        title={currentLanguage.label}
      >
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full">
            {/* Icon (Shows by default, hides on hover/open) */}
            <div className={`absolute transition-all duration-300 flex items-center justify-center ${
                isOpen ? "translate-y-8 opacity-0" : "group-hover:translate-y-8 group-hover:opacity-0"
            }`}>
                <Languages className="w-6 h-6 text-purple-600" />
            </div>

            {/* Native Code (Shows on hover/open) */}
            <div className={`absolute transition-all duration-300 flex flex-col items-center justify-center ${
                isOpen ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
            }`}>
                <span className="text-[10px] font-black text-purple-600 leading-none select-none tracking-tight">
                    {currentLanguage.short}
                </span>
                <div className={`mt-1 h-0.5 bg-purple-600 rounded-full transition-all duration-300 ${isOpen ? "w-4" : "w-2"}`} />
            </div>
        </div>
        
        {/* Floating Tooltip */}
        {!isOpen && (
            <div className="absolute right-full mr-4 px-3 py-2 bg-gray-900 text-white text-[10px] font-bold rounded-xl opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none transition-all duration-300 whitespace-nowrap shadow-xl">
                {currentLanguage.label}
            </div>
        )}
      </button>
    </div>
  );
}
