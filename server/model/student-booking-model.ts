import { model, models, ObjectId, Schema } from "mongoose";

export type StudentCalendar = {
  _id: ObjectId;
  studentId: Schema.Types.ObjectId;
  mentorId: Schema.Types.ObjectId;
  date: string;
  time: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
};

const StudentSchema = new Schema<StudentCalendar>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    mentorId: { type: Schema.Types.ObjectId, ref: "Mentor", required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);


export const StudentBookingModel =
  models.Booking || model<StudentCalendar>("Booking", StudentSchema);
