import { Request, Response } from "express";
import { CategoryModel } from "../model/category-model";

export const createCategory = async (req: Request, res: Response): Promise<any> => {
  const { categoryName } = req.body;

  if (!categoryName || typeof categoryName !== "string") {
    return res.status(400).json({ message: "categoryName талбарыг зөв оруулна уу." });
  }

  try {
    const existingCategory = await CategoryModel.findOne({ categoryName });

    if (existingCategory) {
      return res.status(409).json({ message: "Ангилал аль хэдийн бүртгэлтэй байна." });
    }

    const newCategory = await CategoryModel.create({ categoryName });

    return res.status(201).json({
      message: "Ангилал амжилттай нэмэгдлээ.",
      category: newCategory,
    });
  } catch (error: any) {
    console.error("Алдаа:", error.message || error);
    return res.status(500).json({ message: "Сервер дээр алдаа гарлаа." });
  }
};
