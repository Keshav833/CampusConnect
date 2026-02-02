import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Download, Award, Calendar } from "lucide-react"
import { useState } from "react"

const certificates = [
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
  const [searchQuery, setSearchQuery] = useState("")
  const [yearFilter, setYearFilter] = useState("All")

  const years = ["All", "2024", "2023", "2022"]

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch = cert.eventName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesYear = yearFilter === "All" || cert.date.includes(yearFilter)
    return matchesSearch && matchesYear
  })

  return (
    <div className="min-h-screen bg-background">

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Certificates</h1>
          <p className="text-muted-foreground">Download certificates for events you've attended</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by event name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Year Filter */}
          <div className="flex gap-2">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setYearFilter(year)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  yearFilter === year
                    ? "bg-indigo-600 text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Certificates Grid */}
        {filteredCertificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCertificates.map((cert) => (
              <Card key={cert.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">{cert.eventName}</h3>
                    <p className="text-sm text-muted-foreground">{cert.organizer}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{cert.date}</span>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          cert.status === "Available" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {cert.status}
                      </span>
                      {cert.status === "Available" && (
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No certificates found</p>
          </div>
        )}
      </main>
    </div>
  )
}
