import { Request, Response } from "express";
import { ReplacementRequest } from "../../model/replacement-request.model";

export const getAvailableReplacements = async (req: Request, res: Response) => {
  try {
    const now = new Date();

    const replacements = await ReplacementRequest.find({
      status: "WAITING", 
      scheduledAt: { $gt: now }, 
    }).populate("mentorId") 
      .populate("meetingId");

    res.status(200).json({ replacements });
  } catch (error) {
    console.error("Error fetching available replacements:", error);
    res.status(500).json({ message: "Дотоод серверийн алдаа" });
  }
};
