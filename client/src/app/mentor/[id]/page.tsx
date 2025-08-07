"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";

import MentorProfile from "@/app/_components/MentorProfile";
import MentorDetails from "@/app/_components/MentorDetails";
import BookingModal from "@/components/BookingModal";

interface Mentor {
  id: string;
  firstName: string;
  lastName: string;
  profession: string;
  experience: {
    work: string;
    position: string;
    careerDuration: string;
  };
  education: {
    schoolName: string;
    major: string;
    endedYear: string;
  };
  bio: string;
  rating: number;
  hourlyPrice: number;
  image: string;
  category?: {
    categoryId: string;
    price: number;
  };
}

interface CalendarSlot {
  _id: string;
  date: string;
  times: string[];
}

const MentorDetailPage = () => {
  const params = useParams();
  const mentorId = params.id as string;

  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [calendar, setCalendar] = useState<CalendarSlot[]>([]);
  const [selectedTimesByDate, setSelectedTimesByDate] = useState<Record<string, string[]>>({});
  const [selectedBookingDate, setSelectedBookingDate] = useState<string>("");
  const [selectedBookingTime, setSelectedBookingTime] = useState<string>("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await axios.get<Mentor>(`http://localhost:8000/mentor/${mentorId}`);
        setMentor(response.data);
      } catch (error) {
        console.error("Mentor fetch алдаа:", error);
      }
    };

    if (mentorId) fetchMentor();
  }, [mentorId]);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const response = await axios.get<{ availabilities: CalendarSlot[] }>(
          `http://localhost:8000/calendar/${mentorId}`
        );
        setCalendar(response.data.availabilities);
      } catch (error) {
        console.error("Calendar fetch алдаа:", error);
      }
    };

    if (mentorId) fetchCalendar();
  }, [mentorId]);

  const handleTimeSelect = (date: string, time: string) => {
    const current = selectedTimesByDate[date] || [];
    const updated = current.includes(time)
      ? current.filter((t) => t !== time)
      : [...current, time];

    setSelectedTimesByDate((prev) => ({
      ...prev,
      [date]: updated,
    }));

    setSelectedBookingDate(date);
    setSelectedBookingTime(time);

    const calendarId = findCalendarId(date, time);
    if (calendarId) {
      localStorage.setItem("calendarId", calendarId);
    }
  };

  const findCalendarId = (date: string, time: string): string | null => {
    const slot = calendar.find((s) => s.date === date && s.times.includes(time));
    return slot ? slot._id : null;
  };

  useEffect(() => {
    if (mentor) {
      const totalHours = getTotalSelectedHours();
      setTotalPrice(totalHours * mentor.hourlyPrice);
    }
  }, [selectedTimesByDate, mentor]);

  const getTotalSelectedHours = () =>
    Object.values(selectedTimesByDate).flat().length;

  const getAllSelectedTimes = () =>
    Object.values(selectedTimesByDate).flat();

  const handleMultiBooking = async () => {
    const token = localStorage.getItem("studentToken");
    const studentUser = JSON.parse(localStorage.getItem("studentUser") || "{}");
    const studentId = studentUser.id;
    const times = getAllSelectedTimes();

    if (!token || !mentorId || !studentId || times.length === 0 || !selectedBookingDate) {
      alert("Мэдээлэл дутуу байна.");
      return;
    }

    try {
      const payload = {
        mentorId,
        studentId,
        date: selectedBookingDate,
        times,
        price: totalPrice,
        category: mentor?.category?.categoryId || "Тодорхойгүй",
      };

      const response = await axios.post("http://localhost:8000/bookings", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Booking success:", response.data);
      setShowBookingModal(true);
    } catch (error: any) {
      console.error("Booking error:", error.response?.data || error.message);
      alert("Захиалга амжилтгүй боллоо.");
    }
  };

  if (!mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
        <span className="ml-2">Уншиж байна...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <div className="absolute inset-0 bg-black/30 -z-10" />
      <Image
        src="https://images.unsplash.com/photo-1706074740295-d7a79c079562?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="bg"
        fill
        className="absolute inset-0 object-cover -z-20"
      />

      <div className="relative z-10 w-full h-full flex justify-center items-center p-6">
        <div className="w-full max-w-5xl h-[70vh] flex items-center justify-center">
          <div className="w-full h-full border border-gray-400/50 backdrop-blur-md bg-black/20 flex rounded-[20px] overflow-hidden">
            <MentorProfile
              mentor={mentor}
              totalHours={getTotalSelectedHours()}
              onBook={handleMultiBooking}
            />
            <MentorDetails
              mentor={mentor}
              calendar={calendar}
              selectedTimesByDate={selectedTimesByDate}
              onTimeSelect={handleTimeSelect}
              totalHours={getTotalSelectedHours()}
              totalPrice={totalPrice}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-2 left-6 text-xs text-white/60 z-30">
        <div>Copyright © 2025 Mentor Meet</div>
      </div>

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        selectedDate={selectedBookingDate}
        selectedTime={selectedBookingTime}
        totalPrice={totalPrice}
        selectedTimes={getAllSelectedTimes()}
        selectedTimesByDate={selectedTimesByDate}
        MentorId={mentorId}
      />
    </div>
  );
};

export default MentorDetailPage;
