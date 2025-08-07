import { Request, Response } from "express";
import mongoose from "mongoose";
import { Booking } from "../model/booking-model";

// 🟡 Статус хөрвүүлэлт
const mapStatus = (status: string): "scheduled" | "cancelled" | "completed" => {
  switch (status) {
    case "CONFIRMED":
      return "scheduled";
    case "CANCELLED":
      return "cancelled";
    case "COMPLETED":
      return "completed";
    default:
      return "scheduled";
  }
};

export const getMentorBookings = async (req: Request, res: Response) => {
  try {
    const mentorId = req.params.mentorId;
    console.log("📥 Incoming mentorId:", mentorId);

    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).json({
        success: false,
        message: "mentorId буруу байна",
      });
    }

    const bookings = await Booking.find({
      mentorId: new mongoose.Types.ObjectId(mentorId),
    })
      .populate({
        path: "studentId",
        select: "email",
        model: "Student",
      })
      .select("_id date times studentId status")
      .lean();

    console.log("🎯 Raw bookings ===>", bookings);

    const mapped = bookings.map((booking, index) => {
      const student = booking.studentId as { email?: string } | mongoose.Types.ObjectId;

      const email =
        typeof student === "object" && student !== null && "email" in student
          ? student.email
          : "unknown@example.com";

      const id = booking._id?.toString?.() || "";
      const date = booking.date
        ? new Date(booking.date).toISOString().split("T")[0]
        : "";

      const time =
        Array.isArray(booking.times) && booking.times.length > 0
          ? booking.times[0]
          : "Цаг байхгүй";

      return {
        id,
        date,
        time,
        studentEmail: email,
        status: mapStatus(booking.status || "PENDING"),
      };
    });

    return res.status(200).json({
      success: true,
      message: "Уулзалтууд амжилттай татагдлаа",
      data: mapped, // 🟩 Хөрвүүлсэн array буцаана
    });
  } catch (error) {
    console.error("🔥 getMentorBookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Уулзалт татаж чадсангүй",
    });
  }
};
