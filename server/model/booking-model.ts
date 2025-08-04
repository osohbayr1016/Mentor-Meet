import mongoose, { Schema, model } from "mongoose";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export type BookingType = {
  _id: string;
  mentorId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  duration: number; // in minutes
  status: BookingStatus;
  price: number;
  category: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

const BookingSchema = new Schema<BookingType>({
  mentorId: { type: Schema.Types.ObjectId, ref: "Mentor", required: true },
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: Number, default: 60 }, // 60 minutes default
  status: {
    type: String,
    enum: Object.values(BookingStatus),
    default: BookingStatus.PENDING,
  },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Booking = model<BookingType>("Booking", BookingSchema);
