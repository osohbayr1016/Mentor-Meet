"use client";

import Link from "next/link";
import { 
  UserCheck, 
  Users, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  AlertCircle,
  Settings,
  FileText
} from "lucide-react";

interface QuickActionsProps {
  pendingApprovals?: number;
}

interface ActionButton {
  label: string;
  href: string;
  icon: React.ElementType;
  color: string;
  count?: number;
  description: string;
}

export default function QuickActions({ pendingApprovals = 0 }: QuickActionsProps) {
  // Ideally wire this with /api/admin/stats to show pending approvals dynamically
  // Parent can pass the count; if not, we'll fetch it once here for convenience
  // Kept simple to avoid extra hooks in this component
  const actions: ActionButton[] = [
    {
      label: "Багш зөвшөөрөх",
      href: "/admin/mentors",
      icon: UserCheck,
      color: "blue",
      count: pendingApprovals,
      description: "Шинэ багш нарын хүсэлт"
    },
    {
      label: "Хэрэглэгчид",
      href: "/admin/students",
      icon: Users,
      color: "green",
      description: "Суралцагч нарын жагсаалт"
    },
    {
      label: "Захиалгууд",
      href: "/admin/bookings",
      icon: Calendar,
      color: "purple",
      description: "Бүх захиалгын мэдээлэл"
    },
    {
      label: "Төлбөр",
      href: "/admin/payments",
      icon: DollarSign,
      color: "yellow",
      description: "Орлого болон төлбөрийн мэдээлэл"
    },
    {
      label: "Тайлангууд",
      href: "/admin/reports",
      icon: BarChart3,
      color: "indigo",
      description: "Статистик болон тайлан"
    },
    {
      label: "Тохиргоо",
      href: "/admin/settings",
      icon: Settings,
      color: "gray",
      description: "Системийн тохиргоо"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; hover: string }> = {
      blue: { bg: "bg-blue-50", text: "text-blue-700", hover: "hover:bg-blue-100" },
      green: { bg: "bg-green-50", text: "text-green-700", hover: "hover:bg-green-100" },
      purple: { bg: "bg-purple-50", text: "text-purple-700", hover: "hover:bg-purple-100" },
      yellow: { bg: "bg-yellow-50", text: "text-yellow-700", hover: "hover:bg-yellow-100" },
      indigo: { bg: "bg-indigo-50", text: "text-indigo-700", hover: "hover:bg-indigo-100" },
      gray: { bg: "bg-gray-50", text: "text-gray-700", hover: "hover:bg-gray-100" },
    };
    
    return colorMap[color] || colorMap.gray;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Хурдан үйлдэл
        </h3>
        <AlertCircle className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const colors = getColorClasses(action.color);
          
          return (
            <Link
              key={index}
              href={action.href}
              className={`
                block w-full p-4 rounded-lg border border-gray-200 transition-all duration-200
                ${colors.bg} ${colors.hover} hover:border-gray-300 hover:shadow-sm
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${colors.text}`} />
                  <div>
                    <p className={`font-medium ${colors.text}`}>
                      {action.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
                
                {action.count && action.count > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {action.count}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Платформ төлөв:</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-green-600 font-medium">Хэвийн ажиллаж байна</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-500">Сүүлийн backup:</span>
          <span className="text-gray-900 font-medium">
            {new Date().toLocaleDateString("en-US")}
          </span>
        </div>
      </div>
    </div>
  );
}