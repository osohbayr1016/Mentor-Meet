"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  FileText,
  HeadphonesIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface AdminSidebarProps {
  className?: string;
}

export default function AdminSidebar({ className = "" }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navigation = [
    {
      name: "Үндсэн самбар",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Хэрэглэгчид",
      icon: Users,
      children: [
        { name: "Багш нар", href: "/admin/mentors" },
        { name: "Суралцагч нар", href: "/admin/students" },
        { name: "Зөвшөөрөл", href: "/admin/approvals" },
      ],
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
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      name: "Контент",
      href: "/admin/content",
      icon: FileText,
    },
    {
      name: "Дэмжлэг",
      href: "/admin/support",
      icon: HeadphonesIcon,
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
      className={`bg-white shadow-lg transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MM</span>
            </div>
            <span className="font-bold text-gray-900">Admin Panel</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item, index) => (
            <li key={index}>
              {item.children ? (
                <div>
                  <div
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 font-medium ${
                      collapsed ? "justify-center" : ""
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </div>
                  {!collapsed && (
                    <ul className="ml-8 mt-2 space-y-1">
                      {item.children.map((child, childIndex) => (
                        <li key={childIndex}>
                          <Link
                            href={child.href}
                            className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                              isActive(child.href)
                                ? "bg-blue-100 text-blue-700 font-medium"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    collapsed ? "justify-center" : ""
                  } ${
                    isActive(item.href)
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <button
          className={`flex items-center gap-3 px-3 py-2 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Гарах</span>}
        </button>
      </div>
    </div>
  );
}
