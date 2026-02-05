import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminHome = () => {
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
      <header>
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Pending Events', value: stats.pendingEvents, color: 'text-amber-600' },
          { label: 'Approved Events', value: stats.approvedEvents, color: 'text-emerald-600' },
          { label: 'Rejected Events', value: stats.rejectedEvents, color: 'text-rose-600' },
          { label: 'Total Organizers', value: stats.totalOrganizers, color: 'text-zinc-900' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm">
            <div className="text-sm font-medium text-zinc-500 mb-2">{card.label}</div>
            <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
          </div>
        ))}
      </div>

      <section className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Pending Events (Preview)</h3>
          <Link to="/admin/pending" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Event Title</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Organizer</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {pendingPreview.length > 0 ? (
                pendingPreview.map(event => (
                  <tr key={event._id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-zinc-900">{event.title}</td>
                    <td className="px-6 py-4 text-sm text-zinc-600">{event.organizerId?.organization || event.organizerId?.name || event.organizerName}</td>
                    <td className="px-6 py-4 text-sm text-zinc-600">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-right">
                      <Link to={`/admin/event/${event._id}`} className="text-zinc-400 hover:text-zinc-900 font-medium transition-colors">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-zinc-500 text-sm italic">
                    All clear! No pending events.
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
