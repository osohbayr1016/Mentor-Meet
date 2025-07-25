
import mongoose, { model, ObjectId, Schema } from "mongoose";



export type StudentType = {
  _id: string;
  email: string;
  password: string;
  phoneNumber?: number;
  nickname?: string;
  createAt: Date;
  updateAt: Date;
  meetingHistory: ObjectId;
  bookedHistory: ObjectId;
};

const StudentSchema = new Schema<StudentType>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false, unique: true },
  phoneNumber: { type: Number, required: false },
  nickname: { type: String, required: false },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  meetingHistory: { type: Schema.ObjectId, ref: "Meeting" },
  bookedHistory: { type: Schema.ObjectId, ref: "Booking" },
});




const TempUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  code: String,
  isVerified: { type: Boolean, default: false },
  password: String,
  nickname: String,
  phoneNumber: String,
});

export const TempUserModel = mongoose.model("TempUser", TempUserSchema);


export const StudentModel = model<StudentType>("Student",StudentSchema)