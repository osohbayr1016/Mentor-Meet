import { model, Schema } from "mongoose";

export type CategoryType = {
    _id:Schema.Types.ObjectId;
    categoryName:string;
    subCategory:string[];
    createdAt:Date;
    updatedAt:Date
};

const category = new Schema<CategoryType> ({
    categoryName:{type:String, required:true},
    subCategory:[{type:String}],
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date, default: Date.now },
})

export const CategoryModel = model<CategoryType>("Categories", category)