"use client";

import { useEffect, useState } from "react";
import { Clock, User, Calendar, DollarSign, AlertTriangle } from "lucide-react";

interface ActivityItem {
  id: string | number;
  type: string;
  message: string;
  user?: string;
  timestamp: string; // ISO string
  details?: string;
}

function getActivityIcon(type: string) {
  switch (type) {
    case "user_signup":
      return <User className="h-4 w-4 text-blue-500" />;
    case "mentor_application":
      return <User className="h-4 w-4 text-purple-500" />;
    case "booking":
    case "booking_created":
      return <Calendar className="h-4 w-4 text-green-500" />;
    case "payment":
    case "payment_completed":
      return <DollarSign className="h-4 w-4 text-yellow-500" />;
    case "booking_cancelled":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
}

function getActivityBgColor(type: string) {
  switch (type) {
    case "user_signup":
      return "bg-blue-50";
    case "mentor_application":
      return "bg-purple-50";
    case "booking":
    case "booking_created":
      return "bg-green-50";
    case "payment":
    case "payment_completed":
      return "bg-yellow-50";
    case "booking_cancelled":
      return "bg-red-50";
    default:
      return "bg-gray-50";
  }
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();
      if (json?.success && Array.isArray(json.data?.recentActivity)) {
        setActivities(json.data.recentActivity);
      } else {
        setActivities([]);
      }
    } catch (e) {
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
    const id = setInterval(fetchActivity, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Сүүлийн үйл ажиллагаа
        </h3>
        <button onClick={fetchActivity} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Бүгдийг харах
        </button>
      </div>

      <div className="space-y-4">
        {loading && (
          <div className="text-sm text-gray-500">Ачаалж байна...</div>
        )}
        {!loading && activities.length === 0 && (
          <div className="text-sm text-gray-500">Үйл ажиллагаа алга.</div>
        )}
        {activities.map((activity: ActivityItem) => (
          <div
            key={activity.id}
            className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Icon */}
            <div className={`
              p-2 rounded-full flex-shrink-0 
              ${getActivityBgColor(activity.type)}
            `}>
              {getActivityIcon(activity.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.user || ""}
                  </p>
                  {activity.details && (
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.details}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 ml-4">
                  <p className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(activity.timestamp).toLocaleString("mn-MN")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View all button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-center py-2 text-sm text-gray-600 hover:text-gray-900 font-medium">
          Цаашдын үйл ажиллагаа харах
        </button>
      </div>
    </div>
  );
}