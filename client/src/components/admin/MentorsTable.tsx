"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  MoreVertical,
  Star,
  DollarSign,
  Calendar,
} from "lucide-react";
import { MentorProfile } from "../../types/admin";
import Image from "next/image";

interface MentorsTableProps {
  mentors: MentorProfile[];
}

export default function MentorsTable({ mentors }: MentorsTableProps) {
  const [selectedMentors, setSelectedMentors] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleMentorAction = async (
    mentorId: string,
    action: "approve" | "reject"
  ) => {
    setActionLoading(mentorId);

    try {
      // In production, call your API
      // const response = await fetch(`/api/admin/mentors/${mentorId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ action })
      // });

      // if (response.ok) {
      //   // Refresh the page or update state
      //   window.location.reload();
      // }

      // Mock delay for demo
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`${action} mentor ${mentorId}`);

      // In a real app, you'd update the mentor's status here
      alert(
        `Багш ${action === "approve" ? "зөвшөөрөгдлөө" : "татгалзагдлаа"}!`
      );
    } catch (error) {
      console.error(`Failed to ${action} mentor:`, error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (approved: boolean, isActive: boolean) => {
    if (!isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Идэвхгүй
        </span>
      );
    }

    if (approved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Зөвшөөрөгдсөн
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Хүлээгдэж буй
        </span>
      );
    }
  };

  const formatCurrency = (amount: number) => {
    // Use a consistent format that works the same on server and client
    const formattedNumber = amount.toLocaleString("en-US");
    return `₮ ${formattedNumber}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Багш нарын жагсаалт ({mentors.length})
          </h3>
          {selectedMentors.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedMentors.length} сонгогдсон
              </span>
              <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
                Бүгдийг зөвшөөрөх
              </button>
              <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700">
                Бүгдийг татгалзах
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedMentors(mentors.map((m) => m._id));
                    } else {
                      setSelectedMentors([]);
                    }
                  }}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Багш
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ангилал
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Төлөв
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статистик
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Орлого
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Үйлдэл
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mentors.map((mentor) => (
              <tr key={mentor._id} className="hover:bg-gray-50">
                {/* Checkbox */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedMentors.includes(mentor._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMentors([...selectedMentors, mentor._id]);
                      } else {
                        setSelectedMentors(
                          selectedMentors.filter((id) => id !== mentor._id)
                        );
                      }
                    }}
                  />
                </td>

                {/* Mentor Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {mentor.profileImage ? (
                        <Image
                          src={mentor.profileImage}
                          alt={mentor.user?.name || "Mentor"}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {mentor.user?.name?.charAt(0) || "M"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {mentor.user?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {mentor.user?.email}
                      </div>
                      <div className="text-xs text-gray-400">
                        {mentor.experience}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{mentor.category}</div>
                  {mentor.subcategory && (
                    <div className="text-sm text-gray-500">
                      {mentor.subcategory}
                    </div>
                  )}
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(
                    mentor.approved,
                    mentor.user?.isActive || false
                  )}
                </td>

                {/* Stats */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{mentor.totalBookings}</span>
                    </div>
                    {mentor.rating > 0 && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{mentor.rating}</span>
                      </div>
                    )}
                  </div>
                </td>

                {/* Earnings */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                    <span>{formatCurrency(mentor.totalEarnings)}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatCurrency(mentor.hourlyRate)}/цаг
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {!mentor.approved && (
                      <>
                        <button
                          onClick={() =>
                            handleMentorAction(mentor._id, "approve")
                          }
                          disabled={actionLoading === mentor._id}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          title="Зөвшөөрөх"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleMentorAction(mentor._id, "reject")
                          }
                          disabled={actionLoading === mentor._id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Татгалзах"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      title="Дэлгэрэнгүй"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="text-gray-600 hover:text-gray-900"
                      title="Засах"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="text-gray-600 hover:text-gray-900"
                      title="Цэс"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {mentors.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <p className="text-lg font-medium">Багш олдсонгүй</p>
            <p className="text-sm mt-1">Шүүлтийн нөхцөлийг өөрчилж үзнэ үү.</p>
          </div>
        </div>
      )}
    </div>
  );
}
