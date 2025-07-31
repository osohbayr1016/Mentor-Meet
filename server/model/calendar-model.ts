import { model, ObjectId, Schema, Types } from "mongoose"

export type Availability = {
    date:string;
    times:string[];
}

export type MentorCalendar = {
_id:ObjectId;
mentorId:ObjectId;
availabilities:Availability;
createdAt:string;
updatedAt:string;
}


const MentorCalendarSchema = new Schema(
  {
    mentorId: {
      type: Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    availabilities: [
      {
        date: { type: String, required: true }, 
        times: [{ type: String }], 
      },
    ],
  },
  { timestamps: true }
);

export const MentorCalendarModel = model("MentorCalendar", MentorCalendarSchema);