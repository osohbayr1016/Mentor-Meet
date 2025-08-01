import { model, ObjectId, Schema, Types } from "mongoose";

export type Availability = {
  date: string;
  times: string[];
};

export type MentorCalendar = {
  _id: ObjectId;
  mentorId: Schema.Types.ObjectId;
  availabilities: Availability[];
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
  },
  { timestamps: true }
);

export const MentorCalendarModel = model<MentorCalendar>(
  "MentorCalendar",
  MentorCalendarSchema
);
