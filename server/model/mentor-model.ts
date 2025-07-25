import { model, ObjectId, Schema } from "mongoose";

export enum UserRoleEnum {
  MENTOR = "MENTOR",
  ADMIN = "ADMIN",
}

export type MentorType = {
  _id: string;
  email: string;
  password: string;
  phoneNumber?: number;
  firstName: string;
  lastName: string;
  nickName?: string;
  role: UserRoleEnum;
  image: string;
  bio: string;
  profession: string;
  education: EducationType;
  experience: ExperienceType;
  calendar?: calendarType;
  category?: CategoryType;
  rating?: number;
  review?: string;
  createdAt: Date;
  updatedAt: Date;
  otp: string;
};

export type EducationType = {
  schoolName: string;
  major: string;
  endedYear: Date;
};

export type ExperienceType = {
  work: string;
  position: string;
  careerDuration: Date;
};

export type calendarType = {
  available: Date;
};

export type CategoryType = {
  categoryId: ObjectId;
  price: number;
};

const MentorSchema = new Schema<MentorType>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: false },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  nickName: { type: String, required: false },
  image: { type: String, required: false },
  bio: { type: String, required: false },
  profession: { type: String, required: false },
  education: {
    schoolName: { type: String, required: false },
    major: { type: String, required: false },
    endedYear: { type: String, required: false },
  },
  experience: {
    work: { type: String, required: false },
    position: { type: String, required: false },
    careerDuration: { type: String, required: false },
  },
  calendar: {
    available: { type: Date, required: false },
  },
  category: {
    categoryId: { type: Schema.ObjectId, ref: "Categories", required: false },
    price: { type: Number, required: false },
  },
  rating: { type: Number, default: 0 },
  role: {
    type: String,
    enum: Object.values(UserRoleEnum),
    default: UserRoleEnum.MENTOR,
  },
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now },
});

// MentorSchema.index({ categoryName: 1 }, { unique: true });
export const MentorModel = model<MentorType>("Mentor", MentorSchema); //mentormodel bolgov
