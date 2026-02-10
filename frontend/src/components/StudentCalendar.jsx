import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const StudentCalendar = ({ events = [] }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [tooltip, setTooltip] = React.useState({ show: false, content: "", x: 0, y: 0 });

  // Map categories to colors (using Campus Connect theme colors)
  const categoryColors = {
    Tech: "#6366f1", // Indigo
    Cultural: "#ec4899", // Pink
    Sports: "#f59e0b", // Amber
    Workshops: "#10b981", // Emerald
    Hackathons: "#8b5cf6", // Violet
    Clubs: "#3b82f6", // Blue
    Academic: "#64748b", // Slate
  };

  const formattedEvents = events.map((event) => ({
    id: event.eventId || event._id,
    title: event.title,
    start: `${event.startDate || event.date}T${event.time || "00:00:00"}`,
    end: `${event.endDate || event.date}T${event.endTime || "23:59:59"}`,
    backgroundColor: categoryColors[event.category] || "#6366f1",
    borderColor: categoryColors[event.category] || "#6366f1",
    extendedProps: {
      category: event.category,
      venue: event.venue,
    },
  }));

  const handleEventClick = (info) => {
    navigate(`/events/${info.event.id}`);
  };

  return (
    <div className="calendar-container bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={i18n.language}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={formattedEvents}
        eventClick={handleEventClick}
        height="auto"
        aspectRatio={1.1}
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        }}
        dayMaxEvents={false}
        dayCellDidMount={(arg) => {
          const dateStr = arg.date.toLocaleDateString('en-CA'); 
          const dayEvents = formattedEvents.filter(e => e.start.startsWith(dateStr));
          
          if (dayEvents.length > 0) {
            const firstColor = dayEvents[0].backgroundColor;
            // High-end Forensic Style: Light category fill + Solid side border
            arg.el.style.backgroundColor = `${firstColor}08`; 
            arg.el.style.borderLeft = `4px solid ${firstColor}`;
            arg.el.style.transition = "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)";
            arg.el.classList.add('day-has-event');
          }
        }}
        eventMouseEnter={(info) => {
          info.el.style.backgroundColor = "#4989f154";
          info.el.style.color = "#ffffff";
          info.el.style.transform = "scale(1.02) translateY(-1px)";
          info.el.style.zIndex = "50";
          info.el.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.06)";
          info.el.style.transition = "all 0.2s ease";
          
          const rect = info.el.getBoundingClientRect();
          setTooltip({
            show: true,
            content: info.event.title,
            x: rect.left + rect.width / 2,
            y: rect.top - 10
          });
        }}
        eventMouseLeave={(info) => {
          const color = info.event.backgroundColor || '#494cfcff';
          info.el.style.backgroundColor = `${color}15`;
          info.el.style.color = '#1e293b';
          info.el.style.transform = "scale(1) translateY(0)";
          info.el.style.zIndex = "1";
          info.el.style.boxShadow = "none";
          setTooltip({ ...tooltip, show: false });
        }}
        eventDidMount={(info) => {
          const color = info.event.backgroundColor || '#6366f1';
          info.el.style.backgroundColor = `${color}15`;
          info.el.style.borderLeft = `4px solid ${color}`;
          info.el.style.color = '#1e293b';
        }}
        className="custom-fullcalendar"
      />

      {/* Custom Tooltip */}
      {tooltip.show && (
        <div 
          className="fixed z-[9999] pointer-events-none px-3 py-2 bg-zinc-900 text-white text-[11px] font-bold rounded-lg shadow-xl -translate-x-1/2 -translate-y-full animate-in fade-in zoom-in-95 duration-200"
          style={{ 
            left: `${tooltip.x}px`, 
            top: `${tooltip.y}px`,
          }}
        >
          {tooltip.content}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-4 border-transparent border-t-zinc-900" />
        </div>
      )}
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-gray-50">
        {Object.entries(categoryColors).map(([category, color]) => (
          <div key={category} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: color }}
            />
            <span className="text-xs font-medium text-gray-600">
              {t(`common.categories.${category}`)}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        .fc {
          --fc-button-bg-color: #6366f1;
          --fc-button-border-color: #6366f1;
          --fc-button-hover-bg-color: #4f46e5;
          --fc-button-hover-border-color: #4f46e5;
          --fc-button-active-bg-color: #4338ca;
          --fc-button-active-border-color: #4338ca;
          --fc-event-resizer-thickness: 8px;
          --fc-event-border-color: transparent;
          font-family: inherit;
        }
        .fc .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
        }
        .fc .fc-header-toolbar {
          margin-bottom: 2rem !important;
        }
        .fc .fc-button {
          font-weight: 600;
          font-size: 0.875rem;
          padding: 0.5rem 1rem;
          border-radius: 0.75rem;
          text-transform: capitalize;
        }
        .fc .fc-button-primary:not(:disabled).fc-button-active, 
        .fc .fc-button-primary:not(:disabled):active {
          background-color: var(--fc-button-active-bg-color);
          border-color: var(--fc-button-active-border-color);
        }
        .fc .fc-daygrid-day-top {
          display: flex;
          justify-content: center;
          padding: 0;
        }
        .fc .fc-daygrid-day-number {
          font-size: 0.85rem;
          font-weight: 700;
          color: #1e293b;
          padding: 10px;
          opacity: 0.6;
          text-align: center;
          width: 100%;
        }
        .fc .fc-day-today .fc-daygrid-day-number {
          background: #6366f1;
          color: white;
          border-radius: 8px;
          opacity: 1;
          margin: 6px;
          padding: 4px 8px;
          display: inline-block;
          width: fit-content;
        }
        .fc .fc-col-header-cell-cushion {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #94a3b8;
          padding: 16px 4px;
        }
        .fc-theme-standard td, .fc-theme-standard th {
          border-color: #f8fafc;
        }
        .fc-theme-standard .fc-scrollgrid {
          border-color: #f1f5f9;
          border-radius: 20px;
          overflow: hidden;
        }
        .fc .fc-event {
          cursor: pointer;
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 0.7rem;
          font-weight: 700;
          margin: 1px 4px !important;
          border: 1px solid #f1f5f9 !important;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
          transition: all 0.2s ease;
        }
        .fc .fc-event:hover {
          background: #1e293b !important;
          color: white !important;
          border-left-width: 6px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 50;
        }
        .fc-daygrid-day-frame {
          min-height: 110px !important;
          position: relative;
        }
        .day-has-event:hover {
          background-color: #f1f5f9 !important;
          cursor: pointer;
        }
        .fc-daygrid-event-harness {
          margin-bottom: 2px !important;
        }
        .fc-daygrid-event {
          white-space: normal !important;
          align-items: flex-start !important;
          border: none !important;
          padding: 4px 8px !important;
        }
        @media (max-width: 768px) {
          .fc-daygrid-day-frame {
            min-height: 60px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentCalendar;
