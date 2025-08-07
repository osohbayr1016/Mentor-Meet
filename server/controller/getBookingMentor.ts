import { Request, Response } from "express";
import { Booking } from "../model/booking-model";

export const getBookingMentor = async (req: Request, res: Response) => {
  const { studentId } = req.params;

  if (!studentId) {
    return res.status(400).send({ message: "Student ID is required" });
  }

  try {
    // Find all bookings for the student
    const bookings = await Booking.find({ studentId })
      .populate({
        path: "mentorId",
        model: "Mentor",
        select: "firstName lastName image profession rating category",
      })
      .sort({ createdAt: -1 }); // Sort by newest first

    if (!bookings || bookings.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No bookings found for this student",
        data: [],
      });
    }

    // Transform the data to match the frontend requirements
    const bookingData = bookings.map((booking) => {
      const mentor = booking.mentorId as any;

      return {
        _id: booking._id,
        mentorId: booking.mentorId,
        mentorName: mentor
          ? `${mentor.firstName} ${mentor.lastName}`
          : "Unknown Mentor",
        mentorImage: mentor?.image || "",
        mentorProfession: mentor?.profession || "",
        mentorRating: mentor?.rating || 0,
        category: booking.category || "",
        price: booking.price,
        status: booking.status,
        meetingDate: booking.date,
        meetingTime: booking.times?.[0] || "",
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: bookingData,
    });
  } catch (error) {
    console.error("GET BOOKING MENTOR ERROR:", error);
    return res.status(500).send({ message: "Server error occurred" });
  }
};
