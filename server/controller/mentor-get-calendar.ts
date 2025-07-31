import { Request,Response } from "express";
import { MentorCalendarModel } from "../model/calendar-model";

export const getMentorCalendar = async (req: Request, res: Response) => {
    
  const { mentorId } = req.params;

  try {
    const calendar = await MentorCalendarModel.findOne({ mentorId });
    if (!calendar) {
      return res.status(404).json({ message: "Олдсонгүй" });
    }

    return res.status(200).json(calendar);
  } catch (error) {
    console.error("Get availability error:", error);
    return res.status(500).json({ message: "Серверийн алдаа" });
  }
};
