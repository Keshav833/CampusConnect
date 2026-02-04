import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const AdminEventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`http://localhost:5000/api/admin/event/${id}`, config);
      setEvent(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event detail:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleApprove = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`http://localhost:5000/api/admin/approve/${id}`, {}, config);
      navigate('/admin/pending');
    } catch (error) {
      alert('Failed to approve event');
    }
  };

  const handleReject = async () => {
    const reason = prompt('Please enter a reason for rejection (optional):');
    if (reason === null) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`http://localhost:5000/api/admin/reject/${id}`, { reason }, config);
      navigate('/admin/pending');
    } catch (error) {
      alert('Failed to reject event');
    }
  };

  if (loading) return <div>Loading event details...</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold">Event Submission</h2>
      </header>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Event Title</h3>
              <p className="text-lg font-semibold text-zinc-900">{event.title}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Organizer</h3>
              <p className="text-lg font-semibold text-zinc-900">{event.organizer?.name} ({event.organizer?.organization || 'Individual'})</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Category</h3>
              <p className="text-lg font-semibold text-zinc-900">{event.category}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Date & Time</h3>
              <p className="text-lg font-semibold text-zinc-900">{new Date(event.date).toLocaleDateString()} at {event.time || 'TBA'}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Venue</h3>
              <p className="text-lg font-semibold text-zinc-900">{event.location}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Submitted At</h3>
              <p className="text-lg font-semibold text-zinc-900">{new Date(event.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-2 pt-8 border-t border-zinc-100">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Description</h3>
            <p className="text-zinc-600 leading-relaxed overflow-wrap-anywhere whitespace-pre-wrap">{event.description}</p>
          </div>

          {event.status !== 'Pending' && (
            <div className="pt-8 border-t border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  event.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  Status: {event.status}
                </span>
                {event.status === 'Rejected' && event.rejectionReason && (
                   <span className="text-sm text-zinc-500 italic">“{event.rejectionReason}”</span>
                )}
              </div>
            </div>
          )}
        </div>

        {event.status === 'Pending' && (
          <div className="bg-zinc-50 px-8 py-6 border-t border-zinc-100 flex justify-end gap-4 sticky bottom-0">
            <button 
              onClick={handleReject} 
              className="px-6 py-2 bg-rose-50 text-rose-600 rounded-lg text-sm font-bold hover:bg-rose-100 transition-colors"
            >
              Reject Event
            </button>
            <button 
              onClick={handleApprove} 
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors shadow-md"
            >
              Approve Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventDetail;
