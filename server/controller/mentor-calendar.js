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
exports.UpdateMentorAvailability = void 0;
const calendar_model_1 = require("../model/calendar-model");
const UpdateMentorAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mentorId } = res.locals;
    const { availabilities } = req.body;
    try {
        const existing = yield calendar_model_1.MentorCalendarModel.findOne({ mentorId });
        console.log(mentorId);
        if (existing) {
            existing.availabilities = availabilities;
            yield existing.save();
        }
        else {
            yield calendar_model_1.MentorCalendarModel.create({
                mentorId,
                availabilities,
            });
        }
        return res.status(200).json({ message: "Амжилттай хадгалагдлаа" });
    }
    catch (err) {
        console.error("Calendar save error:", err);
        return res.status(500).json({ message: "Серверийн алдаа" });
    }
});
exports.UpdateMentorAvailability = UpdateMentorAvailability;
// import { Request, Response } from "express";
// import { MentorCalendarModel } from "../model/calendar-model";
// export const UpdateMentorAvailability = async (req: Request, res: Response) => {
//   const { mentorId } = res.locals;
//   const { availabilities } = req.body;
//   if (!Array.isArray(availabilities) || availabilities.length === 0) {
//     return res.status(400).json({ message: "availabilities хоосон байна" });
//   }
//   try {
//     const existing = await MentorCalendarModel.findOne({ mentorId });
//     if (existing) {
//       // Merge or replace logic — here we replace the old availabilities
//       existing.availabilities = availabilities;
//       await existing.save();
//     } else {
//       await MentorCalendarModel.create({
//         mentorId,
//         availabilities, // ✅ send the full array as-is
//       });
//     }
//     return res.status(200).json({ message: "Амжилттай хадгалагдлаа" });
//   } catch (err) {
//     console.error("Calendar save error:", err);
//     return res.status(500).json({ message: "Серверийн алдаа" });
//   }
// };
