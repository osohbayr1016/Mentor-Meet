import mongoose, { Schema, model, InferSchemaType } from "mongoose";

const MentorAvailabilitySchema = new Schema(
  {
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    availableTimes: [
      {
        type: String,
        required: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create compound index for mentorId and date to ensure uniqueness
MentorAvailabilitySchema.index({ mentorId: 1, date: 1 }, { unique: true });

// TypeScript type
export type MentorAvailabilityType = InferSchemaType<
  typeof MentorAvailabilitySchema
>;

// Model
export const MentorAvailability = model<MentorAvailabilityType>(
  "MentorAvailability",
  MentorAvailabilitySchema
);
