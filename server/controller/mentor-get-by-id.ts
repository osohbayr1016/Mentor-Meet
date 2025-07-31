import { Request, Response } from "express";
import { MentorModel } from "../model/mentor-model";

export const getMentorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Mentor ID is required" });
    }

    const mentor = await MentorModel.findById(id).populate(
      "category.categoryId"
    );

    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    // Return mentor data with price information
    const mentorData = {
      id: mentor._id,
      firstName: mentor.firstName,
      lastName: mentor.lastName,
      profession: mentor.profession,
      bio: mentor.bio,
      image: mentor.image,
      rating: mentor.rating,
      experience: mentor.experience,
      education: mentor.education,
      category: mentor.category,
      // Calculate hourly price
      hourlyPrice: mentor.category?.price || 0,
    };

    res.status(200).json(mentorData);
  } catch (error) {
    console.error("Error getting mentor by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
