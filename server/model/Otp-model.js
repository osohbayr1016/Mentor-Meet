"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpModel = void 0;
const mongoose_1 = require("mongoose");
// export type OtpPopulated = {
//   userId: StudentType | MentorType;
// }; //OtpPopulated bolgov
const Otp = new mongoose_1.Schema({
    code: { type: String, required: true },
    email: { type: String, required: true },
    // userId: { type: Schema.ObjectId, require: true, ref: "Users" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
exports.OtpModel = (0, mongoose_1.model)("Otp", Otp);
