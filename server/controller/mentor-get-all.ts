import { Request, Response } from "express";
import { MentorModel } from "../model/mentor-model";
import { CategoryModel } from "../model/category-model";

export const getAllMentors = async (req: Request, res: Response) => {
  try {
    console.log("Raw URL:", req.url);
    console.log("Raw query string:", req.query);

    const { category, subCategory } = req.query;

    console.log("Raw query params:", req.query);
    console.log("Received query params:", { category, subCategory });
    console.log("Category type:", typeof category);
    console.log("Category length:", category?.toString().length);

    // Build filter object
    const filter: any = {};

    // If category is provided, we need to find mentors by category name
    if (category) {
      console.log("Looking for category:", category);
      console.log("Category string:", JSON.stringify(category));

      // First, find the category by name
      const categoryDoc = await CategoryModel.findOne({
        categoryName: category,
      });

      console.log("Found category doc:", categoryDoc);

      if (categoryDoc) {
        // Filter mentors by this category ID
        filter["category.categoryId"] = categoryDoc._id;
        console.log("Filtering by category ID:", categoryDoc._id);
      } else {
        console.log("Category not found, returning empty array");
        // If category not found, return empty array
        return res.status(200).json([]);
      }
    }

    console.log("Final filter:", filter);

    const mentors = await MentorModel.find(filter)
      .populate("category.categoryId")
      .select(
        "firstName lastName profession experience education bio rating image category subcategory"
      );

    console.log("Found mentors:", mentors.length);

    // Transform the data to match the frontend interface and filter out incomplete profiles
    const transformedMentors = mentors
      .filter(
        (mentor: any) =>
          mentor.firstName &&
          mentor.lastName &&
          mentor.profession &&
          mentor.experience?.careerDuration
      )
      .map((mentor: any) => ({
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

    console.log("Transformed mentors:", transformedMentors.length);

    // Filter by subcategory if provided
    let filteredMentors = transformedMentors;
    if (subCategory) {
      filteredMentors = transformedMentors.filter(
        (mentor: any) => mentor.subCategory === subCategory
      );
    }

    console.log("Final filtered mentors:", filteredMentors.length);

    res.status(200).json(filteredMentors);
  } catch (error) {
    console.error("Error getting all mentors:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
