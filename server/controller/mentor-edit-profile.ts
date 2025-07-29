import { Request, Response } from "express";
import { MentorModel } from "../model/mentor-model";
import mongoose from "mongoose";
import { CategoryModel } from "../model/category-model";

export const editMentorProfile = async (req: Request, res: Response) => {
  const { mentorId } = res.locals; 
  const {
    firstName,
    lastName,
    nickName,
    category,
    careerDuration,
    profession,
    image,
    bio,
    socialLinks,
    specialization,
    achievements,
    bankAccount,
  } = req.body;

  try {
    
    if (!firstName || !lastName ) {
      return res
        .status(400)
        .json({ message: "Заавал бөглөх талбарууд дутуу байна." });
    }

   
  
      const foundCategory = await CategoryModel.findById(category.categoryId);
      if (!foundCategory) {
        return res.status(404).json({ message: "Ангилал олдсонгүй." });
      }
  

    const updatedMentor = await MentorModel.findByIdAndUpdate(
      mentorId,
      {
        firstName,
        lastName,
        nickName: nickName || "",
        profession,
        bio: bio || "",
        image: image || "",
        category: "",
        experience: {
          careerDuration,
        },
        specialization,
        achievements,
        socialLinks: typeof socialLinks === "string" ? JSON.parse(socialLinks) : socialLinks,
        bankAccount: typeof bankAccount === "string" ? JSON.parse(bankAccount) : bankAccount,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedMentor) {
      return res.status(404).json({ message: "Ментор олдсонгүй." });
    }

    return res.status(200).json({
      message: "Профайл амжилттай шинэчлэгдлээ.",
      mentor: updatedMentor,
    });
  } catch (error: any) {
    console.error("Edit profile error:", error);
    return res
      .status(500)
      .json({ message: "Сервер дээр алдаа гарлаа. Дахин оролдоно уу." });
  }
};
