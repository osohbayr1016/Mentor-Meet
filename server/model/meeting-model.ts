import { ObjectId } from "mongoose";

export type MeetingModel = {
  _id: number;
  categoryId: ObjectId;
  mentorId: ObjectId;
  studentId: ObjectId;
  status: MeetingStatus;
  duration: number;
  scheduledAt: Date;
};

export enum MeetingStatus {
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}