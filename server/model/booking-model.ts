import mongoose, { Schema, model, InferSchemaType } from "mongoose";

// ✅ populate-д бүртгэлтэй байх ёстой тул заавал import хийнэ
import { StudentModel } from "./student-model";
import { MentorModel } from "./mentor-model"; // хэрвээ шаардлагатай бол

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

const BookingSchema = new Schema(
  {
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    times: [
      {
        type: String,
        required: true,
      },
    ],
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    // Google Meet integration fields
    meetingLink: {
      type: String,
      required: false,
    },
    calendarEventId: {
      type: String,
      required: false,
    },
    meetingStartTime: {
      type: Date,
      required: false,
    },
    meetingEndTime: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt автоматаар нэмэгдэнэ
    versionKey: false,
  }
);

// ✅ TypeScript-д зориулсан төрөл
export type BookingType = InferSchemaType<typeof BookingSchema>;

// ✅ model нэр: "Booking"
export const Booking = model<BookingType>("Booking", BookingSchema);
