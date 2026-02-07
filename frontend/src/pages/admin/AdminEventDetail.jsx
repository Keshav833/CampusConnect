import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

const AdminEventDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/event/${id}`, config);
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
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/events/${id}/approve`, {}, config);
      navigate('/admin/pending');
    } catch (error) {
      alert(t("admin.eventReview.errorApprove"));
    }
  };

  const handleReject = async () => {
    const reason = prompt(t("admin.eventReview.rejectionPlaceholder"));
    if (reason === null) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/events/${id}/reject`, { reason }, config);
      navigate('/admin/pending');
    } catch (error) {
      alert(t("admin.eventReview.errorReject"));
    }
  };

  if (loading) return <div className="p-8 text-center text-zinc-500 font-medium">{t("common.loading")}</div>;
  if (!event) return <div className="p-8 text-center text-zinc-500 font-medium">{t("student.events.noResults")}</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </header>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t("admin.eventReview.fields.title")}</h3>
              <p className="text-lg font-semibold text-zinc-900">{event.title}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t("admin.eventReview.fields.organizer")}</h3>
              <p className="text-lg font-semibold text-zinc-900">{event.organizerId?.name || event.organizerName} ({event.organizerId?.organization || 'Individual'})</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t("admin.eventReview.fields.category")}</h3>
              <p className="text-lg font-semibold text-zinc-900">{event.category}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t("admin.eventReview.fields.dateTime")}</h3>
              <p className="text-lg font-semibold text-zinc-900">
                {new Date(event.startDate || event.date).toLocaleDateString()}
                {event.endDate && event.endDate !== event.startDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                {` at ${event.time || 'TBA'}`}
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t("admin.eventReview.fields.venue")}</h3>
              <p className="text-lg font-semibold text-zinc-900">{event.venue}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t("admin.eventReview.fields.submittedAt")}</h3>
              <p className="text-lg font-semibold text-zinc-900">{new Date(event.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-2 pt-8 border-t border-zinc-100">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t("admin.eventReview.fields.description")}</h3>
            <p className="text-zinc-600 leading-relaxed overflow-wrap-anywhere whitespace-pre-wrap">
              {typeof event.description === 'object' ? (event.description.en || Object.values(event.description)[0]) : event.description}
            </p>
          </div>

          {event.status !== 'pending' && (
            <div className="pt-8 border-t border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  event.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                  event.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                  'bg-amber-100 text-amber-700' // Default for pending
                }`}>
                  {t("admin.eventReview.fields.status")}: {t(`organizer.myEvents.tabs.${event.status}`)}
                </span>
                {event.status === 'rejected' && event.rejectionReason && (
                   <span className="text-sm text-zinc-500 italic">“{event.rejectionReason}”</span>
                )}
              </div>
            </div>
          )}
        </div>

        {event.status === 'pending' && (
          <div className="bg-zinc-50 px-8 py-6 border-t border-zinc-100 flex justify-end gap-4 sticky bottom-0">
            <button 
              onClick={handleReject} 
              className="px-6 py-2 bg-rose-50 text-rose-600 rounded-lg text-sm font-bold hover:bg-rose-100 transition-colors"
            >
              {t("admin.eventReview.reject")}
            </button>
            <button 
              onClick={handleApprove} 
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors shadow-md"
            >
              {t("admin.eventReview.approve")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventDetail;
