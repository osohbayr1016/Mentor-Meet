"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  Settings,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface SidebarItem {
  name: string;
  href: string;
  icon: any;
  badge?: number;
}

interface AdminSidebarProps {
  pendingApprovals?: number;
}

export default function AdminSidebar({
  pendingApprovals = 0,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navigation: SidebarItem[] = [
    {
      name: "Үндсэн самбар",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Багш нар",
      href: "/admin/mentors",
      icon: UserCheck,
      badge: pendingApprovals,
    },
    {
      name: "Суралцагч нар",
      href: "/admin/students",
      icon: Users,
    },
    {
      name: "Захиалгууд",
      href: "/admin/bookings",
      icon: Calendar,
    },
    {
      name: "Төлбөр",
      href: "/admin/payments",
      icon: DollarSign,
    },
    {
      name: "Тайлангууд",
      href: "/admin/reports",
      icon: BarChart3,
    },
    {
      name: "Тохиргоо",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div
      className={`
      fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg z-30
      transition-all duration-300 ease-in-out
      ${collapsed ? "w-16" : "w-64"}
    `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MM</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-500">Mentor Meet</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={index}
              href={item.href}
              className={`
                flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200
                ${collapsed ? "justify-center" : ""}
                ${
                  active
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="font-medium">{item.name}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div
          className={`
          text-xs text-gray-500 
          ${collapsed ? "text-center" : ""}
        `}
        >
          {!collapsed && (
            <>
              <p>© 2025 Mentor Meet</p>
              <p>Admin Panel v1.0</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
