import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const AdminPendingEvents = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/events/pending`, config);
      setEvents(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending events:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/events/${id}/approve`, {}, config);
      fetchPending(); // Refresh list
    } catch (error) {
      alert('Failed to approve event');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Please enter a reason for rejection (optional):');
    if (reason === null) return; // User cancelled prompt

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/events/${id}/reject`, { reason }, config);
      fetchPending(); // Refresh list
    } catch (error) {
      alert('Failed to reject event');
    }
  };

  if (loading) return <div>Loading pending events...</div>;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-zinc-900">{t("admin.pending.title")}</h2>
        <p className="text-zinc-500 mt-1">{t("admin.pending.subtitle")}</p>
      </header>

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">{t("admin.dashboard.table.title")}</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">{t("admin.dashboard.table.organizer")}</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">{t("organizer.createEvent.form.category")}</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">{t("admin.dashboard.table.date")}</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">{t("admin.dashboard.table.view")}</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">{t("admin.dashboard.table.action")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {events.length > 0 ? (
                events.map(event => (
                  <tr key={event._id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-zinc-900">{event.title}</td>
                    <td className="px-6 py-4 text-sm text-zinc-600">{event.organizerId?.organization || event.organizerId?.name || event.organizerName}</td>
                    <td className="px-6 py-4 text-sm text-zinc-600">
                      <span className="px-2 py-1 bg-zinc-100 text-zinc-600 rounded text-xs font-medium">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <Link to={`/admin/event/${event._id}`} className="text-zinc-500 hover:text-zinc-900 font-medium">
                        {t("admin.dashboard.table.view")}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleApprove(event._id)} 
                          className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 transition-colors"
                        >
                          ✓ {t("admin.eventReview.approve")}
                        </button>
                        <button 
                          onClick={() => handleReject(event._id)} 
                          className="px-3 py-1 bg-rose-600 text-white rounded text-xs font-bold hover:bg-rose-700 transition-colors"
                        >
                          ✕ {t("admin.eventReview.reject")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-zinc-500 text-sm italic">
                    {t("admin.pending.empty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPendingEvents;
