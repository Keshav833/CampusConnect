import React from "react"
import { LayoutGrid, List, ChevronDown, Calendar, Filter } from "lucide-react"

export function EventControlBar({ 
  tabs, 
  activeTab, 
  onTabChange, 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  dateFilter, 
  onDateFilterChange, 
  view, 
  onViewChange,
  counts = {}
}) {
  const dateOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" }
  ]

  return (
    <div className="flex flex-row items-center justify-between gap-2 px-2 md:px-0 mb-2 border-b border-gray-100 pb-2 animate-in fade-in duration-500 overflow-x-auto scrollbar-hide">
      {/* 1. Status Tabs (Left Section) - Pill Style */}
      <div className="flex p-0.5 bg-gray-100/60 backdrop-blur-sm rounded-full w-fit border border-gray-200/50 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3 py-1 rounded-full text-[10px] font-black transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                : "text-gray-400 hover:text-gray-600 hover:bg-white/30"
            }`}
          >
            {tab.label}
            {counts[tab.id] !== undefined && (
              <span className={`min-w-[16px] h-4 flex items-center justify-center rounded-full text-[9px] font-black transition-colors ${
                activeTab === tab.id ? "bg-indigo-50 text-indigo-600" : "bg-gray-200/50 text-gray-400"
              }`}>
                {counts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        {/* 2. Category Filter - Pill Style */}
        <div className="relative group">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="appearance-none pl-7 pr-7 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-black text-gray-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all cursor-pointer hover:border-gray-300 shadow-sm min-w-[100px]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
            ))}
          </select>
          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none group-focus-within:text-indigo-400" />
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none group-hover:rotate-180 transition-transform duration-300" />
        </div>

        {/* 3. Date Filter - Pill Style */}
        <div className="relative group text-gray-600">
          <select
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            className="appearance-none pl-7 pr-7 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-black text-gray-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all cursor-pointer hover:border-gray-300 shadow-sm min-w-[100px]"
          >
            {dateOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none group-focus-within:text-indigo-400" />
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none group-hover:rotate-180 transition-transform duration-300" />
        </div>

        {/* 4. View Toggle - Pill Style */}
        <div className="flex p-0.5 bg-gray-50 border border-gray-200 rounded-full shadow-sm">
          <button
            onClick={() => onViewChange("grid")}
            className={`p-1.5 rounded-full transition-all ${
              view === "grid"
                ? "bg-white text-indigo-600 shadow-sm border border-black/5"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewChange("list")}
            className={`p-1.5 rounded-full transition-all ${
              view === "list"
                ? "bg-white text-indigo-600 shadow-sm border border-black/5"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
