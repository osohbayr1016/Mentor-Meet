import { Request, Response } from "express";
import { MentorModel } from "../model/mentor-model";

export const MentorGetProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
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

    // Map the mentor data to include mentorId
    const mentorData = {
      id: mentor._id.toString(),
      mentorId: mentor._id.toString(),
      email: mentor.email,
      isAdmin: mentor.role === "ADMIN",
      firstName: mentor.firstName || "",
      lastName: mentor.lastName || "",
      nickName: mentor.nickName,
      category: mentor.category
        ? {
            categoryId: mentor.category.categoryId
              ? mentor.category.categoryId.toString()
              : null,
            price: mentor.category.price || 0,
          }
        : null,
      experience: {
        work: mentor.experience?.work || "",
        position: mentor.experience?.position || "",
        careerDuration: mentor.experience?.careerDuration || "",
      },
      education: {
        schoolName: mentor.education?.schoolName || "",
        major: mentor.education?.major || "",
        endedYear: mentor.education?.endedYear || "",
      },
      profession: mentor.profession || "",
      bio: mentor.bio || "",
      image: mentor.image || "",
      rating: mentor.rating || 0,
    };

    console.log("Mentor data being sent:", mentorData);

    return res.status(200).send({ mentor: mentorData });
  } catch (err: any) {
    console.error("Get profile error:", err.message);
    console.error("Error details:", err);
    console.error("Mentor ID:", res.locals.mentorId);
    return res.status(500).json({ message: "Сервер дээр алдаа гарлаа." });
  }
};
