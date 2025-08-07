import { Request, Response } from "express";
import { Booking,  } from "../model/booking-model";


export const getBookingBell = async (req: Request, res: Response) => {
  const { mentorId } = req.params;

  try {
 
    const bookings = await Booking.find({ mentorId }).sort({ createdAt: -1 });

    console.log("Found bookings:", bookings.length);

    if (!bookings || bookings.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No bookings found for this student",
        data: []
      });
    }


    return res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
    });

  } catch (error) {
    console.error("GET BOOKING MENTOR ERROR:", error);
    return res.status(500).send({ message: "Server error occurred" });
  }
}; 