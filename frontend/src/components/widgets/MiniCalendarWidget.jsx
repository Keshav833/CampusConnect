import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export function MiniCalendarWidget({ events = [] }) {
  const formattedEvents = events.map(e => ({
    id: e._id,
    title: e.title,
    start: e.date,
    color: '#6366f1'
  }));

  return (
    <div className="bg-white rounded-[20px] p-4 shadow-sm border border-gray-100 mini-calendar-container">
      <style>{`
        .mini-calendar-container .fc {
          font-family: inherit;
          --fc-border-color: transparent;
          --fc-daygrid-dot-event-bg-color: #6366f1;
          font-size: 0.75rem;
        }
        .mini-calendar-container .fc-theme-standard td, 
        .mini-calendar-container .fc-theme-standard th,
        .mini-calendar-container .fc-theme-standard .fc-scrollgrid {
          border: none !important;
        }
        .mini-calendar-container .fc-header-toolbar {
          margin-bottom: 1.5rem !important;
          padding: 0 0.25rem;
        }
        .mini-calendar-container .fc-toolbar-title {
          font-size: 0.9rem !important;
          font-weight: 800 !important;
          color: #111827;
        }
        .mini-calendar-container .fc-button {
          padding: 2px 4px !important;
          background: #f9fafb !important;
          border: 1px solid #f3f4f6 !important;
          color: #374151 !important;
          font-size: 0.7rem !important;
        }
        .mini-calendar-container .fc-button:hover {
          background: #f3f4f6 !important;
        }
        .mini-calendar-container .fc-day-today {
          background: #f5f3ff !important;
        }
        .mini-calendar-container .fc-daygrid-day-top {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
        }
        .mini-calendar-container .fc-daygrid-day-number {
          padding: 0 !important;
          font-weight: 700;
          font-size: 0.8rem;
          color: #475569;
          z-index: 2;
        }
        .mini-calendar-container .fc-col-header-cell-cushion {
          padding: 12px 0 !important;
          font-weight: 800;
          color: #9ca3af;
          text-transform: uppercase;
          font-size: 0.65rem;
          letter-spacing: 0.05em;
        }
        .mini-calendar-container .fc-daygrid-day-frame {
          aspect-ratio: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 50% !important;
          margin: 4px !important;
          position: relative;
          cursor: pointer;
        }
        .mini-calendar-container .fc-daygrid-day {
          padding: 0 !important;
        }
        .mini-calendar-container .fc-day-today .fc-daygrid-day-frame {
          background-color: #6366f110 !important;
          border: 2px solid #6366f1 !important;
          box-shadow: none;
        }
        .mini-calendar-container .fc-day-today .fc-daygrid-day-number {
          color: #6366f1 !important;
          font-weight: 900;
        }
        .mini-calendar-container .day-has-event .fc-daygrid-day-frame {
          background-color: #1e293b08 !important; /* Light forensic fill */
          border: 2px solid #1e293b !important; /* Dark solid border */
        }
        .mini-calendar-container .day-has-event .fc-daygrid-day-number {
          color: #1e293b !important;
          font-weight: 800;
        }
        .mini-calendar-container .day-has-event .fc-daygrid-day-frame:hover {
          background-color: #6366f115 !important;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
          z-index: 10;
        }
        .mini-calendar-container .fc-daygrid-event-harness {
          display: none !important;
        }
      `}</style>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'title',
          right: 'prev,next'
        }}
        events={formattedEvents}
        height="auto"
        aspectRatio={1}
        dayMaxEvents={3}
        dayCellDidMount={(arg) => {
          const dateStr = arg.date.toLocaleDateString('en-CA');
          const dayEvents = formattedEvents.filter(e => e.start === dateStr);
          if (dayEvents.length > 0) {
            arg.el.classList.add('day-has-event');
            const titles = dayEvents.map(e => e.title).join(' | ');
            arg.el.setAttribute('title', titles);
          }
        }}
        eventMouseEnter={(info) => {
          info.el.setAttribute('title', info.event.title);
        }}
      />
    </div>
  );
}
