"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMentorById = void 0;
const mentor_model_1 = require("../model/mentor-model");
const getMentorById = async (req, res) => {
    var _a;
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Mentor ID is required" });
        }
        const mentor = await mentor_model_1.MentorModel.findById(id).populate("category.categoryId");
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
            hourlyPrice: ((_a = mentor.category) === null || _a === void 0 ? void 0 : _a.price) || 0,
        };
        res.status(200).json(mentorData);
    }
    catch (error) {
        console.error("Error getting mentor by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getMentorById = getMentorById;
