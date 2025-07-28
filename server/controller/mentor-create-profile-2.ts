import { Request,Response } from "express";
import { MentorModel } from "../model/mentor-model";

export const MentorCreateProfileStep2 = async (req: Request, res: Response): Promise<any> => {
  const { mentorId } = res.locals;
  const { bio, description, socialLinks, specialization, achievements } = req.body;

  try {
    const parsedSocialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
    const updatedMentor = await MentorModel.findByIdAndUpdate(
      { _id: mentorId },
      {
        bio,
        description,
        socialLinks: parsedSocialLinks,
        specialization,
        achievements,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedMentor) {
      return res.status(404).json({ message: "Ментор олдсонгүй." });
    }

    return res.status(200).send({ message: "Алхам 2 амжилттай хадгалагдлаа.", mentor: updatedMentor });
  } catch (err: any) {
    console.error("Алдаа:", err.message || err);
    return res.status(500).json({ message: "Сервер дээр алдаа гарлаа." });
  }
};

