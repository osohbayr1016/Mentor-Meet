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
    subcategory,
    image,
    bio,
    socialLinks,
    specialization,
    achievements,
    bankAccount,
    hourlyPrice,
    experience,
    education,
  } = req.body;

  try {
    // Check if mentor exists first
    const existingMentor = await MentorModel.findById(mentorId);
    if (!existingMentor) {
      return res.status(404).json({ message: "Ментор олдсонгүй." });
    }

    if (!firstName || !lastName) {
      return res
        .status(400)
        .json({ message: "Заавал бөглөх талбарууд дутуу байна." });
    }

    // Only validate category if it's provided and has a valid categoryId
    if (category && category.categoryId && category.categoryId.trim() !== "") {
      const foundCategory = await CategoryModel.findById(category.categoryId);
      if (!foundCategory) {
        return res.status(404).json({ message: "Ангилал олдсонгүй." });
      }
    }

    // Prepare update data
    const updateData: any = {
      firstName,
      lastName,
      nickName: nickName || "",
      profession,
      bio: bio || "",
      updatedAt: new Date(),
    };

    // Handle category and price

    if (category && category.categoryId && category.categoryId.trim() !== "") {
      updateData.category = {
        categoryId: category.categoryId,
        price: hourlyPrice || category.price || 0,
      };
    } else if (hourlyPrice && hourlyPrice > 0) {
      // If no category but there's a price, create a category with just the price
      updateData.category = {
        categoryId: null,
        price: hourlyPrice,
      };
    }

    // Add optional fields if they exist
    if (subcategory) updateData.subcategory = subcategory;
    if (image) updateData.image = image;
    if (experience) updateData.experience = experience;
    if (education) updateData.education = education;
    if (specialization) updateData.specialization = specialization;
    if (achievements) updateData.achievements = achievements;
    if (socialLinks) {
      updateData.socialLinks =
        typeof socialLinks === "string" ? JSON.parse(socialLinks) : socialLinks;
    }
    if (bankAccount) {
      updateData.bankAccount =
        typeof bankAccount === "string" ? JSON.parse(bankAccount) : bankAccount;
    }

    const updatedMentor = await MentorModel.findByIdAndUpdate(
      mentorId,
      updateData,
      { new: true }
    );

    if (!updatedMentor) {
      return res.status(404).json({ message: "Ментор олдсонгүй." });
    }

    // Map the updated mentor data to match the frontend interface
    const mentorData = {
      id: updatedMentor._id.toString(),
      mentorId: updatedMentor._id.toString(),
      email: updatedMentor.email,
      isAdmin: updatedMentor.role === "ADMIN",
      firstName: updatedMentor.firstName || "",
      lastName: updatedMentor.lastName || "",
      nickName: updatedMentor.nickName,
      category: updatedMentor.category
        ? {
            categoryId: updatedMentor.category.categoryId
              ? updatedMentor.category.categoryId.toString()
              : null,
            price: updatedMentor.category.price || 0,
          }
        : null,
      experience: {
        work: updatedMentor.experience?.work || "",
        position: updatedMentor.experience?.position || "",
        careerDuration: updatedMentor.experience?.careerDuration || "",
      },
      education: {
        schoolName: updatedMentor.education?.schoolName || "",
        major: updatedMentor.education?.major || "",
        endedYear: updatedMentor.education?.endedYear || "",
      },
      profession: updatedMentor.profession || "",
      bio: updatedMentor.bio || "",
      image: updatedMentor.image || "",
      rating: updatedMentor.rating || 0,
    };

    return res.status(200).json({
      message: "Профайл амжилттай шинэчлэгдлээ.",
      mentor: mentorData,
    });
  } catch (error: any) {
    console.error("Edit profile error:", error);
    console.error("Request body:", req.body);
    console.error("Mentor ID:", mentorId);
    return res
      .status(500)
      .json({ message: "Сервер дээр алдаа гарлаа. Дахин оролдоно уу." });
  }
};
