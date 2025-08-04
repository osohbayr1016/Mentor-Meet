import { Schema, model } from "mongoose";
import { StudentModel, StudentType } from "./student-model";
import { MentorType } from "./mentor-model";

export type Email = {
  _id: Schema.Types.ObjectId;

  mail: String;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

const emailSchema = new Schema<Email>({
  mail: { type: String, required: true },
  email: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const EmailModel = model<Email>("sendEmail", emailSchema);
