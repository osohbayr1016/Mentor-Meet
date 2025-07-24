import { model, ObjectId, Schema } from "mongoose";


export enum UserRoleEnum	{
MENTOR =  "MENTOR",
ADMIN = "ADMIN"
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
  experience:  ExperienceType;
  calendar: calendarType;
  category: CategoryType; 
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

export type calendarType = {
  available: Date
}

export type CategoryType = {
  categoryId: ObjectId,
  price: number
}

const MentorSchema = new Schema<MentorType>({
  email: { type: String, required: true , unique: true},
  password: {type : String, required: true, unique: true},
   phoneNumber: { type: String, required: false },
   firstName: {type: String, required: true},
   lastName: {type: String, required: true},
   nickName: {type: String, required: true},
   image : {type: String, required: true},
   bio: {type: String, required: true},
    profession: {type: String, required: true},
    education: {
      schoolName: {type: String, required: true},
      major: {type: String, required: true},
      endedYear: {type: String, required: true},
    },
    experience: {
work: {type: String, required: true},
position: {type: String, required: true},
careerDuration: {type: String, required: true},
    },
    calendar:{
      available: {type: Date, required: true }
    },
    category: {
      categoryId: {type: Schema.ObjectId , ref : "Categories",  required: true },
      price: {type: Number,  required: true}
    },
    rating: {type: Number, default: 0},
   role: {type : String, enum: Object.values(UserRoleEnum), default: UserRoleEnum.MENTOR},
     createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now },
})

// MentorSchema.index({ categoryName: 1 }, { unique: true });
export const CategoryModel = model<MentorType>("Categories", MentorSchema);
