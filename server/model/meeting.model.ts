import mongoose, {Schema, Document } from "mongoose"

export enum MeetingStatus {
    PENDING = "PENDING",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
}

export interface IMeeting extends Document {
    categoryId: mongoose.Types .ObjectId;
    mentorId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    status: MeetingStatus;
    duration: number;
    scheduledAt: Date;
}

const meetingSchema = new Schema <IMeeting> ({
    categoryId: {type: Schema.Types.ObjectId, ref: "Category", required: true},
    mentorId: {type: Schema.Types.ObjectId, ref: "Mentor", required: true},
    studentId: {type: Schema.Types.ObjectId, ref: "Student", required: true},
    status: {type: String, enum: Object.values(MeetingStatus), default: MeetingStatus.PENDING},
    duration: {type: Number, required: true},
    scheduledAt: {type: Date, required: true},
});

export const MeetingModel = mongoose.model<IMeeting>("Meeting", meetingSchema);