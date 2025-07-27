import { Schema, model } from "mongoose";
import { StudentModel, StudentType } from "./student-model";
import { MentorType } from "./mentor-model";

export type Otp = {
  _id: Schema.Types.ObjectId;
  // userId: Schema.Types.ObjectId;
  code: String;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

// export type OtpPopulated = {
//   userId: StudentType | MentorType;
// }; //OtpPopulated bolgov

const Otp = new Schema<Otp>({
  code: { type: String, required: true },
  email: { type: String, required: true },
  // userId: { type: Schema.ObjectId, require: true, ref: "Users" },

  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now },
});

export const OtpModel = model<Otp>("Otp", Otp);
