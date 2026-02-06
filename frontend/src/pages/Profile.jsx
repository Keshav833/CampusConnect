import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTranslation } from "react-i18next"
import {
  Mail,
  Phone,
  CreditCard as IdCard,
  Bell,
  Bookmark as BookmarkIcon,
  Award,
  HelpCircle,
  MessageSquare,
  Shield,
  LogOut,
  Edit,
  Globe,
  Calendar,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export default function Profile() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const userData = JSON.parse(localStorage.getItem('userData') || '{}')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [remindersEnabled, setRemindersEnabled] = useState(true)
  const [updatesEnabled, setUpdatesEnabled] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userData')
    navigate('/login')
  }

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang)
  }

  const preferredCategories = ["Tech", "Cultural", "Sports", "Workshops"]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="p-6 border-gray-100 shadow-sm overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 to-purple-600" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar className="w-24 h-24 ring-4 ring-indigo-50 shadow-lg">
            <AvatarImage src={userData.avatar || "/placeholder.svg?height=96&width=96"} />
            <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-600 font-bold">
              {userData.name ? userData.name.substring(0, 2).toUpperCase() : "CC"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{userData.name || "Student Name"}</h1>
            <p className="text-gray-500 font-medium">{userData.college || "Your University"}</p>
            <p className="text-sm text-gray-400 mt-1">
              {userData.department || "Department"} • {userData.year || "Year"}
            </p>
          </div>

          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-100 transition-all hover:scale-105 active:scale-95">
            <Edit className="w-4 h-4 mr-2" />
            {t("student.profile.editProfile")}
          </Button>
        </div>
      </Card>

      {/* Account Information */}
      <Card className="p-6 border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold mb-6 text-gray-900 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
          {t("student.profile.accountInfo")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 group">
            <div className="p-3 bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 rounded-xl transition-all">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t("student.profile.emailId")}</p>
              <p className="text-gray-900 font-medium break-all">{userData.email || "email@example.com"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="p-3 bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 rounded-xl transition-all">
              <IdCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t("student.profile.studentId")}</p>
              <p className="text-gray-900 font-medium">{userData.id || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="p-3 bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 rounded-xl transition-all">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t("student.profile.contactNumber")}</p>
              <p className="text-gray-900 font-medium">{userData.phone || "+91 00000 00000"}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-6 border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold mb-6 text-gray-900 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
          {t("student.profile.preferences")}
        </h2>

        <div className="space-y-8">
          {/* Preferred Categories */}
          <div>
            <Label className="text-sm font-bold text-gray-500 mb-3 block uppercase tracking-wider">
              {t("student.profile.eventCategories")}
            </Label>
            <div className="flex flex-wrap gap-2">
              {preferredCategories.map((category) => (
                <span
                  key={category}
                  className="px-4 py-2 bg-indigo-50/50 text-indigo-700 rounded-xl text-sm font-bold border border-indigo-100/50 transition-all hover:bg-indigo-600 hover:text-white cursor-default"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Language Selection */}
            <div>
              <Label className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2 uppercase tracking-wider">
                <Globe className="w-4 h-4" />
                {t("student.profile.language")}
              </Label>
              <select 
                value={i18n.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-semibold"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="gu">ગુજરાતી</option>
                <option value="mr">मराठी</option>
                <option value="bn">বাংলা</option>
                <option value="ta">தமிழ்</option>
              </select>
            </div>

            {/* Notification Preferences */}
            <div>
              <Label className="text-sm font-bold text-gray-500 mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Bell className="w-4 h-4" />
                {t("student.profile.notifications")}
              </Label>
              <div className="space-y-4">
                <div className="flex items-center justify-between group">
                  <Label htmlFor="all-notifications" className="text-sm font-medium text-gray-700 cursor-pointer group-hover:text-indigo-600 transition-colors">
                    {t("student.profile.enableAll")}
                  </Label>
                  <Switch
                    id="all-notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                <div className="flex items-center justify-between group">
                  <Label htmlFor="reminders" className="text-sm font-medium text-gray-700 cursor-pointer group-hover:text-indigo-600 transition-colors">
                    {t("student.profile.reminders")}
                  </Label>
                  <Switch id="reminders" checked={remindersEnabled} onCheckedChange={setRemindersEnabled} />
                </div>
                <div className="flex items-center justify-between group">
                  <Label htmlFor="updates" className="text-sm font-medium text-gray-700 cursor-pointer group-hover:text-indigo-600 transition-colors">
                    {t("student.profile.updates")}
                  </Label>
                  <Switch id="updates" checked={updatesEnabled} onCheckedChange={setUpdatesEnabled} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold mb-6 text-gray-900 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
            {t("student.profile.quickAccess")}
          </h2>
          <div className="space-y-3">
            <Link
              to="/my-events"
              className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-gray-50 hover:text-indigo-600 transition-all group"
            >
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-indigo-600">{t("common.myEvents")}</span>
            </Link>
            <Link
              to="/saved-events"
              className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-gray-50 hover:text-indigo-600 transition-all group"
            >
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <BookmarkIcon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-indigo-600">{t("student.profile.savedEvents")}</span>
            </Link>
            <Link
              to="/certificates"
              className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-gray-50 hover:text-indigo-600 transition-all group"
            >
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Award className="w-5 h-5" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-indigo-600">{t("student.profile.certificatesHistory")}</span>
            </Link>
          </div>
        </Card>

        {/* Support & Settings */}
        <Card className="p-6 border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold mb-6 text-gray-900 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
            {t("student.profile.supportSettings")}
          </h2>
          <div className="space-y-3">
            <Link to="/help" className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-gray-50 hover:text-indigo-600 transition-all group">
              <div className="p-2 bg-gray-100 text-gray-400 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-indigo-600">{t("student.profile.helpFaqs")}</span>
            </Link>
            <Link to="/contact" className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-gray-50 hover:text-indigo-600 transition-all group">
              <div className="p-2 bg-gray-100 text-gray-400 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-indigo-600">{t("student.profile.contactSupport")}</span>
            </Link>
            <Link to="/feedback" className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-gray-50 hover:text-indigo-600 transition-all group">
              <div className="p-2 bg-gray-100 text-gray-400 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-indigo-600">{t("student.profile.feedbackReport")}</span>
            </Link>
            <Link to="#" className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-gray-50 hover:text-indigo-600 transition-all group">
              <div className="p-2 bg-gray-100 text-gray-400 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-indigo-600">{t("student.profile.privacySecurity")}</span>
            </Link>
          </div>
        </Card>
      </div>

      <button 
        onClick={handleLogout}
        className="flex items-center justify-center gap-3 w-full p-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-600 hover:text-white transition-all active:scale-[0.98] shadow-sm shadow-red-100"
      >
        <LogOut className="w-5 h-5" />
        <span>{t("common.logout")}</span>
      </button>
    </div>
  )
}
