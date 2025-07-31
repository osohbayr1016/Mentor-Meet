import { Request, Response } from "express";
import { CategoryModel } from "../model/category-model";
import {} from "node-fetch"
import mongoose from "mongoose";

export const addSubCategories = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const { subCategory } = req.body; 

  try {
    const result = await CategoryModel.updateOne(
      { _id: categoryId },
      { $push: { subCategory: { $each: subCategory } } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "categoryId олдсонгүй" });
    }

    res.status(200).json({ message: "SubCategory-ууд амжилттай нэмэгдлээ", result });
  } catch (err: any) {
    res.status(500).json({ message: "SubCategory seed хийх үед алдаа гарлаа", error: err.message });
  }
};
