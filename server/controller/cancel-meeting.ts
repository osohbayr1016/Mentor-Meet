import { Request, Response } from "express";
import mongoose from "mongoose";
import { Booking, BookingStatus } from "../model/booking-model";

/**
 * @route   PATCH /api/bookings/:id/cancel
 * @desc    Cancel a mentor-student meeting
 * @access  Protected (optional – depending on your middleware)
 */
export const cancelMeeting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("📥 Received meeting ID to cancel:", id);

    // 🔍 1. Шалгах: ID формат зөв эсэх
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Meeting ID буруу байна",
      });
    }

    // 🔍 2. Booking олдох эсэх
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking олдсонгүй",
      });
    }

    // 🔁 3. Статус өөрчлөх
    booking.status = BookingStatus.CANCELLED;

    // 💾 4. Хадгалах
    await booking.save();

    // ✅ 5. Хариу буцаах
    return res.status(200).json({
      success: true,
      message: "Уулзалт амжилттай цуцлагдлаа",
    });
  } catch (error) {
    console.error("🔥 cancelMeeting error:", error);
    return res.status(500).json({
      success: false,
      message: "Сервер дээр алдаа гарлаа",
      error,
    });
  }
};
