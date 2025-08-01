"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMentorCalendar = void 0;
const calendar_model_1 = require("../model/calendar-model");
const getMentorCalendar = async (req, res) => {
    const { mentorId } = req.params;
    try {
        const calendar = await calendar_model_1.MentorCalendarModel.findOne({ mentorId });
        if (!calendar) {
            return res.status(404).json({ message: "Олдсонгүй" });
        }
        return res.status(200).json(calendar);
    }
    catch (error) {
        console.error("Get availability error:", error);
        return res.status(500).json({ message: "Серверийн алдаа" });
    }
};
exports.getMentorCalendar = getMentorCalendar;
