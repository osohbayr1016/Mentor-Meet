
import { Request, Response } from "express";
import { CategoryModel } from "../model/category-model";


export const getCategories = async (req: Request, res: Response) => {

  try {
    const categories = await CategoryModel.find({});

    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "Ангилал олдсонгүй." });
    }

    return res.status(200).json({ categories });
  } catch (error: any) {
    console.error("Get categories error:", error.message);
    return res.status(500).json({ message: "Сервер дээр алдаа гарлаа." });
  }
};
