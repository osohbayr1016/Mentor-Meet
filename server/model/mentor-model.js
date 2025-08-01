"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorModel = exports.UserRoleEnum = void 0;
const mongoose_1 = require("mongoose");
var UserRoleEnum;
(function (UserRoleEnum) {
    UserRoleEnum["MENTOR"] = "MENTOR";
    UserRoleEnum["ADMIN"] = "ADMIN";
})(UserRoleEnum || (exports.UserRoleEnum = UserRoleEnum = {}));
const MentorSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    nickName: { type: String, required: false },
    image: { type: String, required: false },
    bio: { type: String, required: false },
    profession: { type: String, required: false },
    subcategory: { type: String, required: false },
    education: {
        schoolName: { type: String, required: false },
        major: { type: String, required: false },
        endedYear: { type: String, required: false },
    },
    experience: {
        work: { type: String, required: false },
        position: { type: String, required: false },
        careerDuration: { type: String, required: false },
    },
    calendar: {
        available: { type: Date, required: false },
    },
    category: {
        categoryId: { type: mongoose_1.Schema.ObjectId, ref: "Categories", required: false },
        price: { type: Number, required: false },
    },
    rating: { type: Number, default: 0 },
    role: {
        type: String,
        enum: Object.values(UserRoleEnum),
        default: UserRoleEnum.MENTOR,
    },
    createdAt: { type: Date, default: Date.now, immutable: true },
    updatedAt: { type: Date, default: Date.now },
    otp: { type: String, required: false }
});
exports.MentorModel = (0, mongoose_1.model)("Mentor", MentorSchema); //mentormodel bolgov
