"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMentorAvailability = void 0;
const calendar_model_1 = require("../model/calendar-model");
const UpdateMentorAvailability = async (req, res) => {
    const { mentorId } = res.locals;
    const { availabilities } = req.body;
    try {
        const existing = await calendar_model_1.MentorCalendarModel.findOne({ mentorId });
        console.log(mentorId);
        if (existing) {
            existing.availabilities = availabilities;
            await existing.save();
        }
        else {
            await calendar_model_1.MentorCalendarModel.create({ mentorId, availabilities });
        }
        return res.status(200).json({ message: "Амжилттай хадгалагдлаа" });
    }
    catch (err) {
        console.error("Calendar save error:", err);
        return res.status(500).json({ message: "Серверийн алдаа" });
    }
};
exports.UpdateMentorAvailability = UpdateMentorAvailability;
