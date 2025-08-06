import { Request, Response } from "express";
import { Booking } from "../model/booking-model";
import { StudentModel } from "../model/student-model";
import { MentorModel } from "../model/mentor-model";

export const getBooking = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ message: "Missing studentId or mentorId" });
    }

    const meeting = await Booking.find({ studentId });

    res.status(200).send({ meeting, message: "success" });
  } catch (error) {
    console.error("Error search meetings:", error);
    return res.status(500).send({ message: "server error" });
  }
};
