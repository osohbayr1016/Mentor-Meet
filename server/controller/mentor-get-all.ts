import { Request, Response } from "express";
import { MentorModel } from "../model/mentor-model";

export const getAllMentors = async (req: Request, res: Response) => {
  try {
    const { category, subCategory } = req.query;

    // Build filter object
    const filter: any = {};

    if (category) {
      // For now, we'll get all mentors since category filtering needs proper category mapping
      // TODO: Implement proper category filtering based on category names
    }

    const mentors = await MentorModel.find(filter)
      .populate("category.categoryId")
      .select(
        "firstName lastName profession experience education bio rating image category"
      );

    // Transform the data to match the frontend interface and filter out incomplete profiles
    const transformedMentors = mentors
      .filter((mentor) => 
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
        subCategory: "Тодорхойгүй", // TODO: Add subcategory support
        hourlyPrice: mentor.category?.price || 0,
      }));

    // Filter by category name if provided
    let filteredMentors = transformedMentors;
    if (category) {
      filteredMentors = transformedMentors.filter(
        (mentor) => mentor.category === category
      );
    }

    res.status(200).json(filteredMentors);
  } catch (error) {
    console.error("Error getting all mentors:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
