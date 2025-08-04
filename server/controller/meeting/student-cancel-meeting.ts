import { Request, Response } from "express";
import { MeetingModel } from "../../model/meeting.model";
import { ReplacementRequest } from "../../model/replacement-request.model";
import mongoose from "mongoose";

export const studentCancelMeeting = async (req: Request, res: Response) => {
  const { meetingId } = req.body;
  const studentId = (req as any).userId; 

  try {
    const meeting = await MeetingModel.findById(meetingId);

    if (!meeting) return res.status(404).json({ message: "Уулзалт олдсонгүй" });

    if (!meeting.studentId.equals(new mongoose.Types.ObjectId(studentId))) {
      return res.status(403).json({ message: "Та зөвшөөрөлгүй байна" });
    }

    const timeDiffInHours =
      (meeting.scheduledAt.getTime() - Date.now()) / (1000 * 60 * 60);

    if (timeDiffInHours < 4) {
      return res.status(400).json({ message: "Цуцлах боломжгүй. 4 цаг хүрэхгүй байна." });
    }

    const existing = await ReplacementRequest.findOne({
      meetingId,
      studentId,
    });

    if (existing) {
      return res.status(400).json({ message: "Та аль хэдийн цуцлалтын хүсэлт илгээсэн байна." });
    }

    await ReplacementRequest.create({
      meetingId,
      studentId,
      mentorId: meeting.mentorId,
      scheduledAt: meeting.scheduledAt,
      status: "WAITING",
    });

    return res.status(200).json({
      message: "Цуцлалтын хүсэлт илгээгдлээ. Орлуулагч оюутан орвол бүрэн цуцлагдана.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Дотоод серверийн алдаа" });
  }
};
