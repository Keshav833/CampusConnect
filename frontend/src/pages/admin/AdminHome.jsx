import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const AdminHome = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    pendingEvents: 0,
    approvedEvents: 0,
    rejectedEvents: 0,
    totalOrganizers: 0
  });
  const [pendingPreview, setPendingPreview] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const [statsRes, pendingRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`, config),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/events/pending`, config)
        ]);

        setStats(statsRes.data);
        setPendingPreview(pendingRes.data.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: t("admin.dashboard.stats.pending"), value: stats.pendingEvents, color: 'text-amber-600' },
          { label: t("admin.dashboard.stats.approved"), value: stats.approvedEvents, color: 'text-emerald-600' },
          { label: t("admin.dashboard.stats.rejected"), value: stats.rejectedEvents, color: 'text-rose-600' },
          { label: t("admin.dashboard.stats.totalOrganizers"), value: stats.totalOrganizers, color: 'text-zinc-900' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm">
            <div className="text-sm font-medium text-zinc-500 mb-2">{card.label}</div>
            <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
          </div>
        ))}
      </div>

      <section className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-zinc-900">{t("admin.dashboard.pendingPreview")}</h3>
          <Link to="/admin/pending" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors flex items-center gap-1">
            {t("admin.dashboard.viewAll")} →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-zinc-900">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">{t("admin.dashboard.table.title")}</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">{t("admin.dashboard.table.organizer")}</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">{t("admin.dashboard.table.date")}</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">{t("admin.dashboard.table.action")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {pendingPreview.length > 0 ? (
                pendingPreview.map(event => (
                  <tr key={event._id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-zinc-900">{event.title}</td>
                    <td className="px-6 py-4 text-sm text-zinc-600">{event.organizerId?.organization || event.organizerId?.name || event.organizerName}</td>
                    <td className="px-6 py-4 text-sm text-zinc-600">
                      {new Date(event.startDate || event.date).toLocaleDateString()}
                      {event.endDate && event.endDate !== event.startDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <Link to={`/admin/event/${event._id}`} className="text-zinc-400 hover:text-zinc-900 font-medium transition-colors">
                        {t("admin.dashboard.table.view")}
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-zinc-500 text-sm italic">
                    {t("admin.dashboard.noPending")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminHome;
