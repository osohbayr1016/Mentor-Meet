import { Request, Response } from "express";
import { MentorModel } from "../model/mentor-model";

export const MentorGetProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    // Get mentorId from the token checker middleware
    const { mentorId } = res.locals;

    if (!mentorId) {
      return res.status(401).send({ message: "Mentor ID олдсонгүй" });
    }

    const mentor = await MentorModel.findById(mentorId);
    if (!mentor) {
      return res.status(404).send({ message: "Mentor profile is not found" });
    }

    return res.status(200).send({ mentor });
  } catch (err: any) {
    console.error("Get profile error:", err.message);
    return res.status(500).json({ message: "Сервер дээр алдаа гарлаа." });
  }
};
