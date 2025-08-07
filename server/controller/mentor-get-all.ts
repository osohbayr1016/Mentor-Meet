import { Request, Response } from "express";
import { MentorModel } from "../model/mentor-model";
import { CategoryModel } from "../model/category-model";

export const getAllMentors = async (req: Request, res: Response) => {
  try {
    const { category, subCategory } = req.query;
    const filter: any = {};

    if (category) {
      const categoryDoc = await CategoryModel.findOne({
        categoryName: category,
      });

      if (categoryDoc) {
        filter["category.categoryId"] = categoryDoc._id;
      } else {
        return res.status(200).json([]);
      }
    }

    const mentors = await MentorModel.find(filter)
      .populate("category.categoryId")
      .select(
        "firstName lastName profession experience education bio rating image category subcategory"
      );

    const transformedMentors = mentors
      .filter(
        (mentor) =>
          mentor.firstName &&
          mentor.lastName &&
          mentor.profession &&
          mentor.experience?.careerDuration
      )
      .map((mentor) => ({
        id: mentor._id,
        name: `${mentor.firstName} ${mentor.lastName}`,
        profession: mentor.profession || "Тодорхойгүй",
        experience: `Туршлага: ${
          mentor.experience?.careerDuration || "Тодорхойгүй"
        }`,
        rating: mentor.rating || 0,
        image: mentor.image || "/image709.png",
        category:
          (mentor.category?.categoryId as any)?.categoryName || "Тодорхойгүй",
        subCategory: mentor.subcategory || "Тодорхойгүй",
        hourlyPrice: mentor.category?.price || 0,
      }));

    let filteredMentors = transformedMentors;
    if (subCategory) {
      filteredMentors = transformedMentors.filter(
        (mentor) => mentor.subCategory === subCategory
      );
    }

    res.status(200).json(filteredMentors);
  } catch (error) {
    console.error("Error getting all mentors:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
