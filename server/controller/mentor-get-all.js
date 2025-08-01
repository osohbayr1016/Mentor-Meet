"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMentors = void 0;
const mentor_model_1 = require("../model/mentor-model");
const category_model_1 = require("../model/category-model");
const getAllMentors = async (req, res) => {
    try {
        console.log("Raw URL:", req.url);
        console.log("Raw query string:", req.query);
        const { category, subCategory } = req.query;
        console.log("Raw query params:", req.query);
        console.log("Received query params:", { category, subCategory });
        console.log("Category type:", typeof category);
        console.log("Category length:", category === null || category === void 0 ? void 0 : category.toString().length);
        // Build filter object
        const filter = {};
        // If category is provided, we need to find mentors by category name
        if (category) {
            console.log("Looking for category:", category);
            console.log("Category string:", JSON.stringify(category));
            // First, find the category by name
            const categoryDoc = await category_model_1.CategoryModel.findOne({
                categoryName: category,
            });
            console.log("Found category doc:", categoryDoc);
            if (categoryDoc) {
                // Filter mentors by this category ID
                filter["category.categoryId"] = categoryDoc._id;
                console.log("Filtering by category ID:", categoryDoc._id);
            }
            else {
                console.log("Category not found, returning empty array");
                // If category not found, return empty array
                return res.status(200).json([]);
            }
        }
        console.log("Final filter:", filter);
        const mentors = await mentor_model_1.MentorModel.find(filter)
            .populate("category.categoryId")
            .select("firstName lastName profession experience education bio rating image category subcategory");
        console.log("Found mentors:", mentors.length);
        // Transform the data to match the frontend interface and filter out incomplete profiles
        const transformedMentors = mentors
            .filter((mentor) => {
            var _a;
            return mentor.firstName &&
                mentor.lastName &&
                mentor.profession &&
                ((_a = mentor.experience) === null || _a === void 0 ? void 0 : _a.careerDuration);
        })
            .map((mentor) => {
            var _a, _b, _c, _d;
            return ({
                id: mentor._id,
                name: `${mentor.firstName} ${mentor.lastName}`,
                profession: mentor.profession || "Тодорхойгүй",
                experience: `Туршлага: ${((_a = mentor.experience) === null || _a === void 0 ? void 0 : _a.careerDuration) || "Тодорхойгүй"}`,
                rating: mentor.rating || 0,
                image: mentor.image || "/image709.png",
                category: ((_c = (_b = mentor.category) === null || _b === void 0 ? void 0 : _b.categoryId) === null || _c === void 0 ? void 0 : _c.categoryName) || "Тодорхойгүй",
                subCategory: mentor.subcategory || "Тодорхойгүй",
                hourlyPrice: ((_d = mentor.category) === null || _d === void 0 ? void 0 : _d.price) || 0,
            });
        });
        console.log("Transformed mentors:", transformedMentors.length);
        // Filter by subcategory if provided
        let filteredMentors = transformedMentors;
        if (subCategory) {
            filteredMentors = transformedMentors.filter((mentor) => mentor.subCategory === subCategory);
        }
        console.log("Final filtered mentors:", filteredMentors.length);
        res.status(200).json(filteredMentors);
    }
    catch (error) {
        console.error("Error getting all mentors:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getAllMentors = getAllMentors;
