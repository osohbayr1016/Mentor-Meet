import { Request, Response } from "express";
import mongoose from "mongoose";
import { Booking, BookingStatus } from "../model/booking-model";

/**
 * @route   PATCH /bookings/:id/cancel
 * @desc    Cancel a mentor-student meeting
 * @access  Protected (optional)
 */
export const cancelMeeting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log("📥 Уулзалт цуцлах хүсэлт ирлээ");
    console.log("🆔 Цуцлах уулзалтын ID:", id);

    // ✅ ObjectId эсэхийг шалгана
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("❌ ObjectId буруу байна");
      return res.status(400).json({
        success: false,
        message: "Meeting ID буруу байна",
      });
    }

    // 🔍 ID-р booking хайна
    const booking = await Booking.findById(id);

    if (!booking) {
      console.log("❌ Booking олдсонгүй");
      return res.status(404).json({
        success: false,
        message: "Уулзалт олдсонгүй",
      });
    }

    console.log("✅ Booking олдлоо:", booking);

    // ⛔ Аль хэдийн CANCELLED бол дахин хадгалахгүй
    if (booking.status === BookingStatus.CANCELLED) {
      console.log("⚠️ Уулзалт аль хэдийн цуцлагдсан");
      return res.status(400).json({
        success: false,
        message: "Энэ уулзалт аль хэдийн цуцлагдсан байна",
      });
    }

    // 📦 Статусыг CANCELLED болгож хадгална
    booking.status = BookingStatus.CANCELLED;
    await booking.save();

    console.log("✅ Уулзалт цуцлагдлаа");

    return res.status(200).json({
      success: true,
      message: "Уулзалт амжилттай цуцлагдлаа",
    });
  } catch (error: any) {
    console.error("🔥 cancelMeeting алдаа:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Сервер дээр алдаа гарлаа",
      error: error.message || error,
    });
  }
};
