import mongoose, { Schema, Document } from "mongoose";

export enum ReplacementStatus {
  WAITING = "WAITING",
  REPLACED = "REPLACED",
  EXPIRED = "EXPIRED",
}

export interface IReplacementRequest extends Document {
  meetingId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId; // cancel хийсэн хүн
  mentorId: mongoose.Types.ObjectId;
  scheduledAt: Date;
  status: ReplacementStatus;
  createdAt: Date;
}

const replacementRequestSchema = new Schema<IReplacementRequest>({
  meetingId: { type: Schema.Types.ObjectId, ref: "Meeting", required: true },
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  mentorId: { type: Schema.Types.ObjectId, ref: "Mentor", required: true },
  scheduledAt: { type: Date, required: true },
  status: {
    type: String,
    enum: Object.values(ReplacementStatus),
    default: ReplacementStatus.WAITING,
  },
  createdAt: { type: Date, default: Date.now },
});

export const ReplacementRequest = mongoose.model<IReplacementRequest>(
  "ReplacementRequest",
  replacementRequestSchema
);
