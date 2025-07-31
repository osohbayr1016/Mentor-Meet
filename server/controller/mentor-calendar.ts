import { Request, Response } from "express";
import { MentorCalendarModel } from "../model/calendar-model";

export const UpdateMentorAvailability = async (req: Request, res: Response) => {
  const { mentorId } = res.locals;
  const { availabilities } = req.body;

  try {
    const existing = await MentorCalendarModel.findOne({ mentorId });
    console.log(mentorId);

    if (existing) {
      existing.availabilities = availabilities;

      await existing.save();
    } else {
      await MentorCalendarModel.create({ mentorId, availabilities });
    }

    return res.status(200).json({ message: "Амжилттай хадгалагдлаа" });
  } catch (err) {
    console.error("Calendar save error:", err);
    return res.status(500).json({ message: "Серверийн алдаа" });
  }
};
