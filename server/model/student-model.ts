import mongoose, { model, ObjectId, Schema } from "mongoose";

export type StudentType = {
  _id: string;
  email: string;
  password?: string;
  phoneNumber?: number;
  nickname?: string;
  createdAt: Date;
  updatedAt: Date;
  meetingHistory: ObjectId[]; // олон уулзалт
  bookedHistory: ObjectId[]; // олон захиалга
  googleAuth?: boolean;
};

const StudentSchema = new Schema<StudentType>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // ⚠️ unique хассан
    phoneNumber: { type: Number, required: false },
    nickname: { type: String, required: false },
    meetingHistory: [{ type: Schema.ObjectId, ref: "Meeting" }],
    bookedHistory: [{ type: Schema.ObjectId, ref: "Booking" }],
    googleAuth: { type: Boolean, default: false },
  },
  {
    timestamps: true, // ✅ createdAt, updatedAt автоматаар нэмэгдэнэ
    versionKey: false,
  }
);

// TempUser (OTP/verify зориулалттай)
const TempUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  code: String,
  isVerified: { type: Boolean, default: false },
  password: String,
  nickname: String,
  phoneNumber: String,
});

export const TempUserModel = mongoose.model("TempUser", TempUserSchema);
export const StudentModel = model<StudentType>("Student", StudentSchema);
