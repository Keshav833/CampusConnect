import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const AdminOrganizers = () => {
  const { t } = useTranslation();
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/organizers`, config);
        setOrganizers(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching organizers:', error);
        setLoading(false);
      }
    };

    fetchOrganizers();
  }, []);

  if (loading) return <div className="p-8 text-center text-zinc-500 font-medium">{t("common.loading")}</div>;

  return (
    <div className="space-y-6">

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">{t("admin.organizers.table.name")}</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">{t("admin.organizers.table.organization")}</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">{t("admin.organizers.table.email")}</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">{t("admin.organizers.table.totalEvents")}</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-emerald-600">{t("admin.organizers.table.approved")}</th>
                <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-rose-600">{t("admin.organizers.table.rejected")}</th>
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
                  <td colSpan="6" className="px-6 py-10 text-center text-zinc-500 text-sm italic font-medium">
                    {t("admin.organizers.empty")}
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
