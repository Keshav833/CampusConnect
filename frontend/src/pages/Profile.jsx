import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
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
import { Link } from "react-router-dom"

export default function Profile() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [remindersEnabled, setRemindersEnabled] = useState(true)
  const [updatesEnabled, setUpdatesEnabled] = useState(false)

  const preferredCategories = ["Tech", "Cultural", "Sports", "Workshops"]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Header */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" />
              <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-600">AK</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Arjun Kumar</h1>
              <p className="text-muted-foreground">Indian Institute of Technology, Delhi</p>
              <p className="text-sm text-muted-foreground mt-1">Computer Science & Engineering • 3rd Year</p>
            </div>

            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Account Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Account Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email ID</p>
                <p className="text-foreground">arjun.kumar@iitd.ac.in</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IdCard className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Student ID</p>
                <p className="text-foreground">2021CS10123</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Contact Number</p>
                <p className="text-foreground">+91 98765 43210</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Preferences</h2>

          <div className="space-y-6">
            {/* Preferred Categories */}
            <div>
              <Label className="text-sm font-medium text-foreground mb-2 block">Preferred Event Categories</Label>
              <div className="flex flex-wrap gap-2">
                {preferredCategories.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm border border-indigo-200"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <div>
              <Label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Language
              </Label>
              <select className="w-full sm:w-64 px-3 py-2 border border-input rounded-lg bg-background text-foreground">
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
                <option>Bengali</option>
              </select>
            </div>

            {/* Notification Preferences */}
            <div>
              <Label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notification Preferences
              </Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="all-notifications" className="text-sm text-foreground cursor-pointer">
                    Enable all notifications
                  </Label>
                  <Switch
                    id="all-notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="reminders" className="text-sm text-foreground cursor-pointer">
                    Event reminders
                  </Label>
                  <Switch id="reminders" checked={remindersEnabled} onCheckedChange={setRemindersEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="updates" className="text-sm text-foreground cursor-pointer">
                    Event updates & announcements
                  </Label>
                  <Switch id="updates" checked={updatesEnabled} onCheckedChange={setUpdatesEnabled} />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Access */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Quick Access</h2>
          <div className="space-y-2">
            <Link
              to="/my-events"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span className="text-foreground">My Events</span>
            </Link>
            <Link
              to="/saved-events"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <BookmarkIcon className="w-5 h-5 text-indigo-600" />
              <span className="text-foreground">Saved / Bookmarked Events</span>
            </Link>
            <Link
              to="/certificates"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <Award className="w-5 h-5 text-indigo-600" />
              <span className="text-foreground">Certificates & Participation History</span>
            </Link>
          </div>
        </Card>

        {/* Support & Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Support & Settings</h2>
          <div className="space-y-2">
            <Link to="/help" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">Help & FAQs</span>
            </Link>
            <Link to="/contact" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">Contact Support</span>
            </Link>
            <Link to="/feedback" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">Feedback / Report an Issue</span>
            </Link>
            <Link to="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">Privacy & Security</span>
            </Link>
            <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-destructive/10 transition-colors text-destructive w-full">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </Card>
      </main>
    </div>
  )
}
