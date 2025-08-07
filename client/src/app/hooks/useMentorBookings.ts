"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export type Meeting = {
  id: string;
  date: string;
  time: string;
  studentEmail: string;
  status: "scheduled" | "cancelled" | "completed";
};

type GetBookingsResponse = {
  success: boolean;
  message: string;
  data: Meeting[]; 
};

export const useMentorBookings = (mentorId: string | undefined) => {
  const [bookings, setBookings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mentorId) return;

    const fetchBookings = async () => {
      try {
        const res = await axios.get<GetBookingsResponse>(
          `http://localhost:8000/mentor-bookings/${mentorId}`
        );


        setBookings(res.data.data);
      } catch (err) {
        setError("Уулзалтуудыг дуудахад алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [mentorId]);

  return { bookings, loading, error };
};
