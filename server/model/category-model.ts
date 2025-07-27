import { model, Mongoose, ObjectId, Schema } from "mongoose";

export type CategoryType = {
    _id:Schema.Types.ObjectId;
    categoryName:string;
    createdAt:Date;
    updatedAt:Date
};

const category = new Schema<CategoryType> ({
    categoryName:{type:String, required:true},
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date, default: Date.now },
})

export const CategoryModel = model<CategoryType>("Categories", category)