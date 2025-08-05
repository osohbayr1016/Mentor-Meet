import { Request, Response } from "express";
import { StudentBookingModel } from "../model/student-booking-model";

export const createBooking = async (req: Request, res: Response) => {
  const { mentorId } = req.body;
  const { studentId } = res.locals; 

  const { date, time } = req.body;

  try {
    const booking = await StudentBookingModel.create({
      studentId,
      mentorId,
      date,
      time,
    });

    return res.status(201).json({ message: "Захиалга амжилттай", booking });
  } catch (err) {
    console.error("Захиалга хийхэд алдаа:", err);
    return res.status(500).json({ message: "Серверийн алдаа" });
  }
};
