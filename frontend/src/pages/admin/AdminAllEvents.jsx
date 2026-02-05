import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminAllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: ''
  });

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { 
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      };
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/all`, config);
      setEvents(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching all events:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'approved': return 'bg-emerald-100 text-emerald-700';
      case 'rejected': return 'bg-rose-100 text-rose-700';
      default: return 'bg-zinc-100 text-zinc-700';
    }
  };

  if (loading) return <div>Loading events...</div>;

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">All Events</h2>
        <div className="flex gap-2">
          <select 
            name="status" 
            value={filters.status} 
            onChange={handleFilterChange} 
            className="px-3 py-2 bg-white border border-zinc-200 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select 
            name="category" 
            value={filters.category} 
            onChange={handleFilterChange} 
            className="px-3 py-2 bg-white border border-zinc-200 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-500"
          >
            <option value="">All Categories</option>
            <option value="Tech">Tech</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
            <option value="Workshops">Workshops</option>
            <option value="Hackathons">Hackathons</option>
            <option value="Clubs">Clubs</option>
          </select>
        </div>
      </header>

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Event Title</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Organizer</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {events.length > 0 ? (
                events.map(event => (
                  <tr key={event._id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-zinc-900">{event.title}</td>
                    <td className="px-6 py-4 text-sm text-zinc-600">{event.organizerId?.organization || event.organizerId?.name || event.organizerName}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusClass(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600">{new Date(event.date).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-zinc-500 text-sm italic">
                    No events found matching your filters.
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

export default AdminAllEvents;
