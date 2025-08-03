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
exports.MentorGetProfile = void 0;
const mentor_model_1 = require("../model/mentor-model");
const MentorGetProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        // Get mentorId from the token checker middleware
        const { mentorId } = res.locals;
        if (!mentorId) {
            return res.status(401).send({ message: "Mentor ID олдсонгүй" });
        }
        const mentor = yield mentor_model_1.MentorModel.findById(mentorId);
        if (!mentor) {
            return res.status(404).send({ message: "Mentor profile is not found" });
        }
        // Map the mentor data to include mentorId
        const mentorData = {
            mentorId: mentor._id.toString(),
            email: mentor.email,
            isAdmin: mentor.role === "ADMIN",
            firstName: mentor.firstName || "",
            lastName: mentor.lastName || "",
            nickName: mentor.nickName,
            category: ((_b = (_a = mentor.category) === null || _a === void 0 ? void 0 : _a.categoryId) === null || _b === void 0 ? void 0 : _b.toString()) || null,
            careerDuration: (_c = mentor.experience) === null || _c === void 0 ? void 0 : _c.careerDuration,
            profession: mentor.profession,
            image: mentor.image,
        };
        return res.status(200).send({ mentor: mentorData });
    }
    catch (err) {
        console.error("Get profile error:", err.message);
        return res.status(500).json({ message: "Сервер дээр алдаа гарлаа." });
    }
});
exports.MentorGetProfile = MentorGetProfile;
