import { ObjectId, Schema } from "mongoose";

export type MentorType = {
  _id: string;
  email: string;
  password: string;
  phoneNumber?: number;
  firstName: string;
  lastName: string;
  nickName?: string;
  role: string;
  image: string;
  bio: string;
  profession: string;
  education: EducationType;
  experience: string;
  calendar: string;
  category: string;
  rating: number;
  review: string;
  createdAt: Date;
  updatedAt: Date;
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

export type CalendarType = {
  availableDate: Date;
};

export type CategoryType = {
  categoryId: ObjectId;
  price: number;
};
