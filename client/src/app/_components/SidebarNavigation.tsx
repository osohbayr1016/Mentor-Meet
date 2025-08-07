"use client";

import { useRouter } from "next/navigation";
import { FC } from "react";

interface Props {
  activeTab: "profile" | "scheduled" | "history";
  setActiveTab: (tab: "profile" | "scheduled" | "history") => void;
  onLogout: () => void;
}

const SidebarNavigation: FC<Props> = ({ activeTab, setActiveTab, onLogout }) => {
  const router = useRouter();

  return (
    <div className="w-72 flex flex-col h-full justify-between">
      <div className="space-y-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
            activeTab === "profile"
              ? "bg-gray-600 text-white"
              : "text-gray-300 hover:bg-gray-700/50"
          }`}
        >
          Миний профайл
        </button>
        <button
          onClick={() => setActiveTab("scheduled")}
          className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
            activeTab === "scheduled"
              ? "bg-gray-600 text-white"
              : "text-gray-300 hover:bg-gray-700/50"
          }`}
        >
          Товлосон уулзалтууд
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
            activeTab === "history"
              ? "bg-gray-600 text-white"
              : "text-gray-300 hover:bg-gray-700/50"
          }`}
        >
          Уулзалтын түүх
        </button>
      </div>

      <div className="mt-auto space-y-2">
        <button
          onClick={() => router.push("/mentor-dashboard-calendar")}
          className="w-full text-left px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-gray-700/50 transition-colors flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Календар засах
        </button>
        <button
          onClick={onLogout}
          className="w-full text-left px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-gray-700/50 transition-colors flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Гарах
        </button>
      </div>
    </div>
  );
};

export default SidebarNavigation;
