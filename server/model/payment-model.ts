import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  calendarId: mongoose.Types.ObjectId;
  mentorId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  price: number;
  paymentStatus: "pending" | "succeeded" | "failed";
  createdAt: Date;
  updatedAt: Date;
  email: string;
}

const paymentSchema = new Schema<IPayment>(
  {
    calendarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MentorCalendar",
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    price: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "succeeded", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const PaymentModel = mongoose.model<IPayment>("Payment", paymentSchema);
