import { Request, Response } from "express";
import { Booking } from "../model/booking-model";
import { BookingStatus } from "../model/booking-model";

export const getMentorBookedSlots = async (req: Request, res: Response) => {
  const { mentorId } = req.params;

  if (!mentorId) {
    return res.status(400).send({ message: "Mentor ID is required" });
  }

  try {
    // Find all active bookings for the mentor (not cancelled)
    const bookings = await Booking.find({
      mentorId,
      status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
    }).select("date times status");

    // Transform the data to get booked time slots
    const bookedSlots: Record<string, string[]> = {};

    bookings.forEach((booking) => {
      if (!booking.date) return;

      const dateStr = booking.date.toISOString().split("T")[0]; // YYYY-MM-DD format
      const day = dateStr.split("-")[2]; // Get day part

      if (!bookedSlots[day]) {
        bookedSlots[day] = [];
      }

      // Add all times for this date
      if (booking.times && Array.isArray(booking.times)) {
        // Remove duplicates and add to booked slots
        const uniqueTimes = [...new Set(booking.times)];
        bookedSlots[day] = [...new Set([...bookedSlots[day], ...uniqueTimes])];
      }
    });

    return res.status(200).json({
      success: true,
      message: "Booked slots retrieved successfully",
      data: bookedSlots,
    });
  } catch (error) {
    console.error("GET MENTOR BOOKED SLOTS ERROR:", error);
    return res.status(500).send({
      success: false,
      message: "Server error occurred",
      data: {},
    });
  }
};
