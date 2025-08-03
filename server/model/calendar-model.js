"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorCalendarModel = void 0;
const mongoose_1 = require("mongoose");
const availabilitiesSchema = new mongoose_1.Schema({
    date: { type: String, required: true },
    times: [{ type: String }],
});
const MentorCalendarSchema = new mongoose_1.Schema({
    mentorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Mentor",
        required: true,
    },
    availabilities: [availabilitiesSchema],
}, { timestamps: true });
exports.MentorCalendarModel = (0, mongoose_1.model)("MentorCalendar", MentorCalendarSchema);
