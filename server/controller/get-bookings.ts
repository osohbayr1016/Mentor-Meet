import { Request, Response } from "express";
import { Booking } from "../model/booking-model";
import { StudentModel } from "../model/student-model";
import { MentorModel } from "../model/mentor-model";
import { StudentBookingModel } from "../model/student-booking-model";

export const getBooking = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const meeting = await Booking.findOne({ studentId });
    if (!meeting) {
      res.status(404).send({ message: "Олдсонгүй" });
    }
  } catch (error) {
    console.error("Error search meetings:", error);
    return res.status(500).send({ message: "server error" });
  }
};
