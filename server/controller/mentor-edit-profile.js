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
exports.editMentorProfile = void 0;
const mentor_model_1 = require("../model/mentor-model");
const category_model_1 = require("../model/category-model");
const editMentorProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mentorId } = res.locals;
    const { firstName, lastName, nickName, category, careerDuration, profession, subcategory, image, bio, socialLinks, specialization, achievements, bankAccount, } = req.body;
    try {
        if (!firstName || !lastName) {
            return res
                .status(400)
                .json({ message: "Заавал бөглөх талбарууд дутуу байна." });
        }
        const foundCategory = yield category_model_1.CategoryModel.findById(category.categoryId);
        if (!foundCategory) {
            return res.status(404).json({ message: "Ангилал олдсонгүй." });
        }
        const updatedMentor = yield mentor_model_1.MentorModel.findByIdAndUpdate(mentorId, {
            firstName,
            lastName,
            nickName: nickName || "",
            profession,
            subcategory: subcategory || "",
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
        }, { new: true });
        if (!updatedMentor) {
            return res.status(404).json({ message: "Ментор олдсонгүй." });
        }
        return res.status(200).json({
            message: "Профайл амжилттай шинэчлэгдлээ.",
            mentor: updatedMentor,
        });
    }
    catch (error) {
        console.error("Edit profile error:", error);
        return res
            .status(500)
            .json({ message: "Сервер дээр алдаа гарлаа. Дахин оролдоно уу." });
    }
});
exports.editMentorProfile = editMentorProfile;
