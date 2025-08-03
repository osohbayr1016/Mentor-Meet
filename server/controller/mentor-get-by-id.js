"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMentorById = void 0;
const mentor_model_1 = require("../model/mentor-model");
const getMentorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Mentor ID is required" });
        }
        const mentor = yield mentor_model_1.MentorModel.findById(id).populate("category.categoryId");
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
});
exports.getMentorById = getMentorById;
