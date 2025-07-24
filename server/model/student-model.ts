
import { ObjectId, Schema } from "mongoose";



export type StudentType = {
  _id: string;
  email: string;
  password: string;
  phoneNumber?: number;
  firstname: string;
  lastname: string;
  nickname?: string;
  role: string;
  createAt: Date;
  updateAt: Date;
  meetingHistory: ObjectId;
  bookedHistory: ObjectId;
};

const StudentSchema = new Schema<StudentType>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  phoneNumber: { type: Number, required: false },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  nickname: { type: String, required: false },
  role: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  meetingHistory: { type: Schema.ObjectId, ref: "Meeting" },
  bookedHistory: { type: Schema.ObjectId, ref: "Booking" },
});
