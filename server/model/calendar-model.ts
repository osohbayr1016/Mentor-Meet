import { model, ObjectId, Schema, Types } from "mongoose";

export type Availability = {
  date: string;
  times: string[];
};

export type MentorCalendar = {
  _id: ObjectId;
  mentorId: Schema.Types.ObjectId;
  availabilities: Availability[];
  status: {
    type: String;
    enum: ["PENDING", "PAID", "CANCELLED"];
    default: "PENDING";
    
  };
  createdAt: string;
  updatedAt: string;
};

const availabilitiesSchema = new Schema<Availability>({
  date: { type: String, required: true },
  times: [{ type: String }],
});

const MentorCalendarSchema = new Schema<MentorCalendar>(
  {
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    availabilities: [availabilitiesSchema],
      status: {
      type: String,
      enum: ["PENDING", "PAID", "CANCELLED"],
      default: "PENDING",
    },
  },

  { timestamps: true }
);

export const MentorCalendarModel = model<MentorCalendar>(
  "MentorCalendar",
  MentorCalendarSchema
);
