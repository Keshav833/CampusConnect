import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, Download, Award, Calendar, FolderOpen } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

const mockCertificates = [
  {
    id: "1",
    eventName: "Tech Meetup 2024",
    organizer: "Tech Club IIT Delhi",
    date: "Nov 15, 2024",
    status: "Available",
  },
  {
    id: "2",
    eventName: "Hackathon 2024",
    organizer: "Computer Science Department",
    date: "Oct 28, 2024",
    status: "Available",
  },
  {
    id: "3",
    eventName: "Cultural Festival",
    organizer: "Student Affairs",
    date: "Dec 20, 2024",
    status: "Pending",
  },
  {
    id: "4",
    eventName: "Workshop on AI",
    organizer: "AI Research Lab",
    date: "Sep 12, 2024",
    status: "Available",
  },
]

export default function Certificates() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [yearFilter, setYearFilter] = useState("All")

  const years = ["All", "2024", "2023", "2022"]

  const filteredCertificates = mockCertificates.filter((cert) => {
    const matchesSearch = cert.eventName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesYear = yearFilter === "All" || cert.date.includes(yearFilter)
    return matchesSearch && matchesYear
  })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("student.certificates.title")}</h1>
        <p className="text-gray-500 font-medium">{t("student.certificates.subtitle")}</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8 space-y-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            placeholder={t("student.certificates.searchPlaceholder")}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Year Filter */}
        <div className="flex flex-wrap gap-2">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setYearFilter(year)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                yearFilter === year
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105"
                  : "bg-gray-50 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              {year === "All" ? t("common.categories.all") : year}
            </button>
          ))}
        </div>
      </div>

      {/* Certificates Grid */}
      {filteredCertificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCertificates.map((cert) => (
            <Card key={cert.id} className="p-6 border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all group rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-600/10 transition-colors" />
              
              <div className="flex items-start gap-5 relative">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                  <Award className="w-7 h-7 text-indigo-600 group-hover:text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xl text-gray-900 truncate mb-1">{cert.eventName}</h3>
                  <p className="text-gray-500 text-sm font-medium mb-4">{cert.organizer}</p>
                  
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-6 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      {cert.date}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                        cert.status === "Available" 
                          ? "bg-green-50 text-green-700 border-green-100" 
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}
                    >
                      {cert.status === "Available" ? t("common.available") || "Available" : t("common.pending") || "Pending"}
                    </span>
                    
                    {cert.status === "Available" && (
                      <Button className="bg-gray-900 hover:bg-indigo-600 text-white rounded-xl shadow-lg transition-all active:scale-95 group/btn">
                        <Download className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
                        {t("student.certificates.download")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
            <FolderOpen className="w-10 h-10" />
          </div>
          <p className="text-gray-500 font-bold text-lg">{t("student.certificates.noResults") || "No certificates found"}</p>
        </div>
      )}
    </div>
  )
}
