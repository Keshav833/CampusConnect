import React from 'react';
import { Zap, Bell, CheckCircle, Heart } from 'lucide-react';
import { useTranslation } from "react-i18next";

export function RecentActivityWidget() {
  const { t } = useTranslation();
  const activities = [
    { id: 1, type: 'registration', text: t("widgets.recentActivity.items.registered"), time: t("widgets.recentActivity.items.time2h"), icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 2, type: 'notification', text: t("widgets.recentActivity.items.announcement"), time: t("widgets.recentActivity.items.time4h"), icon: Bell, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 3, type: 'interest', text: t("widgets.recentActivity.items.liked"), time: t("widgets.recentActivity.items.yesterday"), icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' },
  ];

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-900 text-sm mb-4">{t("widgets.recentActivity.title")}</h3>
      <div className="space-y-4">
        {activities.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className={`w-8 h-8 rounded-lg ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
              <item.icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-gray-800 line-clamp-2 leading-snug">
                {item.text}
              </p>
              <p className="text-[9px] font-medium text-gray-400 mt-0.5">
                {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
