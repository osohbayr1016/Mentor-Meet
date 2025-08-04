import { Request, Response } from "express";
import { ReplacementRequest, ReplacementStatus } from "../../model/replacement-request.model";
import { MeetingModel } from "../../model/meeting.model";
import mongoose from "mongoose";

export const replaceStudentForMeeting = async (req: Request, res: Response) => {
  const { replacementRequestId } = req.body;
  const newStudentId = req.userId; 

  try {
    const request = await ReplacementRequest.findById(replacementRequestId);

    if (!request || request.status !== "WAITING") {
      return res.status(400).json({ message: "Хүчинтэй хүсэлт олдсонгүй" });
    }

    const meeting = await MeetingModel.findById(request.meetingId);

    if (!meeting) {
      return res.status(404).json({ message: "Уулзалт олдсонгүй" });
    }


    meeting.studentId = new mongoose.Types.ObjectId(newStudentId);
    await meeting.save();


    request.status = ReplacementStatus.REPLACED;
    await request.save();

    return res.status(200).json({ message: "Орлогч амжилттай бүртгэгдлээ", meeting });
  } catch (err) {
    console.error("Орлогч солих алдаа:", err);
    return res.status(500).json({ message: "Серверийн алдаа" });
  }
};
