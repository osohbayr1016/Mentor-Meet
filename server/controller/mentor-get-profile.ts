import { Request, Response } from "express";
import { MentorModel } from "../model/mentor-model";

export const MentorGetProfile = async (req: Request, res: Response) => {
  try {
    const profile = await MentorModel.find({});
    if (!profile) {
      res.status(401).send({ message: "Mentor profile is not found" });
      return;
    }

    res.status(200).send({ profile });
  } catch (err: any) {
    console.error("Get profile error:", err.message);
    return res.status(500).json({ message: "Сервер дээр алдаа гарлаа." });
  }
};
