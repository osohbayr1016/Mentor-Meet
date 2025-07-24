import { Schema, model } from "mongoose";
import { StudentModel, StudentType } from "./student-model";
import { MentorType } from "./mentor-model";
export type Otp = {
  _id: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  code: String;
  createdAt: Date;
};

export type Otppopulated = {
  userId: StudentType | MentorType

};

const Otp = new Schema<Otp>({
  code: { type: String, require: true },
  userId: { type: Schema.ObjectId, require: true, ref: "Users" },

  createdAt: { type: Date, default: Date.now, expires: 90 },
});

export const OtpModel = model<Otp>("Otp", Otp);
