"use strict";
// import { Request, Response } from "express";
// import { MentorModel } from "../model/mentor-model";
// import mongoose from "mongoose";
// import { CategoryModel } from "../model/category-model";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorCreateProfile1 = void 0;
const mentor_model_1 = require("../model/mentor-model");
const mongoose_1 = __importDefault(require("mongoose"));
const category_model_1 = require("../model/category-model");
const MentorCreateProfile1 = async (req, res) => {
    const { mentorId } = res.locals;
    const { category } = req.body;
    if (!(category === null || category === void 0 ? void 0 : category.categoryId) ||
        !mongoose_1.default.Types.ObjectId.isValid(category.categoryId)) {
        return res.status(400).json({ message: "Зөв categoryId оруулна уу." });
    }
    try {
        const { firstName, lastName, nickName, category, careerDuration, profession, subcategory, image, bio, experience, socialLinks, specialization, achievements, bankAccount, } = req.body;
        if (!firstName ||
            !lastName ||
            !(category === null || category === void 0 ? void 0 : category.categoryId) ||
            !careerDuration ||
            !profession) {
            return res
                .status(400)
                .send({ message: "Мэдээлэл дутуу байна. Бүх талбарыг бөглөнө үү." });
        }
        const foundCategory = await category_model_1.CategoryModel.findOne({
            _id: category.categoryId,
        });
        if (!foundCategory) {
            return res.status(400).json({ message: "Ийм нэртэй ангилал олдсонгүй!" });
        }
        const parsedSocialLinks = typeof socialLinks === "string" ? JSON.parse(socialLinks) : socialLinks;
        const parsedBankAccount = typeof bankAccount === "string" ? JSON.parse(bankAccount) : bankAccount;
        const updatedMentor = await mentor_model_1.MentorModel.findByIdAndUpdate({ _id: mentorId }, {
            firstName,
            lastName,
            nickName: nickName || "",
            category: {
                categoryId: foundCategory._id,
                price: category.price || 0,
            },
            experience: {
                careerDuration,
            },
            profession,
            subcategory: subcategory || "",
            image: image || "",
            updatedAt: new Date(),
        }, { new: true, upsert: true });
        return res.status(200).send({
            message: "Менторын профайл амжилттай хадгалагдлаа.",
            mentor: updatedMentor,
        });
    }
    catch (err) {
        console.error("Алдаа:", err.message || err);
        return res
            .status(500)
            .json({ message: "Сервер дээр алдаа гарлаа. Дахин оролдоно уу." });
    }
};
exports.MentorCreateProfile1 = MentorCreateProfile1;
