import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { useState } from "react";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "hi", label: "हिंदी", flag: "🇮🇳" },
  { code: "gu", label: "ગુજરાતી", flag: "🇮🇳" },
  { code: "mr", label: "मराठी", flag: "🇮🇳" },
  { code: "bn", label: "বাংলা", flag: "🇮🇳" },
  { code: "ta", label: "தமிழ்", flag: "🇮🇳" }
];

export function LanguageSwitcher({ isCollapsed }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors group relative ${isCollapsed ? "justify-center" : ""}`}
      >
        <Languages className="w-5 h-5 opacity-70 group-hover:opacity-100 shrink-0" />
        {!isCollapsed && <span className="truncate">{currentLanguage.label}</span>}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60]">
            {currentLanguage.label}
          </div>
        )}
      </button>

      {isOpen && (
        <div className={`absolute ${isCollapsed ? "left-full bottom-0 ml-2" : "bottom-full left-0 mb-2"} w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-[70] p-2 animate-in fade-in slide-in-from-bottom-2 duration-200`}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm transition-all ${
                i18n.language === lang.code
                  ? "bg-indigo-50 text-indigo-600 font-bold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
