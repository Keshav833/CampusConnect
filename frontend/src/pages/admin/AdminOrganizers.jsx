import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminOrganizers = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:5000/api/admin/organizers', config);
        setOrganizers(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching organizers:', error);
        setLoading(false);
      }
    };

    fetchOrganizers();
  }, []);

  if (loading) return <div>Loading organizers...</div>;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Organizers</h2>
      </header>

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Events</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-emerald-600">Approved</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-rose-600">Rejected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {organizers.length > 0 ? (
                organizers.map(org => (
                  <tr key={org._id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-zinc-900">{org.name}</td>
                    <td className="px-6 py-4 text-sm text-zinc-600">{org.organization || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-zinc-600">{org.email}</td>
                    <td className="px-6 py-4 text-sm text-zinc-900 font-semibold">{org.totalEvents}</td>
                    <td className="px-6 py-4 text-sm text-emerald-600 font-bold">{org.approvedCount}</td>
                    <td className="px-6 py-4 text-sm text-rose-600 font-bold">{org.rejectedCount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-zinc-500 text-sm italic">
                    No organizers found.
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

export default AdminOrganizers;
