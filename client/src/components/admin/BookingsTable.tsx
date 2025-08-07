"use client";

import { useState } from "react";
import {
  Eye,
  Edit,
  MoreVertical,
  ExternalLink,
  Calendar,
  Clock,
} from "lucide-react";
import { Booking } from "../../types/admin";

interface BookingsTableProps {
  bookings: Booking[];
}

export default function BookingsTable({ bookings }: BookingsTableProps) {
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);

  const getStatusBadge = (status: Booking["status"]) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    };

    const statusLabels = {
      pending: "Хүлээгдэж буй",
      confirmed: "Баталгаажсан",
      completed: "Дууссан",
      cancelled: "Цуцлагдсан",
      refunded: "Буцаагдсан",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
      >
        {statusLabels[status]}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: Booking["paymentStatus"]) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    };

    const statusLabels = {
      pending: "Хүлээгдэж буй",
      paid: "Төлөгдсөн",
      failed: "Амжилтгүй",
      refunded: "Буцаагдсан",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
      >
        {statusLabels[status]}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("mn-MN", {
      style: "currency",
      currency: "MNT",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("mn-MN");
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Захиалгын жагсаалт ({bookings.length})
          </h3>
          {selectedBookings.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedBookings.length} сонгогдсон
              </span>
              <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
                Баталгаажуулах
              </button>
              <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700">
                Цуцлах
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
                      setSelectedBookings(bookings.map((b) => b._id));
                    } else {
                      setSelectedBookings([]);
                    }
                  }}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Захиалга
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Суралцагч
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Багш
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Огноо/Цаг
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Төлөв
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Төлбөр
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Үйлдэл
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50">
                {/* Checkbox */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedBookings.includes(booking._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBookings([...selectedBookings, booking._id]);
                      } else {
                        setSelectedBookings(
                          selectedBookings.filter((id) => id !== booking._id)
                        );
                      }
                    }}
                  />
                </td>

                {/* Booking Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    #{booking._id.slice(-6).toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {booking.duration} минут
                  </div>
                </td>

                {/* Student */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.student?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {booking.student?.email}
                  </div>
                </td>

                {/* Mentor */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.mentor?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {booking.mentor?.email}
                  </div>
                </td>

                {/* Date/Time */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {formatDate(booking.date)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    {formatTime(booking.startTime)} -{" "}
                    {formatTime(booking.endTime)}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(booking.status)}
                </td>

                {/* Payment */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(booking.amount)}
                  </div>
                  <div className="mt-1">
                    {getPaymentStatusBadge(booking.paymentStatus)}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {booking.meetingLink && (
                      <a
                        href={booking.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-900"
                        title="Уулзалт нээх"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
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
      {bookings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <p className="text-lg font-medium">Захиалга олдсонгүй</p>
            <p className="text-sm mt-1">Шүүлтийн нөхцөлийг өөрчилж үзнэ үү.</p>
          </div>
        </div>
      )}
    </div>
  );
}
