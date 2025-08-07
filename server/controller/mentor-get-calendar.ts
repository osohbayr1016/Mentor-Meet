import { Request, Response } from "express";
import { MentorCalendarModel } from "../model/calendar-model";
import mongoose from "mongoose";

export const getMentorCalendar = async (req: Request, res: Response) => {
  const { mentorId } = req.params;

  try {
    console.log("📥 Ирсэн mentorId:", mentorId);

    // ✅ String-ийг ObjectId болгон хөрвүүлнэ
    const objectId = new mongoose.Types.ObjectId(mentorId);

    const calendar = await MentorCalendarModel.findOne({ mentorId: objectId });

    if (!calendar) {
      console.log("❌ Calendar олдсонгүй");
      return res.status(404).json({ message: "Олдсонгүй" });
    }

    console.log("✅ Calendar амжилттай олдлоо:", calendar);
    return res.status(200).json(calendar);
  } catch (error) {
    console.error("❌ Get availability error:", error);
    return res.status(500).json({ message: "Серверийн алдаа" });
  }
};
