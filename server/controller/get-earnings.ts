import { Request, Response } from "express";
import mongoose from "mongoose";
import { Booking } from "../model/booking-model"; 

const PRICE_PER_BOOKING = 10000;

export const getEarnings = async (req: Request, res: Response) => {
  try {
    const { mentorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).json({
        success: false,
        message: "mentorId буруу байна",
      });
    }

    const confirmedBookings = await Booking.find({
      mentorId: new mongoose.Types.ObjectId(mentorId),
      status: "CONFIRMED", // эсвэл "COMPLETED" болгоорой
    });

    const totalEarnings = confirmedBookings.length * PRICE_PER_BOOKING;

    return res.status(200).json({
      success: true,
      totalEarnings: totalEarnings, // 👉 frontend-д тааруулсан
      count: confirmedBookings.length,
    });
  } catch (error) {
    console.error("💥 getEarnings error:", error);
    return res.status(500).json({
      success: false,
      message: "Орлого татаж чадсангүй",
    });
  }
};
